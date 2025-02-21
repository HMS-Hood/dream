<template>
  <div class="back">
    <div class="back-icon">
      <icon-double-left
        :stroke-width="6"
        size="48"
        @click="router.push('/main')"
      ></icon-double-left>
      <icon-right size="48" @click="calendar.nextDay()"></icon-right>
      <icon-double-right
        size="48"
        @click="calendar.nextTenDay()"
      ></icon-double-right>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { calendar } from '@/core/game';

  const router = useRouter();
</script>

<style lang="less" scoped>
  .back {
    position: relative;
    width: 120px;
    margin: 20px;
    overflow: visible;
    cursor: pointer;

    .back-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      color: #fff;
      background-color: rgb(0 0 0 / 30%);
      border-radius: 5px;

      &:hover {
        background-color: rgb(0 0 0 / 50%);
        box-shadow: 0 0 10px rgb(0 0 0 / 30%);
        transform: scale(1.05);
        transform-origin: center;
        transition: transform 0.3s;
      }
    }
  }
</style>
