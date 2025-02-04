<template>
  <div class="row team-list">
    <div
      v-for="(item, index) in teamShownList"
      :key="index"
      class="team-cell cell"
    >
      <avatar
        :quality="(item.leader as Character).quality"
        :avatar="(item.leader as Character).avatar"
      ></avatar>
      <div class="team-info parallelogram">
        <div class="team-info">
          <h3 class="name">{{ item.name }}</h3>
          <p class="quality">Leader: {{ (item.leader as Character).name }}</p>
        </div>
      </div>
      <Avatar
        v-for="(teamMember, i) in item.member"
        :key="i"
        :quality="(teamMember as Character).quality"
        :avatar="(teamMember as Character).avatar"
      ></Avatar>
      <div class="config-member" @click="checkMember(item)"
        ><icon-plus :stroke-width="8" :size="72"></icon-plus
      ></div>
    </div>
    <check-team-member
      v-model:visible="checkMemberModalVisible"
      :checked-ids="hoverItem?.memberIds"
      :characters="player.members"
      @change-checked="handleChecked"
    ></check-team-member>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import Avatar from './Avatar.vue';
  import { player } from '../../core/game';
  import { Team } from '../../core/entities/Team';
  import CheckTeamMember from './CheckTeamMember.vue';
  import { Character } from '../../core/entities/Character';

  const hoverItem = ref<Team | null>(null);
  const checkMemberModalVisible = ref<boolean>(false);

  const checkMember = (item: Team) => {
    hoverItem.value = item;
    checkMemberModalVisible.value = true;
  };

  const teamShownList = computed(() => {
    return [player.leadTeam, ...player.teams].map((team) => {
      return reactive({
        ...team,
        leader: computed(() =>
          player.members.find((member) => member.id === team.leaderId)
        ),
        member: computed(() =>
          team.memberIds.map((memberId) =>
            player.members.find((member) => member.id === memberId)
          )
        ),
      });
    });
  });

  const handleChecked = (checkedIds: string[]) => {
    if (hoverItem.value) {
      if (player.leadTeam.id === hoverItem.value.id) {
        player.leadTeam.memberIds = checkedIds;
      } else {
        const curTeam = player.teams.find(
          (team) => team.id === hoverItem.value?.id
        );
        if (curTeam) curTeam.memberIds = checkedIds;
      }
    }
  };
</script>

<style lang="less" scoped>
  .team-list {
    display: flex;
    flex-direction: column;

    .team-cell.cell {
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

      .team-info.parallelogram {
        // transform: skewX(-10deg); /* Skew for parallelogram */
        display: flex;
        flex: 1;
        align-items: center;
        height: 100%;
        overflow: hidden;
      }

      .team-info {
        padding: 10px 20px;
        color: #f2f7f5; /* Light text color */
        transform: skewX(5deg); /* Counter skew for content */

        .name {
          margin-bottom: 5px;
          color: #fff; /* Team name in white */
          font-size: 1.2em;
          text-shadow: 1px 1px 2px rgb(0 0 0 / 80%); /* Text shadow for team name */
        }

        .quality,
        .method {
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
