<template>
  <div
    class="container"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <!-- 左侧部队列表 -->
    <div class="side-panel">
      <h2>{{ campaign?.getBattleState().sides[0].name }}</h2>
      <div class="army-list">
        <div
          v-for="army in campaign?.getBattleState().sides[0].armies"
          :key="army.id"
          class="army-card"
        >
          <div class="army-info">
            <h3>Army {{ army.id }}</h3>
            <div class="army-stats">
              <p>Squads: {{ army.squads.length }}</p>
              <p>Total Units: {{ getTotalUnits(army) }}</p>
              <div class="squad-distribution">
                <div class="position-stat">
                  <span>Front: {{ getSquadsByPosition(army, 'FRONT') }}</span>
                </div>
                <div class="position-stat">
                  <span>Middle: {{ getSquadsByPosition(army, 'MIDDLE') }}</span>
                </div>
                <div class="position-stat">
                  <span>Back: {{ getSquadsByPosition(army, 'BACK') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间战役信息 -->
    <div class="battle-info">
      <div class="battle-header">
        <h2>Battle Status - Round {{ campaign?.getBattleState().round }}</h2>
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
          v-for="group in campaign?.getActiveBattleGroups()"
          :key="group.id"
          :class="{
            'battle-group': true,
            'player-group': isPlayerBattleGroup(group),
          }"
        >
          <div class="group-armies">
            <div class="side">
              <h4>Side 1</h4>
              <div
                v-for="army in group.side1Armies"
                :key="army.id"
                :class="{
                  'army-info': true,
                  'player-army': isPlayerArmy(army),
                }"
              >
                <squad-distribution :army="army" />
              </div>
            </div>
            <div class="side">
              <h4>Side 2</h4>
              <div
                v-for="army in group.side2Armies"
                :key="army.id"
                :class="{
                  'army-info': true,
                  'player-army': isPlayerArmy(army),
                }"
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
            <p
              >Casualties - Side 1:
              {{ getBattleGroupCasualties(group, true) }}</p
            >
            <p
              >Casualties - Side 2:
              {{ getBattleGroupCasualties(group, false) }}</p
            >
          </div>
        </div>
      </div>

      <!-- 玩家战斗详情 -->
      <div
        v-if="playerBattleExecuted && playerBattleGroup"
        class="player-battle-details"
      >
        <h3>Player Battle Details</h3>
        <a-switch v-model:model-value="showDetailedCombat" />
        <span class="switch-label">Show Detailed Combat</span>

        <div class="combat-log">
          <div
            v-for="(log, index) in combatLogs"
            :key="index"
            class="log-entry"
          >
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
    </div>

    <!-- 右侧部队列表 -->
    <div class="side-panel">
      <h2>{{ campaign?.getBattleState().sides[1].name }}</h2>
      <div class="army-list">
        <div
          v-for="army in campaign?.getBattleState().sides[1].armies"
          :key="army.id"
          class="army-card"
        >
          <div class="army-info">
            <h3>Army {{ army.id }}</h3>
            <div class="army-stats">
              <p>Squads: {{ army.squads.length }}</p>
              <p>Total Units: {{ getTotalUnits(army) }}</p>
              <div class="squad-distribution">
                <div class="position-stat">
                  <span>Front: {{ getSquadsByPosition(army, 'FRONT') }}</span>
                </div>
                <div class="position-stat">
                  <span>Middle: {{ getSquadsByPosition(army, 'MIDDLE') }}</span>
                </div>
                <div class="position-stat">
                  <span>Back: {{ getSquadsByPosition(army, 'BACK') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 战斗组详情部分 -->
    <div class="battle-group-details">
      <template v-for="group in campaign?.getBattleGroups()" :key="group.id">
        <div class="armies-info">
          <div class="side-armies">
            <h3>Side 1 Armies</h3>
            <div v-for="army in group.side1Armies" :key="army.id">
              <div class="squad-distribution">
                <div>Front: {{ getSquadsByPosition(army, 'FRONT') }}</div>
                <div>Middle: {{ getSquadsByPosition(army, 'MIDDLE') }}</div>
                <div>Back: {{ getSquadsByPosition(army, 'BACK') }}</div>
              </div>
              <div>Total Units: {{ getTotalUnits(army) }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 战斗结果显示部分 -->
    <div v-if="campaign?.isBattleOver()" class="battle-result">
      <h2>Battle Ended</h2>
      <div>Winner: {{ getWinningSide() }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import {
    Army,
    BattleGroup,
    BattleGroupResult,
    CombatLog,
  } from '../../core/interfaces/combat';
  import { SquadPosition } from '../../core/enums';
  import { useCampaignStore } from '../../store/campaign';
  import SquadDistribution from './SquadDistribution.vue';

  const battleMatched = ref(false);
  const nonPlayerBattlesExecuted = ref(false);
  const playerBattleExecuted = ref(false);
  const showDetailedCombat = ref(false);

  const campaignStore = useCampaignStore();
  const campaign = computed(() => {
    const currentCampaign = campaignStore.getCampaign();
    return currentCampaign;
  });

  const playerBattleGroup = computed(() => {
    const battleGroups = campaign.value?.getBattleGroups();
    const playerSide = campaign.value?.getPlayerSide();
    if (!playerSide) return null;

    return battleGroups?.find(
      (group) =>
        group.side1Armies.some((army) => playerSide.armies.includes(army)) ||
        group.side2Armies.some((army) => playerSide.armies.includes(army))
    );
  });
  const combatLogs = ref<string[]>([]);
  const battleStats = ref({
    totalDamage: 0,
    unitsLost: 0,
  });
  const backgroundImage = ref('/img/bg/battle.png');

  // 监听战役状态变化
  watch(
    () => campaign.value,
    () => {
      const status = campaign.value?.getBattleStatus();
      if (status) {
        battleMatched.value = status.battleMatched;
        nonPlayerBattlesExecuted.value = status.nonPlayerBattlesExecuted;
        playerBattleExecuted.value = status.playerBattleExecuted;
      }
    },
    { deep: true }
  );

  const getTotalUnits = (army: Army): number => {
    return army.squads.reduce(
      (total, squad) => total + squad.members.length,
      0
    );
  };

  const getSquadsByPosition = (army: Army, position: string): number => {
    return army.squads.filter(
      (squad) =>
        squad.position === SquadPosition[position as keyof typeof SquadPosition]
    ).length;
  };

  const matchBattles = () => {
    const result = campaign.value?.executeNextStep();
    if (result === 'match') {
      battleMatched.value = true;
    }
  };

  const updateBattleResults = (results: Map<string, BattleGroupResult>) => {
    const battleGroups = campaign.value?.getBattleGroups();
    Array.from(results.entries()).forEach(([groupId]) => {
      if (groupId !== playerBattleGroup.value?.id) {
        const battleGroup = battleGroups?.find((group) => group.id === groupId);
        if (battleGroup) {
          battleGroup.battleState.isOver = true;
        }
      }
    });
  };

  const executeNonPlayerBattles = () => {
    const result = campaign.value?.executeNextStep();
    if (result === 'nonPlayerBattles') {
      nonPlayerBattlesExecuted.value = true;
      const results = campaign.value?.getCurrentBattleResults();
      if (results) {
        updateBattleResults(results);
      }
    }
  };

  const formatDetailedLog = (log: CombatLog): string => {
    if (log.type === 'unit') {
      return `Unit ${log.attackerId} attacked Unit ${log.targetId} for ${
        log.damage
      } damage${log.isKill ? ' (Kill)' : ''}`;
    }
    return `Squad ${log.attackerId} attacked Squad ${log.targetId} for ${log.damage} total damage`;
  };

  const formatSquadLog = (log: CombatLog): string => {
    return `Squad ${log.attackerId} attacked Squad ${log.targetId} (${log.damage} damage)`;
  };

  const updatePlayerBattleResults = (
    results: Map<string, BattleGroupResult>
  ) => {
    const playerResult = Array.from(results.values()).find(
      (result) => result.groupId === playerBattleGroup.value?.id
    );

    if (playerResult) {
      // 根据详细程度设置显示的战斗日志
      combatLogs.value = showDetailedCombat.value
        ? playerResult.combatLogs.map((log) => formatDetailedLog(log))
        : playerResult.combatLogs
            .filter((log) => log.type === 'squad')
            .map((log) => formatSquadLog(log));

      // 更新战斗统计
      battleStats.value = {
        totalDamage: playerResult.combatLogs.reduce(
          (sum, log) => sum + log.damage,
          0
        ),
        unitsLost:
          playerResult.casualties?.side1 ??
          0 + (playerResult.casualties?.side2 ?? 0),
      };
    }
  };

  const executePlayerBattle = () => {
    const result = campaign.value?.executeNextStep();
    if (result === 'playerBattle') {
      playerBattleExecuted.value = true;
      const results = campaign.value?.getCurrentBattleResults();
      if (results) {
        updatePlayerBattleResults(results);
      }
    }
  };

  const getBattleGroupCasualties = (
    group: BattleGroup,
    isSide1: boolean
  ): number => {
    const results = campaign.value?.getCurrentBattleResults();
    if (results) {
      const result = results.get(group.id);
      if (result) {
        return (
          (isSide1 ? result.casualties?.side1 : result.casualties?.side2) ?? 0
        );
      }
    }
    return 0;
  };

  const isPlayerBattleGroup = (group: BattleGroup): boolean => {
    const playerSide = campaign.value?.getPlayerSide();
    if (!playerSide) return false;

    return (
      group.side1Armies.some((army) => playerSide.armies.includes(army)) ||
      group.side2Armies.some((army) => playerSide.armies.includes(army))
    );
  };

  const isPlayerArmy = (army: Army): boolean => {
    const playerSide = campaign.value?.getPlayerSide();
    return playerSide?.armies.includes(army) || false;
  };

  // 添加获取胜利方的方法
  const getWinningSide = () => {
    const sides = campaign.value?.getSides();
    const winningSide = sides?.find((side) =>
      side.armies.some((army) => army.squads.some((squad) => !squad.isDead))
    );
    return winningSide?.name || 'Draw';
  };
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    justify-content: space-between;
    min-height: 100vh;
    padding: 20px;
    color: #fff;
    background-position: center;
    background-size: cover;
  }

  .side-panel {
    flex: 0 0 300px;
    padding: 20px;
    background-color: rgb(0 0 0 / 70%);
    border-radius: 10px;

    h2 {
      margin-bottom: 20px;
      color: goldenrod;
      text-align: center;
    }
  }

  .battle-info {
    flex: 1;
    margin: 0 20px;
    padding: 20px;
    background-color: rgb(0 0 0 / 70%);
    border-radius: 10px;
  }

  .army-card {
    margin-bottom: 15px;
    padding: 15px;
    background-color: rgb(48 48 48 / 80%);
    border-radius: 6px;

    &:hover {
      background-color: rgb(64 64 64 / 80%);
    }
  }

  .battle-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    h2 {
      color: goldenrod;
    }
  }

  .control-buttons {
    display: flex;
    gap: 10px;
  }

  .battle-groups {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .battle-group {
    padding: 15px;
    background-color: rgb(48 48 48 / 80%);
    border-radius: 6px;

    .group-armies {
      display: flex;
      gap: 20px;
      justify-content: space-evenly;
    }
  }

  .battle-sides {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .battle-side {
    flex: 1;
    padding: 10px;
  }

  .combat-log {
    height: 300px;
    margin-top: 20px;
    padding: 10px;
    overflow-y: auto;
    background-color: rgb(32 32 32 / 80%);
    border-radius: 4px;
  }

  .battle-statistics {
    margin-top: 20px;
    padding: 15px;
    background-color: rgb(48 48 48 / 80%);
    border-radius: 6px;
  }

  .switch-label {
    margin-left: 10px;
    color: #d0e8e4;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .position-stat {
    padding: 4px 8px;
    background-color: rgb(64 64 64 / 80%);
    border-radius: 4px;
  }

  .battle-group-details {
    margin-top: 20px;
    padding: 20px;
    background-color: rgb(0 0 0 / 70%);
    border-radius: 10px;

    .armies-info {
      margin-bottom: 20px;

      .side-armies {
        margin-bottom: 10px;

        h3 {
          margin-bottom: 10px;
          color: goldenrod;
        }
      }
    }
  }

  .battle-result {
    margin-top: 20px;
    padding: 20px;
    background-color: rgb(0 0 0 / 70%);
    border-radius: 10px;

    h2 {
      margin-bottom: 10px;
      color: goldenrod;
    }
  }
</style>
