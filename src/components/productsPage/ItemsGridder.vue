<template>
  <div>
    <slot></slot>
  </div>
</template>

<style scoped>
div {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin: 0 auto;
  width: 100%;
}
@media screen and (max-width: 767px) {
  div {
    grid-template-columns: 1fr
  }
}
</style>
