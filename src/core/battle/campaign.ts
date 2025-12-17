/* eslint-disable no-continue */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { reactive } from 'vue';
import { IArmy, BattleGroup, ISquad } from '../interfaces/combat';
import { BattleConfig, ICombatUnit } from '../interfaces';
import { generateId } from '../utils/utils';
import { ActionScheduler } from './actionScheduler';
import { BattleUtils } from './battleUtils';
import { IRefactoredCampaign } from './IRefactoredCampaign';
import { BattleState } from './battleState';
import { BattleStateHandler } from './battleStateHandler';
import { energySetting } from '../setting/param-combat';

type BattleStatistic = {
  name: string;
  damage: number;
  receive: number;
  attack: number;
  defense: number;
};

type BattleLog = {
  statistics: Map<string, BattleStatistic>;
  message: string[];
};

function useBattleLog(playerSquads: ISquad[]) {
  const membersId = playerSquads
    .flatMap((squad) => squad.members)
    .map((member) => member.getCharacter().id);
  const logs: BattleLog = {
    statistics: new Map<string, BattleStatistic>(),
    message: [],
  };

  const record = (
    attackUnit: ICombatUnit,
    targetUnit: ICombatUnit,
    damage: number,
    counterDamage: number
  ) => {
    const logCharacter = membersId.includes(attackUnit.getCharacter().id)
      ? attackUnit.getCharacter()
      : targetUnit.getCharacter();
    const type = membersId.includes(attackUnit.getCharacter().id)
      ? 'attack'
      : 'defend';
    const stac = logs.statistics.get(logCharacter.id) ?? {
      name: logCharacter.name,
      damage: 0,
      receive: 0,
      attack: 0,
      defense: 0,
    };
    if (type === 'attack') {
      stac.damage += damage;
      stac.receive += counterDamage;
      stac.attack += 1;
    } else {
      stac.damage += counterDamage;
      stac.receive += damage;
      stac.defense += 1;
    }
    logs.statistics.set(logCharacter.id, stac);
  };

  return { record, logs };
}

