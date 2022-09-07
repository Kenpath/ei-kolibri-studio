<template>
  <Uploader ref="uploader" :presetID="imagePreset">
    <template #default="{ handleFiles }">
      <VLayout>
        <VFlex xs7 lg5>
          <VSelect
            :items="kindSelectItems"
            :label="$tr('questionTypeLabel')"
            data-test="kindSelect"
            :menu-props="{ offsetY: true }"
            box
            @input="onKindUpdate"
          />
        </VFlex>
      </VLayout>

      <VLayout v-if="!windowsNativeQuestion">
        <VFlex>
          <ErrorList :errors="questionErrorMessages" data-test="questionErrors" />

          <div class="grey--text mb-1 text--darken-2">
            {{ $tr('questionLabel') }}
          </div>

          <transition name="fade">
            <keep-alive include="MarkdownEditor">
              <MarkdownEditor
                v-if="isQuestionOpen"
                analyticsLabel="Question"
                :markdown="question"
                :handleFileUpload="handleFiles"
                :getFileUpload="getFileUpload"
                :imagePreset="imagePreset"
                @update="onQuestionUpdate"
                @minimize="closeQuestion"
              />
              <div
                v-else
                class="pb-3 pl-2 pr-2 pt-3 question-text"
                data-test="questionText"
                @click="openQuestion"
              >
                <VLayout align-start justify-space-between>
                  <MarkdownViewer :markdown="question" />

                  <Icon color="grey darken-1" class="mr-2"> edit </Icon>
                </VLayout>
              </div>
            </keep-alive>
          </transition>
        </VFlex>
      </VLayout>
      <VLayout> </VLayout>
      <VLayout mt-4 v-if="!windowsNativeQuestion">
        <VFlex>
          <ErrorList :errors="answersErrorMessages" data-test="answersErrors" />

          <AnswersEditor
            :questionKind="kind"
            :answers="answers"
            :openAnswerIdx="openAnswerIdx"
            :handleFileUpload="handleFiles"
            :getFileUpload="getFileUpload"
            :imagePreset="imagePreset"
            @update="onAnswersUpdate"
            @open="openAnswer"
            @close="closeAnswer"
          />

          <HintsEditor
            class="mt-4"
            :hints="hints"
            :openHintIdx="openHintIdx"
            :handleFileUpload="handleFiles"
            :getFileUpload="getFileUpload"
            :imagePreset="imagePreset"
            @update="onHintsUpdate"
            @open="openHint"
            @close="closeHint"
          />
        </VFlex>
      </VLayout>
      <VLayout v-if="windowsNativeQuestion">
        <VSelect
          :key="kindSelectKey"
          :items="applicationTypeItems"
          :value="applicationSelected"
          :label="$tr('applicationTypeLabel')"
          :menu-props="{ offsetY: true }"
          box
          @input="applicationTypeSelected"
          aria-labelledby="application_type_dropdown"
        />
        <p id="application_type_dropdown" hidden="true" v-if="applicationSelected.length">{{applicationSelected}} are selected in Action Type</p><p v-else id="application_type_dropdown" hidden="true">No Value Selected</p>
      </VLayout>
      <VLayout v-if="applicationType">
        <VSelect
          :key="kindSelectKey"
          :items="actionTypeItems"
          :label="$tr('actionTypeLabel')"
          :menu-props="{ offsetY: true }"
          :value="actionSelected"
          box
          @input="actionTypeSelected"
          aria-labelledby="action_type_dropdown"
        />
        <p id="action_type_dropdown" hidden="true" v-if="actionSelected.length">{{actionSelected}} are selected in Action Type</p><p v-else id="action_type_dropdown" hidden="true">No Value Selected</p>
      </VLayout>
      <div v-if="actionType === 'excel_compare_cell_with_value'">
        <!-- <div v-if="assessmentFileData[0] && assessmentFileData[0].original_filename">
          <VLayout>
          <p>{{assessmentFileData[0].original_filename}}</p>
        </VLayout>
        </div>
        <div v-else> -->
          <!-- <ActionTypesFunction :actionType="actionType" :assessmentId="item.assessment_id" :item="item"/> -->
        <VLayout>
          <h1 class="subheading" tabindex="0" aria-label="Prompt File">Prompt File</h1>
          <br />
          <UploadTextFiles :assessmentId="item.assessment_id" fileStatus="promptFile" :assessmentFileData="assessmentFileData[0]"/>
        </VLayout>
        <VLayout>
          <VTextField
            label="Value"
            maxlength="200"
            counter
            autofocus
            box
            class="mt-4"
            @input="excelCellValue"
            :value="dataDisplay('cell_number')"
          >
          </VTextField>
        </VLayout>
        <VLayout v-if="actionType === 'excel_compare_cell_with_value'">
          <VTextField
            @input="cellBoxValue"
            :value="dataDisplay('cell_value')"
            label="Excel Cell Box"
            maxlength="200"
            counter
            box
            class="mt-4"
          >
          </VTextField>
        </VLayout>
        <VLayout v-if="actionType === 'excel_compare_cell_with_value'">
          <VTextField
            @input="sheetNumberValue"
            :value="dataDisplay('sheet_number')"
            label="Sheet Number"
            maxlength="200"
            counter
            box
            class="mt-4"
          >
          </VTextField>
        </VLayout>
      </div>
      <div v-if="actionType === 'compare_cells'">
        <VLayout>
          <VTextField
            label="First Cell Box"
            maxlength="200"
            counter
            autofocus
            box
            class="mt-4"
            @input="firstCellNumber"
            :value="dataDisplay('first_cell_number')"
          >
          </VTextField>
        </VLayout>
        <VLayout>
          <VTextField
            @input="secondCellNumber"
            :value="dataDisplay('second_cell_number')"
            label="Second Cell Box"
            maxlength="200"
            counter
            box
            class="mt-4"
          >
          </VTextField>
        </VLayout>
        <VLayout>
          <VTextField
            @input="sheetNumberValue"
            :value="dataDisplay('sheet_number')"
            label="Sheet Number"
            maxlength="200"
            counter
            box
            class="mt-4"
          >
          </VTextField>
        </VLayout>
        <VLayout>
          <h1 class="subheading" tabindex="0" aria-label="Prompt File">Prompt File</h1>
          <br />
          <UploadTextFiles :assessmentId="item.assessment_id" fileStatus="promptFile" :assessmentFileData="assessmentFileData[0]" />
        </VLayout> <br />
        <VLayout>
          <h1 :assessmentId="item.assessment_id" fileStatus="correctFile" :assessmentFileData="assessmentFileData[1]">Correct File</h1>
          <br />
          <UploadTextFiles :assessmentId="item.assessment_id" />
        </VLayout>
      </div>
      <div v-if="actionType === 'compare_column_widths'">
        <VLayout>
          <VTextField
            label="Column Number"
            maxlength="200"
            counter
            autofocus
            box
            class="mt-4"
            @input="columnNumber"
            :value="dataDisplay('column_number')"
          >
          </VTextField>
        </VLayout>
        <VLayout>
          <VTextField
            @input="tolerance"
            :value="dataDisplay('tolerance')"
            label="Tolerance Box"
            maxlength="200"
            counter
            box
            class="mt-4"
          >
          </VTextField>
        </VLayout>
        <VLayout>
          <h1 class="subheading" tabindex="0" aria-label="Prompt File">Prompt File</h1>
          <br />
          <UploadTextFiles :assessmentId="item.assessment_id" fileStatus="promptFile" :assessmentFileData="assessmentFileData[0]" />
        </VLayout> <br />
        <VLayout>
          <h1 class="subheading" tabindex="0" aria-label="Correct File">Correct File</h1>
          <br />
          <UploadTextFiles :assessmentId="item.assessment_id" fileStatus="correctFile" :assessmentFileData="assessmentFileData[1]" />
        </VLayout>
      </div>
      <div v-if="actionType === 'compare_files_using_word'">
        <VLayout>
          <h1 class="subheading" tabindex="0" aria-label="Prompt File">Prompt File</h1>
          <br />
          <UploadTextFiles :assessmentId="item.assessment_id" fileStatus="promptFile" :assessmentFileData="assessmentFileData[0]" />
        </VLayout> <br />
        <VLayout>
          <h1 class="subheading" tabindex="0" aria-label="Correct File">Correct File</h1>
          <br />
          <UploadTextFiles :assessmentId="item.assessment_id" fileStatus="correctFile" :assessmentFileData="assessmentFileData[1]" />
        </VLayout>
      </div>
      <div v-if="actionType === 'check_slide_layout'">
        <VLayout>
          <h1 class="subheading" tabindex="0" aria-label="Prompt File">Prompt File</h1>
          <br />
          <UploadTextFiles :assessmentId="item.assessment_id" fileStatus="promptFile" :assessmentFileData="assessmentFileData[0]" />
        </VLayout> <br />
        <VTextField
            label="Slide Index"
            maxlength="200"
            counter
            autofocus
            box
            type = "Number"
            class="mt-4"
            @input="slideIndex"
            :value="dataDisplay('slide_index')"
          >
          </VTextField>
          <VSelect
          :items="layoutSlides"
          />
      </div>
      <div v-if="actionType === 'check_selected_slide' || actionType === 'comparing_notepad_files'">
        <VLayout>
          <h1 class="subheading" tabindex="0" aria-label="Prompt File">Prompt File</h1>
          <br />
          <UploadTextFiles :assessmentId="item.assessment_id" fileStatus="promptFile" :assessmentFileData="assessmentFileData[0]" />
        </VLayout> <br />
        <VLayout>
          <h1 class="subheading" tabindex="0" aria-label="Correct File">Correct File</h1>
          <br />
          <UploadTextFiles :assessmentId="item.assessment_id" fileStatus="correctFile" :assessmentFileData="assessmentFileData[1]" />
        </VLayout>
      </div>
      <div v-if="actionType === 'count_slides'">
        <VLayout>
          <h1 class="subheading" tabindex="0" aria-label="Prompt File">Prompt File</h1>
          <br />
          <UploadTextFiles :assessmentId="item.assessment_id" fileStatus="promptFile" :assessmentFileData="assessmentFileData[0]" />
        </VLayout> <br />
      </div>
    </template>
  </Uploader>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import { AssessmentItemTypeLabels } from '../../constants';
