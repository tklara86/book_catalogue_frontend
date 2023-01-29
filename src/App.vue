<script setup>
  import Container from './components/Container.vue';
  import Nav from './components/Nav.vue'
  import { RouterView } from 'vue-router';


</script>

<template>
  <Container>
    <template #sidebar>
        <Nav></Nav>
    </template>
    
      <template #main>
        <RouterView v-slot="{Component}">
          <Transition name="component" mode="out-in">
            <component :is="Component"></component>
          </Transition>
        </RouterView>
      </template>

   
  </Container>
</template>


<style scoped>
.component-enter-active,
.component-leave-active {
  transition: all 0.25s ease;
}
.component-enter-from,
.component-leave-to {
  opacity: 0;

}
</style>

