import { QualityLevel } from '../enums';
import { QualityString, QualityRange, QualityNumber } from './param';

export const qualityDamageRanges: QualityRange = {
  [QualityLevel.F]: [5, 5],
  [QualityLevel.E]: [6, 6],
  [QualityLevel.D]: [7, 7],
  [QualityLevel.C]: [8, 8],
  [QualityLevel.B]: [9, 10],
  [QualityLevel.A]: [11, 12],
  [QualityLevel.S]: [13, 14],
  [QualityLevel.SS]: [15, 17],
  [QualityLevel.SSS]: [18, 20],
};

export const qualityTwoHandDamageRanges: QualityRange = {
  [QualityLevel.F]: [7, 7],
  [QualityLevel.E]: [9, 9],
  [QualityLevel.D]: [10, 10],
  [QualityLevel.C]: [12, 12],
  [QualityLevel.B]: [13, 15],
  [QualityLevel.A]: [16, 18],
  [QualityLevel.S]: [19, 22],
  [QualityLevel.SS]: [23, 26],
  [QualityLevel.SSS]: [27, 30],
};

export const qualityShieldRanges: QualityRange = {
  [QualityLevel.F]: [2, 2],
  [QualityLevel.E]: [3, 3],
  [QualityLevel.D]: [4, 4],
  [QualityLevel.C]: [4, 5],
  [QualityLevel.B]: [6, 7],
  [QualityLevel.A]: [8, 10],
  [QualityLevel.S]: [11, 15],
  [QualityLevel.SS]: [16, 20],
  [QualityLevel.SSS]: [21, 25],
};

export const qualityPlateRanges: QualityRange = {
  [QualityLevel.F]: [5, 5],
  [QualityLevel.E]: [6, 6],
  [QualityLevel.D]: [7, 8],
  [QualityLevel.C]: [9, 10],
  [QualityLevel.B]: [11, 15],
  [QualityLevel.A]: [16, 20],
  [QualityLevel.S]: [21, 30],
  [QualityLevel.SS]: [31, 40],
  [QualityLevel.SSS]: [41, 50],
};

export const qualityPlateDecRanges: QualityRange = {
  [QualityLevel.F]: [1, 1],
  [QualityLevel.E]: [2, 2],
  [QualityLevel.D]: [3, 4],
  [QualityLevel.C]: [5, 6],
  [QualityLevel.B]: [7, 8],
  [QualityLevel.A]: [9, 10],
  [QualityLevel.S]: [9, 10],
  [QualityLevel.SS]: [7, 8],
  [QualityLevel.SSS]: [5, 6],
};

export const qualityPlateLimitRanges: QualityRange = {
  [QualityLevel.F]: [7, 7],
  [QualityLevel.E]: [8, 8],
  [QualityLevel.D]: [8, 8],
  [QualityLevel.C]: [9, 9],
  [QualityLevel.B]: [10, 10],
  [QualityLevel.A]: [11, 11],
  [QualityLevel.S]: [11, 11],
  [QualityLevel.SS]: [10, 10],
  [QualityLevel.SSS]: [9, 9],
};

export const qualityChainRanges: QualityRange = {
  [QualityLevel.F]: [4, 4],
  [QualityLevel.E]: [5, 5],
  [QualityLevel.D]: [6, 6],
  [QualityLevel.C]: [7, 7],
  [QualityLevel.B]: [8, 11],
  [QualityLevel.A]: [12, 15],
  [QualityLevel.S]: [16, 22],
  [QualityLevel.SS]: [23, 29],
  [QualityLevel.SSS]: [30, 37],
};

export const qualityChainLimitRanges: QualityRange = {
  [QualityLevel.F]: [5, 5],
  [QualityLevel.E]: [5, 5],
  [QualityLevel.D]: [6, 6],
  [QualityLevel.C]: [6, 6],
  [QualityLevel.B]: [7, 7],
  [QualityLevel.A]: [8, 8],
  [QualityLevel.S]: [8, 8],
  [QualityLevel.SS]: [7, 7],
  [QualityLevel.SSS]: [6, 6],
};

export const qualityLeatherRanges: QualityRange = {
  [QualityLevel.F]: [3, 3],
  [QualityLevel.E]: [4, 4],
  [QualityLevel.D]: [5, 5],
  [QualityLevel.C]: [6, 7],
  [QualityLevel.B]: [8, 10],
  [QualityLevel.A]: [11, 13],
  [QualityLevel.S]: [14, 16],
  [QualityLevel.SS]: [17, 19],
  [QualityLevel.SSS]: [20, 25],
};

