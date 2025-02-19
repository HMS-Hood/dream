<template>
  <div class="army-manager-container">
    <div class="squad-columns">
      <!-- Front Column -->
      <div class="squad-column front">
        <squad-column
          :all-members="allMembers"
          :squads="squads"
          :list-squads="frontSquads"
          :position="SquadPosition.FRONT"
          title="前排小队"
          @change-members="changeMembers"
        ></squad-column>
      </div>

      <!-- Back Column -->
      <div class="squad-column back">
        <squad-column
          :all-members="allMembers"
          :squads="squads"
          :list-squads="backSquads"
          :position="SquadPosition.BACK"
          title="后排小队"
          @change-members="changeMembers"
        ></squad-column>
      </div>
    </div>
    <div class="army-actions">
      <a-button @click="loadTemplate">读取部队模板</a-button>
      <a-button @click="saveTemplate">保存部队模板</a-button>
      <a-button type="primary" @click="saveArmy">保存部队信息</a-button>
    </div>
    <!-- Modal for adjusting squad members -->
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { Message, Modal } from '@arco-design/web-vue';
  import { useArmyStyleStore } from '@/store/armyStyle';
  import { CharacterInterface } from '@/core/interfaces';
  import { ISquad, IArmy } from '@/core/interfaces/combat';
  import { SquadPosition } from '@/core/enums';
  import { CombatUnit } from '@/core/battle/CombatUnit';
  import { useArmyStore } from '@/store/army';
  import { validateArmyFormation } from '@/core/utils/armyUtils';
  import { Squad } from '@/core/battle/Squad';
  import { Army } from '@/core/battle/Army';
  import SquadColumn from './component/SquadColumn.vue';

  const squads = ref<ISquad[]>([]);

  // Split squads into three groups by their position.
  const frontSquads = computed(() =>
    squads.value.filter((squad) => squad.position === SquadPosition.FRONT)
  );
  const backSquads = computed(() =>
    squads.value.filter((squad) => squad.position === SquadPosition.BACK)
  );

  const props = defineProps<{ idleMembers: CharacterInterface[] }>();

  // --- Squad Member Adjustment Feature ---
  const allMembers = ref<CharacterInterface[]>([...props.idleMembers]); // Use player's available members
  const changeMembers = (members: CharacterInterface[]) => {
    allMembers.value = members;
  };

  const armyStore = useArmyStore();
  const saveArmy = () => {
    if (squads.value.some((squad) => !squad.checkLimit())) {
      Modal.warning({ content: '有小队队员人数超出限制！' });
      return;
    }

    const army: IArmy = new Army({
      id: 'player_army',
      name: 'Player Army',
      squads: squads.value,
    });

    if (!validateArmyFormation(army)) {
      Modal.warning({ content: '部队阵型不合规定！' });
      return;
    }
    armyStore.setArmy(army);
    Message.success('Army information saved.');
  };

  const armyStyleStore = useArmyStyleStore();
  const saveTemplate = () => {
    armyStyleStore.setArmyStyle(
      squads.value.map((squad) => ({
        position: squad.position,
        leaderId: squad.leaderId,
        membersId: squad.members.map((member) => member.getCharacter().id),
      }))
    );
  };

  const loadTemplate = () => {
    Modal.confirm({
      title: `载入部队模板警告`,
      content: `载入部队模板将会丢失现有的配置，是否继续？`,
      okText: '载入模板',
      cancelText: '放弃载入',
      onOk: () => {
        const armyTemplate = armyStyleStore.getArmyStyle();
        squads.value.forEach((squad) => {
          allMembers.value.splice(
            allMembers.value.length,
            0,
            ...squad.members.map((member) => member.getCharacter())
          );
        });
        const newSquads: ISquad[] = [];
        armyTemplate.forEach((squadTemplate) => {
          newSquads.push(
            new Squad({
              id: `squad_${Date.now()}`,
              position: squadTemplate.position,
              leaderId: squadTemplate.leaderId,
              members: allMembers.value
                .filter((member) => squadTemplate.membersId.includes(member.id))
                .map((member) => new CombatUnit(member)),
            })
          );
        });
        squads.value = newSquads;
        allMembers.value = allMembers.value.filter(
          (member) =>
            !squads.value
              .flatMap((squad) => squad.members)
              .map((unit) => unit.getCharacter().id)
              .includes(member.id)
        );
      },
    });
  };

  const reset = () => {
    squads.value = [];
  };

  defineExpose({ reset });
</script>

<style lang="less" scoped>
  @import url('@/assets/style/dream.less');

  .army-manager-container {
    min-height: 100vh;
    padding: 20px;
    color: #fff;
    background-image: url('/img/bg/bg1.png');
    background-size: cover;

    .squad-columns {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .squad-column {
      position: relative;
      flex: 1;
      margin: 0 10px;
      padding: 15px;
      background-color: rgb(32 32 32 / 80%);
      border-radius: 8px;
      box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
    }

    .army-actions {
      text-align: center;

      :deep(button) {
        margin: 10px;
      }
    }
  }
</style>
