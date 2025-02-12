import { QualityLevel } from '../enums';
import { QualityString, QualityRange, QualityNumber } from './param';

export const qualityDamageRanges: QualityRange = {
  [QualityLevel.F]: [10, 12],
  [QualityLevel.E]: [14, 16],
  [QualityLevel.D]: [19, 22],
  [QualityLevel.C]: [25, 29],
  [QualityLevel.B]: [32, 37],
  [QualityLevel.A]: [40, 46],
  [QualityLevel.S]: [49, 56],
  [QualityLevel.SS]: [59, 67],
  [QualityLevel.SSS]: [70, 79],
};

export const qualityTwoHandDamageRanges: QualityRange = {
  [QualityLevel.F]: [15, 18],
  [QualityLevel.E]: [21, 24],
  [QualityLevel.D]: [29, 33],
  [QualityLevel.C]: [38, 44],
  [QualityLevel.B]: [48, 56],
  [QualityLevel.A]: [60, 69],
  [QualityLevel.S]: [74, 84],
  [QualityLevel.SS]: [89, 101],
  [QualityLevel.SSS]: [105, 119],
};

export const qualityStaffDamageRanges: QualityRange = {
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

export const qualityStaffIntellRanges: QualityRange = {
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
  [QualityLevel.F]: '铁制长剑',
  [QualityLevel.E]: '精钢长剑',
  [QualityLevel.D]: '骑士剑',
  [QualityLevel.C]: '附魔长剑',
  [QualityLevel.B]: '祝福之剑',
  [QualityLevel.A]: '屠龙剑',
  [QualityLevel.S]: '噬魂之刃',
  [QualityLevel.SS]: '天堂之刃',
  [QualityLevel.SSS]: '誓约胜利之剑',
};

export const namesOfQualityAxe: QualityString = {
  [QualityLevel.F]: '樵夫斧',
  [QualityLevel.E]: '战斧',
  [QualityLevel.D]: '军用斧',
  [QualityLevel.C]: '狂战士之斧',
  [QualityLevel.B]: '雷霆战斧',
  [QualityLevel.A]: '风暴裂斧',
  [QualityLevel.S]: '开山斧',
  [QualityLevel.SS]: '泰坦陨落',
  [QualityLevel.SSS]: '终结之斧',
};

export const namesOfQualityMace: QualityString = {
  [QualityLevel.F]: '青铜重锤',
  [QualityLevel.E]: '精钢重锤',
  [QualityLevel.D]: '尖刺重锤',
  [QualityLevel.C]: '圣骑士之锤',
  [QualityLevel.B]: '圣光破碎者',
  [QualityLevel.A]: '神罚之锤',
  [QualityLevel.S]: '碎星者',
  [QualityLevel.SS]: '天谴之锤',
  [QualityLevel.SSS]: '神王之锤',
};

export const namesOfQualityDagger: QualityString = {
  [QualityLevel.F]: '铁制匕首',
  [QualityLevel.E]: '精钢匕首',
  [QualityLevel.D]: '刺客匕首',
  [QualityLevel.C]: '暗影匕首',
  [QualityLevel.B]: '毒蛇之牙',
  [QualityLevel.A]: '血影之刃',
  [QualityLevel.S]: '暗夜之噬',
  [QualityLevel.SS]: '虚空之刺',
  [QualityLevel.SSS]: '永恒之痛',
};

export const namesOfQualityStaff: QualityString = {
  [QualityLevel.F]: '木制法杖',
  [QualityLevel.E]: '精灵法杖',
  [QualityLevel.D]: '巫师法杖',
  [QualityLevel.C]: '秘法法杖',
  [QualityLevel.B]: '大法师法杖',
  [QualityLevel.A]: '天界法杖',
  [QualityLevel.S]: '星辰法杖',
  [QualityLevel.SS]: '虚空法杖',
  [QualityLevel.SSS]: '神之法杖',
};

export const namesOfQualityBow: QualityString = {
  [QualityLevel.F]: '木制长弓',
  [QualityLevel.E]: '硬木长弓',
  [QualityLevel.D]: '猎手之弓',
  [QualityLevel.C]: '精灵短弓',
  [QualityLevel.B]: '风行者之弓',
  [QualityLevel.A]: '月神之弓',
  [QualityLevel.S]: '星辰之弦',
  [QualityLevel.SS]: '天空之翼',
  [QualityLevel.SSS]: '诸神黄昏',
};

export const namesOfQualityCrossbow: QualityString = {
  [QualityLevel.F]: '铁制弩',
  [QualityLevel.E]: '精钢弩',
  [QualityLevel.D]: '重型弩',
  [QualityLevel.C]: '穿云弩',
  [QualityLevel.B]: '狙击弩',
  [QualityLevel.A]: '破甲神弩',
  [QualityLevel.S]: '天罚之弩',
  [QualityLevel.SS]: '灭世之弩',
  [QualityLevel.SSS]: '末日审判',
};

export const namesOfQualityThrowingAxe: QualityString = {
  [QualityLevel.F]: '投掷斧',
  [QualityLevel.E]: '回旋斧',
  [QualityLevel.D]: '飞斧',
  [QualityLevel.C]: '狂风之斧',
  [QualityLevel.B]: '风暴使者',
  [QualityLevel.A]: '雷霆之握',
  [QualityLevel.S]: '天空之怒',
  [QualityLevel.SS]: '星陨之斧',
  [QualityLevel.SSS]: '神之制裁',
};

export const namesOfQualityStone: QualityString = {
  [QualityLevel.F]: '普通石块',
  [QualityLevel.E]: '尖锐石块',
  [QualityLevel.D]: '精磨石块',
  [QualityLevel.C]: '破魔石',
  [QualityLevel.B]: '陨星碎片',
  [QualityLevel.A]: '天外陨石',
  [QualityLevel.S]: '神石碎片',
  [QualityLevel.SS]: '混沌之石',
  [QualityLevel.SSS]: '创世之石',
};

export const namesOfQualityShield: QualityString = {
  [QualityLevel.F]: '铁制圆盾',
  [QualityLevel.E]: '精钢盾',
  [QualityLevel.D]: '塔盾',
  [QualityLevel.C]: '守卫者之盾',
  [QualityLevel.B]: '皇家禁卫盾',
  [QualityLevel.A]: '圣骑士盾',
  [QualityLevel.S]: '龙鳞盾',
  [QualityLevel.SS]: '神圣壁垒',
  [QualityLevel.SSS]: '永恒之盾',
};

export const namesOfQualityPlate: QualityString = {
  [QualityLevel.F]: '铁甲',
  [QualityLevel.E]: '精钢甲',
  [QualityLevel.D]: '骑士铠甲',
  [QualityLevel.C]: '皇家卫甲',
  [QualityLevel.B]: '督军战甲',
  [QualityLevel.A]: '龙鳞铠甲',
  [QualityLevel.S]: '神圣战甲',
  [QualityLevel.SS]: '不朽之壳',
  [QualityLevel.SSS]: '泰坦之拥',
};

export const namesOfQualityChain: QualityString = {
  [QualityLevel.F]: '铁制链甲',
  [QualityLevel.E]: '精钢链甲',
  [QualityLevel.D]: '强化链甲',
  [QualityLevel.C]: '哨兵链甲',
  [QualityLevel.B]: '守护者链甲',
  [QualityLevel.A]: '秘银链甲',
  [QualityLevel.S]: '天界链甲',
  [QualityLevel.SS]: '星光织网',
  [QualityLevel.SSS]: '龙鳞锁甲',
};

export const namesOfQualityLeather: QualityString = {
  [QualityLevel.F]: '粗制皮甲',
  [QualityLevel.E]: '精制皮甲',
  [QualityLevel.D]: '硬化皮甲',
  [QualityLevel.C]: '暗影皮甲',
  [QualityLevel.B]: '游侠皮甲',
  [QualityLevel.A]: '狮鹫皮甲',
  [QualityLevel.S]: '龙皮甲',
  [QualityLevel.SS]: '幻影之肤',
  [QualityLevel.SSS]: '天界战衣',
};

export const namesOfQualityCloth: QualityString = {
  [QualityLevel.F]: '棉布长袍',
  [QualityLevel.E]: '丝绸法袍',
  [QualityLevel.D]: '附魔丝绸',
  [QualityLevel.C]: '秘法织物',
  [QualityLevel.B]: '术士法袍',
  [QualityLevel.A]: '大法师法袍',
  [QualityLevel.S]: '天界法衣',
  [QualityLevel.SS]: '星辰织物',
  [QualityLevel.SSS]: '虚空法袍',
};

export const namesOfQualityGreatSword: QualityString = {
  [QualityLevel.F]: '铁制大剑',
  [QualityLevel.E]: '精钢大剑',
  [QualityLevel.D]: '重型大剑',
  [QualityLevel.C]: '巨人之剑',
  [QualityLevel.B]: '斩龙大剑',
  [QualityLevel.A]: '天堂之怒',
  [QualityLevel.S]: '审判之剑',
  [QualityLevel.SS]: '诸神之剑',
  [QualityLevel.SSS]: '世界之刃',
};

export const namesOfQualityGreatAxe: QualityString = {
  [QualityLevel.F]: '铁制巨斧',
  [QualityLevel.E]: '精钢巨斧',
  [QualityLevel.D]: '战争巨斧',
  [QualityLevel.C]: '狂战士巨斧',
  [QualityLevel.B]: '毁灭之斧',
  [QualityLevel.A]: '泰坦之斧',
  [QualityLevel.S]: '天崩地裂',
  [QualityLevel.SS]: '诸神之怒',
  [QualityLevel.SSS]: '末世之斧',
};

export const namesOfQualityGreatMace: QualityString = {
  [QualityLevel.F]: '铁制重锤',
  [QualityLevel.E]: '精钢重锤',
  [QualityLevel.D]: '战争重锤',
  [QualityLevel.C]: '巨人之锤',
  [QualityLevel.B]: '山崩之锤',
  [QualityLevel.A]: '地裂之锤',
  [QualityLevel.S]: '天罚之锤',
  [QualityLevel.SS]: '神威之锤',
  [QualityLevel.SSS]: '诸神之力',
};

export const namesOfQualitySpear: QualityString = {
  [QualityLevel.F]: '铁制长矛',
  [QualityLevel.E]: '精钢长矛',
  [QualityLevel.D]: '战争长矛',
  [QualityLevel.C]: '龙骑士矛',
  [QualityLevel.B]: '雷霆之矛',
  [QualityLevel.A]: '天空之矛',
  [QualityLevel.S]: '破晓之矛',
  [QualityLevel.SS]: '苍穹之矛',
  [QualityLevel.SSS]: '命运之矛',
};

export const namesOfQualityPolearm: QualityString = {
  [QualityLevel.F]: '铁制长戟',
  [QualityLevel.E]: '精钢长戟',
  [QualityLevel.D]: '守卫长戟',
  [QualityLevel.C]: '皇家长戟',
  [QualityLevel.B]: '将军之戟',
  [QualityLevel.A]: '龙纹长戟',
  [QualityLevel.S]: '天威之戟',
  [QualityLevel.SS]: '帝王之戟',
  [QualityLevel.SSS]: '九天神戟',
};

export const namesOfQualityHalberd: QualityString = {
  [QualityLevel.F]: '铁制戟斧',
  [QualityLevel.E]: '精钢戟斧',
  [QualityLevel.D]: '军用戟斧',
  [QualityLevel.C]: '禁卫戟斧',
  [QualityLevel.B]: '统帅戟斧',
  [QualityLevel.A]: '霸王戟斧',
  [QualityLevel.S]: '天子戟斧',
  [QualityLevel.SS]: '九霄戟斧',
  [QualityLevel.SSS]: '真龙戟斧',
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

export const qualityLongRangeDamageRanges: QualityRange = {
  [QualityLevel.F]: [12, 14],
  [QualityLevel.E]: [17, 19],
  [QualityLevel.D]: [23, 26],
  [QualityLevel.C]: [30, 35],
  [QualityLevel.B]: [38, 44],
  [QualityLevel.A]: [48, 55],
  [QualityLevel.S]: [59, 67],
  [QualityLevel.SS]: [71, 80],
  [QualityLevel.SSS]: [84, 95],
};
