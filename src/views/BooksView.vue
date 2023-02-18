<script setup>
  import { reactive, ref, onMounted, watch } from 'vue';
  import { useBookStore } from '../stores/book.js'
  import { storeToRefs } from 'pinia';
  import { onClickOutside } from '@vueuse/core';
  import { vOnClickOutside } from '@vueuse/components'
  // Components
  import Spinner from '../components/Spinner.vue';
  import MainHeader from '../components/MainHeader.vue';
  import Table from '../components/Table.vue';

  // pinia
  const bookStore = useBookStore();
  const { responseMessage, loading, errors, submitted } = storeToRefs(bookStore);

  const bookCredentials = reactive({
    title: "",
    status: null,
  })


  // refs
  const isModalOpen = ref(false)
  const modal = ref(null)
  let checkedCategory = ref([])
  let checkedAuthors = ref([])
  const books = ref(null)
  const loadingTable = ref(true)
  const statusValue = ref("Select status");
  const selected = ref(false)

  const runUpdate = ref(false)
  const ctaButton = ref('');

  const bookId = ref(null)

  const filterCategories = ref([])
  const  filterAuthors = ref([])

  const dropdown = ref(false)
  const dropdownAuthors = ref(false)



  let authors = [];
  let categories = [];
  let bookAuthorIds = {};
  let bookCategoryIds = {};

  let categoryNames = ref({});
  let authorNames = ref({});

  onClickOutside(modal, () => (isModalOpen.value = false, runUpdate.value = false))


  const dropdownHandlerCategories = () => {
    dropdown.value = false
  }
  const dropdownHandlerAuthors = () => {
    dropdownAuthors.value = false
  }
  
  // onMounted
  onMounted(async() => {
 
    const filters = {
      //authors: [57],
    //  categories: [23,45],
      status_id: ''
    }
    
    await fetch('http://localhost:4000/v1/books?' + new URLSearchParams(filters))
    .then(response => response.json())
    .then(data => {

      books.value = data.results

      var results = data.results

      for (const [_, value] of Object.entries(results)) {
        bookCategoryIds[value.id] = value.categories
        bookAuthorIds[value.id] = value.authors;
      }   
      
      if (books.value) {
        loadingTable.value = false
      }
    });
    // get cartegories
    fetch('http://localhost:4000/v1/categories')
      .then(response => response.json())
      .then(data => {
        categories = data.results
    })

    // get authors
    await fetch('http://localhost:4000/v1/authors')
      .then(response => response.json())
      .then(data => {
        authors = data.results

    })
  })

  // onWatch
  watch(submitted, () => {
      if (submitted.value) {
        fetch('http://localhost:4000/v1/books')
          .then(response => response.json())
          .then(data => {

           
            books.value = data.results

          });
      }
  })

  watch(filterCategories, () => {
    let filteredName = filterCategories.value
    const regex = new RegExp(filteredName, "gi");
    for (var j  = 0; j < categories.length; j++) {
      let id = 'category_' + categories[j].id
      if (categories[j].name.match(regex)) {
       
        let labelId = document.querySelector(`label#${id}`)
        labelId.style.display = 'flex';
      
      } else {
        let labelId = document.querySelector(`label#${id}`)
        labelId.style.display = 'none';
      }
    }

   
  })

  watch(filterAuthors, () => {
    let filteredName = filterAuthors.value
    const regex = new RegExp(filteredName, "gi");
    for (var j  = 0; j < authors.length; j++) {
      let id = 'author_' + authors[j].id
      if (authors[j].author_name.match(regex)) {
       
        let labelId = document.querySelector(`label#${id}`)
        labelId.style.display = 'flex';
      
      } else {
        let labelId = document.querySelector(`label#${id}`)
        labelId.style.display = 'none';
      }
    }

   
  })






  const handleSubmit = () => {

    let authorIds = [];

    for (var j = 0; j < checkedAuthors.value.length; j++) {
      authorIds.push(parseInt(checkedAuthors.value[j]))
    }

    let categoryIds = [];
    for (var i = 0; i < checkedCategory.value.length; i++) {
      categoryIds.push(parseInt(checkedCategory.value[i]))
    }

    bookStore.handlePostBook(bookCredentials, categoryIds, authorIds)

    // if no errors
    if (errors.value === false) {
      statusValue.value = "Select status";
      selected.value = false;
      bookCredentials.status = null;
      bookCredentials.title = '';

    }

    //clear alert after 4s
    setTimeout(() => {
      responseMessage.value = false;
    }, 4000)

  }

  const handleSelect = (e) => {
    const option = e.target.parentNode;
    option.classList.toggle('show');

    
  }


  const getStatus = (e) => {
    const selectedOption = e.target.closest('li');
    const select = document.querySelector('.select');

    if (selectedOption) {
      bookCredentials.status = parseInt(selectedOption.dataset.statusId)
      statusValue.value = selectedOption.innerHTML
      selected.value = true;
      if (select.classList.contains('show')) {
        select.classList.remove('show');
      }
    }


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
        name: "Title"
      },
      {
        id: 3,
        name: "Author"
      },
      {
        id: 5,
        name: "Categories"
      },
      {
        id: 6,
        name: "Status"
      },
      {
        id: 7,
        name: "Date Added"
      },
      {
        id: 8,
        name: "Updated"
      },
    ],
    data: books,
    fields: ['title', 'book_authors', 'book_categories', 'status_name', 'date_added', 'date_updated'], // from json response
    sub_fields: ['author_name', 'name'], // json response
    loading: loadingTable
  }



  const deleteBook = (ids) => {
    const data = { ids }
   fetch(`http://localhost:4000/v1/books`, {
      method: 'POST',
      body: JSON.stringify(data)
     })
      .then(response => response.json())
      .then(() => {
        fetch('http://localhost:4000/v1/books')
          .then(response => response.json())
          .then(data => {
            books.value = data.results
          });
        
      });
  }

  const updateBook = (id) => {
    isModalOpen.value = true
    runUpdate.value = true
    bookId.value = id
    
    fetch(`http://localhost:4000/v1/books/${id}`)
        .then(response => response.json())
        .then(data => {
          
          bookCredentials.title = data.book.title
          bookCredentials.status = data.book.status_id
          statusValue.value = data.book.status_name
          
        })
  }


  watch(runUpdate, () => {
    if (runUpdate.value) {
      checkedCategory.value = bookCategoryIds[bookId.value]
      checkedAuthors.value = bookAuthorIds[bookId.value]
    }
  })


  watch(checkedCategory, () => {
    for (var i = 0; i < categories.length; i++) {
      // add
      if (checkedCategory.value.includes(categories[i].id)) {
        if (!categoryNames.value[categories[i].id]) {
          categoryNames.value[categories[i].id] = categories[i].name
        }
      } 
      // remove
      if (!checkedCategory.value.includes(categories[i].id)) {
        if (categoryNames.value[categories[i].id]) {
          delete categoryNames.value[categories[i].id]
      
        }
      
      } 
    }


  })

  watch(checkedAuthors, () => {
    for (var i = 0; i < authors.length; i++) {
      // add
      if (checkedAuthors.value.includes(authors[i].id)) {
        if (!authorNames.value[authors[i].id]) {
          authorNames.value[authors[i].id] = authors[i].author_name
        }
      } 
      // remove
      if (!checkedAuthors.value.includes(authors[i].id)) {
        if (authorNames.value[authors[i].id]) {
          delete authorNames.value[authors[i].id]
      
        }
      
      } 
    }


  })


  const handleUpdate = () => {
    
    const data = {
    id: bookId.value,
    title: bookCredentials.title,
    status: bookCredentials.status,
    categories: checkedCategory,
    authors: checkedAuthors
  }

  bookStore.handleUpdateBook(data)

     //if no errors
    if (errors.value === false) {
      
    }

    //clear alert after 4s
    setTimeout(() => {
      responseMessage.value = '';
    }, 4000)
} 

