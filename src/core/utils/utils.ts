import { reactive } from 'vue';
import {
  AttackMethod,
  QualityLevel,
  SquadPosition,
  CharacterLevel,
} from '../enums';
import {
  qualityWeights,
  qualityAttributeRanges,
  maxAvatarIndex,
  QualityRange,
} from '../setting/param';
import { CharacterInterface } from '../interfaces';
import { Squad, Army } from '../interfaces/combat';
import { Character } from '../entities/Character';
import { characterNames } from '../setting/names';
import { Equipments } from '../entities/Equipments';
import { CombatUnit } from '../battle/CombatUnit';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Function to get a random quality level based on weights.
 */
export function generateQualityLevel(): QualityLevel {
  const totalWeight = Object.values(qualityWeights).reduce(
    (sum, weight) => sum + weight,
    0
  );
  const randomNum = Math.random() * totalWeight;
  let weightSum = 0;
  let returnQuality = QualityLevel.F;

  const qualities = Object.keys(qualityWeights);
  for (let i = 0; i < qualities.length && randomNum > weightSum; i += 1) {
    weightSum += qualityWeights[qualities[i]];
    if (randomNum <= weightSum) {
      returnQuality = qualities[i] as QualityLevel;
    }
  }
  // Should not reach here, but as a fallback, return the lowest quality
  return returnQuality;
}

/**
 * Function to get a random integer within a range.
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Function to generate attribute value based on quality level.
 */
export function generateAttributeValue(
  quality: QualityLevel,
  ranges: QualityRange = qualityAttributeRanges
): number {
  const range = ranges[quality];
  return getRandomInt(range[0], range[1]);
}

/**
 * Function to generate avatar URL.
 */
function generateAvatarURL(): string {
  const avatarId = getRandomInt(1, maxAvatarIndex);
  return `/img/avatar/${avatarId}.png`;
}

/**
 * Function to adjust quality level.
 */
function adjustQualityLevel(
  quality: QualityLevel,
  adjustment: number
): QualityLevel {
  const qualityLevels = Object.values(QualityLevel);
  const currentQualityIndex = qualityLevels.indexOf(quality);
  let newQualityIndex = currentQualityIndex + adjustment;

  if (newQualityIndex < 0) {
    newQualityIndex = 0;
  } else if (newQualityIndex >= qualityLevels.length) {
    newQualityIndex = qualityLevels.length - 1;
  } else if (
    newQualityIndex > qualityLevels.indexOf(QualityLevel.A) &&
    adjustment > 0
  ) {
    if (qualityLevels[newQualityIndex] > QualityLevel.A) {
      newQualityIndex = qualityLevels.indexOf(QualityLevel.S); // Cap at S if original quality was A and above and adjustment is more than needed to reach A
    }
  } else if (
    newQualityIndex > qualityLevels.indexOf(QualityLevel.S) &&
    adjustment > 0
  ) {
    newQualityIndex = qualityLevels.indexOf(QualityLevel.SSS); // Cap at SSS if original quality was S and above and adjustment is more than needed to reach S
  }
  return qualityLevels[newQualityIndex] as QualityLevel;
}

/**
 * Generates a random AttackMethod value.
 * @returns A randomly selected AttackMethod.
 */
export function getRandomAttackMethod(): AttackMethod {
  const enumValues = Object.values(AttackMethod);
  const validEnumValues = enumValues.filter(
    (value) => typeof value === 'number'
  );
  const randomIndex = Math.floor(Math.random() * validEnumValues.length);
  // enumValues will contain both string keys and numerical values in reverse mapping by default
  // We want to filter out the string keys to only pick from the enum members themselves
  return validEnumValues[randomIndex] as AttackMethod; // Type assertion for safety
}

function generateName(): string {
  return characterNames[getRandomInt(0, characterNames.length - 1)];
}

/**
 * Function to generate a team member.
 */
export function generateCharacter(): Character {
  // Generate qualities for each attribute independently
  const qualities = {
    strength: generateQualityLevel(),
    agility: generateQualityLevel(),
    endurance: generateQualityLevel(),
    spirit: generateQualityLevel(),
    intelligence: generateQualityLevel(),
    charm: generateQualityLevel(),
    luck: generateQualityLevel(),
    perception: generateQualityLevel(),
  };

  // Determine the highest quality
  const highestQuality = Object.values(qualities).reduce<QualityLevel>(
    (previous, current) => {
      if (
        Object.values(QualityLevel).indexOf(current) >
        Object.values(QualityLevel).indexOf(previous)
      ) {
        return current;
      }
      return previous;
    },
    QualityLevel.F
  );
  const teamMemberQuality: QualityLevel = highestQuality;

  // Adjust other qualities based on the highest quality
  let qualityAdjustment = 0;
  if (teamMemberQuality === QualityLevel.A) {
    qualityAdjustment = 1;
  } else if (
    Object.values(QualityLevel).indexOf(teamMemberQuality) >=
    Object.values(QualityLevel).indexOf(QualityLevel.S)
  ) {
    qualityAdjustment = 2;
  }

  // Adjust all qualities
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

  const character: CharacterInterface = {
    id: generateId(),
    name: generateName(),
    nickName: '',
    avatar: generateAvatarURL(),
    level: CharacterLevel.ROOKIE,
    experience: 0,
    quality: teamMemberQuality,
    health: 100,
    strength: generateAttributeValue(adjustedQualities.strength),
    agility: generateAttributeValue(adjustedQualities.agility),
    endurance: generateAttributeValue(adjustedQualities.endurance),
    spirit: generateAttributeValue(adjustedQualities.spirit),
    intelligence: generateAttributeValue(adjustedQualities.intelligence),
    charm: generateAttributeValue(adjustedQualities.charm),
    luck: generateAttributeValue(adjustedQualities.luck),
    perception: generateAttributeValue(adjustedQualities.perception),
    attackMethod: getRandomAttackMethod(),
    skills: [],
    equipment: new Equipments(),
  };

  return reactive(new Character(character));
}

export function createSquad(
  position: SquadPosition,
  attackMethod: AttackMethod,
  attackSpeed: number,
  members: CharacterInterface[]
): Squad {
  return {
    id: generateId(),
    position,
    attackSpeed,
    members: members.map((member) => new CombatUnit(member)),
    targetIds: [],
    isDead: false,
  };
}

export function createArmy(squads: Squad[], reserveSquads: Squad[]): Army {
  return {
    id: generateId(),
    squads,
    reserveSquads,
  };
}