import { updateAnswersToQuestionType, assessmentItemKey } from '../../utils';
import translator from '../../translator';
import { ActionTypeList } from '../../../shared/leUtils/ActionTypes';
import { ApplicationTypeList } from '../../../shared/leUtils/ApplicationTypes';
import AnswersEditor from '../AnswersEditor/AnswersEditor';
import HintsEditor from '../HintsEditor/HintsEditor';
import { AssessmentItemTypes, ValidationErrors } from 'shared/constants';
import ErrorList from 'shared/views/ErrorList/ErrorList';
import Uploader from 'shared/views/files/Uploader';
import MarkdownEditor from 'shared/views/MarkdownEditor/MarkdownEditor/MarkdownEditor';
import MarkdownViewer from 'shared/views/MarkdownEditor/MarkdownViewer/MarkdownViewer';
import { FormatPresetsNames } from 'shared/leUtils/FormatPresets';
import UploadTextFiles from 'shared/views/files/UploadTextFiles.vue';
import ActionTypes from 'shared/views/files/ActionTypes.vue';

export default {
  name: 'AssessmentItemEditor',
  components: {
    ErrorList,
    MarkdownEditor,
    MarkdownViewer,
    AnswersEditor,
    HintsEditor,
    Uploader,
    UploadTextFiles,
    ActionTypes,
  },
  model: {
    prop: 'item',
    event: 'update',
  },
  props: {
    /**
     * An assessment item as retrieved from API:
     * {
     *    question
     *    type
     *    order
     *    answers
     *    hints
     *    ...
     * }
     */
    item: {
      type: Object,
    },
    /**
     * An array of error codes related to the item.
     */
    errors: {
      type: Array,
    },
    /**
     * Inject a function that opens a dialog that should
     * be confirmed before certain actions can be performed.
     * If not provided, no confirmation will be required.
     * Expected interface:
     *   openDialog({
     *     title: String,
     *     message: String,
     *     cancelLabel: String,
     *     submitLabel: String,
     *     onCancel: Function,
     *     onSubmit: Function,
     *   })
     * })
     */
    openDialog: {
      type: Function,
    },
  },
  data() {
    return {
      isQuestionOpen: false,
      openHintIdx: null,
      openAnswerIdx: null,
      kindSelectKey: 0,
      windowsNativeQuestion: false,
      applicationType: false,
      actionType: '',
      actionTypeList: [],
      applicationTypeValue: '',
      defaultActionData: [],
      assessmentId: '',
      assessmentFileData : ''
    };
  },
  computed: {
    ...mapGetters('file', ['getFileUpload']),
    question() {
      if (!this.item || !this.item.question) {
        return '';
      }

      return this.item.question;
    },
    imagePreset() {
      return FormatPresetsNames.EXERCISE_IMAGE;
    },
    kind() {
      if (!this.item || !this.item.type) {
        return AssessmentItemTypes.SINGLE_SELECTION;
      }

      return this.item.type;
    },
    applicationSelected() {
      console.log('this.action data', this.applicationType);
      if (this.item.application_type && this.item.application_type.length) {
        this.applicationType = true;
        this.applicationTypeValue = this.item.application_type;
      }
      return this.item.application_type;
    },
    actionSelected() {
      console.log('Action Type', ActionTypeList[this.item.application_type][0].value);
      if (this.item.action_type && this.item.action_type.length) {
        this.actionType = this.item.action_type;
        let indexValue = 0
        ActionTypeList[this.item.application_type].map((value, index) =>{
            if(value.value === this.action_type){
              indexValue = index
            }
        })
        return ActionTypeList[this.item.application_type][indexValue].value;
      }
    },
    kindSelectItems() {
      return [
        {
          value: AssessmentItemTypes.SINGLE_SELECTION,
          text: translator.$tr(AssessmentItemTypeLabels[AssessmentItemTypes.SINGLE_SELECTION]),
        },
        {
          value: AssessmentItemTypes.MULTIPLE_SELECTION,
          text: translator.$tr(AssessmentItemTypeLabels[AssessmentItemTypes.MULTIPLE_SELECTION]),
        },
        {
          value: AssessmentItemTypes.INPUT_QUESTION,
          text: translator.$tr(AssessmentItemTypeLabels[AssessmentItemTypes.INPUT_QUESTION]),
        },
        {
          value: AssessmentItemTypes.TRUE_FALSE,
          text: translator.$tr(AssessmentItemTypeLabels[AssessmentItemTypes.TRUE_FALSE]),
        },
        {
          value: AssessmentItemTypes.WINDOW_NATIVE_QUESTION,
          text: translator.$tr(
            AssessmentItemTypeLabels[AssessmentItemTypes.WINDOW_NATIVE_QUESTION]
          ),
        },
      ];
    },
    actionTypeItems() {
      this.actionTypeList = ActionTypeList[this.applicationTypeValue];
      return this.actionTypeList;
    },
    applicationTypeItems() {
      return ApplicationTypeList;
    },
    layoutSlides() {
      return [
        {
          value : 'layout1',
          text : 'Layout 1'
        },
        {
          value : 'layout2',
          text : 'Layout 2'
        },
        {
          value : 'layout3',
          text : 'Layout 3'
        },
        {
          value : 'layout4',
          text : 'Layout 4'
        },
        {
          value : 'layout5',
          text : 'Layout 5'
        },
        {
          value : 'layout6',
          text : 'Layout 6'
        },
      ]
    },
    answers() {
      if (!this.item || !this.item.answers) {
        return [];
      }

      return this.item.answers;
    },
    hints() {
      if (!this.item || !this.item.hints) {
        return [];
      }

      return this.item.hints;
    },
    questionErrorMessages() {
      const errorMessages = [];

      if (this.errors && this.errors.includes(ValidationErrors.QUESTION_REQUIRED)) {
        errorMessages.push(translator.$tr(`errorQuestionRequired`));
      }

      return errorMessages;
    },
    answersErrorMessages() {
      if (
        !this.errors ||
        !this.errors.includes(ValidationErrors.INVALID_NUMBER_OF_CORRECT_ANSWERS)
      ) {
        return [];
      }

      const errorMessages = [];

      switch (this.kind) {
        case AssessmentItemTypes.SINGLE_SELECTION:
        case AssessmentItemTypes.TRUE_FALSE:
          errorMessages.push(translator.$tr(`errorMissingAnswer`));
          break;

        case AssessmentItemTypes.MULTIPLE_SELECTION:
          errorMessages.push(translator.$tr(`errorChooseAtLeastOneCorrectAnswer`));
          break;

        case AssessmentItemTypes.INPUT_QUESTION:
          errorMessages.push(translator.$tr(`errorProvideAtLeastOneCorrectAnswer`));
          break;
      }

      return errorMessages;
    },
    hasMoreCorrectAnswers() {
      const correctAnswers = this.answers.filter((answer) => answer.correct === true);

      return correctAnswers.length > 1;
    },
  },
  mounted() {
    this.action_type = this.item.action_type;
    this.defaultActionData = ActionTypeList;
    this.assessmentId = this.item.assessment_id;
    console.log('ActionTypeL', this.item);
    this.item.question === ''
      ? (this.windowsNativeQuestion = true)
      : (this.windowsNativeQuestion = false);
    if (!this.question) {
      this.openQuestion();
    }
    // Assessments are nested inside of a scrolling panel.
    // Instead of propagating an event all the way back to
    // the scrolling panel, just use scrollIntoView
    // (supported by most major browsers)
    if (this.$el.scrollIntoView) {
      this.$el.scrollIntoView({ behaviour: 'smooth' });
    }
    if(this.assessmentId.length){
      console.log('Action Enter')
        this.getFileData(this.item.id)
    }
  },
  methods: {
    ...mapActions('file', ['loadAssessmentFiles']),
    updateItem(payload) {
      payload = {
        ...assessmentItemKey(this.item),
        ...payload,
      };
      this.$emit('update', payload);
    },
    updateActionType(payload) {
      (payload = {
        ...assessmentItemKey(this.item),
        ...payload,
      }),
        console.log('payload', payload);
      this.$emit('update', payload);
    },
    excelCellValue(value) {
      let obj = {
        cell_number: value,
      };
      let payload = {
        ...obj,
      };
      payload = {
        ...assessmentItemKey(this.item),
        ...payload,
      };
      console.log('payload Data', payload);
      this.$emit('update', payload);
    },
    cellBoxValue(value) {
      let obj = {
        cell_value: value,
      };
      let payload = {
        ...obj,
      };
      payload = {
        ...assessmentItemKey(this.item),
        ...payload,
      };
      console.log('payload Data', payload);
      this.$emit('update', payload);
    },
    firstCellNumber(value) {
      let obj = {
        first_cell_number: value,
      };
      let payload = {
        ...obj,
      };
      payload = {
        ...assessmentItemKey(this.item),
        ...payload,
      };
      console.log('payload Data', payload);
      this.$emit('update', payload);
    },
    secondCellNumber(value) {
      let obj = {
        second_cell_number: value,
      };
      let payload = {
        ...obj,
      };
      payload = {
        ...assessmentItemKey(this.item),
        ...payload,
      };
      console.log('payload Data', payload);
      this.$emit('update', payload);
    },
    sheetNumberValue(value) {
      let obj = {
        sheet_number: value,
      };
      let payload = {
        ...obj,
      };
      payload = {
        ...assessmentItemKey(this.item),
        ...payload,
      };
      console.log('payload Data', payload);
      this.$emit('update', payload);
    },
    tolerance(value) {
      let obj = {
        tolerance: value,
      };
      let payload = {
        ...obj,
      };
      payload = {
        ...assessmentItemKey(this.item),
        ...payload,
      };
      console.log('payload Data', payload);
      this.$emit('update', payload);
    },
    columnNumber(value) {
      let obj = {
        column_number: value,
      };
      let payload = {
        ...obj,
      };
      payload = {
        ...assessmentItemKey(this.item),
        ...payload,
      };
      console.log('payload Data', payload);
      this.$emit('update', payload);
    },
    slideIndex(value) {
      let obj = {
        slide_index: value,
      };
      let payload = {
        ...obj,
      };
      payload = {
        ...assessmentItemKey(this.item),
        ...payload,
      };
      console.log('payload Data', payload);
      this.$emit('update', payload);
    },
    getFileData(assessmentId){
      let data = this.loadAssessmentFiles(assessmentId)
        data.then(value =>{
          console.log('Action Type Value Data', value)
          this.assessmentFileData =  value
        })
      console.log('Action File Data', this.assessmentFileData)
    },
    changeKind(newKind) {
      const newAnswers = updateAnswersToQuestionType(newKind, this.answers);

      this.closeAnswer();
      this.updateItem({
        type: newKind,
        answers: newAnswers,
      });
    },
    validationFiles(actionTypeValue) {
      console.log('actionTypeValue', actionTypeValue);
    },
    // question type VSelect needs to be rerended when confirmation dialog
    // cancelled to display a correct, previous, value that has changed
    // in the select but has not been changed in data storage actually
    // because of cancel action
    rerenderKindSelect() {
      this.kindSelectKey += 1;
    },
    onQuestionUpdate(newQuestion) {
      this.updateItem({ question: newQuestion });
    },
    onKindUpdate(newKind) {
      this.optionTypeSelected(newKind);
      if (this.kind === newKind) {
        return;
      }

      switch (newKind) {
        case AssessmentItemTypes.SINGLE_SELECTION:
          if (typeof this.openDialog === 'function' && this.hasMoreCorrectAnswers) {
            this.openDialog({
              title: this.$tr('dialogTitle'),
              message: this.$tr('dialogMessageChangeToSingleSelection'),
              submitLabel: this.$tr('dialogSubmitBtnLabel'),
              onSubmit: () => this.changeKind(newKind),
              onCancel: this.rerenderKindSelect,
            });
          } else {
            this.changeKind(newKind);
          }

          break;

        case AssessmentItemTypes.TRUE_FALSE:
          if (typeof this.openDialog === 'function' && this.answers.length > 0) {
            this.openDialog({
              title: this.$tr('dialogTitle'),
              message: this.$tr('dialogMessageChangeToTrueFalse'),
              submitLabel: this.$tr('dialogSubmitBtnLabel'),
              onSubmit: () => this.changeKind(newKind),
              onCancel: this.rerenderKindSelect,
            });
          } else {
            this.changeKind(newKind);
          }

          break;

        case AssessmentItemTypes.INPUT_QUESTION:
          if (typeof this.openDialog === 'function' && this.answers.length > 0) {
            this.openDialog({
              title: this.$tr('dialogTitle'),
              message: this.$tr('dialogMessageChangeToInput'),
              submitLabel: this.$tr('dialogSubmitBtnLabel'),
              onSubmit: () => this.changeKind(newKind),
              onCancel: this.rerenderKindSelect,
            });
          } else {
            this.changeKind(newKind);
          }

          break;

        case AssessmentItemTypes.WINDOW_NATIVE_QUESTION:
          if (typeof this.openDialog === 'function') {
            this.openDialog({
              title: this.$tr('dialogTitle'),
              message: this.$tr('dialogMessageChangeToUploadFile'),
              submitLabel: this.$tr('dialogSubmitBtnLabel'),
              onSubmit: () => this.changeKind(newKind),
              onCancel: this.rerenderKindSelect,
            });
          } else {
            this.changeKind(newKind);
          }

        default:
          this.changeKind(newKind);
          break;
      }
    },
    optionTypeSelected(value) {
      value === 'window_native_question'
        ? (this.windowsNativeQuestion = true)
        : (this.windowsNativeQuestion = false);
    },
    actionTypeSelected(actionTypeValue) {
      this.actionTypeList = ActionTypeList;

      this.actionType = actionTypeValue;
      this.updateActionType({
        action_type: actionTypeValue,
      });
    },
    applicationTypeSelected(applicationTypeValueSelected) {
      this.applicationType = true;
      this.applicationTypeValue = applicationTypeValueSelected;
      this.updateActionType({
        application_type: applicationTypeValueSelected,
      });
    },
    dataDisplay(column) {
      return this.item[column];
    },
    onAnswersUpdate(newAnswers) {
      this.updateItem({ answers: newAnswers });
    },
    onHintsUpdate(newHints) {
      this.updateItem({ hints: newHints });
    },
    openQuestion() {
      this.isQuestionOpen = true;

      this.closeAnswer();
      this.closeHint();
    },
    closeQuestion() {
      this.isQuestionOpen = false;
    },
    openHint(hintIdx) {
      this.openHintIdx = hintIdx;

      this.closeQuestion();
      this.closeAnswer();
    },
    closeHint() {
      this.openHintIdx = null;
    },
    openAnswer(answerIdx) {
      this.openAnswerIdx = answerIdx;

      this.closeQuestion();
      this.closeHint();
    },
    closeAnswer() {
      this.openAnswerIdx = null;
    },
  },
  $trs: {
    questionTypeLabel: 'Response type',
    actionTypeLabel: 'Action Types',
    applicationTypeLabel: 'Application Type',
    questionLabel: 'Question',
    dialogTitle: 'Changing question type',
    dialogSubmitBtnLabel: 'Change',
    dialogMessageChangeToSingleSelection:
      "Switching to 'single choice' will set only one answer as correct. Continue?",
    dialogMessageChangeToTrueFalse:
      "Switching to 'true or false' will remove all current answers. Continue?",
    dialogMessageChangeToInput:
      "Switching to 'numeric input' will set all answers as correct and remove all non-numeric answers. Continue?",
    dialogMessageChangeToUploadFile:
      "Switching to 'Windows Native Question' will remove all current aswers. Continue?",
  },
};
</script>

<style lang="less" scoped>
.question-text {
  transition: 0.7s;

  &:hover {
    cursor: pointer;
    background-color: var(--v-greyBackground-base);
  }
}
.subheading {
  margin-bottom: 8px;
  font-weight: bold;
}
</style>
