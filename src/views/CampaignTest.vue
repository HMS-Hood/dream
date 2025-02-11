<template>
  <div
    class="container"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div class="config-panel">
      <back></back>
      <a-form :model="config" label-width="140px">
        <a-form-item label="队伍数量">
          <a-input-number v-model="config.teamCount" :min="2" :max="4" />
        </a-form-item>
        <a-form-item label="每队小队数">
          <a-input-number v-model="config.squadPerTeam" :min="1" :max="6" />
        </a-form-item>
        <a-form-item label="战场队伍限制">
          <a-input-number v-model="config.battleTeamLimit" :min="2" :max="4" />
        </a-form-item>
      </a-form>
      <a-button type="primary" @click="generateCampaign">生成战役</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import back from './my/component/back.vue';
  import { useCampaignStore } from '../store/campaign';
  import { generateCharacter } from '../core/utils/utils';
  import { Character } from '../core/entities/Character';
  import { Army, Squad } from '../core/interfaces/combat';
  import {
    SquadPosition,
    QualityLevel,
    OneHandWeaponType,
    MiddleRangeWeaponType,
    LongRangeWeaponType,
  } from '../core/enums';
  import {
    createNormalStandardWeapon,
    createNormalStandardArmor,
  } from '../core/utils/itemUtils';
  import { Equipments } from '../core/entities/Equipments';
  import { CombatUnit } from '../core/battle/CombatUnit';
  import { Campaign } from '../core/battle/campaign';

  const router = useRouter();
  const backgroundImage = ref('/img/bg/battle.png');

  const config = reactive({
    teamCount: 2,
    squadPerTeam: 3,
    battleTeamLimit: 2,
  });

  // 根据位置生成对应的武器
  const generateWeaponByPosition = (position: SquadPosition) => {
    const quality = Math.random() < 0.5 ? QualityLevel.F : QualityLevel.E;

    switch (position) {
      case SquadPosition.FRONT:
        return createNormalStandardWeapon(quality, OneHandWeaponType.SWORD);
      case SquadPosition.MIDDLE:
        return createNormalStandardWeapon(quality, MiddleRangeWeaponType.LANCE);
      case SquadPosition.BACK:
        return createNormalStandardWeapon(quality, LongRangeWeaponType.BOW);
      default:
        return createNormalStandardWeapon(quality, OneHandWeaponType.SWORD);
    }
  };

  // 生成防具
  const generateArmor = () => {
    const quality = Math.random() < 0.5 ? QualityLevel.F : QualityLevel.E;
    return createNormalStandardArmor(quality, 'Chain');
  };

  // 生成小队成员
  const generateSquadMembers = (position: SquadPosition): CombatUnit[] => {
    const memberCount = Math.floor(Math.random() * 3) + 3;
    const members: Character[] = [];

    for (let i = 0; i < memberCount; i += 1) {
      const character = generateCharacter();
      const equipments = new Equipments();
      equipments.setWeapon(generateWeaponByPosition(position));
      equipments.setArmor(generateArmor());
      character.equipment = equipments;
      members.push(new Character(character));
    }

    return members.map((member) => new CombatUnit(member));
  };

  // 生成小队
  const generateSquads = (): Squad[] => {
    const squads: Squad[] = [];
    for (let i = 0; i < config.squadPerTeam; i += 1) {
      // 根据索引分配位置
      let position: SquadPosition;
      if (i < config.squadPerTeam / 3) {
        position = SquadPosition.FRONT;
      } else if (i < (config.squadPerTeam * 2) / 3) {
        position = SquadPosition.MIDDLE;
      } else {
        position = SquadPosition.BACK;
      }

      const members = generateSquadMembers(position);
      // 计算小队的平均攻击速度
      const averageSpeed =
        members.reduce((sum, member) => sum + member.attackSpeed, 0) /
        members.length;

      squads.push({
        id: `squad_${i}`,
        position,
        members,
        attackSpeed: averageSpeed,
        targetIds: [],
        isDead: false,
      });
    }
    return squads;
  };

  // 生成战役
  const generateCampaign = () => {
    const teams: Army[] = [];
    for (let i = 0; i < config.teamCount; i += 1) {
      teams.push({
        id: `team_${i}`,
        squads: generateSquads(),
        reserveSquads: [],
      });
    }

    // 生成玩家的 Army
    const playerArmy: Army = {
      id: 'player_army',
      squads: generateSquads(),
      reserveSquads: [],
    };

    const campaign = new Campaign(
      {
        battlefieldWidth: config.battleTeamLimit,
        standardInterval: 40,
        battleTimeLimit: 100,
        maxRounds: 10,
        positionWeight: {
          front: 0.4,
          middle: 0.3,
          back: 0.3,
        },
      },
      teams.slice(0, Math.ceil(teams.length / 2) - 1),
      teams.slice(Math.ceil(teams.length / 2)),
      playerArmy,
      true
    );

    // 使用 store 存储 campaign 实例
    const campaignStore = useCampaignStore();
    campaignStore.setCampaign(campaign);

    // 直接跳转到战役页面
    router.push({ name: 'campaign' });
  };
</script>

<style lang="less" scoped>
  .container {
    min-height: 100vh;
    padding: 20px;
    background-position: center;
    background-size: cover;
  }

  .config-panel {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    color: #fff;
    background-color: rgb(0 0 0 / 70%);
    border-radius: 10px;

    :deep(.el-form-item__label) {
      color: #fff;
    }
  }
</style>
