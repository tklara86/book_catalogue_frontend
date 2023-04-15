<script setup>
import {ref, reactive, onMounted, watch} from "vue";
import { onClickOutside } from '@vueuse/core';
import { useAuthorStore } from '../stores/author.js'
import { storeToRefs } from 'pinia';
// Components
import Spinner from '../components/Spinner.vue';
import MainHeader from '../components/MainHeader.vue';
import Table from '../components/Table.vue';

// pinia
const authorStore = useAuthorStore();
const { responseMessage, loading, errors, submitted } = storeToRefs(authorStore);

const authorCredentials = reactive({
  firstName: "",
  lastName: "",
  description: ""
})

// refs
const isModalOpen = ref(false)
const modal = ref(null)
const authors = ref(null)
const loadingTable = ref(true)
const runUpdate = ref(false)
const authorId = ref(null)

onClickOutside(modal, () => (isModalOpen.value = false, runUpdate.value = false, authorCredentials.firstName = '', authorCredentials.lastName = '', authorCredentials.description = ''))

// onMounted
onMounted(async() => {
  await fetch('http://localhost:5200/v1/authors')
    .then(response => response.json())
    .then(data => {
    
    authors.value = data.results

    if (authors.value) {
      loadingTable.value = false
    }
  });
})


watch(submitted, () => {
  if (submitted.value) {
    fetch('http://localhost:5200/v1/authors')
      .then(response => response.json())
      .then(data => {
     
        authors.value = data.results
    });
  }
})

// handle submit form
const handleSubmit = () => {
  authorStore.handlePostAuthor(authorCredentials) 

  // if no errors
  if (errors.value === false) {
    authorCredentials.firstName = '';
    authorCredentials.lastName = '';
    authorCredentials.description = '';
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
      name: "Author"
    },
    {
      id: 3,
      name: "Books"
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
  data: authors,
  fields: ['author_name', 'author_books', 'date_added', 'date_updated'], // from json response
  loading: loadingTable
}

const deleteAuthor = (ids) => {
  const data = { ids }
  fetch(`http://localhost:4000/v1/authors`, {
    method: 'DELETE',
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
      fetch('http://localhost:5200/v1/authors')
      .then(response => response.json())
      .then(data => {
        authors.value = data.results
      });
    });

}


const updateAuthor = (id) => {
 isModalOpen.value = true;
 runUpdate.value = true;
 authorId.value = id;

 fetch(`http://localhost:5200/v1/authors/${id}`)
  .then(response => response.json())
  .then(data => {
    authorCredentials.firstName = data.author.first_name
    authorCredentials.lastName = data.author.last_name
    authorCredentials.description = data.author.description
    
  })
 
}


const handleUpdate = () => {
  const data = {
    id: authorId.value,
    first_name: authorCredentials.firstName,
    last_name: authorCredentials.lastName,
    description: authorCredentials.description
  }

  authorStore.handleUpdateAuthor(data)
     // if no errors
    if (errors.value === false) {
      authorCredentials.firstName,
      authorCredentials.lastName,
      authorCredentials.description
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
  <MainHeader @open-modal="isModalOpen = true" heading="Authors" subHeading="Manage your authors" btnText="Add new author"></MainHeader>
  <!-- Table component -->
  <Table @delete="deleteAuthor" @update="updateAuthor" :tableStructure="tStructure"></Table>

  <Teleport to="#modal">
      <Transition name="modal">
        <div class="modal-bg" v-if="isModalOpen">
          <div class="modal" ref="modal">
            <div class="modal-content">
            <div class="modal-content-top">
              <h3>Author</h3>
              <div class="form-control">
                  <label class="form-label" for="first_name">First Name</label>
                  <input v-model="authorCredentials.firstName" class="input-control input-control--small" type="text" name="first_name" placeholder="First Name">
                  <label class="form-label" for="last_name">Last Name</label>
                  <input v-model="authorCredentials.lastName" class="input-control input-control--small" type="text" name="last_name" placeholder="Last Name">
                  <label class="form-label" for="description">Description (optional)</label>
                  <textarea v-model="authorCredentials.description" rows="5" cols="50" class="input-control input-control--small" name="description" placeholder="Description"></textarea>
              </div>
            </div>
            
            


              <template v-if="runUpdate">
                <div class="modal-buttons">
                  <button class="cta-btn neutral" @click="isModalOpen = false">Cancel</button>  
                  <button class="cta-btn submit" @click="handleUpdate" :model="authorId">
                    <vue-feather v-if="!loading" class="modal-heading--icon" type="edit"></vue-feather>
                    <span v-if="!loading">
                      <template v-if="runUpdate ? ctaButton = 'Update Author' : ctaButton = 'Add new Author'">
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
                        <template v-if="runUpdate ? ctaButton = 'Update Author' : ctaButton = 'Add new Author'">
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

