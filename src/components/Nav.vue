<script setup>
  import { ref } from 'vue'
  import {RouterLink} from 'vue-router'

  const showLink = ref(true);
  const showHideSubLinks = () => {
    showLink.value = !showLink.value
  }
</script>

<template>
  <div class="nav-container">
    <div class="logoClass">
      <img src="@/assets/book-catalogue-logo.png" alt="book catalogue logo" />
    </div>
    <div class="linkClass">
      <RouterLink to="/"><vue-feather class="navigation--icon" type="home"></vue-feather>Home</RouterLink>
      <a href="#" @click="showHideSubLinks"><vue-feather class="navigation--icon" type="edit"></vue-feather>Catalog<vue-feather class="navigation--icon open" :type="showLink ? 'chevron-down' : 'chevron-right'"></vue-feather></a>
        <div>
          <RouterLink class="sub-link" v-if="showLink" to="/books"><vue-feather class="navigation--icon sub-icon" type="book"></vue-feather>Books</RouterLink>
          <RouterLink class="sub-link" v-if="showLink" to="/authors"><vue-feather class="navigation--icon sub-icon" type="users"></vue-feather>Authors</RouterLink>
          <RouterLink class="sub-link" v-if="showLink" to="/categories"><vue-feather class="navigation--icon sub-icon" type="list"></vue-feather>Categories</RouterLink>
        </div>
      <RouterLink to="/settings"><vue-feather class="navigation--icon" type="sliders">Settings</vue-feather>Settings</RouterLink>
    </div>
  </div>

</template>

<style scoped>
  .navigation--icon {
    margin-right: 10px;
    width: 20px;   
  }
  .nav-container {

    padding: 20px;
    height: 100vh;
    background: #f7f7f7;
    border-right: 1px solid #eee;
  }

  .linkClass  a {
    display: flex;
    align-items: center;
  }

  .logoClass img {
    width: 150px;
    height: auto;
    vertical-align: bottom;
  }

  a {
    text-decoration: none;
    color: #141414;
    transition: 0.4s;
    font-weight: 600;
  }

  a.sub-link {
    margin-left: 20px;
  }
  .linkClass a {
    transition: all .3s ease;
    border-radius: 5px;
    padding: 2px;
  }
 

  .container--purpule .linkClass a:hover {
    color: #7135bb;
  }
  .container--green .linkClass a:hover {
    color: #027a48;
  }
  .container--blue .linkClass a:hover {
    color: #0040c1;
  }

  .linkClass a:not(:last-of-type) {
    margin-bottom: 10px;
  }
  .linkClass a.sub-link {
    margin-bottom: 5px;
  }
  .linkClass a.sub-link:last-of-type {
    margin-bottom: 10px;
  }
  hr {
    border: 1px solid #d9d9d9;
  }

  .linkClass {
    display: grid;
    margin-top: 50px;
  }

  .sublinks-enter-active,
.sublinks-leave-active {
  transition: all 0.25s ease;
}

.sub-links-enter-from,
.sub-links-leave-to {
  opacity: 0;
 transform: translateX(10px)
}

.navigation--icon.open {
  width: 16px;
}

</style>