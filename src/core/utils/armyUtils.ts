import { Army } from '../interfaces/combat';
import { SquadPosition } from '../enums';

// 计算部队的正面宽度（前排所有小队队员总和）
export function getFrontWidth(army: Army): number {
  return army.squads
    .filter((squad) => squad.position === SquadPosition.FRONT)
    .reduce((sum, squad) => sum + squad.members.length, 0);
}

// 验证部队的站位分配是否合法
export function validateArmyFormation(army: Army): boolean {
  const front = army.squads
    .filter((s) => s.position === SquadPosition.FRONT)
    .reduce((sum, s) => sum + s.members.length, 0);
  const middle = army.squads
    .filter((s) => s.position === SquadPosition.MIDDLE)
    .reduce((sum, s) => sum + s.members.length, 0);
  const back = army.squads
    .filter((s) => s.position === SquadPosition.BACK)
    .reduce((sum, s) => sum + s.members.length, 0);
  return middle <= front && back <= 2 * front;
}
