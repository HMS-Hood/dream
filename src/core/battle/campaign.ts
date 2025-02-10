/* eslint-disable no-continue */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import { Army, BattleGroup } from '../interfaces/combat';
import { BattleConfig } from '../interfaces';
import { getFrontWidth } from '../utils/armyUtils';
import { generateId } from '../utils/utils';
import { ActionScheduler } from './actionScheduler';
import { BattleUtils } from './battleUtils';
import { AttackMethod } from '../enums';
import { IRefactoredCampaign } from './IRefactoredCampaign';
import { BattleState } from './battleState';
import { BattleStateHandler } from './battleStateHandler';

export class Campaign implements IRefactoredCampaign {
  private config: BattleConfig;

  private side1Armies: Army[];

  private side2Armies: Army[];

  private playerArmy: Army | null;

  // 保存最终匹配出的战团
  private battleGroups: BattleGroup[] = [];

  private isPlayerOnSide1: boolean;

  private battleStateHandler: BattleStateHandler;

  constructor(
    config: BattleConfig,
    side1Armies: Army[],
    side2Armies: Army[],
    playerArmy: Army | null,
    isPlayerOnSide1: boolean = true
  ) {
    this.config = config;
    this.playerArmy = playerArmy;
    this.isPlayerOnSide1 = isPlayerOnSide1;
    if (playerArmy) {
      if (isPlayerOnSide1) {
        this.side1Armies = [playerArmy, ...side1Armies];
        this.side2Armies = side2Armies;
      } else {
        this.side1Armies = side1Armies;
        this.side2Armies = [playerArmy, ...side2Armies];
      }
    } else {
      this.side1Armies = side1Armies;
      this.side2Armies = side2Armies;
    }
    this.battleStateHandler = new BattleStateHandler(
      this.config,
      this.side1Armies,
      this.side2Armies,
      this.isPlayerOnSide1
    );
  }

  // 根据部队正面宽度和战场上限，将上场部队与后备部队分配出来
  public assignActiveAndReserveArmies(maxFrontWidth: number): {
    active: Army[];
    reserve: Army[];
  }[] {
    const assignForSide = (armies: Army[]) => {
      const sorted = armies
        .slice()
        .sort((a, b) => getFrontWidth(b) - getFrontWidth(a));
      const active: Army[] = [];
      const reserve: Army[] = [];
      let totalFrontWidth = 0;
      for (let i = 0; i < sorted.length; i += 1) {
        const army = sorted[i];
        const width = getFrontWidth(army);
        if (totalFrontWidth + width <= maxFrontWidth) {
          active.push(army);
          totalFrontWidth += width;
        } else {
          reserve.push(army);
        }
      }
      return { active, reserve };
    };

    return [assignForSide(this.side1Armies), assignForSide(this.side2Armies)];
  }

  // 匹配双方上场部队组成战团
  public matchBattleGroups(
    activeSide1: Army[],
    activeSide2: Army[]
  ): BattleGroup[] {
    // 目前先采用简单的1对1匹配，后续再根据各部队的正面宽度比例调整实现1对多情况
    const groups: BattleGroup[] = [];
    const side1 = activeSide1
      .slice()
      .sort((a, b) => getFrontWidth(b) - getFrontWidth(a));
    const side2 = activeSide2
      .slice()
      .sort((a, b) => getFrontWidth(b) - getFrontWidth(a));

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

    // 如有剩余的部队，单独成立战团等待后续匹配调节
    while (side1.length) {
      groups.push({
        id: generateId(),
        side1Armies: [side1.shift()!],
        side2Armies: [],
        battleState: { timeElapsed: 0, isOver: false },
      });
    }
    while (side2.length) {
      groups.push({
        id: generateId(),
        side1Armies: [],
        side2Armies: [side2.shift()!],
        battleState: { timeElapsed: 0, isOver: false },
      });
    }
    this.battleGroups = groups;
    return groups;
  }

