<template>
  <div class="side-panel">
    <h2>{{ title }}</h2>
    <div v-if="sideState" class="army-list">
      <div
        v-for="(armyState, index) in sideState.armiesState"
        :key="index"
        class="army-card"
      >
        <div class="army-info">
          <h3>Army {{ armyState.name }}</h3>
          <div class="army-stats">
            <p
              >Squads: {{ armyState.squadCount }} /
              {{ armyState.initalSquadCount }}</p
            >
            <p
              >Total Units: {{ armyState.unitCount }} /
              {{ armyState.initalUnitCount }}</p
            >
            <div class="squad-distribution">
              <div class="position-stat">
                <span
                  >Front:
                  {{
                    getSquadsByPosition(armyState, SquadPosition.FRONT)
                  }}</span
                >
              </div>
              <div class="position-stat">
                <span
                  >Middle:
                  {{
                    getSquadsByPosition(armyState, SquadPosition.MIDDLE)
                  }}</span
                >
              </div>
              <div class="position-stat">
                <span
                  >Back:
                  {{ getSquadsByPosition(armyState, SquadPosition.BACK) }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No side state provided</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SideState } from '../../../core/battle/SideState';
  import { ArmyState } from '../../../core/battle/ArmyState';
  import { SquadPosition } from '../../../core/enums';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const props = defineProps<{
    title: string;
    sideState: SideState;
  }>();

  const getSquadsByPosition = (
    army: ArmyState,
    position: SquadPosition
  ): number => {
    return army.squadsState.filter((squad) => squad.position === position)
      .length;
  };
</script>

<style lang="less" scoped>
  .side-panel {
    width: 25%;
    padding: 10px;
    background-color: rgb(32 32 32 / 80%);
    border-radius: 6px;

    .army-list {
      margin-top: 10px;

      .army-card {
        margin-bottom: 10px;
        padding: 10px;
        background-color: rgb(48 48 48 / 80%);
        border-radius: 6px;

        .army-info h3 {
          margin: 0;
          font-size: 16px;
        }

        .army-stats p {
          margin: 4px 0;
        }

        .squad-distribution {
          display: flex;
          gap: 8px;
        }

        .position-stat {
          padding: 4px 6px;
          font-size: 12px;
          background-color: rgb(64 64 64 / 80%);
          border-radius: 4px;
        }
      }
    }
  }
</style>
