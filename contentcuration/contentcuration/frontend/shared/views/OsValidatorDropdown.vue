<template>
  <VAutocomplete
    v-model="os_validator_value"
    class="language-dropdown"
    label="OS Validators"
    box
    v-bind="$attrs"
    :items="OsValidator"
    :itemText="OsValidatorText"
    color="primary"
    itemValue="id"
    autoSelectFirst
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
import { OsValidatorList } from 'shared/leUtils/OsValidator';
export default {
  name: 'OsValidatorDropdown',
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
    os_validator_value: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    OsValidator() {
      return OsValidatorList;
    },
    menuProps() {
      return {
        minWidth: 300,
        maxWidth: 300,
      };
    },
  },
  methods: {
    OsValidatorText(item) {
      return this.$tr('osItemText', { osValidator: item.text });
    },
  },
  $trs: {
    osItemText: '{osValidator} ',
  },
};
</script>