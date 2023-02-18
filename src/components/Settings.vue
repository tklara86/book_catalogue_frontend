<script setup>
  import { ref } from 'vue';

  const accentColorLocalStorage = localStorage.getItem('accent-color');
  const accentColor = accentColorLocalStorage ? ref(accentColorLocalStorage) : ref('purpule')
 
  const modal = document.querySelector('#modal');
  const container = document.querySelector('.container');

  const tooltipText = ref("");




const updateAccentColor = (e) => {
  const color = e.target.closest('input').value;
  localStorage.setItem('accent-color', color);   
  modal.className = `container--${color}`;
  container.className = `container container--${color}`
}



// const showTooltip = (e) => {
//   var rect = e.target.getBoundingClientRect();
//   const tooltip = document.querySelector('#tooltip');


//   tooltip.style.top =  (rect.top + 30) + 'px';
//   tooltip.style.left =  (rect.left) + 'px';
//   tooltipText.value = e.target.dataset.tooltip

// }


</script>

<template>
  <div class="settings-container">
    <h1>Settings</h1>
    <div class="setting-wrapper">
     <div class="setting-header">
      <h3>Appearance</h3>
      <p>Choose your accent colour</p>
     </div>


      <div @click="updateAccentColor" class="accent-color-wrapper">
        
        <label @mouseenter="showTooltip" class="radio-container purpule" data-tooltip="purpule">
          <input type="radio" checked="checked" name="radio" value="purpule" v-model="accentColor">
          <span class="checkmark"></span>
        </label>
        <label @mouseenter="showTooltip" class="radio-container green" data-tooltip="green">
          <input type="radio" name="radio" value="green" v-model="accentColor">
          <span class="checkmark"></span>
        </label>
        <label @mouseenter="showTooltip" class="radio-container blue" data-tooltip="blue">
          <input type="radio" name="radio" value="blue" v-model="accentColor">
          <span class="checkmark"></span>
        </label>

        <label @mouseenter="showTooltip" class="radio-container black" data-tooltip="black">
          <input type="radio" name="radio" value="black" v-model="accentColor">
          <span class="checkmark"></span>
        </label>
     
        
      </div>
      
    </div>
    <!--<Teleport to="#tooltip">
      <div class="tooltip">
        <p>{{tooltipText}}</p>
      </div>
    </Teleport> -->

 
  </div>


  
</template>


<style scoped lang="scss">

.settings-container {
    padding: 50px;
  }

  .accent-color-wrapper {
    display: flex;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .setting-wrapper {
    margin-top: 20px;
    padding: 20px;
    background: #f7f7f7;
    border-radius: 4px;
    border: 1px solid #eee;
  }

  .radio-container.purpule .checkmark {
    background-color: #7135bb;
  }
  .radio-container.green .checkmark {
    background-color:#027a48;
  }
  .radio-container.blue .checkmark {
    background-color: #0040c1;
  }

  .radio-container.black .checkmark {
    background-color: #272727;
  }

  .setting-header {

    border-bottom: 1px solid #dadada;
    padding: 10px 0;
    p {
      font-size: 14px;
    }

  }


  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 22px;
    width: 22px;
    
    border-radius: 50%;
  }

  .radio-container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
  .radio-container input {
    opacity: 0;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    width: 25px;
    height: 25px;
    z-index: 2;
}

  /* On mouse-over, add a grey background color */
/* .radio-container:hover input ~ .checkmark {
  background-color: #ccc;
} */

/* When the radio button is checked, add a blue background */


/* Create the indicator (the dot/circle - hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the indicator (dot/circle) when checked */
.radio-container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the indicator (dot/circle) */

.radio-container.purpule .checkmark:after { border: 2px solid #7135bb; }
.radio-container.green .checkmark:after { border: 2px solid #027a48; }
.radio-container.blue .checkmark:after { border: 2px solid #0040c1; }

.radio-container.black .checkmark:after { border: 2px solid #272727; }
.radio-container .checkmark:after {
  top: -4px;
  left: -4px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  line-height: 35px;
  position: absolute;
}

</style>


