/* eslint-disable import/prefer-default-export */
import { MissionDifficulty, QualityLevel } from '../enums';
import { MissionInfo } from '../mission/Mission';

export const missionsInfo: MissionInfo[] = [
  {
    name: '教授音律',
    desc: '音乐学院需要临时教师教导学生基础乐理知识。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EASY,
  },
  {
    name: '教导绘画',
    desc: '艺术工作室需要画师指导学徒掌握基础绘画技巧。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EASY,
  },

  // NORMAL 难度的调查类任务
  {
    name: '调查水源',
    desc: '城市水源出现异常，需要经验丰富的调查员查明原因。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '追查谣言',
    desc: '城中流传着一些危险的谣言，需要调查员追查散播源头。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.NORMAL,
  },

  // HARD 难度的除魔类任务
  {
    name: '驱除妖虫',
    desc: '古老果园出现了一种会吸食果树生命的妖虫，需要除妖师铲除。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '封印怨念',
    desc: '一座古宅中的强大怨念开始影响周围居民，需要法师进行封印。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.HARD,
  },

  // EPIC 难度的护送类任务
  {
    name: '护送密信',
    desc: '需要可靠的特使将一封重要密信送往边境要塞。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '押运圣物',
    desc: '教会需要精锐护卫押运一件强大的圣物穿越魔物出没的险地。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EPIC,
  },

  // LEGENDARY 难度的降服类任务
  {
    name: '降服魔树',
    desc: '一棵千年古树被魔气侵蚀变得狂暴，需要能工巧匠设法降服。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  {
    name: '驯服雷兽',
    desc: '一头掌控雷电的远古异兽苏醒，需要顶级驯兽师将其驯服。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  // EASY 难度的教学类任务
  {
    name: '教授音律',
    desc: '音乐学院需要临时教师教导学生基础乐理知识。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EASY,
  },
  {
    name: '教导绘画',
    desc: '艺术工作室需要画师指导学徒掌握基础绘画技巧。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EASY,
  },

  // NORMAL 难度的调查类任务
  {
    name: '调查水源',
    desc: '城市水源出现异常，需要经验丰富的调查员查明原因。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '追查谣言',
    desc: '城中流传着一些危险的谣言，需要调查员追查散播源头。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.NORMAL,
  },

  // HARD 难度的除魔类任务
  {
    name: '驱除妖虫',
    desc: '古老果园出现了一种会吸食果树生命的妖虫，需要除妖师铲除。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '封印怨念',
    desc: '一座古宅中的强大怨念开始影响周围居民，需要法师进行封印。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.HARD,
  },

  // EPIC 难度的护送类任务
  {
    name: '护送密信',
    desc: '需要可靠的特使将一封重要密信送往边境要塞。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '押运圣物',
    desc: '教会需要精锐护卫押运一件强大的圣物穿越魔物出没的险地。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EPIC,
  },

  // LEGENDARY 难度的降服类任务
  {
    name: '降服魔树',
    desc: '一棵千年古树被魔气侵蚀变得狂暴，需要能工巧匠设法降服。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  {
    name: '驯服雷兽',
    desc: '一头掌控雷电的远古异兽苏醒，需要顶级驯兽师将其驯服。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  // 在最后的 ] 前添加:

  // 法术研究类 - EASY
  {
    name: '研究符文',
    desc: '魔法研究所需要学者协助破译一批新发现的远古符文。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EASY,
  },
  {
    name: '整理典籍',
    desc: '法师塔需要专业人士整理一批魔法典籍，要求熟悉基础魔法理论。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EASY,
  },

  // 天象观测类 - NORMAL
  {
    name: '观测星象',
    desc: '占星塔需要经验丰富的星象师记录最近的异常天象。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '预测天灾',
    desc: '预言家协会需要能准确预测近期可能发生的自然灾害。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.NORMAL,
  },

  // 灾害处理类 - HARD
  {
    name: '平息风暴',
    desc: '一场魔法风暴席卷农田，需要精通风系法术的法师加以控制。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '镇压地裂',
    desc: '地下魔脉波动导致地面开裂，需要土系法师进行加固处理。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.HARD,
  },

  // 神秘探索类 - EPIC
  {
    name: '探索秘境',
    desc: '一处远古秘境入口被发现，需要经验丰富的探险队进行初步探索。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '调查空间异常',
    desc: '城郊出现不稳定的空间裂隙，需要专业法师队伍进行调查和修复。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EPIC,
  },

  // 封印危机类 - LEGENDARY
  {
    name: '封印混沌之眼',
    desc: '一只远古巨兽的混沌之眼被唤醒，需要最强大的封印师将其镇压。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  {
    name: '镇压次元裂缝',
    desc: '城市上空出现危险的次元裂缝，需要多位大法师联手封印。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  // 在数组最后的 ] 前添加:

  {
    name: '教授农艺',
    desc: '农场主需要有经验的农夫指导佃农掌握种植技巧。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EASY,
  },
  {
    name: '驱除山贼',
    desc: '山间商道出现一伙山贼，需要经验丰富的卫队清剿。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '除灭妖蛾',
    desc: '森林中出现了一群会吸食生命力的妖异飞蛾，需要猎手清除。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '护送圣女',
    desc: '需要一支精锐护卫队伍护送年轻的圣女前往边境的神圣祭坛。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '封印魔井',
    desc: '一口古井中涌出了强大的魔气，需要多位高阶法师联手封印。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  // 在数组最后的 ] 前添加:

  {
    name: '教授炼金',
    desc: '炼金学院需要助教指导学徒掌握基础药剂制作技巧。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EASY,
  },
  {
    name: '解读古卷',
    desc: '图书馆新获得一批古老卷轴，需要学者协助解读内容。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '驱逐魔狼',
    desc: '郊外牧场遭受魔化狼群侵扰，需要猎人将其驱赶出境。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '运送魔晶',
    desc: '需要可靠的护卫队伍护送一批珍贵的魔法水晶穿越危险地带。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '降服巨蟒',
    desc: '一条远古巨蟒在沼泽出没，需要顶级驯兽师将其活捉。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.LEGENDARY,
  },
  // 在数组最后的 ] 前添加:

  {
    name: '教授锻造',
    desc: '皇家铸造厂需要经验丰富的铁匠指导学徒制作精良武器。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EASY,
  },
  {
    name: '调查灵异',
    desc: '古老宅邸频繁发生怪事，需要经验丰富的灵能者调查原因。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.NORMAL,
  },
  {
    name: '驱除瘴气',
    desc: '矿洞中涌出诡异的瘴气，需要法师施法净化。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.HARD,
  },
  {
    name: '押运古董',
    desc: '博物馆需要护卫队伍护送一批珍贵文物穿越盗贼出没的区域。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.EPIC,
  },
  {
    name: '降服水龙',
    desc: '一头远古水龙在海湾肆虐，需要最强大的驯兽师将其制服。',
    quality: QualityLevel.E,
    difficulty: MissionDifficulty.LEGENDARY,
  },
];
