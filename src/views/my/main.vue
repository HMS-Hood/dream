<template>
  <div
    class="container"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div class="row one">
      <div
        class="cell"
        :style="{
          backgroundImage: `url(${
            player.members.find((member) => member.id === player.protagonistId)
              ?.avatar
          })`,
        }"
      >
        <div class="emblem">
          <img
            width="150px"
            height="150px"
            :src="player.familyEmblem.imageUrl"
          />
        </div>
        <div class="cell-content">
          <div class="player-details">
            <div class="calendar">{{ calendar.getDate() }}</div>
            <div class="name-title">
              <h2 class="player-name">{{ player.name }}</h2>
              <p class="player-title">{{ player.title }}</p>
            </div>
            <div class="reputation">
              <span>Reputation:</span>
              <span>{{ player.reputation }}</span>
            </div>
            <div class="gold">
              <span>Gold:</span>
              <span>{{ player.gold }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-for="(item, index) in row1"
        :key="index"
        class="cell hold"
        :style="{ backgroundImage: `url(${item.image})` }"
        @mouseover="hoverItem = item"
        @mouseleave="hoverItem = null"
      >
        <div class="cell-content">
          <h3>{{ item.title }}</h3>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
        </div>
      </div>
    </div>
    <div class="row two">
      <div
        v-for="(item, index) in row2"
        :key="index"
        class="cell"
        :style="{ backgroundImage: `url(${item.image})` }"
        @mouseover="hoverItem = item"
        @mouseleave="hoverItem = null"
        @click="item.url ? router.push(item.url) : undefined"
      >
        <div class="cell-content">
          <h3>{{ item.title }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { player, calendar } from '../../core/game';

  const backgroundImage = ref('/img/bg/bg1.png');
  const router = useRouter();
  const row1 = ref([
    { title: 'Item 1', image: '/img/avatar/10.png' },
    { title: 'Item 2', image: '/img/avatar/11.png' },
  ]);
  const row2 = ref([
    { title: 'Item 1', image: '/img/avatar/1.png' },
    { title: 'Item 2', image: '/img/avatar/2.png' },
    { title: 'Item 3', image: '/img/avatar/3.png' },
    { title: 'Item 4', image: '/img/avatar/4.png' },
    { title: '征兵所', image: '/img/bg/military-camp.png', url: '/recruit' },
    { title: '兵营', image: '/img/bg/barracks.png', url: '/barracks' },
    { title: '商店', image: '/img/bg/store.png', url: '/shop' },
    { title: '酒馆', image: '/img/bg/tavern1.png' },
  ]);
  const hoverItem = ref<{ title: string; image: string } | null>();
</script>

<style lang="less" scoped>
  .container {
    min-height: 100vh;
    padding: 20px;
    background-position: center;
    background-size: cover;
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .cell {
      position: relative;
      flex: 1;
      margin: 0 10px;
      background-position: center;
      background-size: cover;
      border-radius: 10px;
      transition: transform 0.3s;
    }

    .cell-content {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 10px;
      color: #fff;
      background-color: rgb(0 0 0 / 70%);
      border-bottom-right-radius: 10px;
      border-bottom-left-radius: 10px;
    }

    &.one .cell.hold {
      height: 70vh;
      cursor: pointer;

      &:hover {
        box-shadow: 0 0 10px rgb(0 0 0 / 30%);
        transform: scale(1.025);
      }
    }

    .emblem {
      position: absolute;
      top: 0;
      left: 0;
      width: 150px;
      height: 150px;
      background-color: rgb(128 128 128 / 70%);
    }

    &.two .cell {
      height: 22vh;

      &:hover {
        box-shadow: 0 0 10px rgb(0 0 0 / 30%);
        transform: scale(1.1);
      }
    }
  }

  .player-details {
    width: 100%;
    margin-bottom: 20px;

    .calendar {
      color: goldenrod;
      font-weight: bolder;
      font-size: 2em;
    }

    .player-name {
      margin: 1em 0 5px;
      font-size: 2em;
    }

    .player-title {
      margin: 0.5em 0 10px;
      color: #777;
      font-size: 1.5em;
    }

    .reputation,
    .gold {
      display: flex;
      align-items: center;
      margin-bottom: 0.5em;
      font-size: 1.5em;

      > *:first-child {
        display: inline-block;
        width: 120px; /* Align labels */
        margin-right: 1em;
        font-weight: bold;
      }
    }
  }

  h3 {
    margin: 0;
    font-size: 18px;
  }
</style>
