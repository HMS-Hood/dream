<template>
  <div class="squad-info">
    <a-image
      v-if="squad.leaderId !== ''"
      :width="150"
      :height="75"
      :src="squad.leader?.getCharacter().smallAvatar"
      :class="
        squad.members.filter((member) => !member.isDead).length > 0
          ? 'alive'
          : 'dead'
      "
    />
    <span>
      {{ squad.members.filter((member) => !member.isDead).length }}
      / {{ squad.members.length }}
    </span>
    <a-progress
      :percent="squadCurHealth / squadMaxHealth"
      :show-text="false"
      :color="color"
      size="large"
    />
  </div>
</template>

<script setup lang="ts">
  import { ISquad } from '@/core/interfaces/combat';
  import { computed } from 'vue';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const props = defineProps<{
    squad: ISquad;
  }>();

  const squadMaxHealth = props.squad.members.reduce<number>(
    (total, member) => total + member.maxHealth,
    0
  );

  const squadCurHealth = computed(() =>
    props.squad.members.reduce<number>(
      (total, member) => total + member.currentHealth,
      0
    )
  );

  const color = computed(() => {
    const rate = squadCurHealth.value / squadMaxHealth;
    if (rate > 0.7) return 'green';
    if (rate > 0.3) return 'yellow';
    return 'red';
  });
</script>

<style lang="less" scoped>
  @import url('@/assets/style/dream.less');

  span {
    font-size: @secondary-content-font;
  }

  .squad-info {
    display: flex;
    flex-direction: column;
  }

  :deep(.dead) {
    &::before {
      position: absolute;
      top: 0;
      left: 0; /* Adjust to extend glow further left */
      z-index: 1; /* Place the glow behind the content */
      width: 150px; /* Make it slightly wider than the border to cover it and glow */
      height: 75px;
      background-color: rgb(109 109 109 / 60%); /* Match border color as base */
      content: 'DEAD!'; /* Required for pseudo-elements */
    }
  }
</style>
