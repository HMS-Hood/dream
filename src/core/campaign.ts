/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { SquadPosition, AttackMethod } from './enums';
import { BattleConfig, CharacterInterface } from './interfaces';
import {
  BattleState,
  Army,
  Squad,
  BattleGroup,
  BattleSide,
  BattleRound,
} from './interfaces/combat';
import { CombatUnit } from './entities/CombatUnit';
import { generateId } from './utils/utils';

// 添加新的接口定义
export interface CombatLog {
  type: 'squad' | 'unit';
  attackerId: string;
  targetId: string;
  damage: number;
  isKill: boolean;
  timestamp: number;
}

export interface BattleGroupResult {
  groupId: string;
  side1Casualties: number;
  side2Casualties: number;
  combatLogs: CombatLog[];
  isPlayerInvolved: boolean;
  rounds: BattleRound[];
}

export class Campaign {
  private config: BattleConfig;

  private battleState: BattleState;

  private currentBattleGroupResults: Map<string, BattleGroupResult>;

  private playerBattleGroupId: string | null;

  private battleMatched: boolean;

  private nonPlayerBattlesExecuted: boolean;

  private playerBattleExecuted: boolean;

  constructor(
    config: BattleConfig,
    side1Armies: Army[],
    side2Armies: Army[],
    playerArmy: Army | null,
    isPlayerOnSide1: boolean = true
  ) {
    this.config = config;

    // 如果存在 playerArmy，将其添加到对应阵营
    if (playerArmy) {
      if (isPlayerOnSide1) {
        side1Armies = [playerArmy, ...side1Armies];
      } else {
        side2Armies = [playerArmy, ...side2Armies];
      }
    }

    this.battleState = {
      sides: [
        {
          id: generateId(),
          name: 'Side 1',
          armies: [],
          reserveArmies: side1Armies,
          isPlayerSide: isPlayerOnSide1,
        },
        {
          id: generateId(),
          name: 'Side 2',
          armies: [],
          reserveArmies: side2Armies,
          isPlayerSide: !isPlayerOnSide1,
        },
      ],
      battleGroups: [],
      round: 0,
      isBattleOver: false,
    };

    this.currentBattleGroupResults = new Map();
    this.playerBattleGroupId = null;
    this.battleMatched = false;
    this.nonPlayerBattlesExecuted = false;
    this.playerBattleExecuted = false;
  }

  // Get squads that are participating in the battle
  private getParticipatingSquads(army: Army): Squad[] {
    return army.squads.filter((squad) => !squad.isDead);
  }

  // Get squads that are available in the reserve
  private getReserveSquads(army: Army): Squad[] {
    return army.reserveSquads.filter((squad) => !squad.isDead);
  }

  private calculateAttackDistance(
    attackerSquad: Squad,
    targetSquad: Squad
  ): number {
    const attackerPositionIndex = Object.values(SquadPosition).indexOf(
      attackerSquad.position
    );
    const targetPositionIndex = Object.values(SquadPosition).indexOf(
      targetSquad.position
    );
    let distance = 0;

    if (attackerPositionIndex !== -1 && targetPositionIndex !== -1) {
      distance = Math.abs(attackerPositionIndex - targetPositionIndex);
    }

    return distance;
  }

  // Get attack distance based on attack method
  private getAttackRange(method: AttackMethod): number {
    switch (method) {
      case AttackMethod.MELEE:
        return 1;
      case AttackMethod.MEDIUM_RANGE:
        return 3;
      case AttackMethod.LONG_RANGE:
        return 5;
      default:
        return 0;
    }
  }

