<template>
  <div class="container">
    <div class="panel">
      <div class="official">
        <back></back>
        <img src="/img/recruit.png" />
      </div>
      <div class="info">
        <div class="tip"> <span>商人：</span>{{ info }} </div>
        <div class="consume">
          <div class="label">预计花费</div>
          <div class="value">{{ consume }}</div>
        </div>
        <div class="total">
          <div class="label">当前拥有</div>
          <div class="value">{{ player.gold }}</div>
        </div>
        <div class="action" @click="deal">交易</div>
      </div>
    </div>
    <div class="sell list">
      <div class="tag-list">
        <div class="tag">领主仓库</div>
      </div>
      <div class="item-list">
        <div v-for="item in player.items" :key="item.name" class="item">
          <div class="name" :class="item.quality">{{ item.name }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
    </div>
    <div class="buy list">
      <div class="tag-list">
        <div :class="showWeapon ? 'tag cur' : 'tag'" @click="showWeapon = true"
          >Weapon</div
        >
        <div :class="showWeapon ? 'tag' : 'cur tag'" @click="showWeapon = false"
          >Armor</div
        >
      </div>
      <div v-if="showWeapon" class="item-list">
        <div v-for="item in weaponList" :key="item.name" class="item">
          <div class="name" :class="item.quality">{{ item.name }}</div>
          <div class="num">
            <a-input-number
              v-model="item.num"
              type="number"
              mode="button"
              :min="0"
              size="large"
            ></a-input-number>
          </div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
      <div v-if="!showWeapon" class="item-list">
        <div v-for="item in armorList" :key="item.name" class="item">
          <div class="name" :class="item.quality">{{ item.name }}</div>
          <div class="num">
            <a-input-number
              v-model="item.num"
              type="number"
              mode="button"
              :min="0"
              size="large"
            ></a-input-number>
          </div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { player } from '../../core/game';
  import back from './back.vue';
  import {
    LongRangeWeaponType,
    MiddleRangeWeaponType,
    OneHandWeaponType,
    QualityLevel,
    TwoHandWeaponType,
  } from '../../core/enums';
  import {
    valueOfQualityChain,
    valueOfQualityCloth,
    valueOfQualityLeather,
    valueOfQualityLongRangeWeapon,
    valueOfQualityMiddleRangeWeapon,
    valueOfQualityOneHandWeapon,
    valueOfQualityPlate,
    valueOfQualityShield,
    valueOfQualityTwoHandWeapon,
  } from '../../core/setting/param-item';
  import {
    createNormalStandardArmor,
    createNormalStandardWeapon,
  } from '../../core/utils/itemUtils';

  const weaponList: {
    name: string;
    value: number;
    quality: QualityLevel;
    weaponType:
      | OneHandWeaponType
      | TwoHandWeaponType
      | MiddleRangeWeaponType
      | LongRangeWeaponType;
    num: number;
  }[] = reactive([
    {
      name: '制式长剑',
      value: valueOfQualityOneHandWeapon[QualityLevel.F],
      quality: QualityLevel.F,
      weaponType: OneHandWeaponType.SWORD,
      num: 0,
    },
    {
      name: '优质制式长剑',
      value: valueOfQualityOneHandWeapon[QualityLevel.E],
      quality: QualityLevel.E,
      weaponType: OneHandWeaponType.SWORD,
      num: 0,
    },
    {
      name: '制式战斧',
      value: valueOfQualityOneHandWeapon[QualityLevel.F],
      quality: QualityLevel.F,
      weaponType: OneHandWeaponType.AXE,
      num: 0,
    },
    {
      name: '优质制式战斧',
      value: valueOfQualityOneHandWeapon[QualityLevel.E],
      quality: QualityLevel.E,
      weaponType: OneHandWeaponType.AXE,
      num: 0,
    },
    {
      name: '制式战锤',
      value: valueOfQualityOneHandWeapon[QualityLevel.F],
      quality: QualityLevel.F,
      weaponType: OneHandWeaponType.MACE,
      num: 0,
    },
    {
      name: '优质制式战锤',
      value: valueOfQualityOneHandWeapon[QualityLevel.E],
      quality: QualityLevel.E,
      weaponType: OneHandWeaponType.MACE,
      num: 0,
    },
    {
      name: '制式双手剑',
      value: valueOfQualityTwoHandWeapon[QualityLevel.F],
      quality: QualityLevel.F,
      weaponType: TwoHandWeaponType.GREAT_SWORD,
      num: 0,
    },
    {
      name: '优质制式双手剑',
      value: valueOfQualityTwoHandWeapon[QualityLevel.E],
      quality: QualityLevel.E,
      weaponType: TwoHandWeaponType.GREAT_SWORD,
      num: 0,
    },
    {
      name: '制式双手斧',
      value: valueOfQualityTwoHandWeapon[QualityLevel.F],
      quality: QualityLevel.F,
      weaponType: TwoHandWeaponType.GREAT_AXE,
      num: 0,
    },
    {
      name: '优质制式双手斧',
      value: valueOfQualityTwoHandWeapon[QualityLevel.E],
      quality: QualityLevel.E,
      weaponType: TwoHandWeaponType.GREAT_AXE,
      num: 0,
    },
    {
      name: '制式双手锤',
      value: valueOfQualityTwoHandWeapon[QualityLevel.F],
      quality: QualityLevel.F,
      weaponType: TwoHandWeaponType.GREAT_MACE,
      num: 0,
    },
    {
      name: '优质制式双手锤',
      value: valueOfQualityTwoHandWeapon[QualityLevel.E],
      quality: QualityLevel.E,
      weaponType: TwoHandWeaponType.GREAT_MACE,
      num: 0,
    },
    {
      name: '制式长矛',
      value: valueOfQualityMiddleRangeWeapon[QualityLevel.F],
      quality: QualityLevel.F,
      weaponType: MiddleRangeWeaponType.LANCE,
      num: 0,
    },
    {
      name: '优质制式长矛',
      value: valueOfQualityMiddleRangeWeapon[QualityLevel.E],
      quality: QualityLevel.E,
      weaponType: MiddleRangeWeaponType.LANCE,
      num: 0,
    },
    {
      name: '制式长柄',
      value: valueOfQualityMiddleRangeWeapon[QualityLevel.F],
      quality: QualityLevel.F,
      weaponType: MiddleRangeWeaponType.POLEARM,
      num: 0,
    },
    {
      name: '优质制式长柄',
      value: valueOfQualityMiddleRangeWeapon[QualityLevel.E],
      quality: QualityLevel.E,
      weaponType: MiddleRangeWeaponType.POLEARM,
      num: 0,
    },
    {
      name: '制式长戟',
      value: valueOfQualityMiddleRangeWeapon[QualityLevel.F],
      quality: QualityLevel.F,
      weaponType: MiddleRangeWeaponType.HALBERD,
      num: 0,
    },
    {
      name: '优质制式长戟',
      value: valueOfQualityMiddleRangeWeapon[QualityLevel.E],
      quality: QualityLevel.E,
      weaponType: MiddleRangeWeaponType.HALBERD,
      num: 0,
    },
    {
      name: '制式长弓',
      value: valueOfQualityLongRangeWeapon[QualityLevel.F],
      quality: QualityLevel.F,
      weaponType: LongRangeWeaponType.BOW,
      num: 0,
    },
    {
      name: '优质制式长弓',
      value: valueOfQualityLongRangeWeapon[QualityLevel.E],
      quality: QualityLevel.E,
      weaponType: LongRangeWeaponType.BOW,
      num: 0,
    },
    {
      name: '制式十字弓',
      value: valueOfQualityLongRangeWeapon[QualityLevel.F],
      quality: QualityLevel.F,
      weaponType: LongRangeWeaponType.CROSSBOW,
      num: 0,
    },
    {
      name: '优质制式十字弓',
      value: valueOfQualityLongRangeWeapon[QualityLevel.E],
      quality: QualityLevel.E,
      weaponType: LongRangeWeaponType.CROSSBOW,
      num: 0,
    },
    {
      name: '制式投斧',
      value: valueOfQualityLongRangeWeapon[QualityLevel.F],
      quality: QualityLevel.F,
      weaponType: LongRangeWeaponType.THROWING_AXE,
      num: 0,
    },
    {
      name: '优质制式投斧',
      value: valueOfQualityLongRangeWeapon[QualityLevel.E],
      quality: QualityLevel.E,
      weaponType: LongRangeWeaponType.THROWING_AXE,
      num: 0,
    },
    {
      name: '制式石块',
      value: valueOfQualityLongRangeWeapon[QualityLevel.F],
      quality: QualityLevel.F,
      weaponType: LongRangeWeaponType.STONE,
      num: 0,
    },
    {
      name: '优质制式石块',
      value: valueOfQualityLongRangeWeapon[QualityLevel.E],
      quality: QualityLevel.E,
      weaponType: LongRangeWeaponType.STONE,
      num: 0,
    },
  ]);

  const armorList: {
    name: string;
    value: number;
    quality: QualityLevel;
    armorType: 'Shield' | 'Plate' | 'Chain' | 'Leather' | 'Cloth';
    num: number;
  }[] = reactive([
    {
      name: '制式盾牌',
      value: valueOfQualityShield[QualityLevel.F],
      quality: QualityLevel.F,
      armorType: 'Shield',
      num: 0,
    },
    {
      name: '优质制式盾牌',
      value: valueOfQualityShield[QualityLevel.E],
      quality: QualityLevel.E,
      armorType: 'Shield',
      num: 0,
    },
    {
      name: '制式盔甲',
      value: valueOfQualityPlate[QualityLevel.F],
      quality: QualityLevel.F,
      armorType: 'Plate',
      num: 0,
    },
    {
      name: '优质制式盔甲',
      value: valueOfQualityPlate[QualityLevel.E],
      quality: QualityLevel.E,
      armorType: 'Plate',
      num: 0,
    },
    {
      name: '制式链甲',
      value: valueOfQualityChain[QualityLevel.F],
      quality: QualityLevel.F,
      armorType: 'Chain',
      num: 0,
    },
    {
      name: '优质制式链甲',
      value: valueOfQualityChain[QualityLevel.E],
      quality: QualityLevel.E,
      armorType: 'Chain',
      num: 0,
    },
    {
      name: '制式皮甲',
      value: valueOfQualityLeather[QualityLevel.F],
      quality: QualityLevel.F,
      armorType: 'Leather',
      num: 0,
    },
    {
      name: '优质制式皮甲',
      value: valueOfQualityLeather[QualityLevel.E],
      quality: QualityLevel.E,
      armorType: 'Leather',
      num: 0,
    },
    {
      name: '制式布甲',
      value: valueOfQualityCloth[QualityLevel.F],
      quality: QualityLevel.F,
      armorType: 'Cloth',
      num: 0,
    },
    {
      name: '优质制式布甲',
      value: valueOfQualityCloth[QualityLevel.E],
      quality: QualityLevel.E,
      armorType: 'Cloth',
      num: 0,
    },
  ]);

  const consume = computed(
    () =>
      weaponList.reduce<number>(
        (coin: number, item) => coin + item.num * item.value,
        0
      ) +
      armorList.reduce<number>(
        (coin: number, item) => coin + item.num * item.value,
        0
      )
  );
  const info = ref('这里什么都有！不许瞎想 ~~~！');

  const showWeapon = ref(true);

  const deal = () => {
    if (player.gold >= consume.value) {
      weaponList.forEach((item) => {
        if (item.num > 0) {
          const weapon = createNormalStandardWeapon(
            item.quality,
            item.weaponType
          );
          player.items.push(weapon);
          player.gold -= item.num * item.value;
        }
      });
      armorList.forEach((item) => {
        if (item.num > 0) {
          const armor = createNormalStandardArmor(item.quality, item.armorType);
          player.items.push(armor);
          player.gold -= item.num * item.value;
        }
      });
    } else {
      info.value = '概不赊账的！';
    }
  };
</script>

<style lang="less" scoped>
  @import url('../../assets/style/dream.less');

  .container {
    display: flex;
    justify-content: center;
    height: 100vh;
    padding: 20px;
    background-image: url('/img/bg/weapon-store.png');
    background-position: center;
    background-size: cover;

    .panel {
      position: relative;
      display: flex;
      flex-direction: column;
      flex-grow: 0;
      align-items: stretch;
      justify-content: flex-end;
      width: 26vw;
      margin-right: 20px;
      color: aliceblue;
      font-weight: bolder;
      font-size: 2em;
      background-color: rgb(127 127 127 / 50%);
      border-radius: 10px;

      .official {
        flex-basis: 1024px;
        flex-grow: 0;
        height: 100%;
        overflow: hidden;
      }

      .info {
        flex: auto;
        width: 100%;
        padding: 20px;
        background-color: rgb(0 0 0 / 80%);
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;

        .tip {
          span {
            color: goldenrod;
          }

          margin-bottom: 2em;
          color: rgb(161 161 161);
        }

        .consume,
        .total {
          display: flex;
          margin-bottom: 1em;

          .label {
            margin-right: 2em;
          }
        }

        .action {
          margin: 0 20px;
          padding: 10px;
          color: #1f1f1f;
          text-align: center;
          background-color: goldenrod;
          cursor: pointer;

          &:hover {
            color: #000;
            background-color: rgb(240 189 62);
          }
        }
      }
    }

    .list {
      flex-basis: 30vw;
      flex-grow: 1;
      padding: 0 1em;
      color: aliceblue;

      .tag-list {
        display: flex;
        font-size: 2.5em;

        .tag {
          margin: 0 2px;
          padding: 0.5em 1em;
          color: rgb(21 21 21);
          background-color: goldenrod;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          cursor: pointer;

          &:hover {
            color: #000;
            background-color: rgb(240 189 62);
          }

          &.cur {
            color: #000;
            background-color: rgb(240 189 62);
          }
        }
      }

      .item-list {
        height: 92vh;
        overflow-y: scroll;
        font-size: 2em;

        .item {
          display: flex;
          justify-content: space-between;
          margin: 2px 0.5em 2px 0;
          padding: 0.5em 1em;
          background-color: rgb(0 0 0 / 80%);

          .name {
            width: 10em;

            &.A {
              color: @quality-A-color;
            }

            &.B {
              color: @quality-B-color;
            }

            &.C {
              color: @quality-C-color;
            }

            &.D {
              color: @quality-D-color;
            }

            &.E {
              color: @quality-E-color;
            }

            &.F {
              color: @quality-F-color;
            }
          }

          .value {
            width: 5em;
            text-align: right;
          }
        }
      }
    }
  }
</style>
