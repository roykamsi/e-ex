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
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5rem;
    outline: .8px solid #777;
  }
</style>