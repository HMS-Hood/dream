<template>
  <div class="row squad-list">
    <div v-for="(item, index) in squads" :key="index" class="squad-cell cell">
      <template v-for="(squadMember, i) in item.members" :key="i">
        <template v-if="i === 0">
          <avatar
            :quality="squadMember.getCharacter().quality"
            :avatar="squadMember.getCharacter().avatar"
          ></avatar>
          <div class="squad-info parallelogram">
            <div class="squad-info">
              <h3 class="name">{{ squadMember.getCharacter().name }}</h3>
              <p class="quality"
                >Leader: {{ squadMember.getCharacter().name }}</p
              >
              <p class="position">Position: {{ item.position }}</p>
              <select
                v-model="item.position"
                @change="updatePosition($event, index)"
              >
                <option :value="SquadPosition.FRONT">Front</option>
                <option :value="SquadPosition.MIDDLE">Middle</option>
                <option :value="SquadPosition.BACK">Back</option>
              </select>
            </div>
          </div>
        </template>
        <template v-else>
          <Avatar
            :quality="squadMember.getCharacter().quality"
            :avatar="squadMember.getCharacter().avatar"
          ></Avatar>
        </template>
      </template>
      <div class="config-member" @click="checkMember(index)"
        ><icon-plus :stroke-width="8" :size="72"></icon-plus
      ></div>
    </div>
    <check-squad-member
      v-model:visible="checkMemberModalVisible"
      :checked-ids="
        hoverItem?.members.map((member) => member.getCharacter().id) || []
      "
      :characters="allMembers"
      @change-checked="handleChecked"
    ></check-squad-member>
    <button @click="addSquad">Add Squad</button>
    <button @click="saveArmy">Save Army</button>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import Avatar from './component/Avatar.vue';
  import { player } from '../../core/game';
  import { Squad, Army } from '../../core/interfaces/combat';
  import CheckSquadMember from './CheckSquadMember.vue';
  import { SquadPosition } from '../../core/enums';
  import { validateArmyFormation } from '../../core/utils/armyUtils';
  import { CombatUnit } from '../../core/battle/CombatUnit';
  import { Character } from '../../core/entities/Character';

  const hoverItem = ref<Squad | null>(null);
  const checkMemberModalVisible = ref<boolean>(false);
  const squads = ref<Squad[]>([]);

  const checkMember = (index: number) => {
    hoverItem.value = squads.value[index];
    checkMemberModalVisible.value = true;
  };

  const members = ref(player.members);

  const allMembers = computed(() => [
    ...(hoverItem.value?.members.map(
      (member) => new Character(member.getCharacter())
    ) ?? []),
    ...members.value,
  ]);

  const handleChecked = (checkedIds: string[]) => {
    if (hoverItem.value) {
      members.value = members.value.concat(
        hoverItem.value.members.map(
          (member) => new Character(member.getCharacter())
        )
      );
      hoverItem.value.members.splice(0);
      hoverItem.value.members = members.value
        .filter((member) => checkedIds.includes(member.id))
        .map((member) => new CombatUnit(member));
      members.value = members.value.filter(
        (member) => !checkedIds.includes(member.id)
      );
    }
  };

  const addSquad = () => {
    const squadMembers: CombatUnit[] = [];
    const newSquad: Squad = {
      id: `squad_${squads.value.length + 1}`,
      position: SquadPosition.FRONT,
      attackSpeed: 1,
      members: squadMembers,
      targetIds: [],
      isDead: false,
    };
    squads.value.push(newSquad);
  };

  const updatePosition = (e: Event, index: number) => {
    const squad = squads.value[index];
    squad.position = SquadPosition.BACK; // This line is just to trigger reactivity
  };

  const saveArmy = () => {
    const army: Army = {
      id: 'player_army',
      name: 'Player Army',
      squads: squads.value,
      reserveSquads: [],
      isDead: false,
    };

    // Validate army formation
    if (!validateArmyFormation(army)) {
      alert('Army formation is invalid');
      return;
    }

    // Save the army object for later use
    console.log('Army saved:', army);
  };
</script>

<style lang="less" scoped>
  .squad-list {
    display: flex;
    flex-direction: column;

    .squad-cell.cell {
      display: flex;
      width: 98vw;
      height: 12vh; /* Adjusted height */
      margin: 4px 0;
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
      border: 2px solid transparent; /* Initial transparent border */
      border-radius: 8px; /* Slightly smaller border-radius */
      box-shadow: 0 4px 8px rgb(0 0 0 / 20%); /* More pronounced shadow */
      transform: skewX(-10deg);
      transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;

      &.hovered,
      &:hover {
        /* Combined hover and hovered state */
        border-color: #c9ffef; /* Highlighted border color */
        box-shadow: 0 6px 12px rgb(0 0 0 / 30%); /* Stronger shadow on hover */
        transform: skewX(-10deg) scale(1.01); /* Subtle scale on hover */
      }

      .squad-info.parallelogram {
        // transform: skewX(-10deg); /* Skew for parallelogram */
        display: flex;
        flex: 1;
        align-items: center;
        height: 100%;
        overflow: hidden;
      }

      .squad-info {
        padding: 10px 20px;
        color: #f2f7f5; /* Light text color */
        transform: skewX(5deg); /* Counter skew for content */

        .name {
          margin-bottom: 5px;
          color: #fff; /* Squad name in white */
          font-size: 1.2em;
          text-shadow: 1px 1px 2px rgb(0 0 0 / 80%); /* Text shadow for squad name */
        }

        .quality,
        .position {
          margin-bottom: 2px;
          color: #d0e8e4; /* Subtler text color */
          font-size: 0.9em;
        }
      }

      .config-member {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 128px;
        background-color: rgb(78 78 78);
      }
    }
  }
</style>
