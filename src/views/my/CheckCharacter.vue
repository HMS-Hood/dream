<template>
  <div class="character-list" :style="{ 'max-height': `${height}vh` }">
    <div class="character-row header" :style="{ width: `${width}vw` }">
      <div class="list-desc"></div>
      <div class="property-name" @click="order('quality')">品质</div>
      <div class="property-name" @click="order('strength')">力量</div>
      <div class="property-name" @click="order('agility')">敏捷</div>
      <div class="property-name" @click="order('endurance')">耐力</div>
      <div class="property-name" @click="order('intelligence')">智力</div>
      <div class="property-name" @click="order('spirit')">精神</div>
      <div class="property-name" @click="order('perception')">感知</div>
      <div class="property-name" @click="order('luck')">幸运</div>
      <div class="property-name" @click="order('charm')">魅力</div>
    </div>
    <div
      v-for="(item, index) in characters"
      :key="index"
      :style="{ width: `${width}vw` }"
      class="character-row"
      :class="item.checked ? 'checked' : ''"
      @click="check(item as any)"
    >
      <div :class="['team-avatar-container', 'parallelogram', item.quality]">
        <div class="avatar-bg">
          <div
            class="team-avatar"
            :style="{
              'background-image': `url(${item.avatar.replace(
                '.png',
                '_s.png'
              )})`,
            }"
          >
          </div>
        </div>
      </div>
      <div class="character-info parallelogram">
        <h3 class="name">{{ item.name }}</h3>
        <p class="method">Level: {{ item.level }}</p>
        <p class="method">Method: {{ AttackMethod[item.attackMethod] }}</p>
      </div>
      <div :class="['quality', item.quality]"
        ><div class="quality-text">{{ item.quality }}</div></div
      >
      <div class="property">
        <div class="property-value">{{ item.strength }}</div>
      </div>
      <div class="property">
        <div class="property-value">{{ item.agility }}</div>
      </div>
      <div class="property">
        <div class="property-value">{{ item.endurance }}</div>
      </div>
      <div class="property">
        <div class="property-value">{{ item.intelligence }}</div>
      </div>
      <div class="property">
        <div class="property-value">{{ item.spirit }}</div>
      </div>
      <div class="property">
        <div class="property-value">{{ item.perception }}</div>
      </div>
      <div class="property">
        <div class="property-value">{{ item.luck }}</div>
      </div>
      <div class="property">
        <div class="property-value">{{ item.charm }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { AttackMethod, qualityRankMap } from '../../core/enums';
  import { CharacterInterface } from '../../core/interfaces';

  defineProps<{
    width: number;
    height: number;
  }>();

  const characters =
    defineModel<(CharacterInterface & { checked: boolean })[]>('characters');

  const order = (field: string) => {
    if (field === 'quality' || !field) {
      return characters.value?.sort(
        (a, b) => qualityRankMap[b.quality] - qualityRankMap[a.quality]
      );
    }
    return characters.value?.sort((a, b) => b[field] - a[field]);
  };

  const check = (item: CharacterInterface & { checked: boolean }) => {
    item.checked = !item.checked;
  };
</script>

<style lang="less" scoped>
  @import url('../../assets/style/dream.less');

  .character-list {
    display: flex;
    flex-direction: column;
    overflow-x: visible;
    overflow-y: auto;

    .character-row {
      display: flex;
      align-items: center;
      // transform: skewX(-10deg);
      background-color: rgb(0 0 0 / 60%); /* Slightly less opaque background */
      background-image: linear-gradient(
        to right,
        #c7c9c9,
        #f2f7f5,
        0.5
      ); /* Gradient background */

      background-clip: padding-box, border-box;
      background-origin: padding-box, border-box;
      border-bottom: 1px solid transparent; /* Initial transparent border */
      // margin: 1px 0 0px 0;
      border-radius: 8px; /* Slightly smaller border-radius */
      box-shadow: 0 4px 8px rgb(0 0 0 / 20%); /* More pronounced shadow */
      cursor: pointer;
      transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;

      &.checked {
        background-color: rgb(
          0 11 92 / 60%
        ); /* Slightly less opaque background */

        &:hover:not(.header) {
          /* Combined hover and hovered state */
          background-color: rgb(
            0 20 171 / 60%
          ); /* Slightly less opaque background */
        }
      }

      &:hover:not(.header) {
        /* Combined hover and hovered state */
        // border-color: #c9ffef; /* Highlighted border color */
        background-color: rgb(
          39 39 39 / 60%
        ); /* Slightly less opaque background */

        box-shadow: 0 6px 12px rgb(0 0 0 / 30%); /* Stronger shadow on hover */
        // transform: skewX(-10deg) scaleX(1.005); /* Subtle scale on hover */
        transform: scaleX(1.005); /* Subtle scale on hover */
      }

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
        overflow: hidden;
        background-color: rgb(45 45 45 / 90%);

        .avatar-bg {
          width: 100%;
          overflow: hidden;

          .team-avatar {
            width: 100%;
            height: 112px;
            background-position: center;
            background-size: cover;
          }
        }
      }

      .character-info.parallelogram {
        // transform: skewX(-10deg); /* Skew for parallelogram */
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: space-around;
        width: 300px;
        height: 100%;
        padding: 0 20px;
        overflow: hidden;
        // transform: skewX(10deg); /* Counter skew for content */
        color: #f2f7f5; /* Light text color */

        h3,
        p {
          margin: 0;
        }

        p {
          margin-top: 0.5em;
        }

        .name {
          color: #fff; /* Team name in white */
          font-size: 1.5em;
          text-shadow: 1px 1px 2px rgb(0 0 0 / 80%); /* Text shadow for team name */
        }

        .method {
          color: #d0e8e4; /* Subtler text color */
          font-size: 1.2em;
        }
      }

      .quality {
        // transform: skewX(10deg);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        margin-right: 30px;
        border-radius: 30px;

        &.A {
          background-color: @quality-A-color;
        }

        &.B {
          background-color: @quality-B-color;
        }

        &.C {
          background-color: @quality-C-color;
        }

        &.D {
          background-color: @quality-D-color;
        }

        &.E {
          background-color: @quality-E-color;
        }

        &.F {
          background-color: @quality-F-color;
        }

        .quality-text {
          color: #000;
          font-weight: 600;
          font-size: 24px;
        }
      }

      .property {
        width: 80px;
        height: 100%;
        margin: 20px;
        // transform: skewX(10deg);
        .property-value {
          padding: 10px;
          color: #c7c9c9;
          font-size: 1.5em;
        }
      }

      &.header {
        background-color: rgb(0 9 110);
        border-bottom: 2px rgb(171 171 171) solid;
        border-radius: 8px 8px 0 0;

        .list-desc {
          width: 525px;
          height: 100%;
          padding: 20px 35px;
          color: #171717;
          font-weight: 600;
          font-size: 2em;
        }

        .property-name {
          // border-left: 3px sandybrown solid;
          width: 120px;
          padding: 20px 35px;
          color: rgb(206 206 206);
          font-weight: 600;
          font-size: 1.5em;

          &:hover {
            color: rgb(252 185 15);
            background-color: rgb(232 232 232 / 50%);
          }
        }
      }
    }
  }
</style>
