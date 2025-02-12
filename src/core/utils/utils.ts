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
 * Generates a random QualityLevel that is not lower than minQuality.
 */
export function generateQualityLevelWithMin(
  minQuality: QualityLevel
): QualityLevel {
  // Get all QualityLevels from the qualityWeights; assuming ordering is low-to-high.
  const allQualities = Object.values(QualityLevel).filter(
    (value) => typeof value === 'string' || typeof value === 'number'
  ) as QualityLevel[];
  const minIndex = allQualities.indexOf(minQuality);
  // Only allow qualities not lower than the minQuality.
  const validQualities = allQualities.slice(minIndex);
  // Calculate total weight from the original qualityWeights (defined in param.ts).
  const totalWeight = validQualities.reduce(
    (sum, quality) => sum + qualityWeights[quality],
    0
  );
  const randomNum = Math.random() * totalWeight;
  let weightSum = 0;
  for (let i = 0; i < validQualities.length; i += 1) {
    const quality = validQualities[i];
    weightSum += qualityWeights[quality];
    if (randomNum <= weightSum) {
      return quality;
    }
  }
  return minQuality; // fallback
}

/**
 * Generates a random CharacterLevel not lower than minLevel.
 * Each level's weight is reduced by a factor of 10 per level higher than minLevel.
 */
export function generateRandomLevel(minLevel: CharacterLevel): CharacterLevel {
  const allLevels = Object.values(CharacterLevel).filter(
    (value) => typeof value === 'string' || typeof value === 'number'
  ) as CharacterLevel[];
  const minIndex = allLevels.indexOf(minLevel);
  const validLevels = allLevels.slice(minIndex);
  // Weight for level[i] = (0.1)^(i), where i=0 for minLevel.
  const weights = validLevels.map((_, i) => 0.1 ** i);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const randomNum = Math.random() * totalWeight;
  let weightSum = 0;
  for (let i = 0; i < validLevels.length; i += 1) {
    weightSum += weights[i];
    if (randomNum <= weightSum) {
      return validLevels[i];
    }
  }
  return minLevel; // fallback
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

  const character: CharacterInterface = {
    id: generateId(),
    name: generateName(),
    nickName: '',
    avatar: generateAvatarURL(),
    level: randomLevel,
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
    attackMethod: AttackMethod.MELEE,
    skills: [],
    equipment: new Equipments(),
  };

  return reactive(new Character(character));
}

export function createSquad(
  position: SquadPosition,
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
  const id = generateId();
  return {
    id,
    name: `部队[${id}]`,
    squads,
    reserveSquads,
    isDead: false,
  };
}
