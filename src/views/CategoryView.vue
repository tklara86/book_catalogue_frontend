<script setup>
import {ref, reactive, onMounted, watch} from "vue";
import { useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core';
import { useCategoryStore } from '../stores/category.js'
import { storeToRefs } from 'pinia';
//Components
import Spinner from '../components/Spinner.vue';
import MainHeader from '../components/MainHeader.vue';
import Table from '../components/Table.vue';

// pinia
const categoryStore = useCategoryStore();
const { responseMessage, loading, errors, submitted } = storeToRefs(categoryStore);
loading.value = false

const categoryCredentials = reactive({
  name: ""
})
//refs
const isModalOpen = ref(false)
const modal = ref(null)
const categories = ref(null)
const loadingTable = ref(true)
const router = useRouter();
const runUpdate = ref(false)

const ctaButton = ref('');

const categoryId = ref(null)

onClickOutside(modal, () => (isModalOpen.value = false, runUpdate.value = false, categoryCredentials.name = ''))


// onMounted
onMounted(async() => {
  await fetch('http://localhost:5200/v1/categories')
    .then(response => response.json())
    .then(data => {
      const sortedItems = Object.values(data.results).sort((a, b) => {
        return a['books_in_category'] - b['books_in_category'];
      });
      categories.value =   data.results; //sortedItems 
  });
})

// watch
watch(submitted, () => {
  if (submitted.value) {
    fetch('http://localhost:5200/v1/categories')
      .then(response => response.json())
      .then(data => {
        categories.value = data.results
      });
  }

})

const handleSubmit = () => {
  categoryStore.handlePostCategory(categoryCredentials) 

    // if no errors
    if (errors.value === false) {
      categoryCredentials.name = '';
    }

    //clear alert after 4s
    setTimeout(() => {
      responseMessage.value = '';
    }, 4000)

}

  if (isModalOpen) {
    const modal = document.querySelector('#modal');
    const accentColor = localStorage.getItem('accent-color')
    modal.classList.add(`container--${accentColor}`)
  }


  // table structure
  const tStructure = {
    tHeadings: [
    
      {
        id: 2,
        name: "Name"
      },
      {
        id: 3,
        name: "Books in Category"
      },
      {
        id: 4,
        name: "Date added"
      },
      {
        id: 5,
        name: "Updated"
      },
    ],
    data: categories,
    fields: ['name', 'books_in_category', 'date_added', 'date_updated'],
    loading: false
  }

const deleteCategory = (ids) => {
  const data = { ids }
  fetch(`http://localhost:5200/v1/categories`, {
    method: 'DELETE',
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
      
      fetch('http://localhost:5200/v1/categories')
        .then(response => response.json())
        .then(data => {
          categories.value = data.results
      });
  
    });

}

const updateCategory = (id) => {
 isModalOpen.value = true;
 runUpdate.value = true;
 categoryId.value = id;
 fetch(`http://localhost:5200/v1/categories/${id}`)
  .then(response => response.json())
  .then(data => {
    categoryCredentials.name = data.category.name
    
  })
 
}

const handleUpdate = () => {
  const data = {
  id: categoryId.value,
  name: categoryCredentials.name
}
  categoryStore.handleUpdateCategory(data)
     // if no errors
    if (errors.value === false) {
      categoryCredentials.name = '';
    }

    //clear alert after 4s
    setTimeout(() => {
      responseMessage.value = '';
    }, 4000)
}

</script>

<template>
  <main>
  <!-- Main Header component -->
  <MainHeader @open-modal="isModalOpen = true" heading="Categories" subHeading="Manage your categories" btnText="Add new category"></MainHeader>
   <!-- Table component -->
   <Table @delete="deleteCategory" @update="updateCategory" :tableStructure="tStructure"></Table>

  <Teleport to="#modal">
      <Transition name="modal">
        <div class="modal-bg" v-if="isModalOpen">
          <div class="modal" ref="modal">
            
         
          
              <div class="modal-content">
                <div class="modal-content-top">
              
          
                  <h3>Category</h3>

                  <div class="form-control">
                    <label class="form-label" for="first_name">Category Name</label>
                    <input v-model="categoryCredentials.name" class="input-control input-control--small" type="text" name="first_name" placeholder="Category name">
                  </div>
                </div>
                

              
      
                <template v-if="runUpdate">
                  <div class="modal-buttons">
                    <button class="cta-btn neutral" @click="isModalOpen = false">Cancel</button>
                    <button class="cta-btn submit" @click="handleUpdate" :model="categoryId">
                    <vue-feather v-if="!loading" class="modal-heading--icon" type="edit"></vue-feather>
                    <span v-if="!loading">
                      <template v-if="runUpdate ? ctaButton = 'Update Category' : ctaButton = 'Add new Category'">
                        {{ctaButton}}
                      </template>
                      
                    </span>
                    <Spinner v-if="loading" text="Processing.."></Spinner>
                  </button>   
                  </div>
               
                </template>
                <template v-else>
                  <div class="modal-buttons">
                    <button class="cta-btn neutral" @click="isModalOpen = false">Cancel</button>
                    <button class="cta-btn submit" @click="handleSubmit">
                      <vue-feather v-if="!loading" class="modal-heading--icon" type="plus-square"></vue-feather>
                      <span v-if="!loading">
                        <template v-if="runUpdate ? ctaButton = 'Update Category' : ctaButton = 'Add new Category'">
                          {{ctaButton}}
                        </template>
                        
                      </span>
                      <Spinner v-if="loading" text="Processing.."></Spinner>
                  </button> 
                  </div>
          
                </template>
              

         

                  <Transition name="alert">
                    <div v-if="responseMessage" :class="errors ? 'alert-message alert-message--danger' : 'alert-message alert-message--success'">
                      <div class="alert-inner">
                        <vue-feather class="alert-icon" :type="errors ? 'alert-circle' : 'check-circle'"></vue-feather>
                        <p v-if="responseMessage">{{responseMessage}}</p>
                      </div>
                      <vue-feather @click="responseMessage=false" class="alert-close" type="x"></vue-feather>
                    </div>
                  </Transition>
              </div>
            
      
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

