<!-- <template>
  <VAutocomplete
    v-model="screen_reader"
    class="language-dropdown"
    label="Screen Reader"
    box
    v-bind="$attrs"
    :items="[{ text: 'JAWS' }, { text: 'NVDA' }, { text: 'Narrator' }]"
    color="primary"
    itemValue="id"
    autoSelectFirst
    clearable
    :allowOverflow="false"
    :rules="rules"
    :required="required"
    :search-input.sync="input"
    :menu-props="menuProps"
    :multiple="multiple"
    :chips="multiple"
    
    @change="input = ''"
    @focus="$emit('focus')"
  >
  </VAutocomplete>
</template> -->

<template>
    <VAutocomplete
          v-model="screen_reader"
          class="language-dropdown"
          label="Screen Reader"
          box
          v-bind="$attrs"
          :items="[{ text: 'JAWS' }, { text: 'NVDA' }, { text: 'Narrator' }]"
          color="primary"
          itemValue="id"
          autoSelectFirst
          :allowOverflow="false"
          clearable
          :rules="rules"
          :required="required"
          :search-input.sync="input"
          :menu-props="menuProps"
          :multiple="multiple"
          :chips="multiple"
          @change="input = ''"
          @focus="$emit('focus')"
        >
        </VAutocomplete>
</template>

<script>
export default {
  name: 'ScreenReaderDropDown',
  props:{
    multiple: {
        type: Boolean,
        default: true,
      },
  },
  data() {
    return {
      input: '',  
    };
  },
  computed: {
    screen_reader_value: {
      get() {
        return '{screen_reader}';
      },
      set(value) {
        this.$emit('input', '{screen_reader}');
      },
    },
  }
  
}
</script>