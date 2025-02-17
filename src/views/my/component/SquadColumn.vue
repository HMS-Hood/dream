<template>
  <h2>{{ title }}</h2>
  <div v-for="squad in listSquads" :key="squad.id">
    <a-card class="squad-card" hoverable>
      <div class="squad-header">
        <span v-if="squad.members.length" class="leader-name">
          {{ squad.members[0].getCharacter().name }}
        </span>
        <a-image
          v-if="squad.members.length"
          height="128px"
          class="avatar"
          :src="
            squad.members[0].getCharacter().avatar.replace('.png', '_s.png')
          "
        ></a-image>
      </div>
      <div class="squad-body">
        <div class="member-detail">成员数量: {{ squad.members.length }}</div>
        <div class="weapon-stats">
          <span>近战: {{ getWeaponStats(squad).melee }}</span>
          <span>中程: {{ getWeaponStats(squad).mid }}</span>
          <span>远程: {{ getWeaponStats(squad).ranged }}</span>
        </div>
      </div>
      <!-- Icon for adjusting squad members -->
      <div class="adjust-squad" @click.stop="checkMember(squad)">
        <icon-plus :stroke-width="8" :size="48" />
      </div>
    </a-card>
  </div>
  <div></div>
  <div class="add-squad-btn" @click="addSquad()"> 添加小队 </div>
  <check-squad-member
    v-model:visible="checkMemberModalVisible"
    :checked-ids="
      selectedSquadForAdjustment
        ? selectedSquadForAdjustment.members.map(
            (member) => member.getCharacter().id
          )
        : []
    "
    :characters="members"
    @change-checked="handleChecked"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { SquadPosition } from '@/core/enums';
  import { ISquad } from '@/core/interfaces/combat';
  import { CombatUnit } from '@/core/battle/CombatUnit';
  import { CharacterInterface } from '@/core/interfaces';
  import CheckSquadMember from '../CheckSquadMember.vue';

  const checkMemberModalVisible = ref(false);
  const selectedSquadForAdjustment = ref<ISquad | null>(null);

  const props = defineProps<{
    title: string;
    listSquads: ISquad[];
    position: SquadPosition;
    allMembers: CharacterInterface[];
  }>();
  const squads = defineModel<ISquad[]>('squads', { required: true });
  // const allMembers = defineModel<CharacterInterface[]>('allMembers', {
  //   required: true,
  // });

  const emit = defineEmits<{
    (e: 'changeMembers', members: CharacterInterface[]): void;
  }>();

  const addSquad = () => {
    const newSquad: ISquad = {
      id: `squad_${Date.now()}`,
      position: props.position,
      attackSpeed: 1,
      members: [],
      targetIds: [],
      isDead: false,
    };
    squads.value.push(newSquad);
  };

  const members = ref<CharacterInterface[]>([]);
  const checkMember = (squad: ISquad) => {
    members.value = [
      ...squad.members.map((unit) => unit.getCharacter()),
      ...props.allMembers,
    ];
    selectedSquadForAdjustment.value = squad;
    checkMemberModalVisible.value = true;
  };

  // Compute weapon statistics for a squad based on its members' equipped weapon.
  const getWeaponStats = (squad: ISquad) => {
    let melee = 0;
    let mid = 0;
    let ranged = 0;
    squad.members.forEach((member) => {
      const weapon = member.getCharacter().equipment?.weapon;
      if (weapon && weapon.name) {
        const name = weapon.name.toLowerCase();
        if (name.includes('sword')) {
          melee += 1;
        } else if (name.includes('lance')) {
          mid += 1;
        } else if (name.includes('bow')) {
          ranged += 1;
        }
      }
    });
    return { melee, mid, ranged };
  };

  const handleChecked = (newMemberIds: string[]) => {
    if (selectedSquadForAdjustment.value) {
      // Update the squad's members based on the selected member IDs.
      selectedSquadForAdjustment.value.members = members.value
        .filter((member: any) => newMemberIds.includes(member.id))
        .map((member: any) => new CombatUnit(member));
      emit(
        'changeMembers',
        members.value.filter((member: any) => !newMemberIds.includes(member.id))
      );
    }
    checkMemberModalVisible.value = false;
  };
</script>

<style lang="less" scoped>
  @import url('@/assets/style/dream.less');

  h2 {
    margin-bottom: 10px;
    color: #f2f7f5;
    font-size: @secondary-title-font;
    text-align: center;
  }

  .squad-card {
    position: relative;
    margin-bottom: 15px;
    background-color: antiquewhite;
    border-radius: 5px;
    box-shadow: 0 4px 10px rgb(255 255 255);

    &:hover {
      transform: scale(1.01);
      transition: all 0.5s;
    }

    :deep(.arco-card-body) {
      display: flex;
      justify-content: flex-start;
      justify-items: stretch;
    }

    .squad-header {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;

      .leader-name {
        color: #373737;
        font-weight: bold;
        font-size: @secondary-title-font;
      }

      .avatar {
        box-shadow: 5px 5px 3px 1px rgb(183 147 5 / 50%);

        :deep(.arco-image-img) {
          border-top: 3px solid rgb(247 247 246);
          border-left: 3px solid rgb(252 252 252);
        }
      }
    }

    .squad-body {
      flex-grow: 1;
      margin: 0 2em;
      padding: 10px 0;

      .member-detail {
        font-size: @content-font;
      }

      .weapon-stats {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: @secondary-content-font;

        span {
          margin-right: 8px;
        }
      }
    }

    .adjust-squad {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 4em;
      background-color: rgb(141 140 140 / 30%);
      cursor: pointer;

      &:hover {
        background-color: rgb(141 140 140 / 50%);
      }
    }
  }

  .add-squad-btn {
    padding: 1em;
    color: rgb(72 82 92);
    font-size: @content-font;
    text-align: center;
    background-color: rgb(247 226 199 / 10%);
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      color: rgb(27 31 34);
      font-weight: 400;
      background-color: rgb(255 211 145);
      transform: scale(1.01);
      transition: all 0.3s;
    }
  }
</style>
