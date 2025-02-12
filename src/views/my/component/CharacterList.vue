<template>
  <div class="character-cell cell header">
    <div class="list-desc">{{ title }}</div>
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
    v-for="(item, index) in displayList"
    :key="index"
    class="character-cell cell"
    :class="{ hovered: hoverItem === item }"
    @mouseover="hoverItem = item"
    @mouseleave="hoverItem = null"
    @click="showCharacterDetail(item)"
  >
    <avatar :quality="item.quality" :avatar="item.avatar"></avatar>
    <div class="character-info parallelogram">
      <h3 class="name">{{ item.name }}</h3>
      <p class="method">Level: {{ item.level }}</p>
      <p class="method">Method: {{ AttackMethod[item.attackMethod] }}</p>
    </div>
    <div :class="['quality', item.quality]">
      <div class="quality-text">{{ item.quality }}</div>
    </div>
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
    <div class="equipment">
      <img v-if="item.equipment.weapon" :src="item.equipment.weapon.img" />
    </div>
    <div class="equipment">
      <img v-if="item.equipment.shield" :src="item.equipment.shield.img" />
    </div>
    <div class="equipment">
      <img v-if="item.equipment.armor" :src="item.equipment.armor.img" />
    </div>
  </div>
  <a-modal
    v-if="selectedCharacter"
    v-model:visible="characterDetailModalVisible"
    modal-class="modal-detail"
    :modal-style="{
      'background-color': 'rgb(0 0 0 / 60%)',
      'border-radius': '10px',
      'border': '0',
      'box-shadow': '0 8px 16px rgb(0 0 0 / 30%)',
    }"
    :body-style="{ padding: '0' }"
    :hide-title="true"
    :closable="false"
    :footer="false"
    width="1064px"
    height="1064px"
    @before-ok="handleBeforeOk"
  >
    <character-detail :character="selectedCharacter"></character-detail>
  </a-modal>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import Avatar from './Avatar.vue';
  import { CharacterInterface } from '../../../core/interfaces';
  import { AttackMethod, qualityRankMap } from '../../../core/enums';
  import CharacterDetail from './CharacterDetail.vue';

  const hoverItem = ref<CharacterInterface | null>(null);

  const orderBy = ref<string>();

  const props = defineProps<{
    title: string;
    characters: CharacterInterface[];
  }>();

  const displayList = computed(() => {
    const field = orderBy.value;
    const list = [...props.characters];
    if (field) {
      if (field === 'quality') {
        return list.sort(
          (a, b) => qualityRankMap[b.quality] - qualityRankMap[a.quality]
        );
      }
      return list.sort((a, b) => b[field] - a[field]);
    }
    return list;
  });

  const order = (field: string) => {
    orderBy.value = field;
  };

  const selectedCharacter = ref<CharacterInterface | null>(null);
  const characterDetailModalVisible = ref<boolean>(false);

  const showCharacterDetail = (character: CharacterInterface) => {
    selectedCharacter.value = character;
    characterDetailModalVisible.value = true;
  };

  const handleBeforeOk = () => {
    characterDetailModalVisible.value = false;
    return true;
  };
</script>

<style lang="less" scoped>
  @import url('../../../assets/style/dream.less');

  .character-cell.cell {
    display: flex;
    align-items: center;
    width: 97vw;
    height: 12vh; /* Adjusted height */
    overflow: hidden;
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
    transform: skewX(-10deg);
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;

    &.hovered:not(.header),
    &:hover:not(.header) {
      /* Combined hover and hovered state */
      // border-color: #c9ffef; /* Highlighted border color */
      background-color: rgb(
        39 39 39 / 60%
      ); /* Slightly less opaque background */

      box-shadow: 0 6px 12px rgb(0 0 0 / 30%); /* Stronger shadow on hover */
      transform: skewX(-10deg) scaleX(1.005); /* Subtle scale on hover */
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
      color: #f2f7f5; /* Light text color */
      transform: skewX(10deg); /* Counter skew for content */

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
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      margin-right: 30px;
      border-radius: 30px;
      transform: skewX(10deg);

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
      transform: skewX(10deg);

      .property-value {
        padding: 10px;
        color: #c7c9c9;
        font-size: 1.5em;
      }
    }

    .equipment {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 96px;
      height: 96px;
      margin: 0 1em;
      padding: 0;
      color: #f2f7f5;
      font-size: 2em;
      background: linear-gradient(
        45deg,
        rgb(94 94 94),
        rgb(224 224 224),
        rgb(99 100 99)
      );
      transform: skew(10deg);

      img {
        width: 96px;
        height: 96px;
      }
    }

    &.header {
      margin: 10px 0;
      background-color: rgb(255 255 255);
      border: 2px rgb(171 171 171) solid;

      .list-desc {
        width: 550px;
        height: 100%;
        padding: 20px 35px;
        color: #171717;
        font-weight: 600;
        font-size: 2em;
      }

      .property-name {
        width: 120px;
        padding: 20px 35px;
        color: goldenrod;
        font-weight: 600;
        font-size: 1.5em;
        border-left: 3px sandybrown solid;

        &:hover {
          color: rgb(252 185 15);
          background-color: rgb(232 232 232 / 50%);
        }
      }
    }
  }
</style>
