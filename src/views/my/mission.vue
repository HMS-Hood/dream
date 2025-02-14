<template>
  <div
    class="container"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div class="panel">
      <div class="official">
        <back></back>
        <img :src="'/img/mission.png'" />
      </div>
      <div class="info">
        <div class="tip"> <span>任务官艾伦：</span>{{ info }} </div>
        <div class="filters">
          <div @click="showDoingMission = false">查看任务</div>
          <div @click="showDoingMission = true">查看进行中任务</div>
        </div>
        <div class="filters">
          <a-select v-model="qualityFilter" placeholder="品质筛选">
            <a-option label="全部品质" value="" />
            <a-option label="E/F级" value="EF" />
            <a-option label="D级" value="D" />
            <a-option label="C级" value="C" />
            <a-option label="B级" value="B" />
            <a-option label="A级" value="A" />
            <a-option label="S级" value="S" />
            <a-option label="SS级" value="SS" />
            <a-option label="SSS级" value="SSS" />
          </a-select>
          <a-select v-model="difficultyFilter" placeholder="难度筛选">
            <a-option label="全部难度" value="" />
            <a-option label="简单" value="EASY" />
            <a-option label="普通" value="NORMAL" />
            <a-option label="困难" value="HARD" />
            <a-option label="史诗" value="EPIC" />
            <a-option label="传说" value="LEGENDARY" />
          </a-select>
        </div>
      </div>
    </div>

    <div class="mission-list">
      <template v-if="showDoingMission">
        <a-card
          v-for="(result, index) in missionResultList"
          :key="result.mission.name"
          class="mission-card"
          :class="getMissionClass(result.mission)"
        >
          <div class="mission-info">
            <div class="mission-title">
              <span class="mission-name">{{ result.mission.name }}</span>
              <div class="mission-tags">
                <span class="mission-quality">{{
                  getQualityText(result.mission.quality)
                }}</span>
                <span class="mission-difficulty">{{
                  getDifficultyText(result.mission.difficulty)
                }}</span>
              </div>
            </div>
            <div class="mission-desc"
              >{{ result.mission.desc }}
              <h1
                v-if="
                  calendar.getPassedTime(result.startDay) <
                  result.result.duration
                "
                >进行中</h1
              >
              <h1 v-else-if="result.result.success">成功</h1>
              <h1 v-else>失败</h1>
            </div>
          </div>
          <div class="mission-actions">
            <a-button
              :disabled="
                calendar.getPassedTime(result.startDay) >=
                result.result.duration
              "
              type="primary"
              @click="collectResult(index)"
              >任务结算</a-button
            >
          </div>
        </a-card>
      </template>
      <template v-if="!showDoingMission">
        <a-card
          v-for="mission in filteredMissions"
          :key="mission.name"
          class="mission-card"
          :class="getMissionClass(mission)"
        >
          <div class="mission-info">
            <div class="mission-title">
              <span class="mission-name">{{ mission.name }}</span>
              <div class="mission-tags">
                <span class="mission-quality">{{
                  getQualityText(mission.quality)
                }}</span>
                <span class="mission-difficulty">{{
                  getDifficultyText(mission.difficulty)
                }}</span>
              </div>
            </div>
            <div class="mission-desc">{{ mission.desc }}</div>
          </div>
          <div class="mission-actions">
            <a-button type="primary" @click="selectMission(mission)"
              >接取任务</a-button
            >
          </div>
        </a-card>
      </template>
    </div>
    <a-modal
      v-model:visible="showArmyManager"
      :modal-style="{ 'background-color': 'rgb(78, 78, 78, 0.8)' }"
      :fullscreen="true"
      :closable="false"
      @before-ok="handleArmySet"
    >
      <army-manager></army-manager>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { Message, Modal } from '@arco-design/web-vue';
  import { Mission, MissionInfo, MissionResult } from '@/core/mission/Mission';
  import { MissionDifficulty, QualityLevel } from '@/core/enums';
  import { useEnvDataStore } from '@/store/envData';
  import { useArmyStore } from '@/store/army';
  import { calendar, player } from '@/core/game';
  import { Calendar } from '@/core/entities/Calendar';
  import back from './component/back.vue';
  import ArmyManager from './ArmyManager.vue';

  const backgroundImage = '/img/bg/mission.png';
  const gameStore = useEnvDataStore();
  const qualityFilter = ref('');
  const difficultyFilter = ref('');
  const showDoingMission = ref(false);
  const info = ref(
    '欢迎来到任务大厅,这里有各种各样的任务等待着你。记住,任务的难度和品质往往与报酬成正比。'
  );

  // 获取任务列表
  const missionsInfo = computed(() => gameStore.getMissions());

  // 过滤后的任务列表
  const filteredMissions = computed(() => {
    return missionsInfo.value.filter((mission) => {
      const qualityMatch =
        !qualityFilter.value ||
        (qualityFilter.value === 'EF'
          ? mission.quality === QualityLevel.E ||
            mission.quality === QualityLevel.F
          : mission.quality ===
            QualityLevel[qualityFilter.value as keyof typeof QualityLevel]);

      const difficultyMatch =
        !difficultyFilter.value ||
        mission.difficulty ===
          MissionDifficulty[
            difficultyFilter.value as keyof typeof MissionDifficulty
          ];

      return qualityMatch && difficultyMatch;
    });
  });

  // 获取任务品质显示文本
  const getQualityText = (quality: QualityLevel) => {
    return QualityLevel[quality];
  };

  // 获取任务难度显示文本
  const getDifficultyText = (difficulty: MissionDifficulty) => {
    const difficultyMap = {
      [MissionDifficulty.EASY]: '简单',
      [MissionDifficulty.NORMAL]: '普通',
      [MissionDifficulty.HARD]: '困难',
      [MissionDifficulty.EPIC]: '史诗',
      [MissionDifficulty.LEGENDARY]: '传说',
    };
    return difficultyMap[difficulty];
  };

  // 获取任务卡片的样式类
  const getMissionClass = (missionInfo: MissionInfo) => {
    return {
      [`quality-${QualityLevel[missionInfo.quality].toLowerCase()}`]: true,
      [`difficulty-${MissionDifficulty[missionInfo.difficulty].toLowerCase()}`]:
        true,
    };
  };

  // 选择任务
  const curMissionInfo = ref<MissionInfo>();
  const showArmyManager = ref(false);
  const selectMission = (missionInfo: MissionInfo) => {
    // TODO: 实现任务选择逻辑
    curMissionInfo.value = missionInfo;
    showArmyManager.value = true;
    Message.success(`已接取任务：${missionInfo.name}`);
  };

  type DoingMission = {
    mission: Mission;
    result: MissionResult;
    startDay: Calendar;
  };
  const missionResultList: DoingMission[] = [];
  const collectResult = (index: number) => {
    const [endMission] = missionResultList.splice(index, 1);
    player.gold += endMission.result.moneyReward;
    player.items.push(...endMission.result.equipmentReward);
    endMission.result.lostMembersId.forEach((id) => {
      const deadMemberIndex = player.members.findIndex(
        (member) => member.id === id
      );
      if (index > -1) {
        player.deadMembers.push(player.members.splice(deadMemberIndex, 1)[0]);
      }
    });
    Message.normal('任务结算完成');
  };
  const armyStore = useArmyStore();
  const handleArmySet = (done: (closed: boolean) => void) => {
    const army = armyStore.getArmy();
    if (!curMissionInfo.value || !army) return;
    const mission = new Mission(curMissionInfo.value);
    const missionResult = mission.testMission(army);
    Modal.info({
      title: `任务${missionResult.success ? '成功' : '失败'}`,
      content: `预估时长: ${missionResult.duration}天（损失人数：${missionResult.lost}）`,
      okText: '继续任务',
      cancelText: '取消任务',
      onOk: () => {
        missionResultList.push({
          mission,
          result: mission.completeMission(army),
          startDay: calendar,
        });
        done(true);
      },
      onCancel: () => done(false),
    });
  };
