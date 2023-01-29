<script setup>
  const accentColorLocalStorage = localStorage.getItem('accent-color');
</script>

<template>
  <div :class="`container container--${accentColorLocalStorage}`">
    <slot name="sidebar"></slot>
    <slot name="main"></slot>
  </div>
</template>

<style scoped>
  .container {

    display: grid;
    grid-template-columns: max-content 1fr;
  }

  .accent-color-wrapper {
    position: absolute;
    bottom: 20px;
    left: 20px;
  }
</style>