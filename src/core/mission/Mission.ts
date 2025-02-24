import { QualityLevel, MissionDifficulty, SquadPosition } from '../enums';
import { IArmy, ISquad } from '../interfaces/combat';
import {
  missionQualityEnimyCount,
  missionQualityLowQuality,
  missionDifficultyMagnification,
  missionQualityBaseReward,
  missionQualityRewardMagnification,
  missionDropCountWeight,
  luckAndPerMissionDropRate,
} from '../setting/param-mission';
import { generateId, generateQualityLevelWithMin } from '../utils/utils';
import { generateCharacter, generateEnemyArmy } from '../utils/dataUtils';
import {
  createLongRangeWeapon,
  createNormalStandardArmor,
  createOneHandWeapon,
  createShield,
  createTwohandWeapon,
  generateRandomEquipment,
} from '../utils/itemUtils';
import { CombatUnit } from '../battle/CombatUnit';
import { ICharacter, ICombatUnit } from '../interfaces';
import {
  baseMemberLimit,
  baseSquadLimit,
  defaultBattleConfig,
} from '../setting/param-combat';
import { Armor, Item, Shield, Weapon } from '../interfaces/item';
import { Army } from '../battle/Army';
import { SquadBattle } from './SquadBattleA';
import { Squad } from '../battle/Squad';

export interface MissionInfo {
  name: string;

  desc: string;

  quality: QualityLevel;

  difficulty: MissionDifficulty;
}

/**
 * Calculates the money reward after mission completion.
 *
 * @param missionQuality - The quality level of the mission.
 * @param enemyMultiplier - The enemy count multiplier used during enemy generation.
 * @param charm - The charm attribute value.
 * @returns The final money reward.
 *
 * The calculation follows these steps:
 * 1. Retrieve the base money reward from missionQualityBaseReward using missionQuality.
 * 2. Multiply the base reward with enemyMultiplier to get a preliminary reward.
 * 3. Determine the fluctuation upper bound by multiplying the preliminary reward with the
 *    reward magnification (from missionQualityRewardMagnification for the given missionQuality).
 * 4. Calculate actual fluctuating reward = (charm^2 / 900) * fluctuation upper bound.
 * 5. Final money reward = preliminary reward + actual fluctuating reward.
 */
export function calculateMoneyReward(
  missionQuality: QualityLevel,
  enemyMultiplier: number,
  charm: number
): number {
  // 1. Base reward from mission quality.
  const baseReward: number = missionQualityBaseReward[missionQuality];

  // 2. Preliminary reward based on enemy multiplier.
  const preliminaryReward: number = baseReward * enemyMultiplier;

  // 3. Compute the fluctuation upper bound.
  // Note: missionQualityRewardMagnification might need conversion if its type is not a direct multiplier.
  const fluctuationMultiplier: number =
    missionQualityRewardMagnification[missionQuality];
  const fluctuationUpperBound: number =
    preliminaryReward * fluctuationMultiplier;

  // 4. Calculate the actual fluctuating reward based on the charm attribute.
  const actualFluctuation: number =
    ((charm * charm) / 900) * fluctuationUpperBound;

  // 5. Final money reward.
  return Math.floor(preliminaryReward + actualFluctuation);
}

function getDropCountAddition(value: number): number {
  const clampedValue = Math.min(Math.max(value, 10), 30);
  const dropRate = luckAndPerMissionDropRate[clampedValue];
  const totalWeight = Object.values(dropRate).reduce(
    (sum, weight) => sum + weight,
    0
  );
  let randomWeight = Math.random() * totalWeight;
  let addition = 0;

  const allDropRate = Object.entries(dropRate);
  for (let i = 0; i < allDropRate.length; i += 1) {
    const [count, weight] = allDropRate[i];
    randomWeight -= weight;
    if (randomWeight <= 0) {
      addition = parseInt(count, 10);
      break;
    }
  }

  return addition;
}

export function calculateEquipmentReward(
  missionQuality: QualityLevel,
  luck: number,
  perception: number,
  missionDifficulty: MissionDifficulty
): (Weapon | Armor | Shield)[] {
  // 获取任务难度对应的排除数量
  const difficultyIndex =
    Object.keys(MissionDifficulty).indexOf(missionDifficulty);
  const dropCountOptions = Object.entries(missionDropCountWeight)
    .sort((a, b) => a[1] - b[1])
    .slice(difficultyIndex)
    .map(([count]) => parseInt(count, 10));

  // 按权重随机选择掉落数量
  const totalWeight = dropCountOptions.reduce(
    (sum, count) => sum + missionDropCountWeight[count],
    0
  );
  let randomWeight = Math.random() * totalWeight;
  let dropCount = dropCountOptions[0];

  for (let i = 0; i < dropCountOptions.length; i += 1) {
    const count = dropCountOptions[i];
    randomWeight -= missionDropCountWeight[count];
    if (randomWeight <= 0) {
      dropCount = count;
      break;
    }
  }

  // 计算 luck 和 perception 产生的数量增量
  const luckAddition = getDropCountAddition(luck);
  const perceptionAddition = getDropCountAddition(perception);

  const totalDropCount = dropCount + luckAddition + perceptionAddition;

  const equipmentReward: (Weapon | Armor | Shield)[] = [];
  for (let i = 0; i < totalDropCount; i += 1) {
    equipmentReward.push(
      generateRandomEquipment(missionQualityLowQuality[missionQuality])
    );
  }

  return equipmentReward;
}

