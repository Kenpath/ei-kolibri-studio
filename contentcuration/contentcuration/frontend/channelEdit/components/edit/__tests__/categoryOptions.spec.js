import Vue from 'vue';
import Vuetify from 'vuetify';
import { shallowMount } from '@vue/test-utils';
import CategoryOptions from '../CategoryOptions.vue';

Vue.use(Vuetify);

const testDropdown = [
  {
    text: 'DAILY_LIFE',
    value: 'PbGoe2MV',
  },
  {
    text: 'CURRENT_EVENTS',
    value: 'PbGoe2MV.J7CU1IxN',
  },
  {
    text: 'DIVERSITY',
    value: 'PbGoe2MV.EHcbjuKq',
  },
  {
    text: 'ENTREPRENEURSHIP',
    value: 'PbGoe2MV.kyxTNsRS',
  },
  {
    text: 'ENVIRONMENT',
    value: 'PbGoe2MV.tS7WKnZ7',
  },
  {
    text: 'FINANCIAL_LITERACY',
    value: 'PbGoe2MV.HGIc9sZq',
  },
  {
    text: 'MEDIA_LITERACY',
    value: 'PbGoe2MV.UOTL#KIV',
  },
  {
    text: 'MENTAL_HEALTH',
    value: 'PbGoe2MV.d8&gCo2N',
  },
  {
    text: 'PUBLIC_HEALTH',
    value: 'PbGoe2MV.kivAZaeX',
  },
  {
    text: 'FOR_TEACHERS',
    value: 'ziJ6PCuU',
  },
  {
    text: 'GUIDES',
    value: 'ziJ6PCuU.RLfhp37t',
  },
  {
    text: 'LESSON_PLANS',
    value: 'ziJ6PCuU.lOBPr5ix',
  },
  {
    text: 'FOUNDATIONS',
    value: 'BCG3&slG',
  },
  {
    text: 'DIGITAL_LITERACY',
    value: 'BCG3&slG.wZ3EAedB',
  },
  {
    text: 'FOUNDATIONS_LOGIC_AND_CRITICAL_THINKING',
    value: 'BCG3&slG.0&d0qTqS',
  },
  {
    text: 'LEARNING_SKILLS',
    value: 'BCG3&slG.fP2j70bj',
  },
  {
    text: 'LITERACY',
    value: 'BCG3&slG.HLo9TbNq',
  },
  {
    text: 'NUMERACY',
    value: 'BCG3&slG.Tsyej9ta',
  },
  {
    text: 'SCHOOL',
    value: 'd&WXdXWF',
  },
  {
    text: 'ARTS',
    value: 'd&WXdXWF.5QAjgfv7',
  },
  {
    text: 'DANCE',
    value: 'd&WXdXWF.5QAjgfv7.BUMJJBnS',
  },
  {
    text: 'DRAMA',
    value: 'd&WXdXWF.5QAjgfv7.XsWznP4o',
  },
  {
    text: 'MUSIC',
    value: 'd&WXdXWF.5QAjgfv7.u0aKjT4i',
  },
  {
    text: 'VISUAL_ART',
    value: 'd&WXdXWF.5QAjgfv7.4LskOFXj',
  },
  {
    text: 'COMPUTER_SCIENCE',
    value: 'd&WXdXWF.e#RTW9E#',
  },
  {
    text: 'MECHANICAL_ENGINEERING',
    value: 'd&WXdXWF.e#RTW9E#.8ZoaPsVW',
  },
  {
    text: 'PROGRAMMING',
    value: 'd&WXdXWF.e#RTW9E#.CfnlTDZ#',
  },
  {
    text: 'WEB_DESIGN',
    value: 'd&WXdXWF.e#RTW9E#.P7s8FxQ8',
  },
  {
    text: 'HISTORY',
    value: 'd&WXdXWF.zWtcJ&F2',
  },
  {
    text: 'LANGUAGE_LEARNING',
    value: 'd&WXdXWF.JDUfJNXc',
  },
  {
    text: 'MATHEMATICS',
    value: 'd&WXdXWF.qs0Xlaxq',
  },
  {
    text: 'ALGEBRA',
    value: 'd&WXdXWF.qs0Xlaxq.0t5msbL5',
  },
  {
    text: 'ARITHMETIC',
    value: 'd&WXdXWF.qs0Xlaxq.nG96nHDc',
  },
  {
    text: 'CALCULUS',
    value: 'd&WXdXWF.qs0Xlaxq.8rJ57ht6',
  },
  {
    text: 'GEOMETRY',
    value: 'd&WXdXWF.qs0Xlaxq.lb7ELcK5',
  },
  {
    text: 'STATISTICS',
    value: 'd&WXdXWF.qs0Xlaxq.jNm15RLB',
  },
  {
    text: 'READING_AND_WRITING',
    value: 'd&WXdXWF.kHKJ&PbV',
  },
  {
    text: 'LITERATURE',
    value: 'd&WXdXWF.kHKJ&PbV.DJLBbaEk',
  },
  {
    text: 'LOGIC_AND_CRITICAL_THINKING',
    value: 'd&WXdXWF.kHKJ&PbV.YMBXStib',
  },
  {
    text: 'READING_COMPREHENSION',
    value: 'd&WXdXWF.kHKJ&PbV.r7RxB#9t',
  },
  {
    text: 'WRITING',
    value: 'd&WXdXWF.kHKJ&PbV.KFJOCr&6',
  },
  {
    text: 'SCIENCES',
    value: 'd&WXdXWF.i1IdaNwr',
  },
  {
    text: 'ASTRONOMY',
    value: 'd&WXdXWF.i1IdaNwr.mjSF4QlF',
  },
  {
    text: 'BIOLOGY',
    value: 'd&WXdXWF.i1IdaNwr.uErN4PdS',
  },
  {
    text: 'CHEMISTRY',
    value: 'd&WXdXWF.i1IdaNwr.#r5ocgid',
  },
  {
    text: 'EARTH_SCIENCE',
    value: 'd&WXdXWF.i1IdaNwr.zbDzxDE7',
  },
  {
    text: 'PHYSICS',
    value: 'd&WXdXWF.i1IdaNwr.r#wbt#jF',
  },
  {
    text: 'SOCIAL_SCIENCES',
    value: 'd&WXdXWF.K80UMYnW',
  },
  {
    text: 'ANTHROPOLOGY',
    value: 'd&WXdXWF.K80UMYnW.ViBlbQR&',
  },
  {
    text: 'CIVIC_EDUCATION',
    value: 'd&WXdXWF.K80UMYnW.F863vKiF',
  },
  {
    text: 'POLITICAL_SCIENCE',
    value: 'd&WXdXWF.K80UMYnW.K72&pITr',
  },
  {
    text: 'SOCIOLOGY',
    value: 'd&WXdXWF.K80UMYnW.75WBu1ZS',
  },
  {
    text: 'WORK',
    value: 'l7DsPDlm',
  },
  {
    text: 'PROFESSIONAL_SKILLS',
    value: 'l7DsPDlm.#N2VymZo',
  },
  {
    text: 'TECHNICAL_AND_VOCATIONAL_TRAINING',
    value: 'l7DsPDlm.ISEXeZt&',
  },
  {
    text: 'INDUSTRY_AND_SECTOR_SPECIFIC',
    value: 'l7DsPDlm.ISEXeZt&.pRvOzJTE',
  },
  {
    text: 'SKILLS_TRAINING',
    value: 'l7DsPDlm.ISEXeZt&.&1WpYE&n',
  },
  {
    text: 'TOOLS_AND_SOFTWARE_TRAINING',
    value: 'l7DsPDlm.ISEXeZt&.1JfIbP&N',
  },
];

