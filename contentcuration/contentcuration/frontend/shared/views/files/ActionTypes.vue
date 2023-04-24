<template>
  <div>
    <span></span>
    <div v-if="actionType === 'excel_compare_cell_with_value'">
      <VLayout>
        <h1 class="subheading" tabindex="0" aria-label="Prompt File">Prompt File</h1>
        <br />
        <UploadTextFiles />
      </VLayout>
      <VLayout>
        <VTextField
          label="Value"
          maxlength="200"
          counter
          autofocus
          box
          class="mt-4"
          @input="getterSetterValue"
        >
        </VTextField>
      </VLayout>
      <VLayout v-if="actionType === 'excel_compare_cell_with_value'">
        <VTextField label="Excel Cell Box" maxlength="200" counter box class="mt-4"> </VTextField>
      </VLayout>
      <VLayout v-if="actionType === 'excel_compare_cell_with_value'">
        <VTextField label="Sheet Number" maxlength="200" counter box class="mt-4"> </VTextField>
      </VLayout>
    </div>
  </div>
</template>
<script>
import UploadTextFiles from 'shared/views/files/UploadTextFiles.vue';
import { mapGetters, mapActions } from 'vuex';
import { updateAnswersToQuestionType, assessmentItemKey } from '../../../channelEdit/utils';

// function getterSetterValue(value){
//       let obj = {
//         excel_value : value
//       }
//       let payload = {
//         ...obj,
//       }
//       console.log('payload OBJ',payload)
//       this.$emit('update', payload)
//     }
export default {
  name: 'ActionTypes',
  components: {
    UploadTextFiles,
  },
  computed: {
    value: {
        get() {
          return '';
        },
        set(value) {
          this.getterSetterValue('value');
        },
    }
  },
  methods:{
    ...mapActions(['setUnsavedChanges']),
    ...mapActions('contentNode', ['addActionValues']),
    getterSetterValue(value){
      let obj = {
        excel_value : value
      }
      let payload = {
        ...obj,
      }
      let id = this.assessmentId
      payload = {
        ...assessmentItemKey(this.item),
        ...payload,
      };
      this.$emit('update', payload);
      this.addActionValues({id, ...payload})
    }
  },
  mounted() {
    console.log('ActionTypeEnter');
  },
  props: {
    actionType: '',
    assessmentId : '',
    item: {
      type: Object,
    },
  },
};
</script>
