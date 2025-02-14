import { useEnvDataStore } from '@/store/envData';
import { player } from '../game';
import { CharacterInterface } from '../interfaces';
import { MissionInfo } from '../mission/Mission';

const envData = useEnvDataStore();

export function save() {
  localStorage.setItem('player', JSON.stringify(player));
  const items = envData.getItems();
  const recruitMembers = envData.getRecruit();
  const missionsInfo = envData.getMissions();
  localStorage.setItem('items', JSON.stringify(items));
  localStorage.setItem('recruit', JSON.stringify(recruitMembers));
  localStorage.setItem('missions', JSON.stringify(missionsInfo));
}

export function load() {
  const playerData = localStorage.getItem('player');
  if (playerData) {
    const savedPlayer = JSON.parse(playerData);
    player.reload(savedPlayer);
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
}
