<template>
  <div
    class="container"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div class="row one">
      <div
        v-for="(item, index) in row1"
        :key="index"
        class="cell"
        :style="{ backgroundImage: `url(${item.image})` }"
        @mouseover="hoverItem = item"
        @mouseleave="hoverItem = null"
      >
        <div class="cell-content">
          <h3>{{ item.title }}</h3>
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
      >
        <div class="cell-content">
          <h3>{{ item.title }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        backgroundImage: '/img/bg1.png',
        row1: [
          { title: 'Item 1', image: '/img/7.png' },
          { title: 'Item 2', image: '/img/military-camp.png' },
          { title: 'Item 3', image: '/img/tavern1.png' },
        ],
        row2: [
          { title: 'Item 1', image: '/img/1.png' },
          { title: 'Item 2', image: '/img/2.png' },
          { title: 'Item 3', image: '/img/3.png' },
          { title: 'Item 4', image: '/img/4.png' },
          { title: 'Item 5', image: '/img/5.png' },
          { title: '兵营', image: '/img/military-camp.png' },
          { title: '商店', image: '/img/store.png' },
          { title: '酒馆', image: '/img/tavern1.png' },
        ],
        hoverItem: null,
      };
    },
  };
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
      cursor: pointer;
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

    &.one .cell {
      height: 70vh;

      &:hover {
        box-shadow: 0 0 10px rgb(0 0 0 / 30%);
        transform: scale(1.025);
      }
    }

    &.two .cell {
      height: 22vh;

      &:hover {
        box-shadow: 0 0 10px rgb(0 0 0 / 30%);
        transform: scale(1.1);
      }
    }
  }

  h3 {
    margin: 0;
    font-size: 18px;
  }
</style>
