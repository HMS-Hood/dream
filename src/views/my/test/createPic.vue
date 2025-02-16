<template>
  <div>{{ description }}</div>
  <a-button @click="renewDesc">生成</a-button>
  <a-button
    @click="
      copy(description);
      Message.info('copy');
    "
    >复制</a-button
  >
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useClipboard } from '@vueuse/core';
  import { Message } from '@arco-design/web-vue';
  import {
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
    description.value = `A full-body portrait of a queen standing gracefully. 
    She wears a ${armorMain} glamorous armor with ${armorBorder} border, paires dark brown Pantyhose. 
    Her high-heeled boots, expertly designed and crafted, peek out from beneath 
    the armor, accentuating her every step. The heels are sturdy yet stylish, 
    melding seamlessly with the armor to create an impression of both grace and power. 
    Her ${randomHairColor} hair was styled with ${randomHairLength} ${randomHairStyle} and ${randomFrontStyle}. Digital fantasy art style and 
    Japanese anime style ${desc}`;
  };
</script>
