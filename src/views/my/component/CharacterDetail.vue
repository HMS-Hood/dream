<!-- filepath: /e:/my/dream/src/views/my/CharacterDetail.vue -->
<template>
  <a-card
    v-if="character"
    :title="character.name"
    :bordered="false"
    class="character-detail-card"
    :style="{ backgroundImage: `url(${character.avatar})` }"
  >
    <div class="detail-content">
      <div class="left">
        <div class="avatar-container">
          <img
            :src="character.smallAvatar"
            alt="Character Avatar"
            class="avatar"
          />
        </div>
        <a-card class="info-card">
          <input
            v-model="character.nickName"
            class="nickName"
            size="12"
            type="text"
            placeholder="请输入昵称"
          />

          <a-descriptions :column="1" title="角色信息" class="descriptions">
            <a-descriptions-item label="姓名">{{
              character.name
            }}</a-descriptions-item>
            <a-descriptions-item label="等级">{{
              character.level
            }}</a-descriptions-item>
            <a-descriptions-item label="经验">{{
              character.experience
            }}</a-descriptions-item>
            <a-descriptions-item label="品质">{{
              character.quality
            }}</a-descriptions-item>
            <a-descriptions-item label="攻击方式">{{
              character.attackMethod
            }}</a-descriptions-item>
            <a-descriptions-item label="力量">{{
              character.strength
            }}</a-descriptions-item>
            <a-descriptions-item label="敏捷">{{
              character.agility
            }}</a-descriptions-item>
            <a-descriptions-item label="耐力">{{
              character.endurance
            }}</a-descriptions-item>
            <a-descriptions-item label="智力">{{
              character.intelligence
            }}</a-descriptions-item>
            <a-descriptions-item label="精神">{{
              character.spirit
            }}</a-descriptions-item>
            <a-descriptions-item label="感知">{{
              character.perception
            }}</a-descriptions-item>
            <a-descriptions-item label="幸运">{{
              character.luck
            }}</a-descriptions-item>
            <a-descriptions-item label="魅力">{{
              character.charm
            }}</a-descriptions-item>
          </a-descriptions>
        </a-card>
      </div>
      <div class="right">
        <div class="fire-btn" @click="fire()">解雇</div>
        <equipments-panel
          :character="character"
          @open-equipment-modal="openEquipmentModal"
          @remove-equipment="removeEquipment"
        />
      </div>
    </div>
    <a-modal
      v-model:visible="showEquipmentModal"
      :closable="false"
      :footer="false"
      class="dream-modal"
    >
      <div class="equipment-list">
        <div
          v-for="item in availableEquipments"
          :key="item.name"
          class="equipment-item"
          @click="handleEquipmentSelect(item)"
        >
          <div class="equipment-name">{{ item.name }}</div>
          <div class="equipment-name">{{ item.quality }}</div>
        </div>
      </div>
    </a-modal>
  </a-card>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { ICharacter } from '@/core/interfaces';
  import { ItemType } from '@/core/enums';
  import { player } from '@/core/game';
  import { Armor, Item, Shield, Weapon } from '@/core/interfaces/item';
  import { Modal } from '@arco-design/web-vue';
  import EquipmentsPanel from './EquipmentsPanel.vue';

  const character = defineModel<ICharacter>('character');

  const showEquipmentModal = ref(false);
  const selectedSlot = ref<ItemType | null>(null);

  const availableEquipments = computed(() => {
    return selectedSlot.value
      ? player.items.filter((item) => item.type === selectedSlot.value)
      : [];
  });

  const openEquipmentModal = (slot: ItemType) => {
    selectedSlot.value = slot;
    showEquipmentModal.value = true;
  };

  const handleEquipmentSelect = (item: Item) => {
    if (selectedSlot.value && character.value && item) {
      switch (selectedSlot.value) {
        case ItemType.WEAPON:
          player.items.push(
            ...character.value.equipment.setWeapon(item as Weapon)
          );
          break;
        case ItemType.SHIELD:
          player.items.push(
            ...character.value.equipment.setShield(item as Shield)
          );
          break;
        case ItemType.ARMOR:
          player.items.push(
            ...character.value.equipment.setArmor(item as Armor)
          );
          break;
        default:
          break;
      }
      // console.log(
      //   `Equipped ${selectedEquipment.value.name} to ${selectedSlot.value} slot`
      // );
      player.items.splice(
        player.items.findIndex((findItem) => findItem === item),
        1
      );
      showEquipmentModal.value = false;
      selectedSlot.value = null;
    }
  };

  const removeEquipment = (position: string) => {
    if (character.value) {
      const removeItem = character.value?.equipment[position];
      character.value.equipment[position] = undefined;
      if (removeItem) player.items.push(removeItem);
    }
  };

  const fire = () => {
    Modal.confirm({
      content: `是否解雇${character.value?.name}？`,
      onOk: () => {
        const index = player.members.findIndex(
          (member) => member.id === character.value?.id
        );
        if (index >= 0) player.members.splice(index, 1);
      },
    });
  };
</script>

<style lang="less" scoped>
  @import url('@/assets/style/dream.less');

  .character-detail-card {
    height: 1024px;
    background-color: rgb(0 0 0 / 60%);
    box-shadow: 0 8px 16px rgb(0 0 0 / 30%);

    .detail-content {
      display: flex;
      justify-content: space-between;
    }
  }

  .left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .avatar-container {
    width: 256px;
    height: 128px;
    margin-bottom: 20px;
    overflow: hidden;
    border: 2px solid #ecc904;
    border-radius: 10px;
    box-shadow: 0 0 3px 3px rgb(211 194 5 / 30%);
  }

  .avatar {
    width: 256px;
    height: 128px;
    object-fit: cover;
  }

  .info-card {
    /* add a dark overlay */
    position: relative;
    width: 20em;
    margin-bottom: 30px;
    padding: 30px;
    background: linear-gradient(90deg, #606060, #a7a7a7);
    border-radius: 10px;

    .nickName {
      margin-bottom: 0.5em;
      color: #f0de15;
      font-size: 1.5em;
      background-color: transparent;
      border-top: 0;
      border-right: 0;
      border-left: 0;

      &:focus {
        border-bottom-color: #f0de15; // change to desired highlight color (or any color you want)
        outline: none; // remove default outline
      }
    }
  }

  .descriptions {
    :deep(.arco-descriptions-title) {
      margin-bottom: 15px;
      color: #fff;
      font-size: @content-font;
    }

    :deep(.arco-descriptions-item-label-block) {
      color: bisque;
      font-size: @secondary-content-font;
    }

    :deep(.arco-descriptions-item-value-block) {
      color: antiquewhite;
      font-size: @secondary-content-font;
    }
  }

  .fire-btn {
    width: 120px;
    height: 120px;
    padding: 2em;
    color: #444;
    font-size: @secondary-content-font;
    background-color: #a7a7a7;
    cursor: pointer;

    &:hover {
      color: aliceblue;
      background-color: red;
    }
  }

  .equipment-list {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .equipment-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1em;
    border-bottom: 1px solid #444;
    cursor: pointer;
    transition: all 0.3s ease;

    .equipment-name {
      font-size: 12px;
      font-size: @content-font;
    }

    &:hover {
      color: antiquewhite;
      background-color: rgb(60 60 60 / 50%);
    }
  }
</style>