  // 战斗执行方法：采用行动调度器模拟各单位按照攻击速度行动，
  // 并在战斗过程中根据伤亡情况动态调整战团，同时判断后备部队是否可以上场
  public executeBattle(): void {
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
      const action = scheduler.nextAction();
      if (!action) break;
      simulationTime = action.time;
      // 查找该单位所属的战团
      const group = this.battleGroups.find(
        (g) =>
          g.side1Armies.includes(action.army) ||
          g.side2Armies.includes(action.army)
      );
      if (!group) continue;

      // 根据所属阵营确定敌方部队
      let enemyArmies: Army[] = [];
      if (group.side1Armies.includes(action.army)) {
        enemyArmies = group.side2Armies;
      } else {
        enemyArmies = group.side1Armies;
      }

      // 根据攻击者武器类型确定攻击范围
      let attackRange = 1;
      const weaponType =
        action.unit.getCharacter().equipment.weapon?.attackMethod; // 假设 unit.weaponType 属性存在
      if (weaponType === AttackMethod.MEDIUM_RANGE) {
        attackRange = 2;
      } else if (weaponType === AttackMethod.LONG_RANGE) {
        attackRange = 5;
      } else {
        attackRange = 1;
      }

      // 使用 BattleUtils.selectTargetWithinRange 筛选出攻击范围内的目标队员，并直接进行攻击
      const targetUnit = BattleUtils.selectTargetWithinRange(
        action.squad,
        enemyArmies,
        attackRange
      );
      if (targetUnit) {
        this.executeUnitAttack(action.unit, targetUnit);
      }

      // 攻击后重新计算对方存活单位
      const updatedEnemyUnits = enemyArmies
        .flatMap((army) => army.squads)
        .flatMap((squad) => squad.members)
        .filter((unit) => !unit.isDead);

      // 新的处理逻辑
      if (updatedEnemyUnits.length === 0) {
        // 敌方全部阵亡，则对该战团中获胜方的每个部队（以下称为部队b）进行重新分配：
        // 对于每个部队b，查找当前战场上其它所有战团中己方正面宽度劣势最大的战团（记为a），
        // 若a中敌方部队数大于1，则解散a，与部队b一起重新匹配战团；
        // 如果a中敌方部队数为1，则部队b直接加入a。
        // 执行完毕后将当前战团移除。
        this.handleBattleGroupVictory(group);
        continue;
      }

      // 如果攻击者仍存活，则重新安排下次行动
      if (!action.unit.isDead) {
        scheduler.reschedule(action);
      }

      // 每隔一定的模拟时间检查是否有后备部队需要上场
      if (Math.floor(simulationTime) % 20 === 0) {
        this.tryPromoteReserveArmies();
      }
    }
    this.battleStateHandler.getBattleState().isOver = true;
    console.log('Battle execution complete, simulation time:', simulationTime);
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

  // 计算并结算攻击伤害，然后根据对方存活情况执行反击
  private executeUnitAttack(attacker: any, target: any) {
    const attackerDamage = attacker.attackSpeed * 5;
    target.takeDamage(attackerDamage);
    console.log(
      `Unit ${attacker.id} attacked ${target.id} for ${attackerDamage} damage`
    );
    if (!target.isDead) {
      const counterDamage = target.attackSpeed * 2;
      attacker.takeDamage(counterDamage);
      console.log(
        `Unit ${target.id} counterattacked ${attacker.id} for ${counterDamage} damage`
      );
    }
  }

  // 检查后备部队是否达到上场条件，若满足则重新匹配战团
  private tryPromoteReserveArmies() {
    const assignment = this.assignActiveAndReserveArmies(
      this.config.battlefieldWidth
    );
    const newActiveSide1 = assignment[0].active;
    const newActiveSide2 = assignment[1].active;
    const currentActiveSide1 = this.battleGroups.flatMap(
      (group) => group.side1Armies
    );
    const currentActiveSide2 = this.battleGroups.flatMap(
      (group) => group.side2Armies
    );

    if (
      newActiveSide1.length > currentActiveSide1.length ||
      newActiveSide2.length > currentActiveSide2.length
    ) {
      this.battleGroups = this.matchBattleGroups(
        newActiveSide1,
        newActiveSide2
      );
      console.log('Promoted reserve armies and re-matched battle groups');
    }
  }

  // 辅助方法：判断某个部队中是否有存活的队员
  private hasLivingUnits(army: Army): boolean {
    return army.squads.some((squad) =>
      squad.members.some((unit) => !unit.isDead)
    );
  }

  /**
   * 计算指定战团在己方胜利状态下的"正面宽度劣势"值；
   * 当己方敌军正面宽度与己方正面宽度之差越大，表示劣势越明显。
   */
  private getDisadvantageValue(
    group: BattleGroup,
    winningSide: 'side1' | 'side2'
  ): number {
    const friendlyWidth =
      winningSide === 'side1'
        ? group.side1Armies.reduce((sum, army) => sum + getFrontWidth(army), 0)
        : group.side2Armies.reduce((sum, army) => sum + getFrontWidth(army), 0);
    const enemyWidth =
      winningSide === 'side1'
        ? group.side2Armies.reduce((sum, army) => sum + getFrontWidth(army), 0)
        : group.side1Armies.reduce((sum, army) => sum + getFrontWidth(army), 0);
    return enemyWidth - friendlyWidth;
  }

