import { IArmy, ISquad } from '../interfaces/combat';
import { SquadPosition } from '../enums';
import { CharacterInterface } from '../interfaces';
import { generateId } from './utils';
import { CombatUnit } from '../battle/CombatUnit';
import { Squad } from '../battle/Squad';
import { Army } from '../battle/Army';

// 计算部队的正面宽度（前排所有小队队员总和）
export function getFrontWidth(army: IArmy): number {
  return army.squads
    .filter((squad) => squad.position === SquadPosition.FRONT)
    .reduce((sum, squad) => sum + squad.members.length, 0);
}

// 验证部队的站位分配是否合法
export function validateArmyFormation(army: IArmy): boolean {
  // const front = army.squads
  //   .filter((s) => s.position === SquadPosition.FRONT)
  //   .reduce((sum, s) => sum + s.members.length, 0);
  // const back = army.squads
  //   .filter((s) => s.position === SquadPosition.BACK)
  //   .reduce((sum, s) => sum + s.members.length, 0);
  // return front >= back;
  return true;
}

export function createSquad(
  position: SquadPosition,
  members: CharacterInterface[]
): ISquad {
  return new Squad({
    position,
    members: members.map((member) => new CombatUnit(member)),
  });
}

export function createArmy(squads: ISquad[], reserveSquads: ISquad[]): IArmy {
  const id = generateId();
  return new Army({
    id,
    name: `部队[${id}]`,
    squads,
    reserveSquads,
    isDead: false,
  });
}
