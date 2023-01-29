<script setup>  
  const props = defineProps(['text'])
</script>

<template>
  <div class="process-submit">
    <div class="half-circle-spinner">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>
    <p>{{props.text}}</p>
  </div>
</template>

<style scoped lang="scss">
 .half-circle-spinner, .half-circle-spinner * {
    box-sizing: border-box;
  }

  .half-circle-spinner {
    width: 20px;
    height: 20px;
    border-radius: 100%;
    position: relative;
    margin-right: 5px;

    .circle {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 100%;
      border: calc(20px / 10) solid transparent;
    }
  }


  .half-circle-spinner .circle.circle-1 {
    border-top-color: #fff;
    animation: half-circle-spinner-animation 1s infinite;
  }

  .half-circle-spinner .circle.circle-2 {
    border-bottom-color: #fff;
    animation: half-circle-spinner-animation 1s infinite alternate;
  }

  @keyframes half-circle-spinner-animation {
    0% {
      transform: rotate(0deg);

    }
    100%{
      transform: rotate(360deg);
    }
  }
  .process-submit {
    display: flex;
    align-items: center;

    p {
      color: #fff;
    }
  }

</style>