export type MissionResult = {
  success: boolean;
  lost: number;
  duration: number;
  moneyReward: number;
  equipmentReward: Item[];
  executorsId: string[];
  lostMembersId: string[];
};

export class Mission {
  name: string;

  desc: string;

  quality: QualityLevel;

  difficulty: MissionDifficulty;

  moneyReward: number = 0;

  equipmentReward: Item[] = [];

  constructor(missionInfo: MissionInfo) {
    this.name = missionInfo.name;
    this.desc = missionInfo.desc;
    this.quality = missionInfo.quality;
    this.difficulty = missionInfo.difficulty;
  }

  /**
   * Completes the mission with the given player's army and player data.
   * @param playerArmy - The player's army.
   * @param player - The player's data.
   * @returns Whether the mission was successful.
   */
  async completeMission(playerArmy: IArmy): Promise<MissionResult> {
    // 1. Generate enemy army and get the multiplier.
    const { enemyArmies, multiplier } = this.localGenerateEnemyArmy();

    // 2. Create a campaign and let the player's army fight the enemy army.
    const battleConfig = defaultBattleConfig;
    battleConfig.battlefieldWidth = 1;
    battleConfig.battleTimeLimit = 1000;
    const campaign = new SquadBattle(playerArmy, enemyArmies, {
      restThreshold: 0.3,
      fleeThreshold: 0.1,
    });
    const result = await campaign.executeBattle();
    console.log('——————————————————————————————————————————');
    result.logs.statistics.forEach((obj) => {
      console.log(
        `| ${obj.name} | ${obj.damage} | ${obj.attack} | ${obj.receive} | ${obj.defense} |`
      );
    });

    // remove dead member
    let lostMemberCount = 0;
    const lostMembersId: string[] = [];
    playerArmy.squads.forEach((squad) => {
      squad.members.forEach((unit) => {
        if (unit.isDead) {
          lostMemberCount += 1;
          lostMembersId.push(unit.getCharacter().id);
        }
      });
    });

    // 3. If the player's army wins, generate rewards.
    if (result.winner === 'player') {
      // 从玩家部队中选取最高的 charm, luck 和 perception 数值
      let maxCharm = 0;
      let maxLuck = 0;
      let maxPerception = 0;

      playerArmy.squads.forEach((squad) => {
        squad.members.forEach((unit) => {
          const character = unit.getCharacter();
          if (character.charm > maxCharm) maxCharm = character.charm;
          if (character.luck > maxLuck) maxLuck = character.luck;
          if (character.perception > maxPerception)
            maxPerception = character.perception;
        });
      });

      // Calculate money reward.
      this.moneyReward = calculateMoneyReward(
        this.quality,
        multiplier,
        maxCharm
      );

      // Calculate equipment reward.
      this.equipmentReward = calculateEquipmentReward(
        this.quality,
        maxLuck,
        maxPerception,
        this.difficulty
      );

      return {
        success: true,
        lost: lostMemberCount,
        duration: Math.ceil(result.duration / 100),
        moneyReward: this.moneyReward,
        equipmentReward: this.equipmentReward,
        lostMembersId,
        executorsId: playerArmy.squads.flatMap((squad) =>
          squad.members.map((member) => member.getCharacter().id)
        ),
      };
    }

    return {
      success: false,
      lost: lostMemberCount,
      duration: Math.ceil(result.duration / 100),
      moneyReward: this.moneyReward,
      equipmentReward: this.equipmentReward,
      lostMembersId,
      executorsId: playerArmy.squads.flatMap((squad) =>
        squad.members.map((member) => member.getCharacter().id)
      ),
    };
  }

  /**
   * Generates an enemy Army for this mission.
   */
  localGenerateEnemyArmy(): { enemyArmies: IArmy[]; multiplier: number } {
    // 1. Get the base enemy count from missionQualityEnimyCount.
    const baseCount: number = missionQualityEnimyCount[this.quality];

    // 2. Get the multiplier range from missionDifficultyMagnification and compute a random multiplier.
    const [multMin, multMax] = missionDifficultyMagnification[this.difficulty];
    const multiplier = Math.random() * (multMax - multMin) + multMin;

    // 3. Compute the final enemy count.
    const enemyCount = Math.round(baseCount * multiplier);

    // 4. Determine enemy personnel quality lower limit according to missionQualityLowQuality.
    const enemyQualityFloor: QualityLevel =
      missionQualityLowQuality[this.quality];

    // 5. Generate enemy personnel.
    const enemyArmies = generateEnemyArmy(enemyCount, enemyQualityFloor);
    return { enemyArmies, multiplier };
  }
}
