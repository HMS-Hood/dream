<template>
  <div :class="['army-info', { 'player-army': isPlayer }]">
    <div class="list">
      <p>FRONT</p>
      <squad-battle-info
        v-for="squad in army.squads.filter(
          (squad) => squad.position === SquadPosition.FRONT
        )"
        :key="squad.id"
        :squad="squad"
      />
    </div>
    <div class="list">
      <p>BACK</p>
      <squad-battle-info
        v-for="squad in army.squads.filter(
          (squad) => squad.position === SquadPosition.BACK
        )"
        :key="squad.id"
        :squad="squad"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { SquadPosition } from '@/core/enums';
  import { IArmy } from '../../../core/interfaces/combat';
  import SquadBattleInfo from './SquadBattleInfo.vue';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const props = defineProps<{
    army: IArmy;
    isPlayer: boolean;
  }>();
</script>

<style lang="less" scoped>
  @import url('@/assets/style/dream.less');

  .army-info {
    display: flex;
    flex-direction: row;

    .list {
      display: flex;
      flex-direction: column;
      align-items: center;

      p {
        font-size: @content-font;
      }
    }
  }
</style>
