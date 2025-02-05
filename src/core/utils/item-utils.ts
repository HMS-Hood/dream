import {
  ItemType,
  WeaponHandType,
  AttackMethod,
  OneHandWeaponType,
  TwoHandWeaponType,
  MiddleRangeWeaponType,
  LongRangeWeaponType,
  QualityLevel,
} from '../enums';
import {
  Weapon,
  Shield,
  Plate,
  Chain,
  Leather,
  Robe,
  TwoHandWeapon,
  OneHandWeapon,
  MiddleRangeWeapon,
  LongRangeWeapon,
} from '../interfaces/item';
import { QualityRange } from '../setting/param';
import {
  qualityDamageRanges,
  qualityTwoHandDamageRanges,
  qualityShieldRanges,
  qualityPlateLimitRanges,
  qualityPlateDecRanges,
  qualityPlateRanges,
  qualityChainLimitRanges,
  qualityChainRanges,
  qualityLeatherRanges,
  qualityLeatherAgiRanges,
  qualityClothRanges,
  namesOfQualitySword,
  namesOfQualityShield,
  namesOfQualityPlate,
  namesOfQualityChain,
  namesOfQualityLeather,
  valueOfQualityOneHandWeapon,
  valueOfQualityMiddleRangeWeapon,
  valueOfQualityLongRangeWeapon,
  valueOfQualityTwoHandWeapon,
  valueOfQualityShield,
  valueOfQualityPlate,
  valueOfQualityChain,
  valueOfQualityLeather,
  namesOfQualityCloth,
  valueOfQualityCloth,
  qualityClothIntellRanges,
} from '../setting/param-item';
import {
  generateAttributeValue,
  generateQualityLevel,
  getRandomInt,
} from './utils';

export function createWeapon(
  quality: QualityLevel,
  value: number,
  handType: WeaponHandType,
  qualityRanges: QualityRange,
  attackMethod: AttackMethod,
  weaponType:
    | OneHandWeaponType
    | TwoHandWeaponType
    | MiddleRangeWeaponType
    | LongRangeWeaponType
): Weapon {
  const weapon: Weapon = {
    name: namesOfQualitySword[quality],
    value,
    quality,
    img: '',
    keys: [],
    type: ItemType.WEAPON,
    handType,
    minDamage: generateAttributeValue(quality, qualityRanges) - 1,
    maxDamage: generateAttributeValue(quality, qualityRanges) + 1,
    attackMethod,
    weaponType,
  };
  return weapon;
}

function randomOneHandWeaponType(): OneHandWeaponType {
  const oneHandWeaponTypes = [
    OneHandWeaponType.SWORD,
    OneHandWeaponType.AXE,
    OneHandWeaponType.MACE,
  ];
  const randomNum = getRandomInt(0, oneHandWeaponTypes.length - 1);
  return oneHandWeaponTypes[randomNum];
}

export function createOneHandWeapon(
  quality?: QualityLevel,
  oneHandWeaponType?: OneHandWeaponType
): OneHandWeapon {
  return createWeapon(
    quality ?? generateQualityLevel(),
    valueOfQualityOneHandWeapon[quality ?? generateQualityLevel()],
    WeaponHandType.ONE_HAND,
    qualityDamageRanges,
    AttackMethod.MELEE,
    oneHandWeaponType ?? randomOneHandWeaponType()
  ) as OneHandWeapon;
}

function randomMiddleRangeWeaponType(): MiddleRangeWeaponType {
  const middleRangeWeaponTypes = [
    MiddleRangeWeaponType.LANCE,
    MiddleRangeWeaponType.HALBERD,
    MiddleRangeWeaponType.POLEARM,
  ];
  const randomNum = getRandomInt(0, middleRangeWeaponTypes.length - 1);
  return middleRangeWeaponTypes[randomNum];
}

export function createMiddleRangeWeapon(
  quality?: QualityLevel,
  middleRangeWeaponType?: MiddleRangeWeaponType
): MiddleRangeWeapon {
  return createWeapon(
    quality ?? generateQualityLevel(),
    valueOfQualityMiddleRangeWeapon[quality ?? generateQualityLevel()],
    WeaponHandType.TWO_HAND,
    qualityTwoHandDamageRanges,
    AttackMethod.MEDIUM_RANGE,
    middleRangeWeaponType ?? randomMiddleRangeWeaponType()
  ) as MiddleRangeWeapon;
}

function randomLongRangeWeaponType(): LongRangeWeaponType {
  const longRangeWeaponTypes = [
    LongRangeWeaponType.BOW,
    LongRangeWeaponType.CROSSBOW,
    LongRangeWeaponType.THROWING_AXE,
    LongRangeWeaponType.STONE,
  ];
  const randomNum = getRandomInt(0, longRangeWeaponTypes.length - 1);
  return longRangeWeaponTypes[randomNum];
}

export function createLongRangeWeapon(
  quality?: QualityLevel,
  longRangeWeaponType?: LongRangeWeaponType
): LongRangeWeapon {
  return createWeapon(
    quality ?? generateQualityLevel(),
    valueOfQualityLongRangeWeapon[quality ?? generateQualityLevel()],
    WeaponHandType.TWO_HAND,
    qualityDamageRanges,
    AttackMethod.LONG_RANGE,
    longRangeWeaponType ?? randomLongRangeWeaponType()
  ) as LongRangeWeapon;
}

function randomTwoHandWeaponType(): TwoHandWeaponType {
  const twoHandWeaponTypes = [
    TwoHandWeaponType.GREAT_SWORD,
    TwoHandWeaponType.GREAT_AXE,
    TwoHandWeaponType.GREAT_MACE,
  ];
  const randomNum = getRandomInt(0, twoHandWeaponTypes.length - 1);
  return twoHandWeaponTypes[randomNum];
}

