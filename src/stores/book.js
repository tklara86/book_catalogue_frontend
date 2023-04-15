import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBookStore = defineStore('books', () => {
  
  const responseMessage = ref("")
  const loading = ref(false)
  const errors = ref(false)
  const submitted = ref(false)


  async function postData(url = '', data) {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // handle post book function
  const handlePostBook = (credentials, data, authors) => {
    const { title, status } = credentials;
    loading.value = true
    errors.value = false

    if (title.trim() === '') {
      loading.value = false
      errors.value = true
      return responseMessage.value = "Please provide title"
    }

    if (data.length === 0) {
      loading.value = false
      errors.value = true
  
      return responseMessage.value = "Please select at least category"
    }

    if (status <= 0) {
      loading.value = false
      errors.value = true

      return responseMessage.value = "Please select status"
    }

    postData('http://localhost:5200/v1/book', {title: credentials.title, status: credentials.status, status_id: credentials.status, categories: data, authors: authors})
    .then((data) => {
      let errorMsg = '';
      if (data.error) {
        for (let err in data.error) {
          errorMsg += data.error[err] + ', '
        }
        responseMessage.value = errorMsg
        errorStatus.value = true;
      }
      if (data.success) {
        responseMessage.value = data.success.client_message;         
        loading.value = false;
        errors.value = false
        submitted.value = true
      }
    });
  
    responseMessage.value = "";
    submitted.value = false

    
  }

  const handleUpdateBook = (data) => {
    const { id, title, status, categories, authors } = data

    let updated_categories = []
    let updated_authors = [];

    for (const categoryId of categories.value) {
      updated_categories = [...updated_categories, categoryId]
    }

    for (const authorId of authors.value) {
      updated_authors = [...updated_authors, authorId]
    }

    loading.value = true
    errors.value = false

    if (title.trim() === '') {
      loading.value = false
      errors.value = true
      return responseMessage.value = "Title cannot be empty"
    }


    fetch(`http://localhost:5200/v1/books/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ id, title, status, updated_categories, updated_authors }),
      })
      .then(response => response.json())
      .then((json) => {
        let errorMsg = '';
        if (json.error) {
          for (let err in data.error) {
            errorMsg += data.error[err] + ', '
          }
          responseMessage.value = errorMsg
          errorStatus.value = true;
        }
        
        if (json.success) {
          responseMessage.value = json.success.client_message; 
          loading.value = false;
          errors.value = false
          submitted.value = true

        }
    
      });

      responseMessage.value = "";     
      submitted.value = false 
  
  }

  return { handlePostBook, handleUpdateBook, responseMessage, loading, errors, submitted }
})
