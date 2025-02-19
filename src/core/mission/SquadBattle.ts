/* eslint-disable class-methods-use-this */
import { ISquad } from '../interfaces/combat';
import { ActionScheduler } from '../battle/actionScheduler';
import { Army } from '../battle/Army';
import { ICombatUnit } from '../interfaces';

/**
 * 对局参数：
 * - restThreshold: 休息阈值，若玩家小队体力比例低于该值则暂时跳过对局。
 * - fleeThreshold: 逃跑阈值，若玩家小队体力比例低于该值则永久移出交战队列。
 * - fightTimeLimit: 单次1v1小队对战的时间上限（单位与 ActionScheduler 一致）。
 * - standardInterval: 单位行动调度的标准间隔，可复用 campaign 中的值（如 40）。
 */
export interface SquadBattleOptions {
  restThreshold: number; // 例如 0.3 表示30%
  fleeThreshold: number; // 例如 0.1 表示10%
  fightTimeLimit?: number; // 默认1000
  standardInterval?: number; // 默认40
}

/**
 * 战斗结果返回
 */
export interface SquadBattleResult {
  winner: 'player' | 'enemy' | 'none';
  duration: number;
  logs: string[];
}

/**
 * 新的战斗模式：双方（以小队为单位）1v1对决，
 * 玩家至少一方，并根据休息/逃跑阈值对玩家小队进行特殊处理。
 */
export class SquadBattle {
  // 保存交战队列（均为 ISquad 对象）
  private playerSquads: ISquad[];

  private enemySquads: ISquad[];

  private options: SquadBattleOptions;

  private logs: string[] = [];

  private totalSimulationTime = 0;

  constructor(
    playerSquads: ISquad[],
    enemySquads: ISquad[],
    options: SquadBattleOptions
  ) {
    // 浅拷贝队列
    this.playerSquads = [...playerSquads];
    this.enemySquads = [...enemySquads];
    this.options = {
      fightTimeLimit: 1000,
      standardInterval: 40,
      ...options,
    };
  }

  /**
   * 计算一个小队的总体体力比（所有成员 currentHealth / maxHealth 之和）
   */
  private getSquadHealthRatio(squad: ISquad): number {
    const totalCurrent = squad.members.reduce(
      (sum, unit) => sum + unit.currentHealth,
      0
    );
    const totalMax = squad.members.reduce(
      (sum, unit) => sum + unit.maxHealth,
      0
    );
    return totalMax > 0 ? totalCurrent / totalMax : 0;
  }

  /**
   * 判断小队是否全部阵亡
   */
  private isSquadDefeated(squad: ISquad): boolean {
    return squad.members.every((unit) => unit.isDead);
  }

  /**
   * 将小队转换成临时部队（Army），以便使用 ActionScheduler 初始化
   * 此处利用 Army 类构造一个只含一个小队的 Army 实例
   */
  private createTempArmyFromSquad(
    squad: ISquad,
    side: 'player' | 'enemy'
  ): Army {
    return new Army({
      id: `${side}_temp_${squad.id}`,
      squads: [squad],
      name: side === 'player' ? 'PlayerTempArmy' : 'EnemyTempArmy',
    });
  }

