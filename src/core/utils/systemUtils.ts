import { useEnvDataStore } from '@/store/envData';
import { DoingMission, useDoingMissionStore } from '@/store/doingMission';
import { calendar, player } from '../game';
import { CharacterInterface } from '../interfaces';
import { MissionInfo } from '../mission/Mission';

const envData = useEnvDataStore();
const doingMissionStroe = useDoingMissionStore();

export function save() {
  localStorage.setItem('player', JSON.stringify(player));
  localStorage.setItem('calendar', JSON.stringify(calendar));

  const items = envData.getItems();
  localStorage.setItem('items', JSON.stringify(items));

  const recruitMembers = envData.getRecruit();
  localStorage.setItem('recruit', JSON.stringify(recruitMembers));

  const missionsInfo = envData.getMissions();
  localStorage.setItem('missions', JSON.stringify(missionsInfo));

  const doingMission = doingMissionStroe.getDoingMission();
  localStorage.setItem('doingMission', JSON.stringify(doingMission));
}

export function load() {
  const playerData = localStorage.getItem('player');
  if (playerData) {
    const savedPlayer = JSON.parse(playerData);
    player.reload(savedPlayer);
  }
  const calendarData = localStorage.getItem('calendar');
  if (calendarData) {
    const loadCalendar = JSON.parse(calendarData);
    calendar.reset(loadCalendar.year, loadCalendar.month, loadCalendar.day);
  }

  const itemsData = localStorage.getItem('items');
  if (itemsData) {
    const savedItems = JSON.parse(itemsData);
    envData.setItems(savedItems);
  }
  const recruitData = localStorage.getItem('recruit');
  if (recruitData) {
    const saveRecruit = JSON.parse(recruitData) as CharacterInterface[];
    envData.setRecruit(saveRecruit);
  }
  const missionsData = localStorage.getItem('missions');
  if (missionsData) {
    const saveMissions = JSON.parse(missionsData) as MissionInfo[];
    envData.setMissions(saveMissions);
  }
  const doingMissionData = localStorage.getItem('doingMission');
  if (doingMissionData) {
    const doingMission = JSON.parse(doingMissionData) as DoingMission[];
    doingMissionStroe.setDoingMission(doingMission);
  }
}
