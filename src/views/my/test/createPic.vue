<template>
  <div>{{ description }}</div>
  <div class="large" @click="renewDesc">生成</div>
  <div
    class="large"
    @click="
      copy(description);
      Message.info('copy');
    "
    >复制
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useClipboard } from '@vueuse/core';
  import { Message } from '@arco-design/web-vue';
  import {
    profession,
    pantyhoseColor,
    hairColor,
    hairStyle,
    hairLength,
    hairFrontStyle,
    armorColor,
    backgroundDesc,
  } from './data';

  const description = ref<string>('');
  const { copy } = useClipboard();

  const renewDesc = () => {
    const randomProfession =
      profession[Math.floor(Math.random() * profession.length)];
    const randomPantyhoseColor =
      pantyhoseColor[Math.floor(Math.random() * pantyhoseColor.length)];
    const randomHairColor =
      hairColor[Math.floor(Math.random() * hairColor.length)];
    const randomHairStyle =
      hairStyle[Math.floor(Math.random() * hairStyle.length)];
    const randomHairLength =
      hairLength[Math.floor(Math.random() * hairLength.length)];
    const randomFrontStyle =
      hairFrontStyle[Math.floor(Math.random() * hairFrontStyle.length)];
    const [armorMain, armorBorder] =
      armorColor[Math.floor(Math.random() * armorColor.length)];
    const desc =
      backgroundDesc[Math.floor(Math.random() * backgroundDesc.length)];
    description.value = `A full-body portrait of a ${randomProfession} standing gracefully. 
    She wears a ${armorMain} glamorous armor with ${armorBorder} border, paires ${randomPantyhoseColor} pantyhose. 
    Her high-heeled boots, expertly designed and crafted, peek out from beneath 
    the armor, accentuating her every step. The heels are sturdy yet stylish, 
    melding seamlessly with the armor to create an impression of both grace and power. 
    Her ${randomHairColor} hair was styled with ${randomHairLength} ${randomHairStyle}${randomFrontStyle}. Digital fantasy art style and 
    Japanese anime style ${desc}`;
  };
</script>

<style lang="less" scoped>
  .large {
    width: 200px;
    height: 100px;
    margin: 10px;
    padding: 20px;
    color: antiquewhite;
    font-size: 48px;
    text-align: center;
    background-color: darkgreen;
    cursor: pointer;

    &:hover {
      background-color: green;
    }
  }
</style>
