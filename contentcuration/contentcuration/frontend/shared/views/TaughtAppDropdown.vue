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
    aria-required="true"
  >
    <template #item="{ item }">
      <VTooltip bottom>
        <template v-slot:activator="{ on }">
          <span tabindex="5" class="text-truncate" v-on="on">{{ TaughtAppText(item) }}</span>
        </template>
        <span>{{ TaughtAppText(item) }}</span>
      </VTooltip>
    </template>
  </VAutocomplete>
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
      return this.$tr('taughtItemText', { taughtTextValue: item.text });
    },
  },
  $trs: {
    taughtItemText: '{taughtTextValue} ',
  },
};
</script>
