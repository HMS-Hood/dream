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
          <a-button
            type="primary"
            :disabled="battleMatched"
            @click="matchBattles"
          >
            Match Battles
          </a-button>
          <a-button
            type="primary"
            :disabled="!battleMatched || nonPlayerBattlesExecuted"
            @click="executeNonPlayerBattles"
          >
            Execute Other Battles
          </a-button>
          <a-button
            type="primary"
            :disabled="!nonPlayerBattlesExecuted || playerBattleExecuted"
            @click="executePlayerBattle"
          >
            Execute Player Battle
          </a-button>
        </div>
      </div>

      <div v-if="battleMatched" class="battle-groups">
        <div
          v-for="group in activeBattleGroups"
          :key="group.id"
          :class="[
            'battle-group',
            { 'player-group': isPlayerBattleGroup(group) },
          ]"
        >
          <div class="group-armies">
            <div class="side">
              <h4>Side 1</h4>
              <div
                v-for="army in group.side1Armies"
                :key="army.id"
                :class="['army-info', { 'player-army': isPlayerArmy(army) }]"
              >
                <squad-distribution :army="army" />
              </div>
            </div>
            <div class="side">
              <h4>Side 2</h4>
              <div
                v-for="army in group.side2Armies"
                :key="army.id"
                :class="['army-info', { 'player-army': isPlayerArmy(army) }]"
              >
                <squad-distribution :army="army" />
              </div>
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
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { Campaign } from '../../../core/battle/campaign';
  import { Army, BattleGroup } from '../../../core/interfaces/combat';
  import SquadDistribution from './SquadDistribution.vue';
  import { useCampaignStore } from '../../../store/campaign';
  import sideArmiesList from './sideArmiesList.vue';
  import { SideState } from '../../../core/battle/SideState';

  const campaignStore = useCampaignStore();
  const campaign = ref<Campaign | null>(null);

  // 假定从 store 中获取重构后的 Campaign 实例
  campaign.value = campaignStore.getCampaign();

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
  const playerBattleExecuted = ref(false);

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

  const isPlayerArmy = (army: Army): boolean => {
    return playerSide.value?.includes(army) || false;
  };

  const matchBattles = () => {
    if (campaign.value) {
      // 假定 assignActiveAndReserveArmies 方法根据配置进行部队上场及后备分配，此处以一个示例上场宽度参数 100
      // const assignments = campaign.value.assignActiveAndReserveArmies(100);
      // const side1Assign = assignments[0];
      // const side2Assign = assignments[1];
      // 使用分配出的上场部队匹配战团
      // campaign.value.matchBattleGroups(side1Assign.active, side2Assign.active);
      battleMatched.value = true;
    }
  };

  const executeNonPlayerBattles = () => {
    if (campaign.value) {
      campaign.value.executeBattle();
      nonPlayerBattlesExecuted.value = true;
      // 此处可根据具体逻辑更新战斗日志和统计数据
    }
  };

  const executePlayerBattle = () => {
    if (campaign.value) {
      campaign.value.executeBattle();
      playerBattleExecuted.value = true;
      // 示例中更新日志和统计数据，实际可根据 campaign 返回数据进行处理
      combatLogs.value = ['Player battle executed.'];
      battleStats.value = { totalDamage: 1234, unitsLost: 3 };
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