// 定义一个异步函数
async function waitForMilliseconds(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export class Campaign implements IRefactoredCampaign {
  private config: BattleConfig;

  private side1Armies: IArmy[];

  private side2Armies: IArmy[];

  private playerArmy: IArmy | null;

  // 保存最终匹配出的战团
  public battleGroups = reactive<BattleGroup[]>([]);

  private isPlayerOnSide1: boolean;

  private battleStateHandler: BattleStateHandler;

  private record: (
    attackUnit: ICombatUnit,
    targetUnit: ICombatUnit,
    damage: number,
    counterDamage: number
  ) => void;

  private logs: BattleLog;

  constructor(
    config: BattleConfig,
    side1Armies: IArmy[],
    side2Armies: IArmy[],
    playerArmy: IArmy | null,
    isPlayerOnSide1: boolean = true
  ) {
    this.config = config;
    this.playerArmy = playerArmy;
    this.isPlayerOnSide1 = isPlayerOnSide1;
    if (playerArmy) {
      if (isPlayerOnSide1) {
        this.side1Armies = reactive([playerArmy, ...side1Armies]);
        this.side2Armies = reactive(side2Armies);
      } else {
        this.side1Armies = reactive(side1Armies);
        this.side2Armies = reactive([playerArmy, ...side2Armies]);
      }
    } else {
      this.side1Armies = reactive(side1Armies);
      this.side2Armies = reactive(side2Armies);
    }
    this.battleStateHandler = new BattleStateHandler(
      this.config,
      this.side1Armies,
      this.side2Armies,
      this.isPlayerOnSide1
    );
    const { record, logs } = useBattleLog(this.playerArmy?.squads ?? []);
    this.record = record;
    this.logs = logs;
  }

  // 根据部队数和战场上限，将上场部队与后备部队分配出来
  public assignActiveAndReserveArmies(armyLimit: number): {
    active: IArmy[];
    reserve: IArmy[];
  }[] {
    const assignForSide = (armies: IArmy[]) => {
      return {
        active: armies.slice(0, armyLimit),
        reserve: armies.slice(armyLimit),
      };
    };

    return [assignForSide(this.side1Armies), assignForSide(this.side2Armies)];
  }

  // 匹配双方上场部队组成战团
  public matchBattleGroups(
    activeSide1: IArmy[],
    activeSide2: IArmy[]
  ): BattleGroup[] {
    // 目前先采用简单的1对1匹配，后续再根据各部队的正面宽度比例调整实现1对多情况
    const groups: BattleGroup[] = [];
    const side1 = activeSide1.slice();
    const side2 = activeSide2.slice();

    while (side1.length && side2.length) {
      const army1 = side1.shift()!;
      const army2 = side2.shift()!;
      groups.push({
        id: generateId(),
        side1Armies: [army1],
        side2Armies: [army2],
        battleState: { timeElapsed: 0, isOver: false },
      });
    }

    // 如有剩余的部队，则依次加入到战团中
    if (groups.length > 0) {
      while (side1.length) {
        for (let i = 0; i < groups.length && side1.length > 0; i += 1) {
          groups[i].side1Armies.push(side1.shift()!);
        }
      }
      while (side2.length) {
        for (let i = 0; i < groups.length && side2.length > 0; i += 1) {
          groups[i].side2Armies.push(side2.shift()!);
        }
      }
    }
    return groups;
  }

  // 战斗执行方法：采用行动调度器模拟各单位按照攻击速度行动，
  // 并在战斗过程中根据伤亡情况动态调整战团，同时判断后备部队是否可以上场
  public async executeBattle(): Promise<{
    winner: 'side1' | 'side2' | 'none';
    duration: number;
  }> {
    const assignments = this.assignActiveAndReserveArmies(
      this.getBattleConfig().battlefieldWidth
    );
    const side1Assign = assignments[0];
    const side2Assign = assignments[1];
    // 使用分配出的上场部队匹配战团
    if (side1Assign.active.length > 0 && side2Assign.active.length > 0) {
      if (side1Assign.active.length / side2Assign.active.length > 6) {
        side1Assign.reserve.push(
          ...side1Assign.active.splice(side2Assign.active.length * 6 - 1)
        );
      } else if (side2Assign.active.length / side1Assign.active.length > 6) {
        side2Assign.reserve.push(
          ...side2Assign.active.splice(side1Assign.active.length * 6 - 1)
        );
      }
    }
    this.battleGroups.splice(
      0,
      this.battleGroups.length,
      ...this.matchBattleGroups(side1Assign.active, side2Assign.active).map(
        (group) => reactive(group)
      )
    );
    const scheduler = new ActionScheduler(this.config.standardInterval);
    // 初始化所有上场部队
    const allArmies = this.battleGroups.flatMap((group) => [
      ...group.side1Armies,
      ...group.side2Armies,
    ]);
    scheduler.initialize(allArmies);
    let simulationTime = 0;

    while (
      scheduler.hasNext() &&
      simulationTime < this.config.battleTimeLimit &&
      !this.isBattleOver()
    ) {
      if (this.getBattleConfig().interval) {
        // eslint-disable-next-line no-await-in-loop
        await waitForMilliseconds(this.getBattleConfig().interval);
      }
      const action = scheduler.nextAction();
      if (!action) break;
      action.unit.recoverEnergy();
      simulationTime = action.time;
      // 查找该单位所属的战团
      const group = this.battleGroups.find(
        (g) =>
          g.side1Armies.includes(action.army) ||
          g.side2Armies.includes(action.army)
      );
      if (!group) continue;

      // 根据所属阵营确定敌方部队
      let targetArmies: IArmy[] = [];
      if (group.side1Armies.includes(action.army)) {
        targetArmies = group.side2Armies;
      } else {
        targetArmies = group.side1Armies;
      }

      // 攻击者攻击范围
      const attackRange = action.unit.getAttackRange();

      // 使用 BattleUtils.selectTargetWithinRange 筛选出攻击范围内的目标队员，并直接进行攻击
      const targetInfo = BattleUtils.selectTargetWithinRange(
        action.army,
        action.squad,
        targetArmies,
        attackRange
      );
      if (targetInfo) {
        this.executeUnitAttack(
          action.unit,
          targetInfo.unit,
          targetInfo.distance
        );
      }

      // 判断战团是否结束，如果结束则进行重新匹配
      const isGroupOver = this.handleBattleGroupVictory(group);
      if (isGroupOver) {
        // 如果战团结束，则重新匹配战团
        this.tryPromoteReserveArmies(side1Assign, side2Assign);
      }

      // 如果攻击者仍存活，则重新安排下次行动
      if (!action.unit.isDead) {
        scheduler.reschedule(action);
      }
    }
    this.battleStateHandler.getBattleState().isOver = true;
    console.log('schedule', scheduler);
    console.log('Battle execution complete, simulation time:', simulationTime);

    // 判断side1和side2的部队剩下的人数
    const side1Remaining = this.side1Armies
      .flatMap((army) => army.squads)
      .flatMap((squad) => squad.members)
      .filter((unit) => !unit.isDead).length;
    const side2Remaining = this.side2Armies
      .flatMap((army) => army.squads)
      .flatMap((squad) => squad.members)
      .filter((unit) => !unit.isDead).length;

    this.logs.statistics.forEach((obj) => {
      console.log(
        `| ${obj.name} | ${obj.damage} | ${obj.attack} | ${obj.receive} | ${obj.defense} |`
      );
    });
    if (side1Remaining > side2Remaining) {
      return { winner: 'side1', duration: simulationTime };
    }
    if (side2Remaining > side1Remaining) {
      return { winner: 'side2', duration: simulationTime };
    }
    return { winner: 'none', duration: simulationTime };
  }

  // 判定双方是否均有存活单位
  private isBattleOver(): boolean {
    let side1Alive = false;
    let side2Alive = false;
    for (let i = 0; i < this.battleGroups.length; i += 1) {
      const group = this.battleGroups[i];
      const side1Units = group.side1Armies
        .flatMap((army) => army.squads)
        .flatMap((squad) => squad.members)
        .filter((unit) => !unit.isDead);
      const side2Units = group.side2Armies
        .flatMap((army) => army.squads)
        .flatMap((squad) => squad.members)
        .filter((unit) => !unit.isDead);
      if (side1Units.length > 0) side1Alive = true;
      if (side2Units.length > 0) side2Alive = true;
    }
    return !(side1Alive && side2Alive);
  }

  /**
   * 攻击结算逻辑，与 campaign 中 executeUnitAttack 类似
   * 这里统一固定攻击距离为1
   */
  private executeUnitAttack(
    attacker: ICombatUnit,
    target: ICombatUnit,
    distance: number
  ): void {
    if (!attacker.testEnergy(energySetting.attackConsume)) {
      this.record(attacker, target, 0, 0);
      return;
    }
    attacker.consumeEnergy(energySetting.attackConsume);
    let attackerDamage = attacker.physicalAttack;
    const hit = Math.random();
    let attackState: 'normal' | 'miss' | 'parry' | 'block' | 'critical' =
      'normal';
    const attackInfo: string[] = [
      `${attacker.getCharacter().name} attacked ${target.getCharacter().name}`,
    ];

    // 判断命中与闪避
    attacker.addWeaponProficiencyExperience(1);
    const parry = Math.random();
    const block = Math.random();
    const critical = Math.random();
    if (
      hit > Math.max(0.05, attacker.hitRate - target.dodgeRate) &&
      target.testEnergy(energySetting.dodgeConsume)
    ) {
      attackerDamage = 0;
      attackInfo.push('miss');
      attackState = 'miss';
      target.consumeEnergy(energySetting.dodgeConsume);
    } else if (
      parry < target.parryRate - attacker.penetrate &&
      target.testEnergy(energySetting.parryConsume)
    ) {
      attackerDamage = 0;
      attackInfo.push(`parry(rate:${target.parryRate})`);
      attackState = 'parry';
      target.addWeaponProficiencyExperience(1);
      target.consumeEnergy(energySetting.parryConsume);
    } else if (
      block < target.blockRate - attacker.penetrate &&
      target.testEnergy(energySetting.blockConsume)
    ) {
      attackerDamage = Math.max(0, attackerDamage - target.blockValue);
      attackInfo.push(`block(${target.blockValue},rate:${target.blockRate})`);
      attackState = 'block';
      target.addShieldProficiencyExperience(1);
      target.consumeEnergy(energySetting.blockConsume);
    } else if (critical < attacker.criticalRate) {
      attackerDamage *= attacker.criticalDamage;
      attackInfo.push('critical');
      attackState = 'critical';
      attacker.addWeaponProficiencyExperience(1);
      target.consumeEnergy(energySetting.criticalConsume);
    } else {
      target.consumeEnergy(energySetting.beHitConsume);
    }
    target.takeDamage(attackerDamage);
    attackInfo.push(
      `damage: ${attackerDamage}(${target.currentHealth}/${target.maxHealth})`
    );
    if (attackerDamage > 0) {
      attacker.addExperience(1);
    }
    // 如果目标存活且距离满足，反击能量足够，则执行反击
    if (
      !target.isDead &&
      target.getAttackRange() >= distance &&
      target.testEnergy(energySetting.counterConsume)
    ) {
      target.consumeEnergy(energySetting.counterConsume);
      attackInfo.push(
        `${target.getCharacter().name} counterattacked ${
          attacker.getCharacter().name
        }`
      );
      let counterDamage = 0;
      if (attackState === 'miss') {
        counterDamage = target.physicalAttack;
      } else if (attackState === 'parry' || attackState === 'block') {
        counterDamage = target.physicalAttack * 0.5;
      } else if (attackState === 'normal') {
        counterDamage = target.physicalAttack * 0.1;
      } else if (attackState === 'critical') {
        counterDamage = 0;
      }
      target.addWeaponProficiencyExperience(1);
      const counterHit = Math.random();
      const countParry = Math.random();
      const countBlock = Math.random();
      if (
        counterHit > Math.max(0.05, target.hitRate - attacker.dodgeRate) &&
        attacker.testEnergy(energySetting.counterDodgeConsume)
      ) {
        attackInfo.push('counter miss');
        counterDamage = 0;
        attacker.consumeEnergy(energySetting.counterDodgeConsume);
      } else if (
        countParry < attacker.parryRate - target.penetrate &&
        attacker.testEnergy(energySetting.counterParryConsume)
      ) {
        counterDamage = 0;
        attackInfo.push(`counter parry(rate:${attacker.parryRate})`);
        attacker.addWeaponProficiencyExperience(1);
        attacker.consumeEnergy(energySetting.counterParryConsume);
      } else if (
        countBlock < attacker.blockRate - target.penetrate &&
        attacker.testEnergy(energySetting.counterBlockConsume)
      ) {
        counterDamage = Math.max(0, counterDamage - attacker.blockValue);
        attackInfo.push(
          `counter block(${attacker.blockValue},rate:${attacker.blockRate})`
        );
        attacker.addShieldProficiencyExperience(1);
        attacker.consumeEnergy(energySetting.counterBlockConsume);
      } else {
        attacker.consumeEnergy(energySetting.counterBeHitConsume);
      }
      attacker.takeDamage(counterDamage);
      attackInfo.push(
        `counter damage: ${counterDamage}(${attacker.currentHealth}/${attacker.maxHealth})`
      );
      this.record(attacker, target, attackerDamage, counterDamage);
      if (counterDamage > 0) {
        target.addExperience(1);
      }
      this.logs.message.push(attackInfo.join(' | '));
    } else {
      this.record(attacker, target, attackerDamage, 0);
      this.logs.message.push(attackInfo.join(' | '));
    }
  }

  // 检查后备部队是否达到上场条件，若满足则重新匹配战团
  /**
   * 重构后的 tryPromoteReserveArmies 方法：
   * 1. 根据战场限制（battlefieldWidth）将全部部队划分为 active 和 reserve 部队，并过滤掉全部阵亡的部队。
   * 2. 计算哪些 active 部队尚未进入战团（即新晋补充的部队），
   *    同时如果 active 部队数量不足，则从 reserve 队列中继续晋升。
   * 3. 对新晋部队调用 integrateArmyIntoBattleGroup，将它们按照与 reassignVictoriousArmy 类似的逻辑加入到已有的战团中。
   */
  private tryPromoteReserveArmies(
    side1Assign: { active: IArmy[]; reserve: IArmy[] },
    side2Assign: { active: IArmy[]; reserve: IArmy[] }
  ) {
    // 过滤掉没有存活单元的部队
    side1Assign.active = side1Assign.active.filter((army) =>
      this.hasLivingUnits(army)
    );
    side2Assign.active = side2Assign.active.filter((army) =>
      this.hasLivingUnits(army)
    );
    const newSide1Active: IArmy[] = [];
    const newSide2Active: IArmy[] = [];
    // 如果 active 部队不足战场限制，则从 reserve 队列中依次晋升
    while (
      side1Assign.active.length < this.getBattleConfig().battlefieldWidth &&
      side1Assign.reserve.length > 0
    ) {
      newSide1Active.push(side1Assign.active.shift()!);
    }
    while (
      side2Assign.active.length < this.getBattleConfig().battlefieldWidth &&
      side2Assign.reserve.length > 0
    ) {
      newSide2Active.push(side2Assign.reserve.shift()!);
    }

    // 对于每个新晋部队，依次将其加入到已有的战团中（使用与 reassignVictoriousArmy 类似的逻辑）
    newSide1Active.forEach((army) => {
      this.reassignVictoriousArmy(army, 'side1', 'no-group');
    });
    newSide2Active.forEach((army) => {
      this.reassignVictoriousArmy(army, 'side2', 'no-group');
    });

    side1Assign.active = [...side1Assign.active, ...newSide1Active];
    side2Assign.active = [...side2Assign.active, ...newSide2Active];

    if (newSide1Active.length > 0 || newSide2Active.length > 0) {
      console.log(
        'Promoted reserve armies and integrated them into existing battle groups'
      );
    }
  }

  // 辅助方法：判断某个部队中是否有存活的队员
  private hasLivingUnits(army: IArmy): boolean {
    return army.squads.some((squad) =>
      squad.members.some((unit) => !unit.isDead)
    );
  }

  /**
   * 对于获胜部队（部队b），查找其它战团中己方正面宽度劣势最大的战团（记为a），
   * 若a中敌方部队数多余1个，则解散a，与部队b一起重新匹配战团；
   * 如果a中敌方部队数为1，则部队b直接加入a。
   */
  private reassignVictoriousArmy(
    b: IArmy,
    winningSide: 'side1' | 'side2',
    curGroupId: string
  ): void {
    // 过滤掉当前调用中刚结束的战团，其它战团都应该既有我方也有敌方部队
    const candidateGroups = this.battleGroups.filter(
      (group) => group.id !== curGroupId
    );
    if (candidateGroups.length === 0) {
      // 如果没有候选，则创建新的战团
      const newGroup: BattleGroup = {
        id: generateId(),
        side1Armies: winningSide === 'side1' ? [b] : [],
        side2Armies: winningSide === 'side2' ? [b] : [],
        battleState: { timeElapsed: 0, isOver: false },
      };
      this.battleGroups.push(reactive(newGroup));
      return;
    }

    // 在候选的战团中查找“我方部队数量减敌方部队数量”最小的一个
    let selectedGroup = candidateGroups[0];
    let minDifference = this.getSideDifference(selectedGroup, winningSide);
    for (let i = 1; i < candidateGroups.length; i += 1) {
      const diff = this.getSideDifference(candidateGroups[i], winningSide);
      if (diff < minDifference) {
        minDifference = diff;
        selectedGroup = candidateGroups[i];
      }
    }

    // 获取选中战团中的敌方部队数
    const enemyCount =
      winningSide === 'side1'
        ? selectedGroup.side2Armies.length
        : selectedGroup.side1Armies.length;

    if (enemyCount > 1) {
      // 若敌方部队多于1，则拆分该战团，重新匹配（注意保持我方和敌方阵营的顺序）
      const winningArmies =
        winningSide === 'side1'
          ? selectedGroup.side1Armies
          : selectedGroup.side2Armies;
      const enemyArmies =
        winningSide === 'side1'
          ? selectedGroup.side2Armies
          : selectedGroup.side1Armies;
      // 将选中的战团移除
      this.battleGroups.splice(
        this.battleGroups.findIndex((group) => group !== selectedGroup),
        1
      );
      // 合并选中战团中的我方部队与获胜部队 b
      const combinedWinningArmies = [...winningArmies, b];
      // 按matchBattleGroups的逻辑重新匹配战团
      const rematchedGroups =
        winningSide === 'side1'
          ? this.matchBattleGroups(combinedWinningArmies, enemyArmies)
          : this.matchBattleGroups(enemyArmies, combinedWinningArmies);
      // 将新匹配的战团加入战场
      this.battleGroups.push(
        ...rematchedGroups.map((group) => reactive(group))
      );
    } else {
      // 如果敌方部队数量等于1，则直接将 b 加入到选中战团的对应位置
      if (winningSide === 'side1') {
        selectedGroup.side1Armies.push(b);
      }
      selectedGroup.side2Armies.push(b);
    }
  }

  // 辅助方法：计算指定战团中我方部队与敌方部队的数量差值
  // 我们定义“差值”为：我方部队数量减去敌方部队数量
  private getSideDifference(
    group: BattleGroup,
    winningSide: 'side1' | 'side2'
  ): number {
    return winningSide === 'side1'
      ? group.side1Armies.length - group.side2Armies.length
      : group.side2Armies.length - group.side1Armies.length;
  }

  /**
   * 当某战团敌方全部消灭后，对该战团中获胜方的每个部队（部队b）进行处理：
   * 依次查找其它所有战团（记为a）中己方正面宽度劣势最大的战团，
   * 判断a中敌方部队数：若多余1个，则解散a，与部队b重新匹配；若等于1，则部队b直接加入a。
   * 最后，从战场中移除该结束的战团。
   */
  private handleBattleGroupVictory(group: BattleGroup): boolean {
    let winningSide: 'side1' | 'side2' | null = null;
    const side1Alive = group.side1Armies.some((army) =>
      this.hasLivingUnits(army)
    );
    const side2Alive = group.side2Armies.some((army) =>
      this.hasLivingUnits(army)
    );
    if (side1Alive && side2Alive) {
      return false;
    }
    if (side1Alive) winningSide = 'side1';
    else winningSide = 'side2';
    const victoriousArmies =
      winningSide === 'side1' ? group.side1Armies : group.side2Armies;
    for (let i = 0; i < victoriousArmies.length; i += 1) {
      const b = victoriousArmies[i];
      this.reassignVictoriousArmy(b, winningSide, group.id);
    }
    // 移除该已结束的战团
    this.battleGroups.splice(
      0,
      this.battleGroups.length,
      ...this.battleGroups.filter((g) => g !== group)
    );
    return true;
  }

  getBattleConfig(): BattleConfig {
    return this.config;
  }

  getBattleState(): BattleState {
    return this.battleStateHandler.getBattleState();
  }

  getPlayerSide(): IArmy[] {
    return this.playerArmy ? [this.playerArmy] : [];
  }

  getActiveBattleGroups(): BattleGroup[] {
    return this.battleGroups;
  }
}
