<template>

  <VAutocomplete
    v-model="taughtValue"
    class="language-dropdown"
    label="Taught App"
    box
    v-bind="$attrs"
    :items="TaughtAppItems"
    :itemText="TaughtAppText"
    color="primary"
    itemValue="id"
    :allowOverflow="false"
    clearable
    :search-input.sync="input"
    :menu-props="menuProps"
    :multiple="multiple"
    :chips="multiple"
    @change="input = ''"
    @focus="$emit('focus')"
  />

</template>

<script>

  import { taughtAppList } from 'shared/leUtils/TaughtApp';

  export default {
    name: 'TaughtAppDropdown',
    props: {
      value: {
        type: [String, Array, Object],
        default() {
          return [];
        },
      },
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
      taughtValue: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        },
      },
      TaughtAppItems() {
        console.log('taughtAppList', taughtAppList);
        return taughtAppList;
      },
      menuProps() {
        return {
          minWidth: 300,
          maxWidth: 300,
        };
      },
    },
    methods: {
      TaughtAppText(item) {
        console.log('item', item);
        return this.$tr('taughtItemText', { taughtTextValue: item.text });
      },
    },
    $trs: {
      taughtItemText: '{taughtTextValue} ',
    },
  };

</script>