  /**
   * 对于获胜部队（部队b），查找其它战团中己方正面宽度劣势最大的战团（记为a），
   * 若a中敌方部队数多余1个，则解散a，与部队b一起重新匹配战团；
   * 如果a中敌方部队数为1，则部队b直接加入a。
   */
  private reassignVictoriousArmy(
    b: Army,
    winningSide: 'side1' | 'side2'
  ): void {
    // 在其它所有战团中筛选出己方有部队的候选战团
    const candidateGroups = this.battleGroups.filter((group) => {
      if (winningSide === 'side1') {
        return group.side1Armies.length > 0;
      }
      return group.side2Armies.length > 0;
    });

    if (candidateGroups.length === 0) {
      // 无候选，则创建新战团
      const newGroup: BattleGroup = {
        id: generateId(),
        side1Armies: winningSide === 'side1' ? [b] : [],
        side2Armies: winningSide === 'side2' ? [b] : [],
        battleState: { timeElapsed: 0, isOver: false },
      };
      this.battleGroups.push(newGroup);
      return;
    }

    // 选出己方正面宽度劣势最大的候选战团
    let selectedGroup = candidateGroups[0];
    let maxDisadvantage = this.getDisadvantageValue(selectedGroup, winningSide);
    for (let i = 0; i < candidateGroups.length; i += 1) {
      const group = candidateGroups[i];
      const disadvantage = this.getDisadvantageValue(group, winningSide);
      if (disadvantage > maxDisadvantage) {
        maxDisadvantage = disadvantage;
        selectedGroup = group;
      }
    }

    // 根据获胜方所属来判断selectedGroup中敌方部队数量
    const enemyCount =
      winningSide === 'side1'
        ? selectedGroup.side2Armies.length
        : selectedGroup.side1Armies.length;
    if (enemyCount > 1) {
      // 若敌方部队多余1个，则解散selectedGroup，与b的部队合并重新匹配
      const winningArmiesFromA =
        winningSide === 'side1'
          ? selectedGroup.side1Armies
          : selectedGroup.side2Armies;
      // 删除selectedGroup
      this.battleGroups = this.battleGroups.filter((g) => g !== selectedGroup);
      // 合并selectedGroup中的己方部队和部队b
      const combinedWinningArmies = [...winningArmiesFromA, b];
      // 提取selectedGroup中的敌方部队
      const enemyArmiesFromA =
        winningSide === 'side1'
          ? selectedGroup.side2Armies
          : selectedGroup.side1Armies;
      // 重新匹配战团：注意匹配时参数顺序要区分己方与敌方
      const rematchedGroups =
        winningSide === 'side1'
          ? this.matchBattleGroups(combinedWinningArmies, enemyArmiesFromA)
          : this.matchBattleGroups(enemyArmiesFromA, combinedWinningArmies);
      // 合并新匹配的战团
      this.battleGroups.push(...rematchedGroups);
    } else if (winningSide === 'side1') {
      // 如果enemyCount正好为1，则直接将部队b加入selectedGroup
      selectedGroup.side1Armies.push(b);
    } else {
      selectedGroup.side2Armies.push(b);
    }
  }

  /**
   * 当某战团敌方全部消灭后，对该战团中获胜方的每个部队（部队b）进行处理：
   * 依次查找其它所有战团（记为a）中己方正面宽度劣势最大的战团，
   * 判断a中敌方部队数：若多余1个，则解散a，与部队b重新匹配；若等于1，则部队b直接加入a。
   * 最后，从战场中移除该结束的战团。
   */
  private handleBattleGroupVictory(group: BattleGroup): void {
    let winningSide: 'side1' | 'side2' | null = null;
    if (group.side1Armies.some((army) => this.hasLivingUnits(army))) {
      winningSide = 'side1';
    } else if (group.side2Armies.some((army) => this.hasLivingUnits(army))) {
      winningSide = 'side2';
    }
    if (!winningSide) return;
    const victoriousArmies =
      winningSide === 'side1' ? group.side1Armies : group.side2Armies;
    for (let i = 0; i < victoriousArmies.length; i += 1) {
      const b = victoriousArmies[i];
      this.reassignVictoriousArmy(b, winningSide);
    }
    // 移除该已结束的战团
    this.battleGroups = this.battleGroups.filter((g) => g !== group);
  }

  getBattleConfig(): BattleConfig {
    return this.config;
  }

  getBattleState(): BattleState {
    return this.battleStateHandler.getBattleState();
  }

  getPlayerSide(): Army[] {
    return this.playerArmy ? [this.playerArmy] : [];
  }

  getActiveBattleGroups(): BattleGroup[] {
    return this.battleGroups;
  }
}
