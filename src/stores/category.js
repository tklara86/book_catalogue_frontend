import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('categories', () => {
  
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


  // handle post author function
  const handlePostCategory = (credentials) => {
    const {name} = credentials;

    loading.value = true
    errors.value = false

    if (name.trim() === '') {
      loading.value = false
      errors.value = true
      return responseMessage.value = "Category name is required"
    }

    postData('http://localhost:5200/v1/category', {name: name})
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

  const handleUpdateCategory = (data) => {
    const {id, name} = data
    loading.value = true
    errors.value = false

    if (name.trim() === '') {
      loading.value = false
      errors.value = true
      return responseMessage.value = "Category name cannot be empty"
    }

    fetch(`http://localhost:5200/v1/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ id, name }),
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

  return { handlePostCategory, handleUpdateCategory, responseMessage, loading, errors, submitted }
})
