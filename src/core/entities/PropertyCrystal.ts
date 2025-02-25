/* eslint-disable import/prefer-default-export */
import {
  CharacterBaseProperty,
  QualityLevel,
  ItemType,
  qualityRankMap,
} from '../enums';
import {
  ICharacter,
  IPropertyCrystal,
  PropertyCrystalInitData,
} from '../interfaces';
import {
  BasePropertyLimit,
  BasePropertyModifier,
  ItemKey,
} from '../interfaces/item';
import { namesOfCrystal, valueOfCrystal } from '../setting/param-crystal';
import { getQualityForValue } from '../utils/utils';

export class PropertyCrystal implements IPropertyCrystal {
  baseProperty: CharacterBaseProperty;

  name: string;

  value: number;

  img: string;

  quality: QualityLevel;

  keys: ItemKey[];

  type: ItemType;

  modifier: BasePropertyModifier[];

  limit: BasePropertyLimit[];

  constructor(initData: PropertyCrystalInitData) {
    this.baseProperty = initData.baseProperty;
    this.quality = initData.quality;
    this.type = ItemType.PROPERTY_CRYSTAL;
    this.keys = [];
    this.modifier = [];
    this.limit = [];
    this.name = namesOfCrystal[this.quality][this.baseProperty];
    this.value = valueOfCrystal[this.quality];
    this.img = `/img/item/crystal-${this.quality.toLowerCase()}.png`;
  }

  ifEffective(character: ICharacter) {
    const propertyQuality = getQualityForValue(character[this.baseProperty]);
    if (qualityRankMap[propertyQuality] <= qualityRankMap[this.quality]) {
      return true;
    }
    return false;
  }

  use(character: ICharacter) {
    if (this.ifEffective(character)) {
      character[this.baseProperty] += 1;
    }
  }
}
