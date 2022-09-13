<template>
  <section>
    <slot></slot>
  </section>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
  section {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: space-between;
    @apply overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-8 text-center rounded-xl
  }
</style>