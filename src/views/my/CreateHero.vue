<template>
  <div
    class="container"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div class="form-panel">
      <!-- 返回按钮，保持与其它页面统一 -->
      <back />
      <a-card class="hero-card">
        <h2 class="title">创建主角</h2>
        <a-form
          :model="info"
          label-col="{ span: 6 }"
          wrapper-col="{ span: 18 }"
          class="hero-form"
          @submit="onSubmit"
        >
          <a-form-item label="名字" required>
            <a-input v-model="info.name" placeholder="请输入名字" />
          </a-form-item>
          <a-form-item label="昵称" required>
            <a-input v-model="info.nickName" placeholder="请输入昵称" />
          </a-form-item>
          <a-form-item label="头像ID" required>
            <a-input
              v-model="info.avatarId"
              placeholder="例如：0001"
              maxlength="4"
            />
          </a-form-item>

          <a-divider>基本属性 (总值：{{ totalAttributes }} / 96)</a-divider>

          <div class="attributes-grid">
            <a-form-item
              v-for="(value, key) in attributes"
              :key="key"
              :label="attributeLabels[key]"
            >
              <a-input-number
                v-model="attributes[key]"
                :default-value="12"
                :min="9"
                :max="18"
              />
            </a-form-item>
          </div>
          <div v-if="totalAttributes > 96" class="error">
            总属性值不能超过96
          </div>
          <a-form-item wrapper-col="{ offset: 6 }">
            <a-button
              type="primary"
              html-type="submit"
              :disabled="totalAttributes > 96"
            >
              确定
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
      <div class="game-controls">
        <button class="btn save-btn" @click="saveGame">保存游戏</button>
        <button class="btn load-btn" @click="loadGame">载入游戏</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { player } from '@/core/game';
  import { Character } from '@/core/entities/Character';
  import { CharacterLevel } from '@/core/enums';
  import { Equipments } from '@/core/entities/Equipments';
  import { generateId } from '@/core/utils/utils';
  import { load, save } from '@/core/utils/systemUtils';
  import back from './component/back.vue';

  const backgroundImage = ref('/img/bg/bg2.png');

  interface HeroInfo {
    name: string;
    nickName: string;
    avatarId: string;
  }

  const info = reactive<HeroInfo>({
    name: '',
    nickName: '',
    avatarId: '',
  });

  // 8项属性初始值均为12，可调范围为9～18
  const attributes = reactive({
    strength: 12,
    agility: 12,
    endurance: 12,
    intelligence: 12,
    spirit: 12,
    perception: 12,
    charm: 12,
    luck: 12,
  });

  // 属性对应的中文标签
  const attributeLabels: Record<string, string> = {
    strength: '力量',
    agility: '敏捷',
    endurance: '耐力',
    intelligence: '智力',
    spirit: '精神',
    perception: '感知',
    charm: '魅力',
    luck: '幸运',
  };

  // 实时计算8项属性总和
  const totalAttributes = computed(() => {
    return (
      attributes.strength +
      attributes.agility +
      attributes.endurance +
      attributes.intelligence +
      attributes.spirit +
      attributes.perception +
      attributes.charm +
      attributes.luck
    );
  });

  const router = useRouter();

  const onSubmit = (): boolean => {
    if (totalAttributes.value > 96) {
      Message.error('总属性值不能超过96');
      return false;
    }
    // 对头像ID进行处理：移除非数字字符，并补足为4位数字
    let processedAvatarId = info.avatarId.replace(/\D/g, '');
    processedAvatarId = processedAvatarId.padStart(4, '0');

    // 创建主角对象：等级固定为1、经验为0，技能和装备为空
    const hero = new Character({
      id: generateId(),
      name: info.name,
      nickName: info.nickName,
      avatar: `/img/avatar/${processedAvatarId}.png`,
      level: CharacterLevel.ROOKIE,
      experience: 0,
      skills: [],
      equipment: new Equipments(),
      ...attributes,
    });

    // 将主角对象保存到全局 player 对象中（此处假定 player 对象已定义相应字段）
    player.setProtagonist(hero);
    Message.success('主角创建成功！');
    router.push({ name: 'main' });
    return false;
  };

  const saveGame = () => {
    try {
      save();
      Message.success('游戏已保存');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('保存游戏失败', error);
      Message.warning('保存游戏失败，请重试。');
    }
  };

  const loadGame = () => {
    try {
      load();
      router.push({ name: 'main' });
      Message.success('游戏已载入');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('载入游戏失败', error);
      Message.error('载入游戏失败，请重试。');
    }
  };
</script>

<style scoped>
  .container {
    min-height: 100vh;
    padding: 30px;
    background-position: center;
    background-size: cover;
  }

  .form-panel {
    max-width: 700px;
    margin: 0 auto;
  }

  .hero-card {
    padding: 20px;
    background-color: rgb(255 255 255 / 90%);
    border-radius: 8px;
    box-shadow: 0 2px 12px rgb(0 0 0 / 30%);
  }

  .title {
    margin-bottom: 20px;
    color: #333;
    font-size: 24px;
    text-align: center;
  }

  .hero-form {
    margin-top: 20px;
  }

  .attributes-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .error {
    margin-bottom: 16px;
    color: red;
    text-align: center;
  }

  .game-controls {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 30px;

    .btn {
      padding: 10px 20px;
      font-size: 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .save-btn {
      color: #fff;
      background-color: #4caf50;

      &:hover {
        background-color: #43a047;
      }
    }

    .load-btn {
      color: #fff;
      background-color: #2196f3;

      &:hover {
        background-color: #1e88e5;
      }
    }
  }
</style>
