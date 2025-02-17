import { QualityLevel, CharacterLevel } from '../enums';
import {
  qualityWeights,
  qualityAttributeRanges,
  QualityRange,
} from '../setting/param';

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

export function getQualityForValue(value: number): QualityLevel {
  const qualityLevels = Object.values(QualityLevel);
  // 从最高品质开始检查，一旦找到符合条件的就返回
  for (let i = qualityLevels.length - 1; i >= 0; i -= 1) {
    const quality = qualityLevels[i];
    if (value >= qualityAttributeRanges[quality][0]) {
      return quality;
    }
  }
  return QualityLevel.F;
}
