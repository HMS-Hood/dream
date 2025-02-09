/* eslint-disable import/prefer-default-export */
import { Army, Squad } from '../interfaces/combat';
import { CombatUnit } from '../entities/CombatUnit';

interface ActionEvent {
  time: number;
  unit: CombatUnit;
  squad: Squad;
  army: Army;
}

export class ActionScheduler {
  private standardInterval: number;

  private queue: ActionEvent[] = [];

  constructor(standardInterval: number) {
    this.standardInterval = standardInterval;
  }

  // 将所有上场部队的单位加入队列（初始化）
  public initialize(armies: Army[]): void {
    armies.forEach((army) => {
      army.squads.forEach((squad) => {
        squad.members.forEach((unit) => {
          const interval = this.standardInterval / unit.attackSpeed;
          this.enqueue({ time: interval, unit, squad, army });
        });
      });
    });
    this.sortQueue();
  }

  private enqueue(event: ActionEvent): void {
    this.queue.push(event);
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => a.time - b.time);
  }

  public nextAction(): ActionEvent | undefined {
    return this.queue.shift();
  }

  public reschedule(event: ActionEvent): void {
    // 重新计算单位的下一次行动时间，并插入队列
    const interval = this.standardInterval / event.unit.attackSpeed;
    event.time += interval;
    this.enqueue(event);
    this.sortQueue();
  }

  public hasNext(): boolean {
    return this.queue.length > 0;
  }
}
