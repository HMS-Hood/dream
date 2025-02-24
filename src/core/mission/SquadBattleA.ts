/* eslint-disable class-methods-use-this */
import { IArmy, ISquad } from '../interfaces/combat';
import { ActionScheduler } from '../battle/actionScheduler';
import { Army } from '../battle/Army';
import { ICombatUnit } from '../interfaces';
import { Campaign } from '../battle/campaign';
import { defaultBattleConfig } from '../setting/param-combat';

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
/**
 * 战斗结果返回
 */
export interface SquadBattleResult {
  winner: 'player' | 'enemy' | 'none';
  duration: number;
  logs: BattleLog;
}

/**
 * 新的战斗模式：双方（以小队为单位）1v1对决，
 * 玩家至少一方，并根据休息/逃跑阈值对玩家小队进行特殊处理。
 */
export class SquadBattle {
  // 保存交战队列（均为 ISquad 对象）
  private playerArmy: Army;

  private enemyArmies: Army[];

  private options: SquadBattleOptions;

  private totalSimulationTime = 0;

  private record: (
    attackUnit: ICombatUnit,
    targetUnit: ICombatUnit,
    damage: number,
    counterDamage: number
  ) => void;

  private logs: BattleLog;

  constructor(
    playerArmy: Army,
    enemyArmies: Army[],
    options: SquadBattleOptions
  ) {
    // 浅拷贝队列
    this.playerArmy = playerArmy;
    this.enemyArmies = [...enemyArmies];
    this.options = {
      fightTimeLimit: 1000,
      standardInterval: 40,
      ...options,
    };
    const { record, logs } = useBattleLog(playerArmy.squads);
    this.record = record;
    this.logs = logs;
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

  private isArmyDefeated(army: IArmy): boolean {
    return army.squads.every((squad) => this.isSquadDefeated(squad));
  }

  /**
   * 模拟一场1v1小队对战
   * 利用 ActionScheduler 调度双方小队内各单位行动，
   * 固定攻击距离为1，使用与 campaign 中相同的伤害计算（包含反击逻辑）
   *
   * 返回对局结果及时间消耗
   */
  private async simulateSquadFight(enemyArmy: Army): Promise<{
    winner: 'player' | 'enemy' | 'draw';
    duration: number;
  }> {
    // 转换为临时 Army 以便调度
    const campainOption = defaultBattleConfig;
    const campaign = new Campaign(
      campainOption,
      [],
      [enemyArmy],
      this.playerArmy,
      true
    );

    const result = await campaign.executeBattle();
    let winner: 'player' | 'enemy' | 'draw' = 'draw';
    if (result.winner === 'side1') winner = 'player';
    if (result.winner === 'side2') winner = 'enemy';
    return { winner, duration: result.duration };
  }

  /**
   * 执行整体战斗
   * 1. 依据轮询规则，从玩家和敌方队列中循环取对决小队
   * 2. 对于玩家小队，将先检查休息阈值（暂时跳过）和逃跑阈值（永久移除）
   * 3. 每场1v1对战后，若一方小队全灭则永久移除出队列
   * 4. 当一边队列为空时，战斗结束
   */
  public async executeBattle(): Promise<SquadBattleResult> {
    this.totalSimulationTime = 0;

    while (!this.playerArmy.isDead && this.enemyArmies.length > 0) {
      const currentEnemyArmy = this.enemyArmies.pop();

      // 模拟1v1小队对战
      // eslint-disable-next-line no-await-in-loop
      const fightResult = await this.simulateSquadFight(currentEnemyArmy!);
      this.totalSimulationTime += fightResult.duration;
      this.logs.message.push(
        `Fight: Player Army vs Enemy Army ${currentEnemyArmy?.id} ⇒ Winner: ${fightResult.winner} (time: ${fightResult.duration})`
      );

      // 根据对战结果从队列中移除已经全灭的小队
      if (fightResult.winner === 'draw') {
        this.enemyArmies.push(currentEnemyArmy!);
      }
    }
    let winner: 'player' | 'enemy' | 'none' = 'none';
    if (!this.isArmyDefeated(this.playerArmy)) {
      winner = 'player';
    } else if (this.enemyArmies.length > 0) {
      winner = 'enemy';
    }

    return {
      winner,
      duration: this.totalSimulationTime,
      logs: this.logs,
    };
  }
}
