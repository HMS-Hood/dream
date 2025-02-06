/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { Player } from './entities/Player';
import { SquadPosition, AttackMethod } from './enums';
import { CharacterInterface } from './interfaces';
import {
  BattleState,
  BattleConfig,
  Army,
  Squad,
  BattleGroup,
} from './interfaces/combat';
import { CombatUnit } from './entities/CombatUnit';
import { generateId } from './utils/utils';

export class Campaign {
  private battleState: BattleState;

  private config: BattleConfig;

  private player: Player;

  constructor(
    config: BattleConfig,
    side1Armies: Army[],
    side2Armies: Army[],
    player: Player,
    isPlayerOnSide1: boolean = true
  ) {
    this.config = config;
    this.player = player;

    this.battleState = {
      sides: [
        {
          id: generateId(),
          name: 'Side 1',
          armies: [], // 当前上场部队
          reserveArmies: side1Armies, // 所有部队初始都在预备队
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
  private handleSquadAttack(attackerSquad: Squad, targetSquad: Squad): void {
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
      this.handleTeamMemberAttack(attacker, target);

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
    const side1Squads = group.side1Armies.flatMap((army) =>
      army.squads.filter((squad) => !squad.isDead)
    );
    const side2Squads = group.side2Armies.flatMap((army) =>
      army.squads.filter((squad) => !squad.isDead)
    );

    if (side1Squads.length === 0 || side2Squads.length === 0) {
      group.battleState.isOver = true;
      return;
    }

    // 创建行动队列
    const actionQueue: { time: number; squad: Squad }[] = [];

    // 添加side1的行动
    side1Squads.forEach((squad) => {
      const actionInterval = this.config.battleTimeLimit / squad.attackSpeed;
      for (
        let time = actionInterval;
        time <= this.config.battleTimeLimit;
        time += actionInterval
      ) {
        actionQueue.push({ time, squad });
      }
    });

    // 添加side2的行动
    side2Squads.forEach((squad) => {
      const actionInterval = this.config.battleTimeLimit / squad.attackSpeed;
      for (
        let time = actionInterval;
        time <= this.config.battleTimeLimit;
        time += actionInterval
      ) {
        actionQueue.push({ time, squad });
      }
    });

    // 按时间排序
    actionQueue.sort((a, b) => a.time - b.time);

    // 执行行动队列
    actionQueue.forEach(({ squad }) => {
      if (squad.isDead) return;

      const isInSide1 = side1Squads.includes(squad);
      const enemySquads = isInSide1 ? side2Squads : side1Squads;

      const validTargets = this.selectTargets(
        squad,
        enemySquads,
        side1Squads,
        side2Squads
      );

      const target = this.getRandomTarget(validTargets);
      if (target) {
        this.handleSquadAttack(squad, target);
      }
    });

    // 更新战团状态
    group.battleState.timeElapsed += this.config.battleTimeLimit;
    group.battleState.isOver = true;

    // 更新军队状态
    [...group.side1Armies, ...group.side2Armies].forEach((army) => {
      army.squads = army.squads.filter((squad) => !squad.isDead);
    });
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
    squad: Squad,
    enemySquads: Squad[],
    side1Squads: Squad[],
    side2Squads: Squad[]
  ): Squad[] {
    const attackRange = this.getSquadAttackRange(squad);
    const validTargets: Squad[] = [];

    enemySquads.forEach((targetSquad) => {
      if (!targetSquad.isDead) {
        const distance = this.calculateBattleDistance(
          squad,
          targetSquad,
          side1Squads,
          side2Squads
        );
        if (distance <= attackRange) {
          validTargets.push(targetSquad);
        }
      }
    });

    return validTargets;
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
}
