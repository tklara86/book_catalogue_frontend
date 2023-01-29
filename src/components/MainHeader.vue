<script setup>
  const props = defineProps(["heading", "subHeading", "btnText"])
</script>

<template>
   <div class="home-container">
      <div class="home-container-wrapper">
        <div class="home-header">
          <h2>{{props.heading}}</h2>
          <p v-if="props.subHeading">{{props.subHeading}}</p>
        </div>
        <button @click="$emit('openModal')" class="cta-btn"><vue-feather type="plus-square"></vue-feather>{{props.btnText}}</button>
      </div>
    </div>
</template>