  /**
   * 模拟一场1v1小队对战
   * 利用 ActionScheduler 调度双方小队内各单位行动，
   * 固定攻击距离为1，使用与 campaign 中相同的伤害计算（包含反击逻辑）
   *
   * 返回对局结果及时间消耗
   */
  private simulateSquadFight(
    playerSquad: ISquad,
    enemySquad: ISquad
  ): { winner: 'player' | 'enemy' | 'draw'; duration: number } {
    const fightTimeLimit = this.options.fightTimeLimit!;
    const standardInterval = this.options.standardInterval!;
    let simulationTime = 0;
    // 转换为临时 Army 以便调度
    const playerArmy = this.createTempArmyFromSquad(playerSquad, 'player');
    const enemyArmy = this.createTempArmyFromSquad(enemySquad, 'enemy');
    const scheduler = new ActionScheduler(standardInterval);
    scheduler.initialize([playerArmy, enemyArmy]);

    // 对战循环：直到一方全部阵亡或超过局限时
    while (scheduler.hasNext() && simulationTime < fightTimeLimit) {
      if (
        this.isSquadDefeated(playerSquad) ||
        this.isSquadDefeated(enemySquad)
      ) {
        break;
      }
      const action = scheduler.nextAction();
      if (!action) break;
      simulationTime = action.time;
      // 当 action.unit 属于哪一方，就选取对方小队中一个活着的单位为目标
      let targetUnit;
      if (playerSquad.members.includes(action.unit)) {
        const aliveTargets = enemySquad.members.filter((unit) => !unit.isDead);
        if (aliveTargets.length === 0) break;
        [targetUnit] = aliveTargets;
      } else {
        const aliveTargets = playerSquad.members.filter((unit) => !unit.isDead);
        if (aliveTargets.length === 0) break;
        [targetUnit] = aliveTargets;
      }
      // 固定攻击距离为1
      this.executeUnitAttack(action.unit, targetUnit, 1);
      if (!action.unit.isDead) {
        scheduler.reschedule(action);
      }
    }

    // 对战结束，依据哪边全灭确定对局胜负
    if (
      this.isSquadDefeated(playerSquad) &&
      !this.isSquadDefeated(enemySquad)
    ) {
      return { winner: 'enemy', duration: simulationTime };
    }
    if (
      !this.isSquadDefeated(playerSquad) &&
      this.isSquadDefeated(enemySquad)
    ) {
      return { winner: 'player', duration: simulationTime };
    }
    return { winner: 'draw', duration: simulationTime };
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
    let attackerDamage = attacker.physicalAttack;
    const hit = Math.random();
    let attackState: 'normal' | 'miss' | 'parry' | 'block' | 'critical' =
      'normal';
    const attackInfo: string[] = [
      `${attacker.getCharacter().name} attacked ${target.getCharacter().name}`,
    ];

    // 判断命中与闪避
    if (hit > Math.max(0.05, attacker.hitRate - target.dodgeRate)) {
      attackerDamage = 0;
      attackInfo.push('miss');
      attackState = 'miss';
    }
    const parry = Math.random();
    const block = Math.random();
    const critical = Math.random();
    if (parry < target.parryRate) {
      attackerDamage = 0;
      attackInfo.push(`parry(rate:${target.parryRate})`);
      attackState = 'parry';
    } else if (block < target.blockRate) {
      attackerDamage = Math.max(0, attackerDamage - target.blockValue);
      attackInfo.push(`block(${target.blockValue},rate:${target.blockRate})`);
      attackState = 'block';
    } else if (critical < attacker.criticalRate) {
      attackerDamage *= attacker.criticalDamage;
      attackInfo.push('critical');
      attackState = 'critical';
    }
    target.takeDamage(attackerDamage);
    attackInfo.push(
      `damage: ${attackerDamage}(${target.currentHealth}/${target.maxHealth})`
    );
    if (attackerDamage > 0) {
      attacker.getCharacter().addExperience(1);
    }
    // 如果目标存活且距离满足，则执行反击
    if (!target.isDead && target.getAttackRange() >= distance) {
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
      const counterHit = Math.random();
      if (counterHit > Math.max(0.05, target.hitRate - attacker.dodgeRate)) {
        attackInfo.push('counter miss');
        counterDamage = 0;
      }
      const countParry = Math.random();
      const countBlock = Math.random();
      if (countParry < attacker.parryRate) {
        counterDamage = 0;
        attackInfo.push(`counter parry(rate:${attacker.parryRate})`);
      } else if (countBlock < attacker.blockRate) {
        counterDamage = Math.max(0, counterDamage - attacker.blockValue);
        attackInfo.push(
          `counter block(${attacker.blockValue},rate:${attacker.blockRate})`
        );
      }
      attacker.takeDamage(counterDamage);
      attackInfo.push(
        `counter damage: ${counterDamage}(${attacker.currentHealth}/${attacker.maxHealth})`
      );
      if (counterDamage > 0) {
        target.getCharacter().addExperience(1);
      }
      this.logs.push(attackInfo.join(' | '));
    } else {
      this.logs.push(attackInfo.join(' | '));
    }
  }

