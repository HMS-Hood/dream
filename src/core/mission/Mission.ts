import { QualityLevel, MissionDifficulty, SquadPosition } from '../enums';
import { Army } from '../interfaces/combat';
import {
  missionQualityEnimyCount,
  missionQualityLowQuality,
  missionDifficultyMagnification,
  missionQualityBaseReward,
  missionQualityRewardMagnification,
} from '../setting/param-mission';
import {
  generateCharacter,
  generateId,
  generateQualityLevelWithMin,
} from '../utils/utils';
import { validateArmyFormation } from '../utils/armyUtils';
import {
  createLongRangeWeapon,
  createMiddleRangeWeapon,
  createNormalStandardArmor,
  createOneHandWeapon,
  createShield,
  createTwohandWeapon,
} from '../utils/itemUtils';
import { CombatUnit } from '../battle/CombatUnit';
import { CharacterInterface } from '../interfaces';

export class Mission {
  name: string;

  desc: string;

  quality: QualityLevel;

  difficulty: MissionDifficulty;

  constructor(
    name: string,
    desc: string,
    quality: QualityLevel,
    difficulty: MissionDifficulty
  ) {
    this.name = name;
    this.desc = desc;
    this.quality = quality;
    this.difficulty = difficulty;
  }
}

/**
 * Generates an enemy Army for this mission.
 */
export function generateEnemyArmy(this: Mission): Army {
  // 1. Get the base enemy count from missionQualityEnimyCount.
  const baseCount: number = missionQualityEnimyCount[this.quality];

  // 2. Get the multiplier range from missionDifficultyMagnification and compute an average multiplier.
  const [multMin, multMax] = missionDifficultyMagnification[this.difficulty];
  const multiplier = (multMin + multMax) / 2;

  // 3. Compute the final enemy count.
  const enemyCount = Math.round(baseCount * multiplier);

  // 4. Determine enemy personnel quality lower limit according to missionQualityLowQuality.
  const enemyQualityFloor: QualityLevel =
    missionQualityLowQuality[this.quality];

  // 5. Generate enemy personnel. (generateCharacter returns a Character.)
  const enemyMembers: CharacterInterface[] = [];
  for (let i = 0; i < enemyCount; i += 1) {
    enemyMembers.push(generateCharacter(enemyQualityFloor));
  }

  // 6. Group every 10 personnel into a squad.
  const squads: any[] = [];
  for (let i = 0; i < enemyMembers.length; i += 10) {
    const group = enemyMembers.slice(i, i + 10);
    // Sort the group by quality descending.
    group.sort((a, b) => Number(b.quality) - Number(a.quality));
    // Wrap each character into a CombatUnit.
    const combatUnits = group.map((member) => new CombatUnit(member));

    const squad = {
      id: generateId(),
      position: SquadPosition.MIDDLE, // temporary; will be reassigned below.
      attackSpeed:
        combatUnits.reduce((sum, unit) => sum + (unit.attackSpeed || 1), 0) /
        combatUnits.length,
      members: combatUnits,
      targetIds: [],
      isDead: false,
    };
    squads.push(squad);
  }

  // 7. Combine squads into an Army object.
  const enemyArmy: Army = {
    id: generateId(),
    name: '敌人',
    squads,
    reserveSquads: [],
    isDead: false,
  };

  // 8. Distribute squads into formation positions.
  const totalSquads = squads.length;
  const frontCount = Math.ceil(totalSquads / 3);
  const middleCount = Math.ceil(totalSquads / 3);

  squads.forEach((squad, index) => {
    if (index < frontCount) {
      squad.position = SquadPosition.FRONT;
    } else if (index < frontCount + middleCount) {
      squad.position = SquadPosition.MIDDLE;
    } else {
      squad.position = SquadPosition.BACK;
    }
  });

  // 9. Validate formation (optional).
  if (!validateArmyFormation(enemyArmy)) {
    // eslint-disable-next-line no-console
    console.warn('Generated enemy army formation is invalid.');
  }

  // 10. For each squad, generate equipment based on formation.
  squads.forEach((squad) => {
    squad.members.forEach((unit: any) => {
      // For each piece of equipment, first determine its random quality.
      const equipQuality = generateQualityLevelWithMin(
        missionQualityLowQuality[this.quality]
      );

      if (squad.position === SquadPosition.FRONT) {
        if (Math.random() < 0.5) {
          unit
            .getCharacter()
            .equipment.setWeapon(createOneHandWeapon(equipQuality));
          unit.getCharacter().equipment.setShield(createShield(equipQuality));
        } else {
          unit
            .getCharacter()
            .equipment.setWeapon(createTwohandWeapon(equipQuality));
        }
        if (Math.random() < 0.5) {
          unit
            .getCharacter()
            .equipment.setArmor(
              createNormalStandardArmor(equipQuality, 'Plate')
            );
        } else {
          unit
            .getCharacter()
            .equipment.setArmor(
              createNormalStandardArmor(equipQuality, 'Chain')
            );
        }
      } else if (squad.position === SquadPosition.MIDDLE) {
        unit
          .getCharacter()
          .equipment.setWeapon(createMiddleRangeWeapon(equipQuality));
        if (Math.random() < 0.5) {
          unit
            .getCharacter()
            .equipment.setArmor(
              createNormalStandardArmor(equipQuality, 'Chain')
            );
        } else {
          unit
            .getCharacter()
            .equipment.setArmor(
              createNormalStandardArmor(equipQuality, 'Leather')
            );
        }
      } else if (squad.position === SquadPosition.BACK) {
        unit
          .getCharacter()
          .equipment.setWeapon(createLongRangeWeapon(equipQuality));
        if (Math.random() < 0.5) {
          unit
            .getCharacter()
            .equipment.setArmor(
              createNormalStandardArmor(equipQuality, 'Leather')
            );
        } else {
          unit
            .getCharacter()
            .equipment.setArmor(
              createNormalStandardArmor(equipQuality, 'Cloth')
            );
        }
      }
    });
  });

  return enemyArmy;
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
  return preliminaryReward + actualFluctuation;
}