export const qualityLeatherAgiRanges: QualityRange = {
  [QualityLevel.F]: [1, 1],
  [QualityLevel.E]: [2, 2],
  [QualityLevel.D]: [3, 3],
  [QualityLevel.C]: [4, 4],
  [QualityLevel.B]: [5, 6],
  [QualityLevel.A]: [7, 8],
  [QualityLevel.S]: [9, 10],
  [QualityLevel.SS]: [11, 12],
  [QualityLevel.SSS]: [13, 15],
};

export const qualityClothRanges: QualityRange = {
  [QualityLevel.F]: [1, 1],
  [QualityLevel.E]: [2, 2],
  [QualityLevel.D]: [3, 3],
  [QualityLevel.C]: [4, 4],
  [QualityLevel.B]: [5, 5],
  [QualityLevel.A]: [6, 7],
  [QualityLevel.S]: [8, 9],
  [QualityLevel.SS]: [10, 11],
  [QualityLevel.SSS]: [12, 15],
};

export const qualityClothIntellRanges: QualityRange = {
  [QualityLevel.F]: [1, 1],
  [QualityLevel.E]: [2, 2],
  [QualityLevel.D]: [3, 3],
  [QualityLevel.C]: [4, 5],
  [QualityLevel.B]: [6, 7],
  [QualityLevel.A]: [8, 10],
  [QualityLevel.S]: [11, 13],
  [QualityLevel.SS]: [14, 16],
  [QualityLevel.SSS]: [17, 20],
};

export const namesOfQualitySword: QualityString = {
  [QualityLevel.F]: 'Standard Sword',
  [QualityLevel.E]: 'Epic Standard Sword',
  [QualityLevel.D]: 'Legendary Standard Sword',
  [QualityLevel.C]: 'Mythic Standard Sword',
  [QualityLevel.B]: 'Elder Standard Sword',
  [QualityLevel.A]: 'Ancient Standard Sword',
  [QualityLevel.S]: 'Divine Standard Sword',
  [QualityLevel.SS]: 'Celestial Standard Sword',
  [QualityLevel.SSS]: 'Legendary Standard Sword',
};

export const namesOfQualityAxe: QualityString = {
  [QualityLevel.F]: 'Standard Axe',
  [QualityLevel.E]: 'Epic Standard Axe',
  [QualityLevel.D]: 'Legendary Standard Axe',
  [QualityLevel.C]: 'Mythic Standard Axe',
  [QualityLevel.B]: 'Elder Standard Axe',
  [QualityLevel.A]: 'Ancient Standard Axe',
  [QualityLevel.S]: 'Divine Standard Axe',
  [QualityLevel.SS]: 'Celestial Standard Axe',
  [QualityLevel.SSS]: 'Legendary Standard Axe',
};

export const namesOfQualityMace: QualityString = {
  [QualityLevel.F]: 'Standard Mace',
  [QualityLevel.E]: 'Epic Standard Mace',
  [QualityLevel.D]: 'Legendary Standard Mace',
  [QualityLevel.C]: 'Mythic Standard Mace',
  [QualityLevel.B]: 'Elder Standard Mace',
  [QualityLevel.A]: 'Ancient Standard Mace',
  [QualityLevel.S]: 'Divine Standard Mace',
  [QualityLevel.SS]: 'Celestial Standard Mace',
  [QualityLevel.SSS]: 'Legendary Standard Mace',
};

export const namesOfQualityDagger: QualityString = {
  [QualityLevel.F]: 'Standard Dagger',
  [QualityLevel.E]: 'Epic Standard Dagger',
  [QualityLevel.D]: 'Legendary Standard Dagger',
  [QualityLevel.C]: 'Mythic Standard Dagger',
  [QualityLevel.B]: 'Elder Standard Dagger',
  [QualityLevel.A]: 'Ancient Standard Dagger',
  [QualityLevel.S]: 'Divine Standard Dagger',
  [QualityLevel.SS]: 'Celestial Standard Dagger',
  [QualityLevel.SSS]: 'Legendary Standard Dagger',
};

export const namesOfQualityBow: QualityString = {
  [QualityLevel.F]: 'Standard Bow',
  [QualityLevel.E]: 'Epic Standard Bow',
  [QualityLevel.D]: 'Legendary Standard Bow',
  [QualityLevel.C]: 'Mythic Standard Bow',
  [QualityLevel.B]: 'Elder Standard Bow',
  [QualityLevel.A]: 'Ancient Standard Bow',
  [QualityLevel.S]: 'Divine Standard Bow',
  [QualityLevel.SS]: 'Celestial Standard Bow',
  [QualityLevel.SSS]: 'Legendary Standard Bow',
};