const removeTag = (id, target) => {
  switch (target){
    case 'authors':
      checkedAuthors.value.splice(checkedAuthors.value.indexOf(parseInt(id)), 1)
      delete authorNames.value[id]
      break;
    case 'categories':
      checkedCategory.value.splice(checkedCategory.value.indexOf(parseInt(id)), 1)
      delete categoryNames.value[id]
      break;

  }
  checkedCategory.value.splice(checkedCategory.value.indexOf(parseInt(id)), 1)
  delete categoryNames.value[id]
  
}


</script>

<template>
  <main>
    <!-- Main Header component -->
    <MainHeader @open-modal="isModalOpen = true" heading="Books" subHeading="Manage your books" btnText="Add new book"></MainHeader>
    <!-- Table component -->
    <Table @delete="deleteBook" @update="updateBook" :tableStructure="tStructure"></Table>

    <Teleport to="#modal">
      <Transition name="modal">
        <div class="modal-bg" v-if="isModalOpen">
          <div class="modal" ref="modal">
            <div class="modal-content">
              <div class="modal-content-top">
                <h3>Book</h3>
                <div class="form-control">
                    <!-- Title -->
                    <label class="form-label" for="title">Title</label>
                    <input v-model="bookCredentials.title" class="input-control input-control--small" type="text" name="title" placeholder="Title">
                    <!-- Status -->
                    <label class="form-label" for="status">Status</label>
                    <div class="select mt-0 mb-0">
                      <div @click="handleSelect" :class="selected ? 'custom-select selected' : 'custom-select'">
                          <span :model="statusValue" class="value">{{statusValue}}</span>
                          <vue-feather class="icon dropdown-icon" type="chevron-down"></vue-feather>
                      </div>
                      <div class="option">
                        <ul @click="getStatus" class="custom-option">
                          <li data-status-id="1">Not read</li>
                          <li data-status-id="2">In Progress</li>
                          <li data-status-id="3">Read</li>
                        </ul>
                      </div>
                    </div>
                      <!-- Authors -->
                      <label class="form-label" for="status">Authors</label>
                      <div v-if="Object.keys(authorNames).length" class="tags-wrapper">
                          <template v-for="(value, key) in authorNames">
                              <span class="tag-item">{{value}}<vue-feather @click="removeTag(key, 'authors')" class="icon dropdown-icon" type="x"></vue-feather></span>
                            </template>
                      </div>
                      <input @click.stop ="dropdownAuthors = !dropdownAuthors" v-model="filterAuthors" class="input-control input-control--small input-control-multiple" type="text" name="authors" placeholder="Authors">
                      <div v-if="dropdownAuthors" v-on-click-outside.bubble="dropdownHandlerAuthors" :class="dropdownAuthors ? 'option show' : 'option'">
                        <div class="checkbox-container">
                          <div v-if="authors">
                            <div v-for="author in authors" :key="'author_' + author.id">
                          
                            <input :class="checkedAuthors.includes(author.id) ? 'checkbox-input selected' : 'checkbox-input'" :id="'author_' + author.id" type="checkbox" :value="author.id" v-model="checkedAuthors"  />
                              <label :id="'author_' + author.id" class="checkbox" :for="'author_' + author.id">
                                <span>
                                  <svg width="12px" height="10px">
                                    <use xlink:href="#check"></use>
                                  </svg>
                                </span>
                                <span>{{author.author_name}}</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    
                      <label class="form-label" for="status">Categories</label>
                      <div v-if="Object.keys(categoryNames).length" class="tags-wrapper">
                        <template v-for="(value, key) in categoryNames">
                            <span class="tag-item">{{value}}<vue-feather @click="removeTag(key, 'categories')" class="icon dropdown-icon" type="x"></vue-feather></span>
                        </template>
                      </div>
                        <input @click.stop ="dropdown = !dropdown" v-model="filterCategories" class="input-control input-control--small input-control-multiple" type="text" name="categories" placeholder="Categories">
                        <div v-if="dropdown" v-on-click-outside.bubble="dropdownHandlerCategories" :class="dropdown ? 'option show' : 'option'">
                          <div class="checkbox-container">
                            <div v-if="categories">
                              <div v-for="category in categories" :key="'category_' + category.id">
                            
                              <input :class="checkedCategory.includes(category.id) ? 'checkbox-input selected' : 'checkbox-input'" :id="'category_' + category.id" type="checkbox" :value="category.id" v-model="checkedCategory"  />
                                <label :id="'category_' + category.id" class="checkbox" :for="'category_' + category.id">
                                  <span>
                                    <svg width="12px" height="10px">
                                      <use xlink:href="#check"></use>
                                    </svg>
                                  </span>
                                  <span>{{category.name}}</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- SVG checkmark -->
                        <div>
                          <svg class="checkbox-symbol">
                            <symbol id="check" viewbox="0 0 12 10">
                              <polyline
                                points="1.5 6 4.5 9 10.5 1"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                              ></polyline>
                            </symbol>
                          </svg>
                        </div>
                  </div> <!-- form control -->
              </div> <!-- modal content top end -->
        
              <template v-if="runUpdate">
                <div class="modal-buttons">
                  <button class="cta-btn neutral" @click="isModalOpen = false">Cancel</button>
                  <button class="cta-btn submit" @click="handleUpdate" :model="bookId">
                  <vue-feather v-if="!loading" class="modal-heading--icon" type="edit"></vue-feather>
                  <span v-if="!loading">
                    <template v-if="runUpdate ? ctaButton = 'Update Book' : ctaButton = 'Add new Book'">
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
                      <template v-if="runUpdate ? ctaButton = 'Update Book' : ctaButton = 'Add new Book'">
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
            </div> <!-- modal content -->
          </div> <!-- modal end -->
        </div>
      </Transition>
    </Teleport>


  </main>