describe('CategoryOptions', () => {
  it('smoke test', () => {
    const wrapper = shallowMount(CategoryOptions);
    expect(wrapper.isVueInstance()).toBe(true);
  });
  it('emits expected data', () => {
    const wrapper = shallowMount(CategoryOptions);
    const value = 'string';
    wrapper.vm.$emit('input', value);

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input.length).toBe(1);
    expect(wrapper.emitted().input[0]).toEqual([value]);
  });
  const expectedFamilyTree = [
    { text: 'SCHOOL', value: 'd&WXdXWF' },
    { text: 'ARTS', value: 'd&WXdXWF.5QAjgfv7' },
    { text: 'DANCE', value: 'd&WXdXWF.5QAjgfv7.BUMJJBnS' },
  ];

  describe('display', () => {
    it('has a tooltip that displays the tree for value of an item', () => {
      const wrapper = shallowMount(CategoryOptions);
      const item = 'd&WXdXWF.5QAjgfv7.BUMJJBnS'; // 'Dance'
      const expectedToolTip = 'School - Arts - Dance';

      expect(wrapper.vm.tooltipHelper(item)).toEqual(expectedToolTip);
    });
    it(`dropdown has 'levels' key necessary to display the nested structure of categories`, () => {
      const wrapper = shallowMount(CategoryOptions);
      const dropdown = wrapper.vm.categoriesList;
      const everyCategoryHasLevelsKey = dropdown.every(item => 'level' in item);

      expect(everyCategoryHasLevelsKey).toBeTruthy();
    });
  });

  describe('nested family structure', () => {
    it('can display all the ids of family tree of an item', () => {
      const wrapper = shallowMount(CategoryOptions);
      const item = 'd&WXdXWF.5QAjgfv7.BUMJJBnS'; //'Dance'
      const expectedFamilyTreeIds = expectedFamilyTree.map(item => item.value);

      expect(wrapper.vm.findFamilyTreeIds(item).sort()).toEqual(expectedFamilyTreeIds.sort());
    });
    it('can display array of objects of family tree of an item', () => {
      const wrapper = shallowMount(CategoryOptions);
      const item = 'd&WXdXWF.5QAjgfv7.BUMJJBnS'; //'Dance'

      expect(wrapper.vm.displayFamilyTree(testDropdown, item)).toEqual(expectedFamilyTree);
    });
  });

  describe('interactions', () => {
    it('when user checks an item, that is emitted to the parent component', () => {
      const wrapper = shallowMount(CategoryOptions);
      const item = 'abcd';
      wrapper.vm.$emit = jest.fn();
      wrapper.vm.add(item);

      expect(wrapper.vm.$emit.mock.calls[0][0]).toBe('input');
      expect(wrapper.vm.$emit.mock.calls[0][1]).toEqual([item]);
    });
    it('when user unchecks an item, that is emitted to the parent component', () => {
      const wrapper = shallowMount(CategoryOptions);
      const item = 'defj';
      wrapper.vm.$emit = jest.fn();
      wrapper.vm.remove(item);

      expect(wrapper.vm.$emit.mock.calls[0][0]).toBe('input');
      expect(wrapper.vm.$emit.mock.calls[0][1]).toEqual([]);
    });
  });

  describe('close button on chip interactions', () => {
    it('in the autocomplete bar, the chip is removed when user clicks on its close button', () => {
      const wrapper = shallowMount(CategoryOptions, {
        data() {
          return { selected: ['remove me', 'abc', 'def', 'abc.'] };
        },
      });
      const originalChipsLength = wrapper.vm.selected.length;
      wrapper.vm.remove('remove me');
      const chips = wrapper.vm.selected;

      expect(chips.length).toEqual(originalChipsLength - 1);
    });
  });
});