</script>

<style lang="less" scoped>
  @import url('../../assets/style/dream.less');

  .container {
    display: flex;
    justify-content: center;
    height: 100vh;
    padding: 20px;
    background-position: center;
    background-size: cover;

    .panel {
      position: relative;
      display: flex;
      flex-direction: column;
      flex-grow: 0;
      align-items: stretch;
      justify-content: flex-end;
      width: 26vw;
      margin-right: 20px;
      color: aliceblue;
      font-weight: bolder;
      font-size: 2em;
      background-color: rgb(127 127 127 / 50%);
      border-radius: 10px;

      .official {
        flex-basis: 1024px;
        flex-grow: 0;
        height: 100%;
        overflow: hidden;
      }

      .info {
        flex: auto;
        width: 100%;
        padding: 20px;
        background-color: rgb(0 0 0 / 80%);
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;

        .tip {
          span {
            color: goldenrod;
          }

          margin-bottom: 2em;
          color: rgb(161 161 161);
        }

        .filters {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
      }
    }

    .mission-list {
      flex-grow: 1;
      height: 92vh;
      padding: 0 20px;
      overflow-y: auto;

      .mission-card {
        margin-bottom: 20px;
        background-color: rgb(0 0 0 / 80%);
        border: none;
        border-radius: 10px;

        .mission-info {
          color: aliceblue;
        }

        .mission-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .mission-name {
          font-weight: bold;
          font-size: 1.2em;
        }

        .mission-tags {
          display: flex;
          gap: 10px;
        }

        .mission-quality,
        .mission-difficulty {
          padding: 2px 8px;
          font-size: 0.9em;
          border-radius: 4px;
        }

        .mission-desc {
          color: #999;
          font-size: 0.9em;
          line-height: 1.5;
        }

        .mission-actions {
          margin-top: 15px;
          text-align: right;
        }
      }
    }

    /* 品质样式 */
    .quality-sss .mission-quality {
      color: #fff;
      background-color: @quality-SSS-color;
    }

    .quality-ss .mission-quality {
      color: #fff;
      background-color: @quality-SS-color;
    }

    .quality-s .mission-quality {
      color: #fff;
      background-color: @quality-S-color;
    }

    .quality-a .mission-quality {
      color: #fff;
      background-color: @quality-A-color;
    }

    .quality-b .mission-quality {
      color: #fff;
      background-color: @quality-B-color;
    }

    .quality-c .mission-quality {
      color: #fff;
      background-color: @quality-C-color;
    }

    .quality-d .mission-quality {
      color: #fff;
      background-color: @quality-D-color;
    }

    .quality-e .mission-quality,
    .quality-f .mission-quality {
      color: #000;
      background-color: @quality-F-color;
    }

    /* 难度样式 */
    .difficulty-legendary .mission-difficulty {
      color: #fff;
      background-color: #ff4500;
    }

    .difficulty-epic .mission-difficulty {
      color: #fff;
      background-color: #9400d3;
    }

    .difficulty-hard .mission-difficulty {
      color: #fff;
      background-color: #1f0087;
    }

    .difficulty-normal .mission-difficulty {
      color: #fff;
      background-color: #016945;
    }

    .difficulty-easy .mission-difficulty {
      color: #060606;
      background-color: #a5a5a5;
    }
  }
</style>
