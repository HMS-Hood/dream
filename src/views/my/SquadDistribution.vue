<template>
  <div>
    <div v-for="squad in army.squads" :key="squad.id">
      <h2>Squad ID: {{ squad.id }}</h2>
      <h2>Squad Troops: {{ squad.members.length }}</h2>
      <h2>Squad position: {{ squad.position }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Army } from '../../core/interfaces/combat';

  const props = defineProps<{
    army: Army;
  }>();
</script>
