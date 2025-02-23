<template>
  <div
    class="container"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <!-- 左侧部队列表 -->
    <side-armies-list title="左方" :side-state="side1State" />

    <!-- 中间战役信息 -->
    <div class="battle-info">
      <div class="battle-header">
        <h2>Battle Status</h2>
        <div class="control-buttons">
          <a-button type="primary" @click="showArmyManager = true">
            Set Army
          </a-button>
          <a-button type="primary" @click="executeNonPlayerBattles">
            Execute Other Battles
          </a-button>
        </div>
      </div>

      <div class="battle-groups">
        <div
          v-for="group in campaign?.battleGroups"
          :key="group.id"
          :class="[
            'battle-group',
            { 'player-group': isPlayerBattleGroup(group) },
          ]"
        >
          <div class="group-armies">
            <div class="side">
              <h4>Side 1</h4>
              <army-battle-info
                v-for="army in group.side1Armies"
                :key="army.id"
                :army="army"
                :is-player="isPlayerArmy(army)"
              />
            </div>
            <div class="side">
              <h4>Side 2</h4>
              <army-battle-info
                v-for="army in group.side2Armies"
                :key="army.id"
                :army="army"
                :is-player="isPlayerArmy(army)"
              />
            </div>
          </div>
          <div
            v-if="nonPlayerBattlesExecuted && !isPlayerBattleGroup(group)"
            class="battle-result"
          >
            <h4>Battle Result</h4>
            <p>Winner: {{ 'TBD' }}</p>
          </div>
        </div>
      </div>

      <div v-if="combatLogs.length > 0" class="combat-log">
        <div v-for="(log, index) in combatLogs" :key="index" class="log-entry">
          {{ log }}
        </div>
      </div>

      <div class="battle-statistics">
        <h4>Battle Statistics</h4>
        <div class="stat-row">
          <span>Total Damage Dealt:</span>
          <span>{{ battleStats.totalDamage }}</span>
        </div>
        <div class="stat-row">
          <span>Units Lost:</span>
          <span>{{ battleStats.unitsLost }}</span>
        </div>
      </div>
    </div>

    <!-- 右侧部队列表 -->
    <side-armies-list title="右方" :side-state="side2State" />

    <!-- 战斗结束显示部分 -->
    <div v-if="battleState" class="battle-result">
      <h2>Battle Ended</h2>
      <div>Winner: {{ getWinningSide() }}</div>
    </div>
  </div>
  <a-modal
    v-model:visible="showArmyManager"
    :modal-style="{ 'background-color': 'rgb(78, 78, 78, 0.8)' }"
    :fullscreen="true"
    :closable="false"
    @before-ok="handleArmySet"
  >
    <army-manager
      ref="armyManagerRef"
      :idle-members="idleMembers"
    ></army-manager>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useArmyStore } from '@/store/army';
  import { Campaign } from '@/core/battle/campaign';
  import { SideState } from '@/core/battle/SideState';
  import { IArmy, BattleGroup } from '@/core/interfaces/combat';
  import { defaultBattleConfig } from '@/core/setting/param-combat';
  import { generateEnemyArmy } from '@/core/utils/dataUtils';
  import { QualityLevel } from '@/core/enums';
  import { player } from '@/core/game';
  import ArmyBattleInfo from './ArmyBattleInfo.vue';
  import sideArmiesList from './sideArmiesList.vue';
  import ArmyManager from '../ArmyManager.vue';

  const campaign = ref<Campaign | null>(null);

  const showArmyManager = ref(false);
  const armyManagerRef = ref<typeof ArmyManager>();
  const armyStore = useArmyStore();
  const handleArmySet = () => {
    const army = armyStore.getArmy();
    const enemyArmies = generateEnemyArmy(90, QualityLevel.F);
    campaign.value = new Campaign(
      defaultBattleConfig,
      [],
      enemyArmies,
      army,
      true
    );
    return true;
  };

  const idleMembers = computed(() =>
    player.members.filter((member) => !player.workingIds.includes(member.id))
  );

  // 假定 RefactoredCampaign 实例提供 getBattleState、getActiveBattleGroups、getPlayerSide 等方法，供渲染使用
  const battleState = computed(() => campaign.value?.getBattleState());
  const side1State = computed(() => {
    if (campaign.value) {
      return campaign.value?.getBattleState().side1State;
    }
    return new SideState([]);
  });
  const side2State = computed(() => {
    if (campaign.value) {
      return campaign.value?.getBattleState().side2State;
    }
    return new SideState([]);
  });
  const activeBattleGroups = computed(
    () => campaign.value?.getActiveBattleGroups() || []
  );
  const playerSide = computed(() => campaign.value?.getPlayerSide());

  // 控制变量
  const battleMatched = ref(false);
  const nonPlayerBattlesExecuted = ref(false);

  const combatLogs = ref<string[]>([]);
  const battleStats = ref({
    totalDamage: 0,
    unitsLost: 0,
  });

  const backgroundImage = ref('/img/bg/battle.png');

  const isPlayerBattleGroup = (group: BattleGroup): boolean => {
    return (
      group.side1Armies.some((army) => playerSide.value?.includes(army)) ||
      group.side2Armies.some((army) => playerSide.value?.includes(army))
    );
  };

  const isPlayerArmy = (army: IArmy): boolean => {
    return armyStore.getArmy()?.id === army.id;
  };

  const executeNonPlayerBattles = () => {
    if (campaign.value) {
      campaign.value.executeBattle();
      nonPlayerBattlesExecuted.value = true;
      // 此处可根据具体逻辑更新战斗日志和统计数据
    }
  };

  const getWinningSide = (): string => {
    return 'Unknown';
  };
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px;
    color: #fff;
    background-size: cover;
  }

  .battle-info {
    flex: 1;
    margin: 0 10px;
    padding: 10px;
    background-color: rgb(16 16 16 / 80%);
    border-radius: 6px;
  }

  .battle-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .control-buttons {
    display: flex;
    gap: 10px;
  }

  .battle-groups {
    margin-top: 20px;
  }

  .battle-group {
    margin-bottom: 15px;
    padding: 15px;
    background-color: rgb(48 48 48 / 80%);
    border-radius: 6px;
  }

  .player-group {
    border: 2px solid gold;
  }

  .group-armies {
    display: flex;
    justify-content: space-around;
  }

  .battle-result {
    margin-top: 10px;
    padding: 10px;
    background-color: rgb(0 0 0 / 70%);
    border-radius: 6px;
  }

  .combat-log {
    height: 200px;
    margin-top: 20px;
    padding: 10px;
    overflow-y: auto;
    background-color: rgb(32 32 32 / 80%);
    border-radius: 6px;
  }

  .battle-statistics {
    margin-top: 20px;
    padding: 15px;
    background-color: rgb(48 48 48 / 80%);
    border-radius: 6px;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
</style>
