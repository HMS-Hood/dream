<template>
  <a-space direction="vertical" style="width: 100%">
    <a-row>
      <a-col :span="12" class="a">aaa</a-col>
      <a-col :span="12">bbb</a-col>
    </a-row>
    <a-row>
      <a-col :span="12">ccc</a-col>
      <a-col :span="12">ccc</a-col>
    </a-row>
  </a-space>
</template>

<script lang="ts" setup>
  import logo from '@/assets/images/login-banner.png';

  const i = 1;
</script>

<style lang="less" scoped>
  .a {
    height: 500px;
    background-image: url('@/assets/images/login-banner.png');
  }
</style>
