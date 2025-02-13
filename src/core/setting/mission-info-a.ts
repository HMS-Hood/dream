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
    name: '守护世界树',
    desc: '世界树受到致命污染，需要最强的贤者们联手净化并守护，否则世界将陷入永久衰败。',
    quality: QualityLevel.A,
    difficulty: MissionDifficulty.EASY,
  },
  {
    name: '阻止献祭',
    desc: '邪教组织正在多个王国同时进行大规模献祭仪式，需要在期限内阻止所有仪式的完成。',
    quality: QualityLevel.A,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '讨伐魔神王',
    desc: '传说中的魔神王苏醒，已经摧毁了三个王国。需要组建联军阻止它的脚步。',
    quality: QualityLevel.A,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '拯救神选者',
    desc: '预言中能够拯救世界的神选者被困在时空裂缝中，需要在时空崩溃前将其救出。',
    quality: QualityLevel.A,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '封印魔界门',
    desc: '魔界之门即将完全打开，需要集结世界上最强大的封印师共同施法，否则世界将被魔物占领。',
    quality: QualityLevel.A,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  {
    name: '统领圣战',
    desc: '黑暗势力正在多个位面同时入侵，需要最强统帅指挥多国联军展开圣战。',
    quality: QualityLevel.A,
    difficulty: MissionDifficulty.EASY,
  },
  {
    name: '净化源头',
    desc: '世界源质正在被未知力量污染，需要最强大的贤者们深入源头进行净化。',
    quality: QualityLevel.A,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '诛灭邪神王',
    desc: '沉睡万年的邪神王即将苏醒，需要在它恢复全部力量前将其诛灭。',
    quality: QualityLevel.A,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '修复世界',
    desc: '世界核心出现裂痕，需要集结所有圣物与最强者进行修复，否则世界将会崩溃。',
    quality: QualityLevel.A,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '终结魔劫',
    desc: '预言中的魔劫降临，需要集结世界上所有顶尖强者联手对抗，事关世界存亡。',
    quality: QualityLevel.A,
    difficulty: MissionDifficulty.LEGENDARY,
  },
];
