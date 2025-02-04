/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import { reactive } from 'vue';
import { Player } from './entities/Player';
import { Emblem } from './entities/Emblem';
import { Flag } from './entities/Flag';
import { generateCharacter } from './utils';

// Create Emblem and Flag
const emblem = new Emblem('Eagle Emblem', '/img/emblem.png');
const flag = new Flag('Red Banner', '/images/red-banner.png');

// Create Player
const player = reactive(new Player('Hero', emblem, flag));

for (let i = 1; i <= 30; i += 1) {
  const character = reactive(generateCharacter(`Fighter${i}`));
  player.members.push(character);
}

// for (let i = 1; i <= 4; i += 1) {
//   const leadMember = generateCharacter(`Lead${i}`);
//   const team = new Team(
//     `team${i}`,
//     leadMember,
//     emblem,
//     flag,
//     leadMember.attackMethod
//   );
//   for (let j = 1; j <= 6; j += 1) {
//     const member = generateCharacter(`Fighter${i}-${j}`);
//     team.addMember(member);
//   }
//   player.teams.push(team);
// }

// // Create squads for army1
// const frontSquad1 = createSquad(SquadPosition.FRONT, AttackMethod.MELEE, 4, [
//   player.leadTeam.leader,
// ]);
// const middleSquad1 = createSquad(
//   SquadPosition.MIDDLE,
//   AttackMethod.MEDIUM_RANGE,
//   5,
//   [member1, member2]
// );
// const backSquad1 = createSquad(SquadPosition.BACK, AttackMethod.LONG_RANGE, 6, [
//   member3,
// ]);
// const reserveSquad1 = createSquad(
//   SquadPosition.BACK,
//   AttackMethod.LONG_RANGE,
//   6,
//   [member4]
// );

// // Create squads for army2
// const frontSquad2 = createSquad(SquadPosition.FRONT, AttackMethod.MELEE, 3, [
//   member5,
// ]);
// const middleSquad2 = createSquad(
//   SquadPosition.MIDDLE,
//   AttackMethod.MEDIUM_RANGE,
//   6,
//   [member6]
// );
// const backSquad2 = createSquad(SquadPosition.BACK, AttackMethod.LONG_RANGE, 5, [
//   member1,
//   member2,
//   member3,
// ]);

// const army1 = createArmy(
//   [frontSquad1, middleSquad1, backSquad1],
//   [reserveSquad1]
// );
// const army2 = createArmy([frontSquad2, middleSquad2, backSquad2], []);

// const battleConfig: BattleConfig = {
//   maxRounds: 10,
//   maxTroopsPerSide: 4,
//   battleTimeLimit: 20,
// };

// const game
// = new Game(battleConfig, [army1, army2], player);
// game.startGame();

export { player };
