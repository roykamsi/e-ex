<template>
  <section>
    <h1>Page not found</h1>
    <router-link to="/">Go to home page</router-link>
    <div class="img-wrapper"><img src="../img/not found page img.svg" alt="Not found"></div>
  </section>
</template>

<style>
  .img-wrapper {
    width: 15%;
    margin: 0 auto;
    margin-top: 2rem;
  }
  @media screen and (max-width: 767px) {
    .img-wrapper {
      width: 80%
    }
  }
</style>