import {
  ItemType,
  WeaponHandType,
  AttackMethod,
  OneHandWeaponType,
  TwoHandWeaponType,
  MiddleRangeWeaponType,
  LongRangeWeaponType,
  QualityLevel,
  StaffWeaponType,
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
  StaffWeapon,
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
  qualityLongRangeDamageRanges,
  namesOfQualityAxe,
  namesOfQualityMace,
  namesOfQualitySpear,
  namesOfQualityHalberd,
  namesOfQualityPolearm,
  namesOfQualityBow,
  namesOfQualityCrossbow,
  namesOfQualityGreatSword,
  namesOfQualityGreatAxe,
  namesOfQualityGreatMace,
  namesOfQualityStaff,
  qualityStaffDamageRanges,
  qualityStaffIntellRanges,
  valueOfQualityStaffWeapon,
} from '../setting/param-item';
import {
  generateAttributeValue,
  generateQualityLevel,
  getRandomInt,
} from './utils';

export function createWeapon(
  quality: QualityLevel,
  name: string,
  imgPre: string,
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
    name,
    value,
    quality,
    img: `/img/item/${imgPre}${quality.toString().toLowerCase()}.png`,
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
  let name: string;
  let imgPre: string;
  switch (oneHandWeaponType) {
    case OneHandWeaponType.SWORD:
      name = namesOfQualitySword[quality ?? generateQualityLevel()];
      imgPre = 'sword-';
      break;
    case OneHandWeaponType.AXE:
      name = namesOfQualityAxe[quality ?? generateQualityLevel()];
      imgPre = 'axe-';
      break;
    case OneHandWeaponType.MACE:
      name = namesOfQualityMace[quality ?? generateQualityLevel()];
      imgPre = 'hammer-';
      break;
    default:
      throw new Error('Invalid one hand weapon type');
  }
  return createWeapon(
    quality ?? generateQualityLevel(),
    name,
    imgPre,
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
  let name: string;
  let imgPre: string;
  switch (middleRangeWeaponType) {
    case MiddleRangeWeaponType.LANCE:
      name = namesOfQualitySpear[quality ?? generateQualityLevel()];
      imgPre = 'spear-';
      break;
    case MiddleRangeWeaponType.HALBERD:
      name = namesOfQualityHalberd[quality ?? generateQualityLevel()];
      imgPre = 'changji-';
      break;
    case MiddleRangeWeaponType.POLEARM:
      name = namesOfQualityPolearm[quality ?? generateQualityLevel()];
      imgPre = 'changbing-';
      break;
    default:
      throw new Error('Invalid middle range weapon type');
  }
  return createWeapon(
    quality ?? generateQualityLevel(),
    name,
    imgPre,
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
  let name: string;
  let imgPre: string;
  switch (longRangeWeaponType) {
    case LongRangeWeaponType.BOW:
      name = namesOfQualityBow[quality ?? generateQualityLevel()];
      imgPre = 'bow-';
      break;
    case LongRangeWeaponType.CROSSBOW:
      name = namesOfQualityCrossbow[quality ?? generateQualityLevel()];
      imgPre = 'cross-bow-';
      break;
    default:
      throw new Error('Invalid long range weapon type');
  }
  return createWeapon(
    quality ?? generateQualityLevel(),
    name,
    imgPre,
    valueOfQualityLongRangeWeapon[quality ?? generateQualityLevel()],
    WeaponHandType.TWO_HAND,
    qualityLongRangeDamageRanges,
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
  let name: string;
  let imgPre: string;
  switch (twoHandWeaponType) {
    case TwoHandWeaponType.GREAT_SWORD:
      name = namesOfQualityGreatSword[quality ?? generateQualityLevel()];
      imgPre = 'g-sword-';
      break;
    case TwoHandWeaponType.GREAT_AXE:
      name = namesOfQualityGreatAxe[quality ?? generateQualityLevel()];
      imgPre = 'g-axe-';
      break;
    case TwoHandWeaponType.GREAT_MACE:
      name = namesOfQualityGreatMace[quality ?? generateQualityLevel()];
      imgPre = 'g-hammer-';
      break;
    default:
      throw new Error('Invalid two hand weapon type');
  }
  return createWeapon(
    quality ?? generateQualityLevel(),
    name,
    imgPre,
    valueOfQualityTwoHandWeapon[quality ?? generateQualityLevel()],
    WeaponHandType.TWO_HAND,
    qualityTwoHandDamageRanges,
    AttackMethod.MELEE,
    twoHandWeaponType ?? randomTwoHandWeaponType()
  ) as TwoHandWeapon;
}

export function createStaff(quality?: QualityLevel): Weapon {
  quality = quality ?? generateQualityLevel();
  const staff: StaffWeapon = {
    name: namesOfQualityStaff[quality],
    value: valueOfQualityStaffWeapon[quality],
    quality,
    img: `/img/equipment/staff-${quality.toLowerCase()}.png`,
    keys: [],
    type: ItemType.WEAPON,
    handType: WeaponHandType.TWO_HAND,
    minDamage: generateAttributeValue(quality, qualityStaffDamageRanges) - 1,
    maxDamage: generateAttributeValue(quality, qualityStaffDamageRanges) + 1,
    attackMethod: AttackMethod.MELEE,
    weaponType: StaffWeaponType.STAFF,
    intelligenceIncrease: generateAttributeValue(
      quality,
      qualityStaffIntellRanges
    ),
  };
  return staff;
}

export function createShield(quality?: QualityLevel): Shield {
  quality = quality ?? generateQualityLevel();
  const shield: Shield = {
    name: namesOfQualityShield[quality],
    value: valueOfQualityShield[quality],
    quality,
    img: `/img/equipment/shield-${quality.toLowerCase()}.png`,
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
    img: `/img/equipment/plate-${quality.toLowerCase()}.png`,
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
    img: `/img/equipment/chain-${quality.toLowerCase()}.png`,
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
    img: `/img/equipment/leather-${quality.toLowerCase()}.png`,
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
    img: `/img/equipment/cloth-${quality.toLowerCase()}.png`,
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
