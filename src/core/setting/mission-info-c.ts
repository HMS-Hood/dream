/* eslint-disable import/prefer-default-export */
/* eslint-disable import/prefer-default-export */
import { MissionDifficulty, QualityLevel } from '../enums';

export const missionsInfo: {
  name: string;
  desc: string;
  quality: QualityLevel;
  difficulty: MissionDifficulty;
}[] = [
  {
    name: '守卫要塞',
    desc: '边境要塞需要一队精锐士兵加强防守，预计会有敌军侦查活动。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.EASY,
  },
  {
    name: '调查暗杀',
    desc: '一位重要商会领袖遭到暗杀，需要揪出幕后黑手。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '讨伐魔将',
    desc: '一位堕落的魔剑士正在边境挑战各路高手，需要将其制服。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '护送皇使',
    desc: '皇室密使携带机密文书，需要护送他穿越敌国势力范围。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '封印魔王',
    desc: '一位沉睡的魔王即将苏醒，需要在它完全复苏前重新封印。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  {
    name: '训练精锐',
    desc: '王城近卫军需要特级教官训练一支精锐小队。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.EASY,
  },
  {
    name: '破解阴谋',
    desc: '有人正在密谋颠覆商会，需要能干的密探追查真相。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '狩猎魔龙',
    desc: '一头成年火龙在边境肆虐，多个村庄被烧毁。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '押运神器',
    desc: '一件远古神器需要秘密运送到皇城，多方势力虎视眈眈。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '讨伐魔神',
    desc: '一位远古魔神的分身降临人间，需要阻止它召唤本体。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  {
    name: '指挥防御',
    desc: '边境城市需要经验丰富的指挥官部署防御工事。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.EASY,
  },
  {
    name: '调查诅咒',
    desc: '王室成员接连遭受诅咒，需要揪出背后的黑手。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '剿灭海盗',
    desc: '一支装备精良的海盗船队威胁着海上贸易，需要将其剿灭。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '护送圣物',
    desc: '一件关乎国运的圣物需要护送到圣地，路途充满危险。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '降伏妖王',
    desc: '一位沉睡千年的妖王苏醒，需要在它恢复全力前将其制服。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  {
    name: '镇守边关',
    desc: '边境重镇需要一位经验丰富的将领坐镇，预防敌国偷袭。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.EASY,
  },
  {
    name: '追查叛徒',
    desc: '王室近卫军中出现叛徒，需要秘密调查并将其揪出。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '讨伐邪龙',
    desc: '一头被邪恶力量污染的巨龙占据了重要关隘，需要将其驱逐。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '护送公主',
    desc: '需要秘密护送公主殿下前往同盟国，路途中可能遭遇刺客。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '封印魔渊',
    desc: '一处远古魔渊出现裂缝，需要集结顶尖法师加固封印。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  {
    name: '训练禁卫',
    desc: '皇宫禁卫军需要一位顶尖剑术大师培训精锐部队。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.EASY,
  },
  {
    name: '调查谋反',
    desc: '有迹象表明某个公国正在密谋叛乱，需要调查证据。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '猎杀魔将',
    desc: '一位魔化的前任将军率领亡灵军队作乱，需要将其讨伐。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '运送秘宝',
    desc: '一批足以影响国运的秘宝需要秘密运往王城宝库。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '镇压邪神',
    desc: '一位蛰伏的邪神即将觉醒，需要在灾难降临前将其镇压。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  {
    name: '守护圣地',
    desc: '一处重要的宗教圣地需要精锐部队驻守，防范亵渎者。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.EASY,
  },
  {
    name: '破解阴谋',
    desc: '有神秘势力正在暗中策划刺杀国王，需要揪出幕后黑手。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '讨伐叛军',
    desc: '一支叛军占据了重要关隘，需要精锐部队将其剿灭。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '护送圣女',
    desc: '需要护送圣女突破重重封锁，前往古老祭坛完成仪式。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '封印古神',
    desc: '一位沉睡的古神显露复苏迹象，需要最强的法师重新封印。',
    quality: QualityLevel.C,
    difficulty: MissionDifficulty.LEGENDARY,
  },
];
