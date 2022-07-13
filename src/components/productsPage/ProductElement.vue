<template>
  <BaseCard>
    <div class="img-container">
      <img :src="pimage" :alt="pname">
    </div>
    <h2>{{pname}}</h2>
    <div>
      <span>
        {{ppcategory}}
      </span>
      <span>
        {{pprice}}
      </span>
    </div>
  </BaseCard>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['pname', 'pimage', 'pprice', 'pcategory', 'pid'])
</script>

<style lang="scss" scoped>

</style>