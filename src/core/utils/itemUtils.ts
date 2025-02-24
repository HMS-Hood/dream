import {
  ItemType,
  WeaponHandType,
  AttackMethod,
  OneHandWeaponType,
  TwoHandWeaponType,
  LongRangeWeaponType,
  QualityLevel,
  StaffWeaponType,
  CharacterBaseProperty,
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
  LongRangeWeapon,
  StaffWeapon,
  Armor,
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
  namesOfQualityLance,
  namesOfQualityHalberd,
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
  generateQualityLevelWithMin,
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
  weaponType: OneHandWeaponType | TwoHandWeaponType | LongRangeWeaponType
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
    modifier: [],
    limit: [],
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
  if (!oneHandWeaponType) {
    oneHandWeaponType = randomOneHandWeaponType();
  }
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

function randomLongRangeWeaponType(): LongRangeWeaponType {
  const longRangeWeaponTypes = [
    LongRangeWeaponType.BOW,
    LongRangeWeaponType.CROSSBOW,
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
  if (!longRangeWeaponType) {
    longRangeWeaponType = randomLongRangeWeaponType();
  }
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
    TwoHandWeaponType.LANCE,
    TwoHandWeaponType.HALBERD,
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
  if (!twoHandWeaponType) {
    twoHandWeaponType = randomTwoHandWeaponType();
  }
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
    case TwoHandWeaponType.LANCE:
      name = namesOfQualityLance[quality ?? generateQualityLevel()];
      imgPre = 'lance-';
      break;
    case TwoHandWeaponType.HALBERD:
      name = namesOfQualityHalberd[quality ?? generateQualityLevel()];
      imgPre = 'halberd-';
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
    img: `/img/item/staff-${quality.toLowerCase()}.png`,
    keys: [],
    type: ItemType.WEAPON,
    handType: WeaponHandType.TWO_HAND,
    minDamage: generateAttributeValue(quality, qualityStaffDamageRanges) - 1,
    maxDamage: generateAttributeValue(quality, qualityStaffDamageRanges) + 1,
    attackMethod: AttackMethod.MELEE,
    weaponType: StaffWeaponType.STAFF,
    modifier: [
      {
        property: CharacterBaseProperty.intelligence,
        value: generateAttributeValue(quality, qualityStaffIntellRanges),
      },
    ],
    limit: [],
  };
  return staff;
}

export function createShield(quality?: QualityLevel): Shield {
  quality = quality ?? generateQualityLevel();
  const shield: Shield = {
    name: namesOfQualityShield[quality],
    value: valueOfQualityShield[quality],
    quality,
    img: `/img/item/shield-${quality.toLowerCase()}.png`,
    keys: [],
    type: ItemType.SHIELD,
    defence: generateAttributeValue(quality, qualityShieldRanges),
    modifier: [],
    limit: [],
  };
  return shield;
}

export function createPlate(quality?: QualityLevel): Plate {
  quality = quality ?? generateQualityLevel();
  const plate: Plate = {
    name: namesOfQualityPlate[quality],
    value: valueOfQualityPlate[quality],
    quality,
    img: `/img/item/plate-${quality.toLowerCase()}.png`,
    keys: [],
    type: ItemType.ARMOR,
    limit: [
      {
        property: CharacterBaseProperty.strength,
        minValue: generateAttributeValue(quality, qualityPlateLimitRanges),
      },
    ],
    modifier: [
      {
        property: CharacterBaseProperty.agility,
        value: generateAttributeValue(quality, qualityPlateDecRanges),
      },
    ],
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
    img: `/img/item/chain-${quality.toLowerCase()}.png`,
    keys: [],
    type: ItemType.ARMOR,
    limit: [
      {
        property: CharacterBaseProperty.strength,
        minValue: generateAttributeValue(quality, qualityChainLimitRanges),
      },
    ],
    modifier: [],
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
    img: `/img/item/leather-${quality.toLowerCase()}.png`,
    keys: [],
    type: ItemType.ARMOR,
    defence: generateAttributeValue(quality, qualityLeatherRanges),
    modifier: [
      {
        property: CharacterBaseProperty.agility,
        value: generateAttributeValue(quality, qualityLeatherAgiRanges),
      },
    ],
    limit: [],
  };
  return leather;
}

export function createCloth(quality?: QualityLevel): Robe {
  quality = quality ?? generateQualityLevel();
  const robe: Robe = {
    name: namesOfQualityCloth[quality],
    value: valueOfQualityCloth[quality],
    quality,
    img: `/img/item/cloth-${quality.toLowerCase()}.png`,
    keys: [],
    type: ItemType.ARMOR,
    defence: generateAttributeValue(quality, qualityClothRanges),
    modifier: [
      {
        property: CharacterBaseProperty.intelligence,
        value: generateAttributeValue(quality, qualityClothIntellRanges),
      },
    ],
    limit: [],
  };
  return robe;
}

export function createNormalStandardWeapon(
  quality: QualityLevel,
  weaponType: OneHandWeaponType | TwoHandWeaponType | LongRangeWeaponType
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
    case TwoHandWeaponType.HALBERD:
      return createTwohandWeapon(quality, TwoHandWeaponType.HALBERD);
    case TwoHandWeaponType.LANCE:
      return createTwohandWeapon(quality, TwoHandWeaponType.LANCE);
    case LongRangeWeaponType.BOW:
      return createLongRangeWeapon(quality, LongRangeWeaponType.BOW);
    case LongRangeWeaponType.CROSSBOW:
      return createLongRangeWeapon(quality, LongRangeWeaponType.CROSSBOW);
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

export function generateRandomEquipment(
  lowQuality: QualityLevel
): Weapon | Armor | Shield {
  const equipQuality = generateQualityLevelWithMin(lowQuality);

  // 随机生成武器或防具
  if (Math.random() < 0.5) {
    // 生成武器
    const weaponType = Math.floor(Math.random() * 5);
    let weapon: Weapon;
    switch (weaponType) {
      case 0:
        weapon = createOneHandWeapon(equipQuality);
        break;
      case 1:
      case 2:
        weapon = createTwohandWeapon(equipQuality);
        break;
      case 3:
        weapon = createLongRangeWeapon(equipQuality);
        break;
      case 4:
        weapon = createStaff(equipQuality);
        break;
      default:
        throw new Error('Invalid weapon type');
    }
    return weapon;
  }
  // 生成防具
  const armorType = Math.floor(Math.random() * 5);
  let armor: Armor | Shield;
  switch (armorType) {
    case 0:
      armor = createShield(equipQuality);
      break;
    case 1:
      armor = createPlate(equipQuality);
      break;
    case 2:
      armor = createChain(equipQuality);
      break;
    case 3:
      armor = createLeather(equipQuality);
      break;
    case 4:
      armor = createCloth(equipQuality);
      break;
    default:
      throw new Error('Invalid armor type');
  }
  return armor;
}
