<template>
  <div class="container">
    <div
      v-for="(item, index) in displayList"
      :key="index"
      class="item-cell cell"
      :class="{ hovered: hoverItem === item }"
      @mouseover="hoverItem = item"
      @mouseleave="hoverItem = null"
      @click="showItemDetail(item)"
    >
      <img :src="item.img" alt="Item Image" class="item-image" />
      <div class="item-info parallelogram">
        <h3 class="name">{{ item.name }}</h3>
        <p class="value">价值: {{ item.value }}</p>
        <p class="quality">品质: {{ item.quality }}</p>
      </div>
    </div>
    <a-modal
      v-if="selectedItem"
      v-model:visible="itemDetailModalVisible"
      class="dream-modal large"
      :body-style="{ padding: '0' }"
      :hide-title="true"
      :closable="false"
      :footer="true"
      width="75%"
      height="600px"
      @before-ok="handleBeforeOk"
    >
      <check-character
        v-model:characters="checkCharacters"
        :width="800"
        :height="600"
        :multi="false"
      ></check-character>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { Item } from '@/core/interfaces/item';
  import { player } from '@/core/game';
  import { PropertyCrystal } from '@/core/entities/PropertyCrystal';
  import CheckCharacter from './CheckCharacter.vue';

  const hoverItem = ref<Item | null>(null);
  const orderBy = ref<string>();
  const selectedItem = ref<Item | null>(null);
  const itemDetailModalVisible = ref<boolean>(false);

  const checkCharacters = ref(
    player.members.map((member) => ({
      character: member,
      checked: false,
    }))
  );

  const props = defineProps<{
    title: string;
    items: Item[];
  }>();

  const displayList = computed(() => {
    const field = orderBy.value;
    const list = [...props.items];
    if (field) {
      return list.sort((a, b) => (b[field] < a[field] ? -1 : 1));
    }
    return list;
  });

  const order = (field: string) => {
    orderBy.value = field;
  };

  const showItemDetail = (item: Item) => {
    selectedItem.value = item;
    itemDetailModalVisible.value = true;
  };

  const handleBeforeOk = () => {
    if (!selectedItem.value) {
      return false;
    }
    const checkedCharacter = checkCharacters.value.find((item) => item.checked);
    if (checkedCharacter) {
      (selectedItem.value as PropertyCrystal).use(checkedCharacter.character);
    }
    itemDetailModalVisible.value = false;
    return true;
  };
</script>

<style lang="less" scoped>
  @import url('../../../assets/style/dream.less');

  .container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: flex-start;
  }

  .item-cell.cell {
    display: flex;
    flex: 0 0 none;
    flex-direction: row;
    align-items: center;
    width: 10vw;
    height: 12vh;
    padding-left: 1em;
    background-color: rgb(0 0 0 / 60%);
    border-bottom: 1px solid transparent;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;

    &.hovered:not(.header),
    &:hover:not(.header) {
      background-color: rgb(39 39 39 / 60%);
      box-shadow: 0 6px 12px rgb(0 0 0 / 30%);
      transform: scaleX(1.01);
    }

    .item-image {
      width: 96px;
      height: 96px;
      margin-right: 20px;
    }

    .item-info.parallelogram {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: space-around;
      width: 300px;
      height: 100%;
      padding: 0 20px;
      color: #f2f7f5;

      h3 {
        margin: 0;
        color: #fff;
        font-size: 1.5em;
      }

      .value,
      .quality {
        margin: 0.5em 0;
        color: #d0e8e4;
        font-size: 1.2em;
      }
    }

    .item-cell.cell.header {
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
