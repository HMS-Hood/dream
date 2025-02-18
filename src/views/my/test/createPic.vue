<template>
  <div>{{ description }}</div>
  <div class="large" @click="renewDesc">生成</div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useClipboard } from '@vueuse/core';
  import { Message } from '@arco-design/web-vue';
  import {
    profession,
    poses,
    pantyhoseColor,
    hairColor,
    hairStyle,
    hairStyleWithLength,
    hairStyleLong,
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
    const randomPose = poses[Math.floor(Math.random() * poses.length)];
    const randomPantyhoseColor =
      pantyhoseColor[Math.floor(Math.random() * pantyhoseColor.length)];
    const randomHairColor =
      hairColor[Math.floor(Math.random() * hairColor.length)];
    const totalStyle = [...hairStyleLong, ...hairStyle, ...hairStyleWithLength];
    const randomHairStyleIndex = Math.floor(
      Math.random() *
        (hairStyleLong.length + hairStyle.length + hairStyleWithLength.length)
    );
    const randomHairStyle = totalStyle[randomHairStyleIndex];
    let randomHairLength = '';
    if (randomHairStyleIndex >= hairStyleLong.length + hairStyle.length) {
      randomHairLength = '';
    } else if (randomHairStyleIndex >= hairStyleLong.length) {
      randomHairLength =
        hairLength[Math.floor(Math.random() * hairLength.length)];
    } else {
      randomHairLength = hairLength[Math.floor(Math.random() * 3)];
    }
    const randomFrontStyle =
      hairFrontStyle[Math.floor(Math.random() * hairFrontStyle.length)];
    const [armorMain, armorBorder] =
      armorColor[Math.floor(Math.random() * armorColor.length)];
    const desc =
      backgroundDesc[Math.floor(Math.random() * backgroundDesc.length)];
    let suitDesc = ` She wears a ${armorMain} glamorous armor with ${armorBorder} border, paires ${randomPantyhoseColor} pantyhose.`;
    if (Math.random() > 0.4) {
      suitDesc = '';
    }
    description.value = `/image model:⭐ FLUX.1.1 Pro prompt:A full-body portrait of a ${randomProfession} standing ${randomPose}.${suitDesc} 
Her footwear consists of expertly designed and crafted high-heeled boots. The heels are sturdy yet stylish, accentuating her every step with an impression of both grace and power.
Her ${randomHairColor} hair was styled with ${randomHairLength} ${randomHairStyle}${randomFrontStyle}. Digital fantasy art style and 
Japanese anime style ${desc}`;
    copy(description.value);
    Message.info('copy');
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
