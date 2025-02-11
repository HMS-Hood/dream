<template>
  <div
    class="container"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div class="panel">
      <div class="official">
        <back></back>
        <img src="/img/recruit.png" />
      </div>
      <div class="info">
        <div class="tip"> <span>征兵处负责人安洁妮卡：</span>{{ info }} </div>
        <div class="consume">
          <div class="label">预计花费</div>
          <div class="value">{{ consume }}</div>
        </div>
        <div class="total">
          <div class="label">当前拥有</div>
          <div class="value">{{ player.gold }}</div>
        </div>
        <div class="action" @click="recruit">雇佣</div>
      </div>
    </div>
    <div class="list">
      <check-character-comp
        v-model:characters="recruitList"
        :width="70"
        :height="96"
      ></check-character-comp>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { CheckCharacter } from '../../core/interfaces';
  import CheckCharacterComp from './component/CheckCharacter.vue';
  import { generateCharacter } from '../../core/utils/utils';
  import { player } from '../../core/game';
  import back from './component/back.vue';
  import { Character } from '../../core/entities/Character';

  const backgroundImage = '/img/bg/recruit.png';
  const recruitList: CheckCharacter[] = reactive([]);
  for (let i = 1; i <= 10; i += 1) {
    recruitList.push({
      character: generateCharacter(),
      checked: false,
    });
  }

  const consume = computed(
    () => recruitList.filter((character) => character.checked).length * 100
  );
  const info = ref(
    '这里有许多正在找工作的冒险者，但是普通人总是占大多数的。用你独到的眼光发现其中的“小天才”吧！'
  );

  const recruit = () => {
    if (player.gold >= consume.value) {
      const newRecruitList = recruitList.filter(
        (character) => !character.checked
      );
      const newMembers = recruitList
        .filter((character) => character.checked)
        .map((checkcharacter) => new Character(checkcharacter.character));
      player.members.splice(player.members.length, 0, ...newMembers);
      player.gold -= consume.value;
      recruitList.splice(1, recruitList.length, ...newRecruitList);
    } else {
      info.value = '他们不会接受赊账的！';
    }
  };
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    justify-content: center;
    height: 100vh;
    padding: 20px;
    background-position: center;
    background-size: cover;

    .panel {
      position: relative;
      display: flex;
      flex-direction: column;
      flex-grow: 0;
      align-items: stretch;
      justify-content: flex-end;
      width: 26vw;
      margin-right: 20px;
      color: aliceblue;
      font-weight: bolder;
      font-size: 2em;
      background-color: rgb(127 127 127 / 50%);
      border-radius: 10px;

      .official {
        flex-basis: 1024px;
        flex-grow: 0;
        height: 100%;
        overflow: hidden;
      }

      .info {
        flex: auto;
        width: 100%;
        padding: 20px;
        background-color: rgb(0 0 0 / 80%);
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;

        .tip {
          span {
            color: goldenrod;
          }

          margin-bottom: 2em;
          color: rgb(161 161 161);
        }

        .consume,
        .total {
          display: flex;
          margin-bottom: 1em;

          .label {
            margin-right: 2em;
          }
        }

        .action {
          margin: 0 20px;
          padding: 10px;
          color: #1f1f1f;
          text-align: center;
          background-color: goldenrod;
          cursor: pointer;

          &:hover {
            color: #000;
            background-color: rgb(240 189 62);
          }
        }
      }
    }

    .list {
      flex-grow: 1;
    }
  }
</style>
