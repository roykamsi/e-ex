<template>
      <base-card>
        <div class="img-container">
          <img :src="pimage" :alt="pname">
        </div>
        <h2>{{pname}}</h2>
        <div>
          <span class="categories" v-for="cat in pcategory" :key="cat">
            {{cat}}
          </span>
          <p>
            Price: {{pprice}} $
          </p>
        </div>
        
      </base-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps(['pname', 'pimage', 'pprice', 'pcategory', 'pid'])

</script>

<style lang="scss" scoped>
.categories:not(:last-child) {
  display: inline-block;
  margin: .4rem;
  outline: 1px solid rgba(#777, .2);
  border-radius: 2.26px;
  padding: .2rem .8rem;
}
</style>