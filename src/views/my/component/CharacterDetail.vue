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
            :src="character.avatar.replace('.png', '_s.png')"
            alt="Character Avatar"
            class="avatar"
          />
        </div>
        <a-card class="info-card">
          <a-form :model="character" layout="vertical">
            <a-form-item field="nickName" label="昵称">
              <input
                v-model="character.nickName"
                class="nickName"
                size="12"
                type="text"
                placeholder="请输入昵称"
              />
            </a-form-item>

            <a-descriptions
              :label-style="{ color: '#fff' }"
              :value-style="{ color: '#fff' }"
              :column="1"
              title="角色信息"
              class="descriptions"
            >
              <a-descriptions-item label="姓名">{{
                character.name
              }}</a-descriptions-item>
              <a-descriptions-item label="等级">{{
                character.level
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
          </a-form>
        </a-card>
      </div>
      <div class="right">
        <div style="width: 120px; height: 120px"></div>
        <equipments-panel
          :character="character"
          @open-equipment-modal="openEquipmentModal"
        />
      </div>
    </div>
    <a-modal
      v-model:visible="showEquipmentModal"
      title="选择装备"
      class="equipment-modal"
      @ok="handleEquipmentSelect"
    >
      <div class="equipment-list">
        <div
          v-for="item in availableEquipments"
          :key="item.name"
          class="equipment-item"
          @click="selectEquipment(item)"
        >
          <img :src="item.img" alt="Equipment Icon" class="equipment-icon" />
          <div class="equipment-name">{{ item.name }}</div>
        </div>
      </div>
    </a-modal>
  </a-card>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { CharacterInterface } from '../../../core/interfaces';
  import EquipmentsPanel from './EquipmentsPanel.vue';
  import { ItemType } from '../../../core/enums';
  import { player } from '../../../core/game';

  const character = defineModel<CharacterInterface>('character');

  const showEquipmentModal = ref(false);
  const selectedSlot = ref<ItemType | null>(null);
  const selectedEquipment = ref<any>(null);

  const availableEquipments = computed(() => {
    return selectedSlot.value
      ? player.items.filter((item) => item.type === selectedSlot.value)
      : [];
  });

  const openEquipmentModal = (slot: ItemType) => {
    selectedSlot.value = slot;
    showEquipmentModal.value = true;
  };

  const selectEquipment = (item: any) => {
    selectedEquipment.value = item;
  };

  const handleEquipmentSelect = () => {
    if (selectedSlot.value && selectedEquipment.value) {
      switch (selectedSlot.value) {
        case ItemType.WEAPON:
          character.value?.equipment.setWeapon(selectedEquipment.value);
          break;
        case ItemType.SHIELD:
          character.value?.equipment.setShield(selectedEquipment.value);
          break;
        case ItemType.ARMOR:
          character.value?.equipment.setArmor(selectedEquipment.value);
          break;
        default:
          break;
      }
      // console.log(
      //   `Equipped ${selectedEquipment.value.name} to ${selectedSlot.value} slot`
      // );
      player.items.splice(
        player.items.findIndex((item) => item === selectedEquipment.value),
        1
      );
      showEquipmentModal.value = false;
      selectedSlot.value = null;
      selectedEquipment.value = null;
    }
  };
</script>

<style lang="less" scoped>
  .character-detail-card {
    height: 1024px;
    background-color: rgb(0 0 0 / 60%);
    border-radius: 10px;
    box-shadow: 0 8px 16px rgb(0 0 0 / 30%);

    .detail-content {
      display: flex;
      justify-content: space-between;
    }
  }

  .avatar-container {
    width: 120px;
    height: 120px;
    margin-bottom: 20px;
    overflow: hidden;
    border: 2px solid #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
  }

  .avatar {
    width: 100%;
    height: 100%;
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
    .ant-descriptions-header {
      margin-bottom: 15px;
      color: #fff;
      font-size: 1.3em;
    }

    .ant-descriptions-item-label {
      color: #eee;
      font-weight: bold;
    }

    .ant-descriptions-item-content {
      color: #fff;
    }
  }

  .equipment-modal {
    .ant-modal-content {
      color: #fff;
      background-color: rgb(0 0 0 / 80%);
      border-radius: 10px;
    }
  }

  .equipment-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  .equipment-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 120px;
    margin: 10px;
    border: 1px solid #444;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgb(255 255 255 / 10%);
      transform: scale(1.05);
    }
  }

  .equipment-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 5px;
    object-fit: contain;
  }

  .equipment-name {
    font-size: 12px;
    text-align: center;
  }
</style>