export const namesOfQualityCrossbow: QualityString = {
  [QualityLevel.F]: 'Standard Crossbow',
  [QualityLevel.E]: 'Epic Standard Crossbow',
  [QualityLevel.D]: 'Legendary Standard Crossbow',
  [QualityLevel.C]: 'Mythic Standard Crossbow',
  [QualityLevel.B]: 'Elder Standard Crossbow',
  [QualityLevel.A]: 'Ancient Standard Crossbow',
  [QualityLevel.S]: 'Divine Standard Crossbow',
  [QualityLevel.SS]: 'Celestial Standard Crossbow',
  [QualityLevel.SSS]: 'Legendary Standard Crossbow',
};

export const namesOfQualityThrowingAxe: QualityString = {
  [QualityLevel.F]: 'Standard Throwing Axe',
  [QualityLevel.E]: 'Epic Standard Throwing Axe',
  [QualityLevel.D]: 'Legendary Standard Throwing Axe',
  [QualityLevel.C]: 'Mythic Standard Throwing Axe',
  [QualityLevel.B]: 'Elder Standard Throwing Axe',
  [QualityLevel.A]: 'Ancient Standard Throwing Axe',
  [QualityLevel.S]: 'Divine Standard Throwing Axe',
  [QualityLevel.SS]: 'Celestial Standard Throwing Axe',
  [QualityLevel.SSS]: 'Legendary Standard Throwing Axe',
};

export const namesOfQualityStone: QualityString = {
  [QualityLevel.F]: 'Standard Stone',
  [QualityLevel.E]: 'Epic Standard Stone',
  [QualityLevel.D]: 'Legendary Standard Stone',
  [QualityLevel.C]: 'Mythic Standard Stone',
  [QualityLevel.B]: 'Elder Standard Stone',
  [QualityLevel.A]: 'Ancient Standard Stone',
  [QualityLevel.S]: 'Divine Standard Stone',
  [QualityLevel.SS]: 'Celestial Standard Stone',
  [QualityLevel.SSS]: 'Legendary Standard Stone',
};

export const namesOfQualityShield: QualityString = {
  [QualityLevel.F]: 'Standard Shield',
  [QualityLevel.E]: 'Epic Standard Shield',
  [QualityLevel.D]: 'Legendary Standard Shield',
  [QualityLevel.C]: 'Mythic Standard Shield',
  [QualityLevel.B]: 'Elder Standard Shield',
  [QualityLevel.A]: 'Ancient Standard Shield',
  [QualityLevel.S]: 'Divine Standard Shield',
  [QualityLevel.SS]: 'Celestial Standard Shield',
  [QualityLevel.SSS]: 'Legendary Standard Shield',
};

export const namesOfQualityPlate: QualityString = {
  [QualityLevel.F]: 'Standard Plate',
  [QualityLevel.E]: 'Epic Standard Plate',
  [QualityLevel.D]: 'Legendary Standard Plate',
  [QualityLevel.C]: 'Mythic Standard Plate',
  [QualityLevel.B]: 'Elder Standard Plate',
  [QualityLevel.A]: 'Ancient Standard Plate',
  [QualityLevel.S]: 'Divine Standard Plate',
  [QualityLevel.SS]: 'Celestial Standard Plate',
  [QualityLevel.SSS]: 'Legendary Standard Plate',
};

export const namesOfQualityChain: QualityString = {
  [QualityLevel.F]: 'Standard Chain',
  [QualityLevel.E]: 'Epic Standard Chain',
  [QualityLevel.D]: 'Legendary Standard Chain',
  [QualityLevel.C]: 'Mythic Standard Chain',
  [QualityLevel.B]: 'Elder Standard Chain',
  [QualityLevel.A]: 'Ancient Standard Chain',
  [QualityLevel.S]: 'Divine Standard Chain',
  [QualityLevel.SS]: 'Celestial Standard Chain',
  [QualityLevel.SSS]: 'Legendary Standard Chain',
};

export const namesOfQualityLeather: QualityString = {
  [QualityLevel.F]: 'Standard Leather',
  [QualityLevel.E]: 'Epic Standard Leather',
  [QualityLevel.D]: 'Legendary Standard Leather',
  [QualityLevel.C]: 'Mythic Standard Leather',
  [QualityLevel.B]: 'Elder Standard Leather',
  [QualityLevel.A]: 'Ancient Standard Leather',
  [QualityLevel.S]: 'Divine Standard Leather',
  [QualityLevel.SS]: 'Celestial Standard Leather',
  [QualityLevel.SSS]: 'Legendary Standard Leather',
};

