<template>
  <VAutocomplete
    id="taughtAppValue"
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
  <!-- <v-select
      :items="['Foo', 'Bar', 'Fizz', 'Buzz']"
      label="Fizzbuzz"
    >
    </v-select> -->

  <!-- <div>
    {{ taughtValue }} is selected 
    <select
      v-model="taughtValue"
      class="language-dropdown"
      multiple
      @change="changeCountry($event)"
      attach
      chips
    >
      <option value="" :selected="taughtValue" disabled>Please Select</option>
      <option
        v-for="country in countries"
        :value="country.text"
        :key="country.text"
        :aria-label="country.text"
      >
        {{ country.text }}
      </option>
    </select>
  </div> -->
</template>

<script>
import { TaughtAppList } from 'shared/leUtils/TaughtApp';

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
      countries: taughtAppList,
      selectedCountry: null,
      user: {
        address: {
          country: null,
        },
      },
      input: '',
    };
  },
  mounted() {
    // var vm = this;
    // // $(this.$el)
    // //   .select2({ theme: 'bootstrap', data: this.options })
    // //   .val(this.value)
    // //   .trigger('change')
    // //   .on('change', function () {
    // //     vm.$emit('input', $(this).val());
    // //   });
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
      return TaughtAppList;
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
    changeCountry(event) {
      this.user.address.country = event.target.value;
      this.selectedCountry = event.target.options[event.target.options.selectedIndex].text;
    },
  },
  $trs: {
    taughtItemText: '{taughtTextValue} ',
  },
};
</script>
