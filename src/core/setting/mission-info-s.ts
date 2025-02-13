/* eslint-disable import/prefer-default-export */
/* eslint-disable import/prefer-default-export */
import { MissionDifficulty, QualityLevel } from '../enums';
import { MissionInfo } from '../mission/Mission';

export const missionsInfo: MissionInfo[] = [
  // S级任务
  {
    name: '镇压混沌',
    desc: '远古混沌之力突破封印，正在吞噬多个位面。需要集结诸界最强者联手镇压，否则将污染整个世界树。',
    quality: QualityLevel.S,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  {
    name: '封印魔神王座',
    desc: '历代魔神王的力量源泉——魔神王座正在复苏，需要重新构建跨位面封印阵法。',
    quality: QualityLevel.S,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '守护时空轴',
    desc: '时空长河出现严重断裂，需要最强时空法师在多个时间点同时施法，修复时空轴。',
    quality: QualityLevel.S,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '净化创世树',
    desc: '支撑诸界的创世树枝干开始腐朽，需要用最纯净的生命源质进行净化。',
    quality: QualityLevel.S,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '重铸天命',
    desc: '世界天命之力即将崩溃，需要集结所有圣物与神器，在创世之地重新铸造天命。',
    quality: QualityLevel.S,
    difficulty: MissionDifficulty.EASY,
  },

  // SS级任务
  {
    name: '诛灭归墟',
    desc: '归墟之力开始入侵现实，无数位面已经被虚无吞噬。需要最强者深入归墟源头，阻止灾难蔓延。',
    quality: QualityLevel.SS,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  {
    name: '修复规则',
    desc: '世界核心规则出现崩溃，诸界秩序开始混乱。需要获得创世神器，重新修复世界规则。',
    quality: QualityLevel.SS,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '封印魔祖',
    desc: '万魔之祖苏醒，祂的存在正在扭曲整个现实。需要集结诸界最强者，共同对抗这位超越时空的存在。',
    quality: QualityLevel.SS,
    difficulty: MissionDifficulty.HARD,
  },

  // SSS级任务
  {
    name: '拯救诸界',
    desc: '世界本源即将枯竭，诸天万界都将归于虚无。需要集结一切可能的力量，深入创世源头，重新点燃世界之火。这个任务关乎所有生命的存续，失败就意味着一切的终结。',
    quality: QualityLevel.SSS,
    difficulty: MissionDifficulty.LEGENDARY,
  },
];
