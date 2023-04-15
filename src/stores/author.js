import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthorStore = defineStore('authors', () => {
  
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
  const handlePostAuthor = (credentials) => {
    const {firstName, lastName, description } = credentials;

  
    loading.value = true
    errors.value = false

    if (firstName.trim() === '') {
      loading.value = false
      errors.value = true
      return responseMessage.value = "First Name is required"
    }

    if (lastName.trim() === '') {
      loading.value = false
      errors.value = true
      return responseMessage.value = "Last Name is required"
    }



    postData('http://localhost:5200/v1/author', {first_name: firstName, last_name: lastName, description: description})
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


  const handleUpdateAuthor = (data) => {
    const {id, first_name, last_name, description} = data
    loading.value = true
    errors.value = false

    if (first_name.trim() === '') {
      loading.value = false
      errors.value = true
      return responseMessage.value = "First name cannot be empty"
    }
    if (last_name.trim() === '') {
      loading.value = false
      errors.value = true
      return responseMessage.value = "Last name cannot be empty"
    }

    fetch(`http://localhost:5200/v1/authors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ id, first_name, last_name, description }),
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


  return { handlePostAuthor, handleUpdateAuthor, responseMessage, loading, errors, submitted }
})
