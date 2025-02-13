<!-- filepath: /e:/my/dream/src/views/my/EquipmentsPanel.vue -->
<template>
  <a-card class="equipments-panel" :bordered="false">
    <div class="equipment-slots">
      <div class="equipment-slot" @click="openEquipmentModal(ItemType.WEAPON)">
        <div v-if="character.equipment?.weapon" class="equipped-item">
          <div class="remove-btn"><icon-close></icon-close></div>
          <a-image
            :src="character.equipment.weapon.img"
            class="equipment-icon"
            :title="character.equipment.weapon.name"
            :description="`攻: ${character.equipment.weapon.minDamage} -
              ${character.equipment.weapon.maxDamage}`"
            width="128"
            height="128"
          ></a-image>
        </div>
        <div v-else class="empty-slot">
          <div class="slot-label">武器</div>
          <span>选择武器</span>
        </div>
      </div>

      <div class="equipment-slot" @click="openEquipmentModal(ItemType.SHIELD)">
        <div v-if="character.equipment?.shield" class="equipped-item">
          <a-image
            :src="character.equipment.shield.img"
            class="equipment-icon"
            :title="character.equipment.shield.name"
            width="128"
            height="128"
            :description="`防: ${character.equipment.shield.defence}`"
          ></a-image>
        </div>
        <div v-else class="empty-slot">
          <div class="slot-label">盾牌</div>
          <span>选择盾牌</span>
        </div>
      </div>

      <div class="equipment-slot" @click="openEquipmentModal(ItemType.ARMOR)">
        <div v-if="character.equipment?.armor" class="equipped-item">
          <a-image
            :src="character.equipment.armor.img"
            class="equipment-icon"
            :title="character.equipment.armor.name"
            :description="`防: ${character.equipment.armor.defence}`"
            width="128"
            height="128"
          ></a-image>
        </div>
        <div v-else class="empty-slot">
          <div class="slot-label">盔甲</div>
          <span>选择盔甲</span>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';
  import { CharacterInterface } from '../../../core/interfaces';
  import { ItemType } from '../../../core/enums';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const props = defineProps<{
    character: CharacterInterface;
  }>();

  const emit = defineEmits<{
    (e: 'openEquipmentModal', slot: ItemType): void;
  }>();

  const openEquipmentModal = (slot: ItemType) => {
    emit('openEquipmentModal', slot);
  };
</script>

<style lang="less" scoped>
  .equipments-panel {
    width: 100%;
    margin-top: 20px;
    color: #fff;
    background: linear-gradient(270deg, #606060, #838383);
    border-radius: 10px;

    .ant-card-head {
      font-weight: bold;
      font-size: 1.2em;
      background-color: transparent;
      border-bottom: 1px solid #444;
    }

    .ant-card-body {
      padding: 20px;
    }
  }

  .equipment-slots {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .equipment-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 128px;
    height: 128px;
    margin-bottom: 1em;
    background-color: rgb(255 255 255 / 5%);
    border: 1px solid #666;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgb(255 255 255 / 10%);
      box-shadow: 0 4px 8px rgb(0 0 0 / 30%);
      transform: translateY(-3px);
    }
  }

  .slot-label {
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 16px;
    text-shadow: 1px 1px 2px #000;
  }

  .equipped-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .remove-btn {
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
    }
  }

  .equipment-icon {
    width: 128px;
    height: 128px;
    margin-bottom: 5px;
    object-fit: contain;
  }

  .equipment-name {
    margin-bottom: 4px;
    font-size: 12px;
    text-align: center;
  }

  .equipment-stats {
    color: #ccc;
    font-size: 10px;
  }

  .empty-slot {
    color: #aaa;
    font-size: 12px;
  }
</style>