  /**
   * 执行整体战斗
   * 1. 依据轮询规则，从玩家和敌方队列中循环取对决小队
   * 2. 对于玩家小队，将先检查休息阈值（暂时跳过）和逃跑阈值（永久移除）
   * 3. 每场1v1对战后，若一方小队全灭则永久移除出队列
   * 4. 当一边队列为空时，战斗结束
   */
  public executeBattle(): SquadBattleResult {
    let playerIndex = 0;
    let enemyIndex = 0;
    this.totalSimulationTime = 0;

    while (this.playerSquads.length > 0 && this.enemySquads.length > 0) {
      // 对玩家小队应用"休息"阈值检查：如果存在至少一个小队满足体力 ≥ restThreshold，则暂时跳过那些体力低于该阈值的。
      const availablePlayerSquads = this.playerSquads.filter(
        (squad) =>
          this.getSquadHealthRatio(squad) >= this.options.restThreshold!
      );
      let currentPlayerSquad: ISquad;
      if (availablePlayerSquads.length > 0) {
        // 从满足条件的小队中依次取出
        currentPlayerSquad =
          availablePlayerSquads[playerIndex % availablePlayerSquads.length];
      } else {
        // 若全部玩家小队均低于休息阈值，则忽略该限制（重置队列）
        currentPlayerSquad =
          this.playerSquads[playerIndex % this.playerSquads.length];
      }
      const currentEnemySquad =
        this.enemySquads[enemyIndex % this.enemySquads.length];

      // 模拟1v1小队对战
      const fightResult = this.simulateSquadFight(
        currentPlayerSquad,
        currentEnemySquad
      );
      this.totalSimulationTime += fightResult.duration;
      this.logs.push(
        `Fight: Player squad ${currentPlayerSquad.id} vs Enemy squad ${currentEnemySquad.id} ⇒ Winner: ${fightResult.winner} (time: ${fightResult.duration})`
      );

      // 根据对战结果从队列中移除已经全灭的小队
      if (fightResult.winner === 'player') {
        // 敌方小队全灭，移除
        this.enemySquads = this.enemySquads.filter(
          (squad) => squad.id !== currentEnemySquad.id
        );
        enemyIndex %= this.enemySquads.length || 1;
      } else if (fightResult.winner === 'enemy') {
        // 玩家小队全灭，移除
        this.playerSquads = this.playerSquads.filter(
          (squad) => squad.id !== currentPlayerSquad.id
        );
        playerIndex %= this.playerSquads.length || 1;
      } else {
        // 平局则均不移除，轮询指针后移
        playerIndex += 1;
        enemyIndex += 1;
      }

      // 对玩家小队额外检查逃跑阈值：如果体力比低于 fleeThreshold，则永久移除该小队
      this.playerSquads = this.playerSquads.filter((squad) => {
        const ratio = this.getSquadHealthRatio(squad);
        if (ratio < this.options.fleeThreshold!) {
          this.logs.push(
            `Player squad ${squad.id} fled (ratio: ${ratio.toFixed(2)})`
          );
          return false;
        }
        return true;
      });

      // 轮询：达到队尾时从头开始
      playerIndex = (playerIndex + 1) % (this.playerSquads.length || 1);
      enemyIndex = (enemyIndex + 1) % (this.enemySquads.length || 1);
    }
    let winner: 'player' | 'enemy' | 'none' = 'none';
    if (this.playerSquads.length > 0) {
      winner = 'player';
    } else if (this.enemySquads.length > 0) {
      winner = 'enemy';
    }

    return {
      winner,
      duration: this.totalSimulationTime,
      logs: this.logs,
    };
  }
}