</template>


<style scoped>
.checkbox-symbol {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
  user-select: none;
}
.checkbox-input {
  position: absolute;
  visibility: hidden;
}

.checkbox {
  user-select: none;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  margin: 5px;
  border: 1px solid transparent;
  margin-bottom: 5px;
}

.checkbox:hover {

  background: #faf8fd;
}





.checkbox span {
  vertical-align: middle;
  transform: translate3d(0, 0, 0);
}

.checkbox span:first-child {
  position: relative;
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  transform: scale(1);
  border: 1px solid #7d3dca;
  transition: all 0.3s ease;
}

.checkbox span:first-child svg {
  position: absolute;
  top: 3px;
  left: 2px;
  fill: none;
  stroke: #fff;
  stroke-dasharray: 16px;
  stroke-dashoffset: 16px;
  transition: all 0.3s ease;
  transform: translate3d(0, 0, 0);
}

.checkbox span:last-child {
  padding-left: 8px;
  line-height: 18px;
}

.checkbox:hover span:first-child {
  border-color: #7d3dca;
}

.checkbox-input:checked + .checkbox span:first-child {
  background: #a153ff;
  border-color: #7d3dca;

  animation: zoom-in-out 0.3s ease;
}



.checkbox-input:checked + .checkbox span:first-child svg {
  stroke-dashoffset: 0;
}

@keyframes zoom-in-out {
  50% {
    transform: scale(0.9);
  }
}




</style>