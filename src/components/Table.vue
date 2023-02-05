<script setup>
  import { ref, watch } from 'vue';
  import SpinnerAlt from './SpinnerAlt.vue';
  const props = defineProps(['tableStructure', 'selectAll'])

  let checkedIds = ref([]);
  let selectedAll = ref(false)
  let selected = '';

  const emit = defineEmits(['delete', 'update',])


  watch(checkedIds, () => {
    let ids = [];
    for (let value in props.tableStructure.data.value) {
      ids.push(props.tableStructure.data.value[value].id);
    }
    
    selectedAll.value = checkedIds.value.length < ids.length ? false : true;
    selected = checkedIds.value.length > 1 ? checkedIds.value.length + ' records' : checkedIds.value.length + ' record';

  })

  const ignoreDelete = () => {
    checkedIds.value.length = 0;
    selectedAll.value = false
  }

  const toggleCheckbox = () => {
    selectedAll.value = !selectedAll.value
    let ids = [];
    for (let value in props.tableStructure.data.value) {
      ids.push(props.tableStructure.data.value[value].id);
    }

    checkedIds.value = selectedAll.value ? ids : []
    
  }

</script>

<template>
  <div v-if="!props.tableStructure.loading.value" class="table">
    <table v-if="props.tableStructure.data">
      <tr>
        <th>
          <input id="0" @click="toggleCheckbox"  class="checkbox-input" type="checkbox" v-model="selectedAll"/>
          <label class="checkbox checkbox-table" for="0">
            <span>
              <svg width="12px" height="10px">
                <use xlink:href="#check"></use>
              </svg>
            </span>
            <span></span>
          </label>
        </th>
        <th v-for="(tHeading, index) in props.tableStructure.tHeadings" :key="index">{{tHeading.name}}</th>
      </tr>
      <tr v-for="(value, index) in props.tableStructure.data.value" :key="index" :class="checkedIds.includes(value.id) ? 'checkbox-selected' : ''">
        <!-- # -->
        <td>
          <input :id="index + 1" class="checkbox-input" :value="value.id" v-model="checkedIds"  type="checkbox"  />
          <label class="checkbox checkbox-table" :for="index + 1">
            <span>
              <svg width="12px" height="10px">
                <use xlink:href="#check"></use>
              </svg>
            </span>
            <span></span>
          </label>
          </td>
        <!-- Rest of the fields -->
        <td v-for="(field, index) in props.tableStructure.fields" :key="index">
            <!-- check for fields as array  -->
            <span v-if="(typeof value[field] === 'object')" v-for="(val, index) in value[field]" :key="index">
              <template v-if="props.tableStructure.sub_fields" v-for="(sub_field, index) in props.tableStructure.sub_fields" :key="index">
                {{ val[sub_field] }}
              </template>
            </span>
            <span :class="field === 'status_name' ? 'status status--' + value['status_id'] : ''" v-else>
                {{ value[field] }}
            </span>
        </td>
        <div class="action-btn-wrapper">
          <button @click="$emit('update', value.id)" class="action-btn"><vue-feather class="icon" type="edit"></vue-feather></button>
        </div>
      </tr>
    </table>
    <div class="pagination">
      <p>Page 1 of 10</p>
      <div class="pagination-btn">
        <button class="cta-btn neutral">Previous</button>
        <button class="cta-btn neutral">Next</button>
      </div>
    </div>
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
  <Transition name="alert">
  <div class="cta-modal" v-if="checkedIds.length != 0">
    <div>
      <p><span style="color:#1a1a1a; font-weight: 600;">{{selected}}</span> selected</p>
    </div>
    <div class="cta-modal-btns">
      <button @click="ignoreDelete" class="action-btn-cancel">Cancel</button>
      <button @click="$emit('delete', [...checkedIds]), ignoreDelete()" class="action-btn-delete">Delete selected</button>
    </div>
  </div>
  </Transition>
  <SpinnerAlt v-if="props.tableStructure.loading.value" text="Getting data"></SpinnerAlt>
   
</template>





<style scoped>
  .action-btn-wrapper {
    position: absolute;
    top: 50%;
    right: 0px;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: all .2s ease;
  }

  tr:hover .action-btn-wrapper {
    opacity: 1;

  }


  .action-btn {
    border: none;
    background: none;
    line-height: 0;
    padding: 7px;
    border-radius: 25px;
    transition: all .2s ease;
  }

  .action-btn:hover {
    cursor: pointer;
    background: #e8e8e8;

  }


  

</style>