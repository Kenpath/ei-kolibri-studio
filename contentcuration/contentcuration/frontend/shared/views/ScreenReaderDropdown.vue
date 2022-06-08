<template>
  <VAutocomplete
    v-model="screen_reader_value"
    class="language-dropdown"
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
    <template #item="{ item }">
      <VTooltip bottom>
        <template v-slot:activator="{ on }">
          <span tabindex="5" class="text-truncate" v-on="on">{{ ScreenReaderText(item) }}</span>
        </template>
        <span>{{ ScreenReaderText(item) }}</span>
      </VTooltip>
    </template>
  </VAutocomplete>
</template>
<script>
import { ScreenReaderList } from 'shared/leUtils/ScreenReader';
export default {
  name: 'ScreenReaderDropDown',
  props: {
    value: {
      type: [String, Array, Object],
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