export const namesOfQualityCloth: QualityString = {
  [QualityLevel.F]: 'Standard Cloth',
  [QualityLevel.E]: 'Epic Standard Cloth',
  [QualityLevel.D]: 'Legendary Standard Cloth',
  [QualityLevel.C]: 'Mythic Standard Cloth',
  [QualityLevel.B]: 'Elder Standard Cloth',
  [QualityLevel.A]: 'Ancient Standard Cloth',
  [QualityLevel.S]: 'Divine Standard Cloth',
  [QualityLevel.SS]: 'Celestial Standard Cloth',
  [QualityLevel.SSS]: 'Legendary Standard Cloth',
};

export const namesOfQualityGreatSword: QualityString = {
  [QualityLevel.F]: 'Standard Great Sword',
  [QualityLevel.E]: 'Epic Standard Great Sword',
  [QualityLevel.D]: 'Legendary Standard Great Sword',
  [QualityLevel.C]: 'Mythic Standard Great Sword',
  [QualityLevel.B]: 'Elder Standard Great Sword',
  [QualityLevel.A]: 'Ancient Standard Great Sword',
  [QualityLevel.S]: 'Divine Standard Great Sword',
  [QualityLevel.SS]: 'Celestial Standard Great Sword',
  [QualityLevel.SSS]: 'Legendary Standard Great Sword',
};

export const namesOfQualityGreatAxe: QualityString = {
  [QualityLevel.F]: 'Standard Great Axe',
  [QualityLevel.E]: 'Epic Standard Great Axe',
  [QualityLevel.D]: 'Legendary Standard Great Axe',
  [QualityLevel.C]: 'Mythic Standard Great Axe',
  [QualityLevel.B]: 'Elder Standard Great Axe',
  [QualityLevel.A]: 'Ancient Standard Great Axe',
  [QualityLevel.S]: 'Divine Standard Great Axe',
  [QualityLevel.SS]: 'Celestial Standard Great Axe',
  [QualityLevel.SSS]: 'Legendary Standard Great Axe',
};

export const namesOfQualityGreatMace: QualityString = {
  [QualityLevel.F]: 'Standard Great Mace',
  [QualityLevel.E]: 'Epic Standard Great Mace',
  [QualityLevel.D]: 'Legendary Standard Great Mace',
  [QualityLevel.C]: 'Mythic Standard Great Mace',
  [QualityLevel.B]: 'Elder Standard Great Mace',
  [QualityLevel.A]: 'Ancient Standard Great Mace',
  [QualityLevel.S]: 'Divine Standard Great Mace',
  [QualityLevel.SS]: 'Celestial Standard Great Mace',
  [QualityLevel.SSS]: 'Legendary Standard Great Mace',
};

export const namesOfQualitySpear: QualityString = {
  [QualityLevel.F]: 'Standard Spear',
  [QualityLevel.E]: 'Epic Standard Spear',
  [QualityLevel.D]: 'Legendary Standard Spear',
  [QualityLevel.C]: 'Mythic Standard Spear',
  [QualityLevel.B]: 'Elder Standard Spear',
  [QualityLevel.A]: 'Ancient Standard Spear',
  [QualityLevel.S]: 'Divine Standard Spear',
  [QualityLevel.SS]: 'Celestial Standard Spear',
  [QualityLevel.SSS]: 'Legendary Standard Spear',
};

export const namesOfQualityPolearm: QualityString = {
  [QualityLevel.F]: 'Standard Polearm',
  [QualityLevel.E]: 'Epic Standard Polearm',
  [QualityLevel.D]: 'Legendary Standard Polearm',
  [QualityLevel.C]: 'Mythic Standard Polearm',
  [QualityLevel.B]: 'Elder Standard Polearm',
  [QualityLevel.A]: 'Ancient Standard Polearm',
  [QualityLevel.S]: 'Divine Standard Polearm',
  [QualityLevel.SS]: 'Celestial Standard Polearm',
  [QualityLevel.SSS]: 'Legendary Standard Polearm',
};

