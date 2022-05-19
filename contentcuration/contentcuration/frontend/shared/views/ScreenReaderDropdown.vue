<template>
  <VAutocomplete
    v-model="screen_reader_value"
    class="screenReader-dropdown"
    label="Screen Reader"
    box
    v-bind="$attrs"
    :items="screenTextReader"
    :itemText="ScreenReaderText"
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
  >
  </VAutocomplete>
</template>
<script>
import isArray from 'lodash/isArray';
import { ScreenReaderList } from 'shared/leUtils/ScreenReader';
import { includes } from 'lodash';
let screenReaderData = [];
export default {
  name: 'ScreenReaderDropDown',
  props: {
    value: {
      type: [Array, String, Object],
      validator: function (value) {

        if (typeof value === 'object') {
          Object.keys(value).map(function (key, valueData) {
            if (!screenReaderData.includes(key)) {
              screenReaderData.push(key);
            }
          });
          console.log(screenReaderData);
          return screenReaderData;
        } else {
          return [];
        }
      },
      default() {
        return [];
      },
    },
    box: {
      type: Boolean,
      default: true,
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
    screen_reader_value: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    screenTextReader() {
      return ScreenReaderList;
    },
    menuProps() {
      return {
        minWidth: 300,
        maxWidth: 300,
      };
    },
  },
  methods: {
    ScreenReaderText(item) {
      return this.$tr('screenItemText', { screenReader: item.text });
    },
  },
  $trs: {
    screenItemText: '{screenReader} ',
  },
};
</script>
