/* eslint-disable import/prefer-default-export */
import { reactive } from 'vue';
import { Character } from '../entities/Character';
import { Equipments } from '../entities/Equipments';
import { CharacterLevel, QualityLevel, qualityRankMap } from '../enums';
import { CharacterInitialData } from '../interfaces';
import { characterNames } from '../setting/names';
import { maxAvatarIndex } from '../setting/param';
import {
  generateAttributeValue,
  generateId,
  generateQualityLevelWithMin,
  generateRandomLevel,
  getRandomInt,
} from './utils';

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
