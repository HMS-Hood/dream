<template>
  <a-modal
    v-model:visible="visible"
    :modal-style="{ 'background-color': 'rgb(78, 78, 78, 0.8)' }"
    :fullscreen="true"
    :closable="false"
    @before-ok="handleBeforeOk"
  >
    <check-character
      v-model:characters="displayList"
      :width="95"
      :height="91"
    ></check-character>
  </a-modal>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { CharacterInterface } from '../../core/interfaces';
  import CheckCharacter from './component/CheckCharacter.vue';

  const props = defineProps<{
    checkedIds?: string[];
    characters: CharacterInterface[];
  }>();

  const emit = defineEmits<{
    (e: 'changeChecked', checkedIdList: string[]): void;
  }>();

  const visible = defineModel<boolean>('visible');

  const displayList = computed(() =>
    props.characters.map((item) =>
      reactive({
        character: item,
        checked: props.checkedIds?.includes(item.id) ?? false,
      })
    )
  );

  const handleBeforeOk = () => {
    const returnList = displayList.value
      .filter((item) => item.checked)
      .map((item) => item.character.id);
    emit('changeChecked', returnList);
    return true;
  };
</script>

<style lang="less" scoped></style>
