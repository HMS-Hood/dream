<template>
  <div :class="['team-avatar-container', 'parallelogram', quality]">
    <div class="avatar-bg">
      <div
        class="team-avatar"
        :style="{
          'background-image': `url(${avatar.replace('.png', '_s.png')})`,
        }"
      >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    quality: string;
    avatar: string;
  }>();
</script>

<style lang="less" scoped>
  @import url('../../assets/style/dream.less');

  .team-avatar-container.parallelogram {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 256px; /* Adjusted width for avatar container */
    height: 100%;
    // transform: skewX(-10deg); /* Skew for parallelogram */
    // margin-right: 20px; /* Spacing between avatar and info */
    padding: 5px;
    background-color: rgb(45 45 45 / 90%);
    border-left-width: 12px;
    border-left-style: solid;

    &.F {
      border-left-color: @quality-F-color;
    }

    &.E {
      border-left-color: @quality-E-color;
    }

    &.D {
      border-left-color: @quality-D-color;
    }

    &.C {
      border-left-color: @quality-C-color;
    }

    &.B {
      border-left-color: @quality-B-color;
    }

    &.A {
      border-left-color: @quality-A-color;
    }

    &.S,
    &.SS,
    &.SSS {
      border-left-color: @quality-S-color;
    }

    .avatar-bg {
      width: 100%;
      overflow: hidden;

      .team-avatar {
        width: 100%;
        height: 112px;
        background-position: center;
        background-size: cover;
        transform: skewX(10deg) scale(1.1); /* Counter skew and slight scale for avatar */
      }
    }
  }
  // .team-avatar-container.parallelogram::before {
  //   content: ''; /* Required for pseudo-elements */
  //   position: absolute;
  //   top: 0;
  //   left: -5px; /* Adjust to extend glow further left */
  //   bottom: 0;
  //   width: 16px; /* Make it slightly wider than the border to cover it and glow */
  //   background-color: rgb(27, 27, 224); /* Match border color as base */
  //   box-shadow: -5px 0 5px 0px rgb(27, 27, 224); /* The glow effect! */
  //   z-index: -1; /* Place the glow behind the content */
  // }
</style>