  private getRandomTarget(validTargets: Squad[]): Squad | null {
    if (validTargets.length === 0) {
      return null;
    }
    const weights = validTargets.map((target) => {
      const distance = this.calculateAttackDistance(validTargets[0], target);
      return 1 - distance * 0.5;
    });

    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i += 1) {
      random -= weights[i];
      if (random <= 0) {
        return validTargets[i];
      }
    }
    return validTargets[0];
  }

  // Calculate damage, can add more sophisticated damage model
  private calculateDamage(
    attacker: CharacterInterface,
    target: CharacterInterface
  ): { attackerDamage: number; targetDamage: number } {
    const attackerDamage = Math.max(attacker.strength, 1);
    const targetDamage = Math.max(target.strength * 0.5, 1);
    return { attackerDamage, targetDamage };
  }

  // Handle player attack
  private handleTeamMemberAttack(
    attacker: CombatUnit,
    target: CombatUnit
  ): void {
    const { attackerDamage, targetDamage } = this.calculateDamage(
      attacker.getCharacter(),
      target.getCharacter()
    );

    target.takeDamage(attackerDamage);
    attacker.takeDamage(targetDamage);
  }

  // Handle squad attack
  private handleSquadAttack(
    attackerSquad: Squad,
    targetSquad: Squad,
    battleGroup: BattleGroup
  ): void {
    if (
      attackerSquad.members.length === 0 ||
      targetSquad.members.length === 0
    ) {
      return;
    }

    // Sort by luck
    const sortedAttackers = [...attackerSquad.members].sort(
      (a, b) => a.getCharacter().luck - b.getCharacter().luck
    );

    for (let i = 0; i < sortedAttackers.length; i += 1) {
      if (targetSquad.members.length === 0) {
        return;
      }
      const attacker = sortedAttackers[i];
      const randomIndex = Math.floor(
        Math.random() * targetSquad.members.length
      );
      const target = targetSquad.members[randomIndex];

      // 计算伤害
      const { attackerDamage, targetDamage } = this.calculateDamage(
        attacker.getCharacter(),
        target.getCharacter()
      );

      // 记录战斗结果
      const isCritical = Math.random() < attacker.getCharacter().luck * 0.1;
      const finalDamage = isCritical ? attackerDamage * 1.5 : attackerDamage;

      this.recordBattleResult(
        battleGroup,
        attackerSquad,
        targetSquad,
        finalDamage,
        isCritical
      );

      // 执行伤害
      target.takeDamage(finalDamage);
      attacker.takeDamage(targetDamage);

      // Remove dead units
      targetSquad.members = targetSquad.members.filter(
        (member) => !member.isDead
      );
      attackerSquad.members = attackerSquad.members.filter(
        (member) => !member.isDead
      );

      if (
        targetSquad.members.length === 0 ||
        attackerSquad.members.length === 0
      ) {
        break;
      }
    }

    // check if the squad is dead
    if (targetSquad.members.length === 0) {
      targetSquad.isDead = true;
    }
    if (attackerSquad.members.length === 0) {
      attackerSquad.isDead = true;
    }
  }

  // 从预备队补充部队
  private addReserveTroops(): void {
    this.battleState.sides.forEach((side) => {
      // 检查当前上场部队数量是否达到上限
      const availableSlots = this.config.battlefieldWidth - side.armies.length;

      if (availableSlots > 0 && side.reserveArmies.length > 0) {
        // 从预备队补充部队
        const troopsToAdd = Math.min(availableSlots, side.reserveArmies.length);
        const newTroops = side.reserveArmies.splice(0, troopsToAdd);
        side.armies.push(...newTroops);
      }
    });
  }

  // Battle Logic
  private handleBattle(): void {
    // 新代码：检查双方存活的部队
    const aliveSides = this.battleState.sides.filter((side) =>
      side.armies.some((army) => this.getParticipatingSquads(army).length > 0)
    );

    if (aliveSides.length < 2) {
      this.battleState.isBattleOver = true;
      return;
    }

    // 获取所有存活的小队
    const allSquads: Squad[] = this.battleState.sides.flatMap((side) =>
      side.armies.flatMap((army) => this.getParticipatingSquads(army))
    );

    // 创建行动队列
    const attackQueue: { time: number; squad: Squad }[] = [];
    allSquads.forEach((squad) => {
      const attackInterval = this.config.battleTimeLimit / squad.attackSpeed;
      for (
        let time = attackInterval;
        time <= this.config.battleTimeLimit;
        time += attackInterval
      ) {
        attackQueue.push({ time, squad });
      }
    });

    // 排序行动队列
    attackQueue.sort((a, b) => a.time - b.time);

    // 执行行动
    attackQueue.forEach(({ squad }) => {
      if (squad.isDead) return;

      // 找出这个小队属于哪一方
      const squadSide = this.battleState.sides.find((side) =>
        side.armies.some((army) => army.squads.includes(squad))
      );

      if (!squadSide) return;

      // 获取敌方所有小队
      const enemySquads = this.battleState.sides
        .filter((side) => side !== squadSide)
        .flatMap((side) =>
          side.armies.flatMap((army) => army.squads.filter((s) => !s.isDead))
        );

      const validTargets = this.selectTargets(
        squad,
        enemySquads,
        squadSide.armies.flatMap((a) => a.squads),
        enemySquads
      );

      const targetSquad = this.selectTargetByWeight(validTargets);
      if (targetSquad) {
        this.executeSquadBattle(squad, targetSquad);
      }

      // 更新所有小队的目标列表
      allSquads.forEach((s) => {
        if (s.targetIds) {
          s.targetIds = s.targetIds.filter((targetId) =>
            allSquads.some((target) => target.id === targetId && !target.isDead)
          );
        }
      });
    });
  }

  // 执行单个战团的战斗
  private executeBattleGroup(group: BattleGroup): void {
    // 创建行动队列
    const attackQueue: { time: number; squad: Squad; army: Army }[] = [];

    // 将所有小队添加到行动队列
    [...group.side1Armies, ...group.side2Armies].forEach((army) => {
      this.getParticipatingSquads(army).forEach((squad) => {
        const attackInterval = this.config.battleTimeLimit / squad.attackSpeed;
        for (
          let time = attackInterval;
          time <= this.config.battleTimeLimit;
          time += attackInterval
        ) {
          attackQueue.push({ time, squad, army });
        }
      });
    });

    // 按时间排序行动队列
    attackQueue.sort((a, b) => a.time - b.time);

    // 执行行动队列
    attackQueue.forEach(({ squad, army }) => {
      // 检查小队是否还存活
      if (squad.isDead) return;

      // 确定目标方的军队
      const targetArmies = group.side1Armies.includes(army)
        ? group.side2Armies
        : group.side1Armies;

      // 获取所有可用的目标小队
      const validTargets = targetArmies.flatMap((targetArmy) =>
        this.getParticipatingSquads(targetArmy)
      );

      if (validTargets.length === 0) return;

      // 选择目标并执行攻击
      const targetSquad = this.getRandomTarget(validTargets);
      if (targetSquad) {
        this.handleSquadAttack(squad, targetSquad, group);
      }
    });

    // 检查战斗组是否结束
    const side1Alive = group.side1Armies.some(
      (army) => this.getParticipatingSquads(army).length > 0
    );
    const side2Alive = group.side2Armies.some(
      (army) => this.getParticipatingSquads(army).length > 0
    );

    if (!side1Alive || !side2Alive) {
      group.battleState.isOver = true;
    }
  }

  // 检查战役是否结束
  private checkCampaignEnd(): boolean {
    const [side1, side2] = this.battleState.sides;

    // 检查是否有一方所有部队都被消灭
    const side1Defeated =
      side1.armies.length === 0 && side1.reserveArmies.length === 0;
    const side2Defeated =
      side2.armies.length === 0 && side2.reserveArmies.length === 0;

    // 移除已被消灭的部队
    side1.armies = side1.armies.filter((army) => army.squads.length > 0);
    side2.armies = side2.armies.filter((army) => army.squads.length > 0);

    return (
      side1Defeated ||
      side2Defeated ||
      this.battleState.round >= this.config.maxRounds
    );
  }

  // 执行一轮战役
  private executeRound(): void {
    // 1. 准备战场，补充部队
    this.prepareBattlefield();

    // 2. 匹配战团
    this.matchBattleGroups();

    // 3. 执行所有战团的战斗
    this.battleState.battleGroups.forEach((group) => {
      if (!group.battleState.isOver) {
        this.executeBattleGroup(group);
      }
    });

    // 4. 更新轮次
    this.battleState.round += 1;

    // 5. 检查战役是否结束
    this.battleState.isBattleOver = this.checkCampaignEnd();
  }

  // 开始战役
  public startCampaign(): void {
    // 初始补充部队
    this.prepareBattlefield();

    while (!this.battleState.isBattleOver) {
      console.log(`Round ${this.battleState.round + 1} starting...`);

      // 匹配战团
      this.matchBattleGroups();

      // 执行所有战团的战斗
      this.battleState.battleGroups.forEach((group) => {
        if (!group.battleState.isOver) {
          this.executeBattleGroup(group);
        }
      });

      // 检查是否需要补充部队
      this.addReserveTroops();

      // 更新轮次
      this.battleState.round += 1;

      // 检查战役是否结束
      this.battleState.isBattleOver = this.checkCampaignEnd();
    }

    // 输出战役结果
    const [side1, side2] = this.battleState.sides;
    if (this.battleState.round >= this.config.maxRounds) {
      console.log(
        `Campaign ended due to reaching maximum rounds (${this.config.maxRounds})`
      );
    } else {
      const side1Defeated =
        side1.armies.length === 0 && side1.reserveArmies.length === 0;
      const side2Defeated =
        side2.armies.length === 0 && side2.reserveArmies.length === 0;

      if (side1Defeated) {
        console.log(
          `${side2.name} (${side2.isPlayerSide ? 'Player' : 'Enemy'}) wins!`
        );
      } else if (side2Defeated) {
        console.log(
          `${side1.name} (${side1.isPlayerSide ? 'Player' : 'Enemy'}) wins!`
        );
      }
    }
  }

  // 准备战场部队
  private prepareBattlefield(): void {
    this.battleState.sides.forEach((side) => {
      // 如果上场部队不足，从后备补充
      while (
        side.armies.length < this.config.battlefieldWidth &&
        side.reserveArmies.length > 0
      ) {
        const army = side.reserveArmies.shift();
        if (army) side.armies.push(army);
      }
    });
  }

  // 创建新的战团
  private createBattleGroup(
    side1Armies: Army[],
    side2Armies: Army[]
  ): BattleGroup {
    return {
      id: generateId(),
      side1Armies,
      side2Armies,
      battleState: {
        timeElapsed: 0,
        isOver: false,
      },
    };
  }

  // 匹配战团
  private matchBattleGroups(): void {
    const [side1, side2] = this.battleState.sides;
    const unassignedArmies1 = [...side1.armies];
    const unassignedArmies2 = [...side2.armies];

    // 清除已结束的战团
    this.battleState.battleGroups = this.battleState.battleGroups.filter(
      (group) => !group.battleState.isOver
    );

    // 为未分配的部队创建新战团
    while (unassignedArmies1.length > 0 && unassignedArmies2.length > 0) {
      const ratio = Math.max(
        Math.ceil(unassignedArmies1.length / unassignedArmies2.length),
        Math.ceil(unassignedArmies2.length / unassignedArmies1.length)
      );

      const armies1 = unassignedArmies1.splice(0, ratio);
      const armies2 = unassignedArmies2.splice(0, ratio);

      this.battleState.battleGroups.push(
        this.createBattleGroup(armies1, armies2)
      );
    }
  }

  // 获取小队的主要攻击距离
  private getSquadAttackRange(squad: Squad): number {
    // 统计不同攻击距离的队员数量
    const rangeCount = new Map<number, number>();

    squad.members.forEach((member) => {
      const range = member.getAttackRange();
      rangeCount.set(range, (rangeCount.get(range) || 0) + 1);
    });

    // 按数量降序排列
    const sortedRanges = Array.from(rangeCount.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    return sortedRanges[0][0]; // 返回数量最多的攻击距离
  }

  // 计算实际战斗距离
  private calculateBattleDistance(
    attackerSquad: Squad,
    targetSquad: Squad,
    side1Squads: Squad[],
    side2Squads: Squad[]
  ): number {
    const getEffectiveRank = (
      position: SquadPosition,
      squads: Squad[]
    ): number => {
      const hasSquadInRank = (pos: SquadPosition) =>
        squads.some((s) => !s.isDead && s.position === pos);

      if (position === SquadPosition.BACK) {
        if (hasSquadInRank(SquadPosition.FRONT)) {
          if (hasSquadInRank(SquadPosition.MIDDLE)) {
            return 3;
          }
          return 2;
        }
        if (hasSquadInRank(SquadPosition.MIDDLE)) {
          return 2;
        }
        return 1;
      }

      if (position === SquadPosition.MIDDLE) {
        if (hasSquadInRank(SquadPosition.FRONT)) {
          return 2;
        }
        return 1;
      }

      return 1; // FRONT position always returns 1
    };

    const attackerRank = getEffectiveRank(
      attackerSquad.position,
      side1Squads.includes(attackerSquad) ? side1Squads : side2Squads
    );
    const targetRank = getEffectiveRank(
      targetSquad.position,
      side1Squads.includes(targetSquad) ? side1Squads : side2Squads
    );

    return Math.abs(attackerRank - targetRank) + 1;
  }

  // 选择可攻击目标
  private selectTargets(
    attackerSquad: Squad,
    enemySquads: Squad[],
    allySquads: Squad[],
    allEnemySquads: Squad[]
  ): Squad[] {
    // 如果已有目标且目标仍然存活，优先攻击已有目标
    const existingTargets = attackerSquad.targetIds
      .map((id) => allEnemySquads.find((squad) => squad.id === id))
      .filter((squad): squad is Squad => squad !== undefined && !squad.isDead);

    if (existingTargets.length > 0) {
      return existingTargets;
    }

    // 根据位置筛选可攻击的目标
    const validTargets = enemySquads.filter((targetSquad) => {
      // 计算攻击距离
      const distance = this.calculateAttackDistance(attackerSquad, targetSquad);

      // 获取攻击范围
      const maxRange = Math.max(
        ...attackerSquad.members.map((unit) =>
          this.getAttackRange(unit.getCharacter().attackMethod)
        )
      );

      return distance <= maxRange;
    });

    if (validTargets.length === 0) {
      return [];
    }

    // 计算目标权重
    const targetWeights = validTargets.map((target) => {
      let weight = 1.0;

      // 距离权重
      const distance = this.calculateAttackDistance(attackerSquad, target);
      weight *= 1 - distance * 0.2;

      // 位置权重
      weight *=
        this.config.positionWeight[this.getPositionKey(target.position)];

      // 剩余生命值权重
      const remainingHpRatio =
        target.members.length / target.members[0].getCharacter().maxHp;
      weight *= (1 - remainingHpRatio) * 0.5 + 0.5;

      // 威胁度权重（攻击力）
      const avgAttack =
        target.members.reduce(
          (sum, unit) => sum + unit.getCharacter().strength,
          0
        ) / target.members.length;
      weight *= avgAttack * 0.01 + 0.9;

      return { target, weight };
    });

    // 按权重排序
    targetWeights.sort((a, b) => b.weight - a.weight);

    // 返回权重最高的目标
    const selectedTarget = targetWeights[0].target;
    attackerSquad.targetIds = [selectedTarget.id];

    return [selectedTarget];
  }

  // 根据位置权重选择目标
  private selectTargetByWeight(validTargets: Squad[]): Squad | null {
    if (validTargets.length === 0) return null;

    const weights = validTargets.map((target) => {
      switch (target.position) {
        case SquadPosition.FRONT:
          return this.config.positionWeight.front;
        case SquadPosition.MIDDLE:
          return this.config.positionWeight.middle;
        case SquadPosition.BACK:
          return this.config.positionWeight.back;
        default:
          return 0;
      }
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i += 1) {
      random -= weights[i];
      if (random <= 0) {
        return validTargets[i];
      }
    }

    return validTargets[0];
  }

  // 执行小队战斗
  private executeSquadBattle(attackerSquad: Squad, targetSquad: Squad): void {
    // 按速度排序队员
    const sortedAttackers = [...attackerSquad.members].sort(
      (a, b) => b.attackSpeed - a.attackSpeed
    );

    // 记录每个目标被攻击次数
    const targetAttackCount = new Map<string, number>();
    targetSquad.members.forEach((member) => {
      targetAttackCount.set(member.getCharacter().id, 0);
    });

    // 执行攻击
    sortedAttackers.forEach((attacker) => {
      if (targetSquad.members.length === 0) return;

      // 选择被攻击最少的目标
      const target = [...targetSquad.members].sort((a, b) => {
        const countA = targetAttackCount.get(a.getCharacter().id) || 0;
        const countB = targetAttackCount.get(b.getCharacter().id) || 0;
        return countA - countB;
      })[0];

      this.handleTeamMemberAttack(attacker, target);
      targetAttackCount.set(
        target.getCharacter().id,
        (targetAttackCount.get(target.getCharacter().id) || 0) + 1
      );

      // 移除死亡目标
      targetSquad.members = targetSquad.members.filter(
        (member) => !member.isDead
      );
      if (targetSquad.members.length === 0) {
        targetSquad.isDead = true;
      }
    });
  }

  // 执行战役的一个步骤
  public executeNextStep():
    | 'match'
    | 'nonPlayerBattles'
    | 'playerBattle'
    | 'complete' {
    if (!this.battleMatched) {
      this.prepareBattlefield();
      this.matchBattleGroups();
      this.playerBattleGroupId = this.findPlayerBattleGroup()?.id || null;
      this.battleMatched = true;
      return 'match';
    }

    if (!this.nonPlayerBattlesExecuted) {
      this.executeNonPlayerBattles();
      this.nonPlayerBattlesExecuted = true;
      return 'nonPlayerBattles';
    }

    if (!this.playerBattleExecuted && this.playerBattleGroupId) {
      this.executePlayerBattle();
      this.playerBattleExecuted = true;
      return 'playerBattle';
    }

    this.finishRound();
    return 'complete';
  }

  private findPlayerBattleGroup(): BattleGroup | null {
    if (!this.playerBattleGroupId) return null;

    return (
      this.battleState.battleGroups.find((group) =>
        [...group.side1Armies, ...group.side2Armies].some(
          (army) => army.id === this.playerBattleGroupId
        )
      ) || null
    );
  }

  private executeNonPlayerBattles(): void {
    this.battleState.battleGroups.forEach((group) => {
      if (group.id !== this.playerBattleGroupId && !group.battleState.isOver) {
        const result = this.executeBattleGroupWithLogs(group);
        this.currentBattleGroupResults.set(group.id, result);
      }
    });
  }

  private executePlayerBattle(): void {
    const playerGroup = this.findPlayerBattleGroup();
    if (!playerGroup) return;

    // 记录战斗前的人数
    const side1UnitsBefore = this.countTotalUnits(playerGroup.side1Armies);
    const side2UnitsBefore = this.countTotalUnits(playerGroup.side2Armies);

    // 执行战斗
    this.executeBattleGroup(playerGroup);

    // 记录战斗结果
    const result: BattleGroupResult = {
      groupId: playerGroup.id,
      side1Casualties:
        side1UnitsBefore - this.countTotalUnits(playerGroup.side1Armies),
      side2Casualties:
        side2UnitsBefore - this.countTotalUnits(playerGroup.side2Armies),
      combatLogs: [], // 战斗日志会在 executeBattleGroup 过程中通过 recordBattleResult 方法记录
      isPlayerInvolved: true,
      rounds: [],
    };

    // 设置战斗结果
    this.currentBattleGroupResults.set(playerGroup.id, result);

    // 更新战团状态
    playerGroup.battleState.isOver = true;
  }

  private executeBattleGroupWithLogs(group: BattleGroup): BattleGroupResult {
    const result: BattleGroupResult = {
      groupId: group.id,
      side1Casualties: 0,
      side2Casualties: 0,
      combatLogs: [],
      isPlayerInvolved: this.isPlayerBattleGroup(group),
      rounds: [] as BattleRound[],
    };

    // 记录战斗前的人数
    const side1UnitsBefore = this.countTotalUnits(group.side1Armies);
    const side2UnitsBefore = this.countTotalUnits(group.side2Armies);

    // 执行战斗并记录日志
    this.executeBattleGroup(group);

    // 计算伤亡
    result.side1Casualties =
      side1UnitsBefore - this.countTotalUnits(group.side1Armies);
    result.side2Casualties =
      side2UnitsBefore - this.countTotalUnits(group.side2Armies);

    return result;
  }

  private countTotalUnits(armies: Army[]): number {
    return armies.reduce(
      (total, army) =>
        total +
        army.squads.reduce(
          (squadTotal, squad) => squadTotal + squad.members.length,
          0
        ),
      0
    );
  }

  // 获取当前回合的战斗结果
  public getCurrentBattleResults(): Map<string, BattleGroupResult> {
    return this.currentBattleGroupResults;
  }

  private finishRound(): void {
    this.battleState.round += 1;
    this.battleState.isBattleOver = this.checkCampaignEnd();
    this.currentBattleGroupResults.clear();
    this.battleMatched = false;
    this.nonPlayerBattlesExecuted = false;
    this.playerBattleExecuted = false;
    this.playerBattleGroupId = null;
  }

  // 获取当前状态
  public getBattleStatus(): {
    battleMatched: boolean;
    nonPlayerBattlesExecuted: boolean;
    playerBattleExecuted: boolean;
  } {
    return {
      battleMatched: this.battleMatched,
      nonPlayerBattlesExecuted: this.nonPlayerBattlesExecuted,
      playerBattleExecuted: this.playerBattleExecuted,
    };
  }

  // 获取战斗状态
  public getBattleState(): BattleState {
    return this.battleState;
  }

  // 获取玩家军队ID
  public getPlayerArmyId(): string | null {
    return this.playerBattleGroupId;
  }

  public getWinningStatus(): { winner: BattleSide | null; isDraw: boolean } {
    const aliveSides = this.battleState.sides.filter((side) =>
      side.armies.some((army) => army.squads.some((squad) => !squad.isDead))
    );

    return {
      winner: aliveSides.length === 1 ? aliveSides[0] : null,
      isDraw: aliveSides.length === 0,
    };
  }

  // 获取活跃的战斗组
  public getActiveBattleGroups(): BattleGroup[] {
    return this.battleState.battleGroups.filter(
      (group) => !group.battleState.isOver
    );
  }

  // 获取玩家方
  public getPlayerSide(): BattleSide | undefined {
    return this.battleState.sides.find((side) => side.isPlayerSide);
  }

  // 判断是否为玩家军队
  public isPlayerArmy(army: Army): boolean {
    const playerSide = this.getPlayerSide();
    return playerSide?.armies.includes(army) || false;
  }

  // 判断是否为玩家战斗组
  public isPlayerBattleGroup(group: BattleGroup): boolean {
    const playerSide = this.getPlayerSide();
    if (!playerSide) return false;

    return (
      group.side1Armies.some((army) => playerSide.armies.includes(army)) ||
      group.side2Armies.some((army) => playerSide.armies.includes(army))
    );
  }

  // 获取所有战斗组
  public getBattleGroups(): BattleGroup[] {
    return this.battleState.battleGroups;
  }

  // 获取所有阵营
  public getSides(): BattleSide[] {
    return this.battleState.sides;
  }

  // 获取当前回合数
  public getRound(): number {
    return this.battleState.round;
  }

  // 获取战斗是否结束
  public isBattleOver(): boolean {
    return this.battleState.isBattleOver;
  }

  // 记录战斗结果
  private recordBattleResult(
    group: BattleGroup,
    attackerSquad: Squad,
    targetSquad: Squad,
    damage: number,
    isCritical: boolean
  ): void {
    const result = this.currentBattleGroupResults.get(group.id) || {
      groupId: group.id,
      side1Casualties: 0,
      side2Casualties: 0,
      combatLogs: [],
      isPlayerInvolved: this.isPlayerBattleGroup(group),
      rounds: [] as BattleRound[],
    };

    // 获取当前回合的战斗记录
    let currentRound = result.rounds.find(
      (r) => r.round === this.battleState.round
    );
    if (!currentRound) {
      currentRound = {
        round: this.battleState.round,
        actions: [],
      };
      result.rounds.push(currentRound);
    }

    // 记录战斗行动
    currentRound.actions.push({
      attackerSquadId: attackerSquad.id,
      targetSquadId: targetSquad.id,
      damage,
      isCritical,
      targetDestroyed: targetSquad.isDead,
    });

    this.currentBattleGroupResults.set(group.id, result);
  }

  // 获取指定战斗组的战斗结果
  public getBattleGroupResult(groupId: string): BattleGroupResult | undefined {
    return this.currentBattleGroupResults.get(groupId);
  }

  // 获取所有战斗结果
  public getAllBattleResults(): Map<string, BattleGroupResult> {
    return this.currentBattleGroupResults;
  }

  private getPositionKey(position: SquadPosition): 'front' | 'middle' | 'back' {
    switch (position) {
      case SquadPosition.FRONT:
        return 'front';
      case SquadPosition.MIDDLE:
        return 'middle';
      case SquadPosition.BACK:
        return 'back';
      default:
        return 'front';
    }
  }
}
