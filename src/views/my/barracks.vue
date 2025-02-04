<template>
  <div
    class="container"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div class="row banner">
      <div class="cell detail">
        <div
          :style="{
            'backgroundImage': `url(${player.familyEmblem.imageUrl})`,
            'width': '80px',
            'height': '80px',
            'background-size': 'cover',
          }"
        ></div>
        <div class="cell-content">
          <div class="player-details">
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
      >
        <div class="cell-content">
          <h3>{{ item.title }}</h3>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
        </div>
      </div>
    </div>
    <div class="row tags">
      <div
        :class="showList === 'team' ? 'tag cur' : 'tag'"
        @click="showList = 'team'"
        ><div class="text">队伍</div></div
      >
      <div
        :class="showList === 'character' ? 'tag cur' : 'tag'"
        @click="showList = 'character'"
        ><div class="text">人员</div></div
      >
      <div
        :class="showList === 'item' ? 'tag cur' : 'tag'"
        @click="showList = 'item'"
        ><div class="text">物品</div></div
      >
    </div>
    <team-list v-if="showList === 'team'"></team-list>
    <character-manager v-if="showList === 'character'"></character-manager>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { player } from '../../core/game';
  import TeamList from './TeamList.vue';
  import CharacterManager from './CharacterManager.vue';

  const backgroundImage = ref('/img/bg/bg1.png');
  const row1 = ref([
    { title: 'Item 1', image: '/img/10.png' },
    { title: 'Item 2', image: '/img/11.png' },
  ]);

  const showList = ref<'team' | 'character' | 'item'>('team');
</script>

<style lang="less" scoped>
  .container {
    min-height: 100vh;
    padding: 20px;
    background-position: center;
    background-size: cover;
  }

  :deep(.row) {
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
      cursor: pointer;
      transition: transform 0.3s;
    }

    .cell.detail {
      background-color: #d7f5ce;
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

    &.banner .cell {
      height: 20vh;

      &:hover {
        box-shadow: 0 0 10px rgb(0 0 0 / 30%);
        transform: scale(1.025);
      }
    }

    &.tags {
      justify-content: start;
      padding: 0, 20px;

      .tag {
        flex-grow: 0;
        width: 100px;
        height: 2em;
        margin: 0 10px;
        padding: 8px 0;
        color: aliceblue;
        font-size: 22px;
        text-align: center;
        background-color: rgb(169 170 169);
        border-radius: 3px;
        transform: skewX(-10deg);
        cursor: pointer;

        &:hover {
          background-color: rgb(201 201 201);
        }

        &.cur {
          background-color: rgb(48 122 16);
        }

        .text {
          transform: skewX(10deg);
        }
      }
    }
  }

  .player-details {
    width: 100%;
    margin-bottom: 20px;
  }

  .player-name {
    margin: 0 0 5px;
    font-size: 1.5em;
  }

  .player-title {
    margin: 0 0 10px;
    color: #777;
  }

  .reputation,
  .gold {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

  .reputation span:first-child,
  .gold span:first-child {
    display: inline-block;
    width: 80px; /* Align labels */
    margin-right: 5px;
    font-weight: bold;
  }

  h3 {
    margin: 0;
    font-size: 18px;
  }

  .team-details-popup {
    position: fixed; /* Or absolute, depending on desired behavior */
    bottom: 20px;
    left: 20px;
    z-index: 10; /* Ensure it's on top of other elements */
    padding: 20px;
    color: white;
    background-color: rgb(0 0 0 / 80%);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgb(0 0 0 / 50%);
  }
</style>
