<template>
  <div class="row character-list">
    <character-list title="" :characters="player.members"></character-list>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import Avatar from './Avatar.vue';
  import { player } from '../../core/game';
  import { CharacterInterface } from '../../core/interfaces';
  import { AttackMethod } from '../../core/enums';
  import CharacterList from './CharacterList.vue';

  const leader = computed(() =>
    player.members.find((member) => member.id === player.protagonistId)
  );
</script>

<style lang="less" scoped>
  @import url('../../assets/style/dream.less');

  .character-list {
    display: flex;
    flex-direction: column;
  }
</style>
