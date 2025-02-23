/* eslint-disable import/prefer-default-export */
import { reactive } from 'vue';
import { Character } from '../entities/Character';
import { Equipments } from '../entities/Equipments';
import {
  CharacterLevel,
  QualityLevel,
  qualityRankMap,
  SquadPosition,
} from '../enums';
import {
  CharacterInitialData,
  CharacterInterface,
  ICombatUnit,
} from '../interfaces';
import { characterNames } from '../setting/names';
import { maxAvatarIndex } from '../setting/param';
import {
  generateAttributeValue,
  generateId,
  generateQualityLevelWithMin,
  generateRandomLevel,
  getRandomInt,
} from './utils';
import { IArmy, ISquad } from '../interfaces/combat';
import { baseMemberLimit, baseSquadLimit } from '../setting/param-combat';
import { CombatUnit } from '../battle/CombatUnit';
import { Squad } from '../battle/Squad';
import { Army } from '../battle/Army';
import {
  createLongRangeWeapon,
  createNormalStandardArmor,
  createOneHandWeapon,
  createShield,
  createTwohandWeapon,
} from './itemUtils';

/**
 * Function to generate avatar URL.
 */
function generateAvatarURL(): string {
  const avatarId = getRandomInt(1, maxAvatarIndex);
  const avatarName = `0000${avatarId}`.substring(`0000${avatarId}`.length - 4);
  return `/img/avatar/${avatarName}.png`;
}

/**
 * Function to adjust quality level.
 */
function adjustQualityLevel(
  quality: QualityLevel,
  adjustment: number
): QualityLevel {
  if (adjustment === 0) {
    return quality;
  }
  const currentQualityIndex = qualityRankMap[quality];
  // 如果调整为1，则原始最大为A，则不会调整大于B的品级
  let maxIndex = 5;
  // 如果调整为1，则原始最大为S，则不会调整大于S的品级
  if (adjustment === 2) {
    maxIndex = 6;
  }
  const newQualityIndex = Math.min(maxIndex, currentQualityIndex + adjustment);

  return Object.keys(QualityLevel)[newQualityIndex] as QualityLevel;
}

function generateName(): string {
  return characterNames[getRandomInt(0, characterNames.length - 1)];
}

/**
 * Function to generate a team member.
 */
export function generateCharacter(
  minQuality: QualityLevel = QualityLevel.F,
  minLevel: CharacterLevel = CharacterLevel.ROOKIE
): Character {
  // Generate each attribute quality with the minimum quality in mind.
  const qualities = {
    strength: generateQualityLevelWithMin(minQuality),
    agility: generateQualityLevelWithMin(minQuality),
    endurance: generateQualityLevelWithMin(minQuality),
    spirit: generateQualityLevelWithMin(minQuality),
    intelligence: generateQualityLevelWithMin(minQuality),
    charm: generateQualityLevelWithMin(minQuality),
    luck: generateQualityLevelWithMin(minQuality),
    perception: generateQualityLevelWithMin(minQuality),
  };

  // Determine the highest quality among the attributes.
  const allQualities = Object.values(qualities);
  const highestQuality = allQualities.reduce<QualityLevel>((prev, current) => {
    return Object.values(QualityLevel).indexOf(current) >
      Object.values(QualityLevel).indexOf(prev)
      ? current
      : prev;
  }, QualityLevel.F);
  const teamMemberQuality: QualityLevel = highestQuality;

  // Determine quality adjustment as before.
  let qualityAdjustment = 0;
  if (teamMemberQuality === QualityLevel.A) {
    qualityAdjustment = 1;
  } else if (
    Object.values(QualityLevel).indexOf(teamMemberQuality) >=
    Object.values(QualityLevel).indexOf(QualityLevel.S)
  ) {
    qualityAdjustment = 2;
  }

  // Adjust all qualities.
  const adjustedQualities = {
    strength: adjustQualityLevel(qualities.strength, qualityAdjustment),
    agility: adjustQualityLevel(qualities.agility, qualityAdjustment),
    endurance: adjustQualityLevel(qualities.endurance, qualityAdjustment),
    spirit: adjustQualityLevel(qualities.spirit, qualityAdjustment),
    intelligence: adjustQualityLevel(qualities.intelligence, qualityAdjustment),
    charm: adjustQualityLevel(qualities.charm, qualityAdjustment),
    luck: adjustQualityLevel(qualities.luck, qualityAdjustment),
    perception: adjustQualityLevel(qualities.perception, qualityAdjustment),
  };

  // Generate a random level with the provided minimum.
  const randomLevel = generateRandomLevel(minLevel);

  const character: CharacterInitialData = {
    id: generateId(),
    name: generateName(),
    nickName: '',
    avatar: generateAvatarURL(),
    level: randomLevel,
    experience: 0,
    strength: generateAttributeValue(adjustedQualities.strength),
    agility: generateAttributeValue(adjustedQualities.agility),
    endurance: generateAttributeValue(adjustedQualities.endurance),
    spirit: generateAttributeValue(adjustedQualities.spirit),
    intelligence: generateAttributeValue(adjustedQualities.intelligence),
    charm: generateAttributeValue(adjustedQualities.charm),
    luck: generateAttributeValue(adjustedQualities.luck),
    perception: generateAttributeValue(adjustedQualities.perception),
    skills: [],
    equipment: new Equipments(),
  };

  return reactive(new Character(character));
}

export function generateEnemyArmy(
  enemyCount: number,
  enemyQualityFloor: QualityLevel
): IArmy[] {
  // 5. Generate enemy personnel. (generateCharacter returns a Character.)
  const enemyMembers: CharacterInterface[] = [];
  for (let i = 0; i < enemyCount; i += 1) {
    enemyMembers.push(generateCharacter(enemyQualityFloor));
  }

  // 6. Group every 10 personnel into a squad.
  // 7. Combine squads into an Army object.
  const enemyArmies: IArmy[] = reactive([]);
  const squadCap = baseMemberLimit;
  const armyCap = baseSquadLimit;
  for (let i = 0; i < enemyMembers.length; i += squadCap * armyCap) {
    const squads: ISquad[] = reactive([]);
    const group = enemyMembers.slice(i, i + squadCap * armyCap);
    // Sort the group by quality descending.
    const combatUnits = group.map((member) => reactive(new CombatUnit(member)));
    while (combatUnits.length > 0) {
      const members = reactive(combatUnits.splice(0, squadCap));
      const squad = {
        id: generateId(),
        position: SquadPosition.FRONT, // temporary; will be reassigned below.
        members,
      };
      squads.push(reactive(new Squad(squad)));
    }
    squads.forEach((squad, index) => {
      squad.position =
        index % 2 === 0 ? SquadPosition.FRONT : SquadPosition.BACK;
    });
    enemyArmies.push(
      new Army({
        id: generateId(),
        name: '敌人',
        squads,
      })
    );
  }

  // 10. For each squad, generate equipment based on formation.
  enemyArmies
    .flatMap((army) => army.squads)
    .forEach((squad) => {
      squad.members.forEach((unit: ICombatUnit) => {
        // For each piece of equipment, first determine its random quality.
        const equipQuality = generateQualityLevelWithMin(enemyQualityFloor);

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
        unit.updateStats();
      });
    });

  return enemyArmies;
}