export const namesOfQualityHalberd: QualityString = {
  [QualityLevel.F]: 'Standard Halberd',
  [QualityLevel.E]: 'Epic Standard Halberd',
  [QualityLevel.D]: 'Legendary Standard Halberd',
  [QualityLevel.C]: 'Mythic Standard Halberd',
  [QualityLevel.B]: 'Elder Standard Halberd',
  [QualityLevel.A]: 'Ancient Standard Halberd',
  [QualityLevel.S]: 'Divine Standard Halberd',
  [QualityLevel.SS]: 'Celestial Standard Halberd',
  [QualityLevel.SSS]: 'Legendary Standard Halberd',
};

export const valueOfQualityOneHandWeapon: QualityNumber = {
  [QualityLevel.F]: 100,
  [QualityLevel.E]: 200,
  [QualityLevel.D]: 400,
  [QualityLevel.C]: 800,
  [QualityLevel.B]: 1600,
  [QualityLevel.A]: 3200,
  [QualityLevel.S]: 6400,
  [QualityLevel.SS]: 12800,
  [QualityLevel.SSS]: 25600,
};

export const valueOfQualityTwoHandWeapon: QualityNumber = {
  [QualityLevel.F]: 150,
  [QualityLevel.E]: 300,
  [QualityLevel.D]: 600,
  [QualityLevel.C]: 1200,
  [QualityLevel.B]: 2400,
  [QualityLevel.A]: 4800,
  [QualityLevel.S]: 9600,
  [QualityLevel.SS]: 19200,
  [QualityLevel.SSS]: 38400,
};

export const valueOfQualityMiddleRangeWeapon: QualityNumber = {
  [QualityLevel.F]: 150,
  [QualityLevel.E]: 300,
  [QualityLevel.D]: 600,
  [QualityLevel.C]: 1200,
  [QualityLevel.B]: 2400,
  [QualityLevel.A]: 4800,
  [QualityLevel.S]: 9600,
  [QualityLevel.SS]: 19200,
  [QualityLevel.SSS]: 38400,
};

export const valueOfQualityLongRangeWeapon: QualityNumber = {
  [QualityLevel.F]: 150,
  [QualityLevel.E]: 300,
  [QualityLevel.D]: 600,
  [QualityLevel.C]: 1200,
  [QualityLevel.B]: 2400,
  [QualityLevel.A]: 4800,
  [QualityLevel.S]: 9600,
  [QualityLevel.SS]: 19200,
  [QualityLevel.SSS]: 38400,
};

export const valueOfQualityShield: QualityNumber = {
  [QualityLevel.F]: 100,
  [QualityLevel.E]: 200,
  [QualityLevel.D]: 400,
  [QualityLevel.C]: 800,
  [QualityLevel.B]: 1600,
  [QualityLevel.A]: 3200,
  [QualityLevel.S]: 6400,
  [QualityLevel.SS]: 12800,
  [QualityLevel.SSS]: 25600,
};

export const valueOfQualityPlate: QualityNumber = {
  [QualityLevel.F]: 300,
  [QualityLevel.E]: 600,
  [QualityLevel.D]: 1200,
  [QualityLevel.C]: 2400,
  [QualityLevel.B]: 4800,
  [QualityLevel.A]: 9600,
  [QualityLevel.S]: 19200,
  [QualityLevel.SS]: 38400,
  [QualityLevel.SSS]: 76800,
};

export const valueOfQualityChain: QualityNumber = {
  [QualityLevel.F]: 250,
  [QualityLevel.E]: 500,
  [QualityLevel.D]: 1000,
  [QualityLevel.C]: 2000,
  [QualityLevel.B]: 4000,
  [QualityLevel.A]: 8000,
  [QualityLevel.S]: 16000,
  [QualityLevel.SS]: 32000,
  [QualityLevel.SSS]: 64000,
};

export const valueOfQualityLeather: QualityNumber = {
  [QualityLevel.F]: 200,
  [QualityLevel.E]: 400,
  [QualityLevel.D]: 800,
  [QualityLevel.C]: 1600,
  [QualityLevel.B]: 3200,
  [QualityLevel.A]: 6400,
  [QualityLevel.S]: 12800,
  [QualityLevel.SS]: 25600,
  [QualityLevel.SSS]: 51200,
};

export const valueOfQualityCloth: QualityNumber = {
  [QualityLevel.F]: 200,
  [QualityLevel.E]: 400,
  [QualityLevel.D]: 800,
  [QualityLevel.C]: 1600,
  [QualityLevel.B]: 3200,
  [QualityLevel.A]: 6400,
  [QualityLevel.S]: 12800,
  [QualityLevel.SS]: 25600,
  [QualityLevel.SSS]: 51200,
};