export function createTwohandWeapon(
  quality?: QualityLevel,
  twoHandWeaponType?: TwoHandWeaponType
): TwoHandWeapon {
  return createWeapon(
    quality ?? generateQualityLevel(),
    valueOfQualityTwoHandWeapon[quality ?? generateQualityLevel()],
    WeaponHandType.TWO_HAND,
    qualityTwoHandDamageRanges,
    AttackMethod.MELEE,
    twoHandWeaponType ?? randomTwoHandWeaponType()
  ) as TwoHandWeapon;
}

export function createShield(quality?: QualityLevel): Shield {
  quality = quality ?? generateQualityLevel();
  const shield: Shield = {
    name: namesOfQualityShield[quality],
    value: valueOfQualityShield[quality],
    quality,
    img: '',
    keys: [],
    type: ItemType.SHIELD,
    defence: generateAttributeValue(quality, qualityShieldRanges),
  };
  return shield;
}

export function createPlate(quality?: QualityLevel): Plate {
  quality = quality ?? generateQualityLevel();
  const plate: Plate = {
    name: namesOfQualityPlate[quality],
    value: valueOfQualityPlate[quality],
    quality,
    img: '',
    keys: [],
    type: ItemType.ARMOR,
    strengthLimit: generateAttributeValue(quality, qualityPlateLimitRanges),
    agilityDecrease: generateAttributeValue(quality, qualityPlateDecRanges),
    defence: generateAttributeValue(quality, qualityPlateRanges),
  };
  return plate;
}

export function createChain(quality?: QualityLevel): Chain {
  quality = quality ?? generateQualityLevel();
  const plate: Chain = {
    name: namesOfQualityChain[quality],
    value: valueOfQualityChain[quality],
    quality,
    img: '',
    keys: [],
    type: ItemType.ARMOR,
    strengthLimit: generateAttributeValue(quality, qualityChainLimitRanges),
    defence: generateAttributeValue(quality, qualityChainRanges),
  };
  return plate;
}

export function createLeather(quality?: QualityLevel): Leather {
  quality = quality ?? generateQualityLevel();
  const leather: Leather = {
    name: namesOfQualityLeather[quality],
    value: valueOfQualityLeather[quality],
    quality,
    img: '',
    keys: [],
    type: ItemType.ARMOR,
    defence: generateAttributeValue(quality, qualityLeatherRanges),
    agilityIncrease: generateAttributeValue(quality, qualityLeatherAgiRanges),
  };
  return leather;
}

export function createCloth(quality?: QualityLevel): Robe {
  quality = quality ?? generateQualityLevel();
  const robe: Robe = {
    name: namesOfQualityCloth[quality],
    value: valueOfQualityCloth[quality],
    quality,
    img: '',
    keys: [],
    type: ItemType.ARMOR,
    defence: generateAttributeValue(quality, qualityClothRanges),
    intelligenceIncrease: generateAttributeValue(
      quality,
      qualityClothIntellRanges
    ),
  };
  return robe;
}

export function createNormalStandardWeapon(
  quality: QualityLevel,
  weaponType:
    | OneHandWeaponType
    | TwoHandWeaponType
    | MiddleRangeWeaponType
    | LongRangeWeaponType
): Weapon {
  switch (weaponType) {
    case OneHandWeaponType.SWORD:
      return createOneHandWeapon(quality, OneHandWeaponType.SWORD);
    case OneHandWeaponType.AXE:
      return createOneHandWeapon(quality, OneHandWeaponType.AXE);
    case OneHandWeaponType.MACE:
      return createOneHandWeapon(quality, OneHandWeaponType.MACE);
    case TwoHandWeaponType.GREAT_SWORD:
      return createTwohandWeapon(quality, TwoHandWeaponType.GREAT_SWORD);
    case TwoHandWeaponType.GREAT_AXE:
      return createTwohandWeapon(quality, TwoHandWeaponType.GREAT_AXE);
    case TwoHandWeaponType.GREAT_MACE:
      return createTwohandWeapon(quality, TwoHandWeaponType.GREAT_MACE);
    case MiddleRangeWeaponType.HALBERD:
      return createMiddleRangeWeapon(quality, MiddleRangeWeaponType.HALBERD);
    case MiddleRangeWeaponType.POLEARM:
      return createMiddleRangeWeapon(quality, MiddleRangeWeaponType.POLEARM);
    case MiddleRangeWeaponType.LANCE:
      return createMiddleRangeWeapon(quality, MiddleRangeWeaponType.LANCE);
    case LongRangeWeaponType.BOW:
      return createLongRangeWeapon(quality, LongRangeWeaponType.BOW);
    case LongRangeWeaponType.CROSSBOW:
      return createLongRangeWeapon(quality, LongRangeWeaponType.CROSSBOW);
    case LongRangeWeaponType.THROWING_AXE:
      return createLongRangeWeapon(quality, LongRangeWeaponType.THROWING_AXE);
    case LongRangeWeaponType.STONE:
      return createLongRangeWeapon(quality, LongRangeWeaponType.STONE);
    default:
      throw new Error('Invalid weapon type');
  }
}

export function createNormalStandardArmor(
  quality: QualityLevel,
  armorType: 'Shield' | 'Plate' | 'Chain' | 'Leather' | 'Cloth'
): Shield | Plate | Chain | Leather | Robe {
  switch (armorType) {
    case 'Shield':
      return createShield(quality);
    case 'Plate':
      return createPlate(quality);
    case 'Chain':
      return createChain(quality);
    case 'Leather':
      return createLeather(quality);
    case 'Cloth':
      return createCloth(quality);
    default:
      throw new Error('Invalid armor type');
  }
}
