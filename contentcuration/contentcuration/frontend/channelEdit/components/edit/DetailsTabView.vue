<template>
  <div v-if="nodes.length" class="details-edit-view">
    <VForm ref="form" v-model="valid" :lazy-validation="newContent" class="px-2">
      <VLayout row wrap class="section">
        <VFlex xs12>
          <h1 class="subheading">Approximate time to complete this excersie</h1>
          <VTextField ref="exerciseCompleteTime" type="integer" v-model="exerciseCompleteTime" label="Time"
            aria-label="This input field will have Minutes Format" aria-required="true" autofocus>
          </VTextField>
        </VFlex>
      </VLayout>
      <VLayout row wrap class="section" v-if="checkAddress || urlUploadData && !blimeyExercise">
        <VFlex xs12>
          <h1 class="subheading">Upload URL</h1>
          <VTextField ref="upload_url" type="string" v-model="upload_url" label="Upload URL" aria-label="Upload URL"
            aria-required="true" autofocus @change="validURL">
          </VTextField>
        </VFlex>
      </VLayout>

      <!-- Blimey exercise url -->
      <VLayout row wrap class="section" v-if="blimeyExercise">
        <VFlex xs12>
          <h1 class="subheading" aria-label="Blimey Exercise Dropdown" tabindex="0" @focus="openDropdown('blimey')">
            Blimey exercises
          </h1>
          <VTextField ref="upload_url" type="string" v-model="blimey_exercise_url" label="Blimey Exercise" aria-label="Blimey Exercise"
            aria-required="true" autofocus>
          </VTextField>
        </VFlex>
      </VLayout>

      <!-- Upload Questions and Answer txt files -->
      <!-- <h1 class = "subheading" v-if="uploadtxtfiles"> Upload Correct File</h1>
          <UploadTextFiles v-if="uploadtxtfiles" :key="firstNode.id"
          :nodeId="firstNode.id"/><br/>
        <h1 class = "subheading" v-if="uploadtxtfiles"> Upload InCorrect File</h1>
          <UploadTextFiles v-if="uploadtxtfiles" :key="firstNode.id"
          :nodeId="firstNode.id"/> -->
      <!-- -->
      <!-- File upload and preview section -->
      <template v-if="oneSelected && allResources && !allExercises && !urlUploadData && !blimeyExercise">
        <FileUpload v-if="oneSelected && allResources && !allExercises && !urlUploadData" :key="firstNode.id"
          :nodeId="firstNode.id" @previewClick="trackPreview" />
      </template>

      <template v-if="upload_url">
        <URLUpload v-if="upload_url" :urlValue="upload_url" />
      </template>

      <!-- Basic information section -->
      <VLayout row wrap class="section">
        <VFlex xs12>
          <h1 class="subheading">
            {{ $tr('basicInfoHeader') }}
          </h1>
          <!-- Title -->
          <VTextField v-if="oneSelected" ref="title" v-model="title" maxlength="200" counter :rules="titleRules"
            :label="$tr('titleLabel')" required box @focus="trackClick('Title')" />
          <VLayout row wrap>
            <VFlex xs12 md12 class="basicInfoColumn" :class="{ 'pr-2': $vuetify.breakpoint.mdAndUp }">
              <!-- Description -->
              <VTextarea v-if="oneSelected" ref="description" v-model="description" :label="$tr('descriptionLabel')"
                maxlength="400" counter autoGrow box height="100%" class="descriptionTextArea"
                @focus="trackClick('Description')" />
            </VFlex>
            <!-- <VFlex
              xs12
              md6
              :class="{ 'pl-2': $vuetify.breakpoint.mdAndUp }"
            > -->
            <!-- Learning activity -->
            <!-- <LearningActivityOptions
                id="learning_activities"
                ref="learning_activities"
                v-model="contentLearningActivities"
                @focus="trackClick('Learning activities')"
              /> -->
            <!-- Level -->
            <!-- <LevelsOptions
                id="levels"
                ref="contentLevel"
                v-model="contentLevel"
                @focus="trackClick('Levels dropdown')"
              /> -->
            <!-- What you will need -->
            <!-- <ResourcesNeededOptions
                id="resources_needed"
                ref="resourcesNeeded"
                v-model="resourcesNeeded"
                @focus="trackClick('What you will need')"
              /> -->
            <!-- Tags -->
          </VLayout>
          <!-- Tags --->
          <VLayout>
            <VFlex>
              <VCombobox ref="tags" v-model="contentTags" class="tagbox" :items="tags" :searchInput.sync="tagText" chips
                box :label="$tr('tagsLabel')" multiple deletableChips hideSelected maxlength="30" autoSelectFirst
                :aria-label="contentTags" @focus="trackClick('Tags')">
                <template v-slot:no-data>
                  <VListTile v-if="tagText && tagText.trim()">
                    <VListTileContent>
                      <VListTileTitle>
                        {{ $tr('noTagsFoundText', { text: tagText.trim() }) }}
                      </VListTileTitle>
                    </VListTileContent>
                  </VListTile>
                </template>
              </VCombobox>
            </VFlex>
          </VLayout>
          <!-- Category -->
          <!-- <CategoryOptions ref="categories" v-model="categories" /> -->
        </VFlex>
      </VLayout>

      <!-- Assessment options -->
      <VLayout v-if="allExercises" row wrap class="section">
        <VFlex xs12>
          <h1 class="subheading">
            {{ $tr('assessmentHeader') }}
          </h1>

          <!-- Mastery -->
          <!-- <MasteryDropdown
            v-if="extra_fields"
            ref="mastery_model"
            v-model="masteryModelItem"
            :placeholder="getPlaceholder('mastery_model')"
            :required="isUnique(mastery_model)"
            :mPlaceholder="getPlaceholder('m')"
            :mRequired="isUnique(m)"
            :nPlaceholder="getPlaceholder('n')"
            :nRequired="isUnique(n)"
            @focus="trackClick('Mastery model')"
            @mFocus="trackClick('Mastery m value')"
            @nFocus="trackClick('Mastery n value')"
          /> -->

          <!-- Randomize question order -->
          <Checkbox ref="randomize" v-model="randomizeOrder" :label="$tr('randomizeQuestionLabel')"
            :indeterminate="!isUnique(randomizeOrder)" />

          <!-- Feature flag: Channel quizzes -->
          <Checkbox v-if="allowChannelQuizzes" v-model="channelQuiz" :label="$tr('channelQuizzesLabel')"
            :indeterminate="!oneSelected" />
        </VFlex>
      </VLayout>

      <!-- Thumbnail section -->
      <VLayout v-if="!blimeyExercise || !upload_url" row wrap class="section">
        <VFlex v-if="oneSelected" xs12>
          <h1 class="subheading">
            {{ $tr('thumbnailHeader') }}
          </h1>
          <!-- Thumbnail -->
          <div style="width:250px;">
            <ContentNodeThumbnail v-model="thumbnail" :nodeId="firstNode.id" :encoding="thumbnailEncoding"
              @encoded="setEncoding" />
          </div>
        </VFlex>
      </VLayout>

      <!-- Audience section -->
      <VLayout row wrap class="section">
        <VFlex xs12>
          <h1 class="subheading">
            {{ $tr('audienceHeader') }}
          </h1>
          <!-- Language -->
          <!-- <LanguageDropdown id="language" ref="language" v-model="language" class="mb-2" :hint="languageHint"
            :placeholder="getPlaceholder('language')" clearable persistent-hint @focus="trackClick('Language')" /> -->

          <h1 class="subheading" aria-label="Language Dropdown" tabindex="0" @focus="openDropdown('languageDropdown')">
            Language
          </h1>
          <select class="languageDropdown" role="list" id="languageDropdown" @focus="openDropdown('languageDropdown')"
            v-model="language" aria-labelledby="languageOptions" v-on:keyup.enter="languageValueSet"
            v-on:keyup.space="languageValueSet" tabindex="0">
            <!-- <option selected="selected" value="0">Select Application Type</option> -->
            <option v-for="(LanguageItems, index) in languageReader" v-bind:value="LanguageItems.id" :key="index"
              :selected="LanguageItems.id == language">
              {{ LanguageItems.native_name }}
            </option>
          </select>
          <div>
            <span id="languageOptions" v-if="language" hidden>{{ languageValue }}</span>
            <span id="languageOptions" v-else hidden>Language DropDown list with {{ languageReader.length }} items</span>
          </div>

          <!-- Visibility -->
          <h1 class="subheading" aria-label="Visibility Dropdown" tabindex="0"
            @focus="openDropdown('visibilityDropdown')">
            Visibility
          </h1>
          <!-- <VisibilityDropdown v-if="allResources" id="role_visibility" ref="role_visibility" v-model="role"
            :placeholder="getPlaceholder('role')" :required="isUnique(role)" @focus="trackClick('Role visibility')" /> -->
          <select class="visibilityDropdown" role="list" id="visibilityDropdown"
            @focus="openDropdown('visibilityDropdown')" v-model="role" aria-labelledby="visibilityOptions"
            @keypress="visibilityValueSet" tabindex="0">
            <!-- <option selected="selected" value="0">Select Application Type</option> -->
            <option v-for="(visibilityItems, index) in visibilityReader" v-bind:value="visibilityItems.value" :key="index"
              :selected="visibilityItems.value == language">
              {{ visibilityItems.text }}
            </option>
          </select>

          <div>
            <span id="visibilityOptions" v-if="visibilityValue.length" hidden>{{ visibilityValue }}</span>
            <span id="visibilityOptions" v-else hidden>VisibilityDropdown DropDown list with {{ visibilityReader.length }}
              items</span>
          </div>
        </VFlex>
      </VLayout>

      <!-- Accessibility section -->
      <!-- <VLayout row wrap class="section">
        <template v-if="requiresAccessibility">
          <VFlex xs12>
            <h1 class="subheading">
              {{ translateMetadataString('accessibility') }}
            </h1>
            <AccessibilityOptions
              v-model="accessibility"
              :checked="accessibility"
              :kind="firstNode.kind"
            />
          </VFlex>
        </template>
      </VLayout> -->
      <!-- Validated for Section -->
      <VLayout>
        <VFlex>
          <h1 class="subheading">
            Validated For
          </h1>
          <!-- <ScreenReaderDropdown
            id="accessibleScreenReader"
            ref="screen_reader_value"
            v-model="screen_reader"
            :placeholder="getPlaceholder('screen_reader')"
            @focus="trackClick('Screen Reader')"
            role="list"
            aria-labelledby="screenreader_multiple_dropdown"
          /> -->

          <!-- ScreenReader Dropdown-->
          <h1 class="subheading" aria-label="Screen Reader Dropdown" tabindex="0" autofocus
            @focus="openDropdown('screenReaderDropdown')">
            Screen Reader
          </h1>
          <VLayout @focus="openDropdown" tabindex="0">
            <select multiple class="screenReaderDropdown" role="list" id="screenReaderDropdown"
              @focus="openDropdown('screenReaderDropdown')" v-model="screen_reader" aria-labelledby="screenReaderOptions"
              @keypress="screenReaderFields" tabindex="0">
              <!-- <option selected="selected" value="0">Select Application Type</option> -->
              <option v-for="(ScreenReaderItems, index) in screenTextReader" v-bind:value="ScreenReaderItems.value"
                :key="index" :selected="ScreenReaderItems.value == screen_reader">
                {{ ScreenReaderItems.text }}
              </option>
            </select>
            <!-- Reading the Selected Options -->
            <div v-if="screen_reader">
              <span id="screenReaderOptions" v-if="screen_reader.length" hidden>{{ screen_reader }}</span>
              <span id="screenReaderOptions" v-else hidden>Screen Reader DropDown list with {{ screenTextReader.length }}
                items</span>
            </div>
          </VLayout>

          <!--Os Validator Dropdown-->
          <h1 class="subheading" aria-label="Os Validator Dropdown" tabindex="0" autofocus
            @focus="openDropdown('osValidatorDropdown')">
            Os Validator
          </h1>
          <select multiple class="osValidatorDropdown" role="list" id="osValidatorDropdown"
            @focus="openDropdown('osValidatorDropdown')" v-model="os_validator" aria-labelledby="osValidatorOptions"
            @keypress="osValidatorFields" tabindex="0">
            <!-- <option selected="selected" value="0">Select Application Type</option> -->
            <option v-for="(osValidatorItems, index) in osValidatorReader" v-bind:value="osValidatorItems.value"
              :key="index" :selected="osValidatorItems.value == os_validator">
              {{ osValidatorItems.text }}
            </option>
          </select>
        </VFlex>
        <!-- Reading the Selected Options -->
        <div v-if="os_validator">
          <span id="osValidatorOptions" v-if="screen_reader.length" hidden>{{ os_validator }}</span>
          <span id="osValidatorOptions" v-else hidden>OS Validator DropDown list with {{ os_validator.length }}
            items</span>
        </div>
      </VLayout>


      <!---- Taught App  Dropdown-->
      <h1 class="subheading" aria-label="Taught App Dropdown" tabindex="0" autofocus
        @focus="openDropdown('taughtAppDropdown')">
        Taught App
      </h1>
      <VLayout>
        <select multiple class="taughtAppDropdown" role="list" id="taughtAppDropdown"
          @focus="openDropdown('taughtAppDropdown')" v-model="taught_app" aria-labelledby="taughtAppOptions"
          @keypress="taughtAppData" tabindex="0">
          <!-- <option selected="selected" value="0">Select Application Type</option> -->
          <option v-for="(taughtAppItems, index) in taughtAppReader" v-bind:value="taughtAppItems.value" :key="index"
            :selected="taughtAppItems.value == taught_app">
            {{ taughtAppItems.text }}
          </option>
        </select>
        <!-- Reading the Selected Options -->
        <div v-if="taught_app">
          <span id="taughtAppOptions" v-if="taught_app.length" hidden>{{ taught_app }}</span>
          <span id="taughtAppOptions" v-else hidden>OS Validator DropDown list with {{ taughtAppReader.length }}
            items</span>
        </div>
      </VLayout>
      <!-- <p id="taught_multiple_dropdown" hidden="true" v-if="taught_app.length">{{taught_app}} are selected Taught App</p>
      <p v-else id="taught_multiple_dropdown" hidden="true">Taught App Drop Down No Value Selected</p>
      <p id="osvalidator_multiple_dropdown" hidden="true" v-if="os_validator.length">{{os_validator}} are selected Os
        Validator</p>
      <p v-else id="osvalidator_multiple_dropdown" hidden="true">Os Validator Drop Down No Value Selected</p>
      <p id="screenreader_multiple_dropdown" hidden="true" v-if="screen_reader.length">{{screen_reader}} are selected
        Screen Reader</p>
      <p v-else id="screenreader_multiple_dropdown" hidden="true">Screen Reader Drop Down No Value Selected</p> -->
      <!-- Pre Requisited -->
      <!-- <VLayout>
        <VTextarea
            ref="preRequisited"
            v-model="preRequisited"
            label="Pre-Requisited"
            maxlength="400"
            autoGrow
            box
            @focus="trackClick('Description')"
          />
      </VLayout> -->
      <!-- Contributed By-->
      <VLayout>
        <VTextField ref="contributedBy" v-model="contributedBy" label="Contributed By" aria-label="Contributed By"
          autoGrow box aria-required="true" @focus="trackClick('Contributed By')" />
      </VLayout>
      <VLayout>
        <VTextField ref="year_of_publish" v-model="year_of_publish" label="Year of Publication"
          aria-label="Year of Publication" autoGrow box aria-required="true" @focus="trackClick('Year of Publication')" />
      </VLayout>
      <VLayout>
        <VTextField id="LevelValue" ref="user_level" v-model="user_level" label="Level" aria-label="Level" type="number"
          max="4" min="1" autoGrow box @input="checkValue" aria-required="true" @focus="trackClick('Level')" />
      </VLayout>
      <VLayout>
        <VTextField ref="computerSettingFilesRequired" v-model="computerSettingFilesRequired"
          label="Computer Setting Files Required" aria-label="Computer Setting Files Required" autoGrow box
          @focus="trackClick('Computer Setting Files Required')" />
      </VLayout>
      <VLayout>
        <VTextField ref="goal" v-model="goal" label="Goal" aria-label="Goal" autoGrow box aria-required="true"
          @focus="trackClick('Goal')" />
      </VLayout>
      <!-- <VLayout>
        <VTextField
          ref="reviewReflect"
          v-model="reviewReflect"
          label="Review and Reflect"
          aria-label="Review and Reflect"
          autoGrow
          box
          aria-required="true"
          @focus="trackClick('Review and Reflect')"
        />
      </VLayout> -->
      <!-- <VLayout>
        <VTextField
            ref="recommendedNextExercise"
            v-model="recommendedNextExercise"
            label="Recommended Next Exercise"
            aria-label="Recommended Next Exercise"
            autoGrow
            box
            @focus="trackClick('Recommended Next Exercise')"
          />
      </VLayout> -->
      <!-- Source section -->
      <VLayout row wrap class="section">
        <template v-if="allResources">
          <VFlex xs12 class="auth-section">
            <h1 class="subheading">
              {{ $tr('sourceHeader') }}
            </h1>
            <p v-if="disableAuthEdits" class="grey--text">
              {{ detectedImportText }}
            </p>
            <p v-if="oneSelected && isImported">
              <ActionLink :href="importedChannelLink" target="_blank"
                :text="$tr('importedFromButtonText', { channel: importedChannelName })" />
            </p>

            <!-- Need to break up v-model to properly show placeholder -->

            <!-- Author -->
            <VCombobox ref="author" :items="authors" :label="$tr('authorLabel')" :readonly="disableAuthEdits"
              maxlength="200" counter autoSelectFirst box :placeholder="getPlaceholder('author')"
              :value="author && author.toString()" @input.native="(e) => (author = e.srcElement.value)"
              @input="author = $event" @focus="trackClick('Author')">
              <template v-slot:append-outer>
                <HelpTooltip :text="$tr('authorToolTip')" top :small="false" />
              </template>
            </VCombobox>

            <!-- Provider -->
            <!-- <VCombobox
              ref="provider"
              :items="providers"
              :label="$tr('providerLabel')"
              :readonly="disableAuthEdits"
              maxlength="200"
              counter
              :placeholder="getPlaceholder('provider')"
              autoSelectFirst
              box
              :value="provider && provider.toString()"
              @input.native="e => provider = e.srcElement.value"
              @input="provider = $event"
              @focus="trackClick('Provider')"
            >
              <template v-slot:append-outer>
                <HelpTooltip :text="$tr('providerToolTip')" top :small="false" />
              </template>
            </VCombobox> -->

            <!-- Aggregator -->
            <!-- <VCombobox
              ref="aggregator"
              :items="aggregators"
              :label="$tr('aggregatorLabel')"
              :readonly="disableAuthEdits"
              maxlength="200"
              counter
              autoSelectFirst
              :placeholder="getPlaceholder('aggregator')"
              box
              :value="aggregator && aggregator.toString()"
              @input.native="e => aggregator = e.srcElement.value"
              @input="aggregator = $event"
              @focus="trackClick('Aggregator')"
            >
              <template v-slot:append-outer>
                <HelpTooltip :text="$tr('aggregatorToolTip')" top :small="false" />
              </template>
            </VCombobox> -->

            <!-- License -->
            <!-- <LicenseDropdown ref="license" v-model="licenseItem"
              :required="isUnique(license) && isUnique(license_description) && !disableAuthEdits"
              :readonly="disableAuthEdits" :placeholder="getPlaceholder('license')"
              :descriptionPlaceholder="getPlaceholder('license_description')" @focus="trackClick('License')"
              @descriptionFocus="trackClick('License description')" /> -->
            <h1 class="subheading" aria-label="License Dropdown" tabindex="0" autofocus
              @focus="openDropdown('licenseDropdown')">
              License Dropdown
            </h1>
            <select class="licenseDropdown" role="list" id="licenseDropdown" v-model="license"
              aria-labelledby="licenseOptions" @keypress="licenseValueSet" v-on:keyup.enter="licenseValueSet"
              v-on:keyup.space="licenseValueSet" tabindex="0">
              <!-- <option selected="selected" value="0">Select Application Type</option> -->
              <option v-for="(LicenseItems, index) in licenseReader" v-bind:value="LicenseItems.id" :key="index"
                :selected="LicenseItems.id == license">
                {{ LicenseItems.license_name }}
              </option>
            </select>
            <VTextarea ref="description" v-model="license_description" class="license-description" maxlength="400"
              :counter="!disableAuthEdits && 400" autoGrow :label="$tr('licenseDescriptionLabel')"
              :placeholder="getPlaceholder('license_description')" :readonly="disableAuthEdits"
              :required="!disableAuthEdits" :rules="descriptionRules" box @focus="trackClick('License description')" />
            <div>
              <span id="licenseOptions" v-if="license" hidden>{{ licenseValue }}</span>
              <span id="licenseOptions" v-else hidden>Lisence DropDown list with {{ licenseReader.length }} items</span>
            </div>

            <!-- Copyright Holder -->
            <VCombobox v-if="copyrightHolderRequired" ref="copyright_holder" :items="copyrightHolders"
              :label="$tr('copyrightHolderLabel')" maxlength="200" counter
              :required="isUnique(copyright_holder) && !disableAuthEdits" :rules="copyrightHolderRules"
              :placeholder="getPlaceholder('copyright_holder')" autoSelectFirst :readonly="disableAuthEdits" box
              :value="copyright_holder && copyright_holder.toString()"
              @input.native="(e) => (copyright_holder = e.srcElement.value)" @input="copyright_holder = $event"
              @focus="trackClick('Copyright holder')" />
          </VFlex>
        </template>
      </VLayout>

      <!-- Subtitles -->
      <VLayout v-if="videoSelected" row wrap class="section">
        <VFlex xs12>
          <SubtitlesList :nodeId="firstNode.id" />
        </VFlex>
      </VLayout>

      <!-- Audio accessibility section -->
      <VLayout row wrap class="section">
        <template v-if="audioAccessibility">
          <VFlex xs12>
            <SubtitlesList :nodeId="firstNode.id" />
          </VFlex>
        </template>
      </VLayout>
    </VForm>
  </div>
</template>

<script>

import difference from 'lodash/difference';
import intersection from 'lodash/intersection';
import uniq from 'lodash/uniq';
import { mapGetters, mapActions } from 'vuex';
import ContentNodeThumbnail from '../../views/files/thumbnails/ContentNodeThumbnail';
import FileUpload from '../../views/files/FileUpload';
import SubtitlesList from '../../views/files/supplementaryLists/SubtitlesList';
import { isImportedContent, importedChannelLink } from '../../utils';
import AccessibilityOptions from './AccessibilityOptions.vue';
// import LevelsOptions from './LevelsOptions.vue';
// import ResourcesNeededOptions from './ResourcesNeededOptions.vue';
// import LearningActivityOptions from './LearningActivityOptions.vue';
import CategoryOptions from './CategoryOptions.vue';
import {
  getTitleValidators,
  getCopyrightHolderValidators,
  translateValidator,
} from 'shared/utils/validation';
import { findLicense, memoizeDebounce } from 'shared/utils/helpers';
import LanguageDropdown from 'shared/views/LanguageDropdown';
import HelpTooltip from 'shared/views/HelpTooltip';
import LicenseDropdown from 'shared/views/LicenseDropdown';
import MasteryDropdown from 'shared/views/MasteryDropdown';
import VisibilityDropdown from 'shared/views/VisibilityDropdown';
import ScreenReaderDropdown from 'shared/views/ScreenReaderDropdown';
import TaughtAppDropdown from 'shared/views/TaughtAppDropdown';
import OsValidatorDropdown from 'shared/views/OsValidatorDropdown';
import Checkbox from 'shared/views/form/Checkbox';
import { ContentKindsNames } from 'shared/leUtils/ContentKinds';
import { NEW_OBJECT, FeatureFlagKeys, ContentModalities } from 'shared/constants';
import { validate as validateCompletionCriteria } from 'shared/leUtils/CompletionCriteria';
import { constantsTranslationMixin, metadataTranslationMixin } from 'shared/mixins';
import URLUpload from '../../views/files/UrlUpload.vue'
import UploadTextFiles from 'shared/views/files/UploadTextFiles.vue'
import { ScreenReaderList } from 'shared/leUtils/ScreenReader';
import { OsValidatorList } from 'shared/leUtils/OsValidator';
import Languages, { LanguagesList } from 'shared/leUtils/Languages';
import { TaughtAppList } from 'shared/leUtils/TaughtApp';
import { LicensesList } from 'shared/leUtils/Licenses';
import $ from 'jquery';
import Roles, { RolesList } from 'shared/leUtils/Roles';
import axios from 'axios';

// Define an object to act as the place holder for non unique values.
const nonUniqueValue = {};
nonUniqueValue.toString = () => '';


function getValueFromResults(results) {
  if (results.length === 0) {
    return null;
  } else if (results.length === 1) {
    return results[0];
  } else {
    return nonUniqueValue;
  }
}

function generateGetterSetter(key) {
  if (key === 'upload_url') {
    setTimeout(function () {
      this.checkAddress = true;
    }, 1000);
  }
  return {
    get() {
      return this.getValueFromNodes(key);
    },
    set(value) {
      if (key === 'language' || key === 'role_visibility' || key == 'license') {
        console.log(key)
      }
      else {
        this.update({ [key]: value });
      }
    },
  };
}

function generateExtraFieldsGetterSetter(key, defaultValue) {
  return {
    get() {
      return this.getExtraFieldsValueFromNodes(key, defaultValue);
    },
    set(value) {
      this.updateExtraFields({ [key]: value });
    },
  };
}

/**
 * This function is used to generate getter/setters for new metadata fields that are boolean maps:
 * - `grade_levels` (sometimes referred to as `content_levels`)
 * - `learner_needs` (resources needed)
 * - `accessibility_labels` (accessibility options)
 * - `learning_activities` (learning activities)
 */
function generateNestedNodesGetterSetter(key) {
  return {
    get() {
      const value = this.getValueFromNodes(key);
      return Object.keys(value);
    },
    set(value) {
      const newMap = {};
      for (let label of value) {
        newMap[label] = true;
      }
      this.update({ [key]: newMap });
    },
  };
}

export default {
  name: 'DetailsTabView',
  components: {
    LanguageDropdown,
    HelpTooltip,
    LicenseDropdown,
    MasteryDropdown,
    VisibilityDropdown,
    ScreenReaderDropdown,
    OsValidatorDropdown,
    FileUpload,
    SubtitlesList,
    ContentNodeThumbnail,
    Checkbox,
    TaughtAppDropdown,
    AccessibilityOptions,
    URLUpload,
    UploadTextFiles,
    // LevelsOptions,
    // ResourcesNeededOptions,
    // LearningActivityOptions,
    CategoryOptions,
  },
  mixins: [constantsTranslationMixin, metadataTranslationMixin],
  props: {
    nodeIds: {
      type: Array,
      default: () => [],
    },
    errorFields: ''
  },
  data() {
    let address = window.location.href.includes('uploadUrl')
    return {
      tagText: null,
      valid: true,
      diffTracker: {},
      checkAddress: address,
      screenReaderArrayValue: [],
      osValidatorArrayValue: [],
      taughtAppArrayValue: [],
      languageValue: '',
      licenseValue: '',
      visibilityValue: ''
    };
  },
  computed: {
    ...mapGetters('contentNode', [
      'getContentNodes',
      'authors',
      // 'providers',
      // 'aggregators',
      'copyrightHolders',
      'tags',
    ]),
    ...mapGetters('currentChannel', ['currentChannel']),
    ...mapGetters('file', ['getContentNodeFiles']),
    nodes() {
      return this.getContentNodes(this.nodeIds);
    },
    firstNode() {
      return this.nodes.length ? this.nodes[0] : null;
    },
    allExercises() {
      return this.nodes.every(node => node.kind === ContentKindsNames.EXERCISE);
    },
    allResources() {
      return !this.nodes.some(node => node.kind === ContentKindsNames.TOPIC);
    },
    urlUploadData() {
      return this.nodes.every(node => node.kind === ContentKindsNames.UPLOADURL);
    },
    blimeyExercise() {
      return this.nodes.every(node => node.kind === ContentKindsNames.BLIMEYEXERCISE);
    },
    uploadtxtfiles() {
      return this.nodes.every(node => node.kind === ContentKindsNames.UPLOADTXTFILES);
    },
    isImported() {
      return isImportedContent(this.firstNode);
    },
    importedChannelLink() {
      return importedChannelLink(this.firstNode, this.$router);
    },
    importedChannelName() {
      return this.firstNode.original_channel_name;
    },
    requiresAccessibility() {
      return this.nodes.every(node => node.kind !== ContentKindsNames.AUDIO);
    },
    audioAccessibility() {
      return this.oneSelected && this.firstNode.kind === 'audio';
    },
    /* FORM FIELDS */
    title: generateGetterSetter('title'),
    description: generateGetterSetter('description'),
    randomizeOrder: generateExtraFieldsGetterSetter('randomize', true),
    author: generateGetterSetter('author'),
    exerciseCompleteTime: generateGetterSetter('exerciseCompleteTime'),
    // provider: generateGetterSetter('provider'),
    // aggregator: generateGetterSetter('aggregator'),
    copyright_holder: generateGetterSetter('copyright_holder'),
    contentTags: {
      get() {
        return intersection(...this.nodes.map(node => node.tags));
      },
      set(value) {
        const oldValue = intersection(...this.nodes.map(node => node.tags));
        // If selecting a tag, clear the text field
        if (value.length > (oldValue || []).length) {
          this.tagText = null;
          this.addNodeTags(difference(value, oldValue));
        } else {
          this.removeNodeTags(difference(oldValue, value));
        }
      },
    },
    role: generateGetterSetter('role_visibility'),
    language: generateGetterSetter('language'),
    // license_value: {
    //   get() {
    //     if (this.value && this.value.license) {
    //       let licenceId = findLicense(this.value.license).id;
    //       let licenceName = LicensesList[licenceId - 1].license_name;
    //       this.setLicenseValue(licenceName);
    //     }
    //     return this.value && findLicense(this.value.license).id;
    //   },
    //   set(value) {
    //     this.licenseValue = findLicense(this.value.license).id;
    //     this.update({['license']: findLicense(value).id});
    //   },
    // },
    // license_description: {
    //   get() {
    //     return this.value && this.value.license_description;
    //   },
    //   set(value) {
    //     this.update('input', {
    //       license: this.value && this.value.license,
    //       license_description: this.isCustom ? value : '',
    //     });
    //   },
    // },
    screen_reader: {
      get() {
        let screenReaderData = [];
        let readerData = this.nodes[0].readers;
        if (readerData) {
          Object.keys(readerData).map(function (key) {
            if (!screenReaderData.includes(key)) {
              screenReaderData.push(key);
            }
          });
        }
        return screenReaderData;
      },
      set(value) {
        this.screenReaderFields(value);
      },
    },
    os_validator: {
      get() {
        let osValidator = [];
        let osValidatorData = this.nodes[0].osvalidators;
        if (osValidatorData) {
          Object.keys(osValidatorData).map(function (key) {
            if (!osValidator.includes(key)) {
              osValidator.push(key);
            }
          });
        }
        return osValidator;
      },
      set(value) {
        this.osValidatorFields(value);
      },
    },
    taught_app: {
      get() {
        let taughtApp = [];
        if (this.nodes[0].taughtapps) {
          let taughtAppValue = this.nodes[0].taughtapps;
          if (taughtAppValue) {
            Object.keys(taughtAppValue).map(function (key) {
              if (!taughtApp.includes(key)) {
                taughtApp.push(key);
              }
            });
          }
        }
        return taughtApp;
      },
      set(value) {
        this.taughtAppData(value);
      },
    },
    // preRequisited: generateGetterSetter('preRequisited'),
    contributedBy: generateGetterSetter('contributedBy'),
    year_of_publish: generateGetterSetter('year_of_publish'),
    user_level: generateGetterSetter('user_level'),
    blimey_exercise_url: generateGetterSetter('blimey_exercise'),
    // conceptExplanation: generateGetterSetter('conceptExplanation'),
    computerSettingFilesRequired: generateGetterSetter('computerSettingFilesRequired'),
    goal: generateGetterSetter('goal'),
    // reviewReflect: generateGetterSetter('reviewReflect'),
    // recommendedNextExercise: generateGetterSetter('recommendedNextExercise'),
    accessibility: generateNestedNodesGetterSetter('accessibility_labels'),
    contentLevel: generateNestedNodesGetterSetter('grade_levels'),
    resourcesNeeded: generateNestedNodesGetterSetter('learner_needs'),
    // contentLearningActivities: generateNestedNodesGetterSetter('learning_activities'),
    categories: generateNestedNodesGetterSetter('categories'),
    mastery_model() {
      return this.getExtraFieldsValueFromNodes('mastery_model');
    },
    m() {
      return this.getExtraFieldsValueFromNodes('m');
    },
    n() {
      return this.getExtraFieldsValueFromNodes('n');
    },
    masteryModelItem: {
      get() {
        return {
          mastery_model: this.mastery_model,
          m: this.m,
          n: this.n,
        };
      },
      set(value) {
        this.updateExtraFields(value);
      },
    },
    license: generateGetterSetter('license'),
    license_description() {
      return this.getValueFromNodes('license_description');
    },
    licenseItem: {
      get() {
        return {
          license: this.license && this.license.toString() ? this.license : null,
          license_description: (this.license_description || '').toString(),
        };
      },
      set(value) {
        this.update(value);
      },
    },
    extra_fields() {
      return this.getValueFromNodes('extra_fields');
    },
    thumbnail: {
      get() {
        return this.nodeFiles.find(f => f.preset.thumbnail);
      },
      set(file) {
        file ? this.updateFile(file) : this.thumbnail ? this.deleteFile(this.thumbnail) : null;
      },
    },
    thumbnailEncoding: generateGetterSetter('thumbnail_encoding'),
    channelQuiz: {
      get() {
        const options = this.getExtraFieldsValueFromNodes('options') || {};
        return options.modality === ContentModalities.QUIZ;
      },
      set(val) {
        const options = { modality: val ? ContentModalities.QUIZ : null };
        this.updateExtraFields({ options });
      },
    },
    upload_url: generateGetterSetter('upload_url'),
    // TODO remove eslint disable when `completionCriteria` is utilized
    /* eslint-disable-next-line kolibri/vue-no-unused-properties */
    completionCriteria: {
      get() {
        const options = this.getExtraFieldsValueFromNodes('options') || {};
        return options.completion_criteria || {};
      },
      set(completion_criteria) {
        // TODO Remove validation if unnecessary after implementing `completionCriteria`
        if (validateCompletionCriteria(completion_criteria)) {
          const options = { completion_criteria };
          this.updateExtraFields({ options });
        } else {
          console.warn('Invalid completion criteria', [...validateCompletionCriteria.errors]);
        }
      },
    },

    /* COMPUTED PROPS */
    disableAuthEdits() {
      return this.nodes.some(node => node.freeze_authoring_data);
    },
    detectedImportText() {
      const count = this.nodes.filter(node => node.freeze_authoring_data).length;
      return this.$tr('detectedImportText', { count });
    },
    oneSelected() {
      return this.nodes.length === 1;
    },
    languageHint() {
      let topLevel = this.nodes.some(node => node.parent === this.currentChannel.main_tree);
      return topLevel ? this.$tr('languageChannelHelpText') : this.$tr('languageHelpText');
    },
    copyrightHolderRequired() {
      // Needs to appear when any of the selected licenses require a copyright holder
      return this.nodes.some(
        node =>
          findLicense(node.license, { copyright_holder_required: false })
            .copyright_holder_required
      );
    },
    titleRules() {
      return getTitleValidators().map(translateValidator);
    },
    copyrightHolderRules() {
      if (this.disableAuthEdits || !this.isUnique(this.copyright_holder)) {
        return [];
      }
      return getCopyrightHolderValidators().map(translateValidator);
    },
    nodeFiles() {
      return (this.firstNode && this.getContentNodeFiles(this.firstNode.id)) || [];
    },
    videoSelected() {
      return this.oneSelected && this.firstNode.kind === 'video';
    },
    newContent() {
      return !this.nodes.some(n => n[NEW_OBJECT]);
    },
    allowChannelQuizzes() {
      return this.$store.getters.hasFeatureEnabled(FeatureFlagKeys.channel_quizzes);
    },
    screenTextReader() {
      return ScreenReaderList;
    },
    osValidatorReader() {
      return OsValidatorList;
    },
    taughtAppReader() {
      return TaughtAppList;
    },
    languageReader() {
      return LanguagesList;
    },
    licenseReader() {
      return LicensesList;
    },
    visibilityReader() {
      return RolesList;
    },
    descriptionRules() {
      return this.isCustom && !this.readonly
        ? getLicenseDescriptionValidators().map(translateValidator)
        : [];
    },
  },
  watch: {
    nodes: {
      deep: true,
      handler() {
        // Handles both when loading a node and when making a change
        this.tagText = null;
        this.$nextTick(this.handleValidation);
      },
    },
  },
  mounted() {
    this.$nextTick(this.handleValidation);
    this.languageSelected()
    this.licenseSelected()
    this.visibilitySelected()
  },
  methods: {
    ...mapActions(['setUnsavedChanges']),
    ...mapActions('contentNode', ['updateContentNode', 'addTags', 'removeTags']),
    ...mapActions('file', ['updateFile', 'deleteFile']),
    saveNode: memoizeDebounce(
      function (id) {
        this.saveFromDiffTracker(id);
      },
      1000,
      { trailing: true }
    ),
    validURL() {
      if (this.upload_url.includes('youtu') && !this.upload_url.includes('embed')) {
        let youtubeString = "https://www.youtube.com/embed/"
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = this.upload_url.match(regExp);
        youtubeString = youtubeString.concat((match && match[7].length == 11) ? match[7] : 'notYoutubeID')
        if (!youtubeString.includes('notYoutubeID')) {
          this.upload_url = youtubeString
        }
      }
      else if (!this.upload_url.includes('player') && this.upload_url.includes('vimeo')) {
        let vimeoString = 'https://player.vimeo.com/video/'
        var regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/
        var parseUrl = regExp.exec(this.upload_url)
        this.upload_url = vimeoString.concat(parseUrl[5])

      }
    },
    saveFromDiffTracker(id) {
      if (this.diffTracker[id]) {
        return this.updateContentNode({ id, ...this.diffTracker[id] }).then(() => {
          delete this.diffTracker[id];
        });
      }
      return Promise.resolve();
    },
    /*
     * @public
     */
    checkValue(value) {
      if (value >= 4) {
        this.user_level = 4;
      } else if (value <= 1) {
        this.user_level = 1;
      }
    },
    /*
     * @public
     */
    immediateSaveAll() {
      return Promise.all(Object.keys(this.diffTracker).map(this.saveFromDiffTracker));
    },
    update(payload) {
      this.nodeIds.forEach(id => {
        this.$set(this.diffTracker, id, {
          ...(this.diffTracker[id] || {}),
          ...payload,
        });
        this.setUnsavedChanges(true);
        this.saveNode(id);
      });
    },
    updateExtraFields(extra_fields) {
      this.nodeIds.forEach(id => {
        const existingData = this.diffTracker[id] || {};
        this.$set(this.diffTracker, id, {
          ...existingData,
          extra_fields: {
            ...(existingData.extra_fields || {}),
            ...extra_fields,
          },
        });
        this.setUnsavedChanges(true);
        this.saveNode(id);
      });
    },
    licenseValueSet(selectedLicense) {
      var code = selectedLicense.keyCode ? selectedLicense.keyCode : selectedLicense.which;
      if (code == 13) {
        this.licenseReader.map((item, index) => {
          if (item.id === selectedLicense.srcElement.value) {
            this.licenseValue = item.license_name
          }
        });
        this.update({ license: Number(selectedLicense.srcElement.value) });
      }
    },
    languageValueSet(selectedLanguage) {
      var code = selectedLanguage.keyCode ? selectedLanguage.keyCode : selectedLanguage.which;
      this.languageReader.map((item, index) => {
        if (item.id === selectedLanguage.srcElement.value) {
          this.languageValue = item.native_name
        }
      });
      this.update({ language: selectedLanguage.srcElement.value });
    },
    visibilityValueSet(selectedVisibility) {
      var code = selectedVisibility.keyCode ? selectedVisibility.keyCode : selectedVisibility.which;
      if (code == 13) {
        this.visibilityReader.map((item, index) => {
          if (item.value === selectedVisibility.path[0].value) {
            this.visibilityValue = item.text
          }
        });
        this.update({ role_visibility: selectedVisibility.path[0].value });
      }
    },
    screenReaderFields(array_data) {
      this.screenTextReader.map((item, index) => {
        if (array_data.path) {
          if (item.value === array_data.path[0].value) {
            if (this.screenReaderArrayValue.includes(item.value)) {
              this.screenReaderArrayValue.splice(index, 1)
            }
            else {
              this.screenReaderArrayValue.push(item.text);
            }
          }
        }
      });
      var code = array_data.keyCode ? array_data.keyCode : array_data.which;
      if (code == 13) {
        //Enter keycode
        array_data.preventDefault();
        let readersObj = {
          readers: {},
        };
        this.screenReaderArrayValue.map(readers => {
          readersObj.readers[readers] = readers;
        });
        // if (array_data.length) {
        // }
        this.nodeIds.forEach(id => {
          this.$set(this.diffTracker, id, {
            ...(this.diffTracker[id] || {}),
            ...readersObj,
          });
          this.setUnsavedChanges(true);
          this.saveNode(id);
        });
        $('option').mousedown(function (e) {
          $(this).toggleClass('selected');
          $(this).prop('selected', !$(this).prop('selected'));
          return false;
        });
        // this.applicationTypeSelected(e.target.value);
      }
    },
    osValidatorFields(array_data) {
      this.osValidatorReader.map((item, index) => {
        if (array_data.path) {
          if (item.value === array_data.path[0].value) {
            if (this.osValidatorArrayValue.includes(item.value)) {
              this.osValidatorArrayValue.splice(index, 1)
            }
            else {
              this.osValidatorArrayValue.push(item.text);
            }
          }
        }
      });
      var code = array_data.keyCode ? array_data.keyCode : array_data.which;
      if (code == 13) {
        //Enter keycode
        array_data.preventDefault();
        let osValidatorObj = {
          osValidator: {},
        };
        this.osValidatorArrayValue.map(osValidator => {
          osValidatorObj.osValidator[osValidator] = osValidator;
        });
        this.nodeIds.forEach(id => {
          this.$set(this.diffTracker, id, {
            ...(this.diffTracker[id] || {}),
            ...osValidatorObj,
          });
          this.setUnsavedChanges(true);
          this.saveNode(id);
        });
        $('option').mousedown(function (e) {
          $(this).toggleClass('selected');
          $(this).prop('selected', !$(this).prop('selected'));
          return false;
        });
      }
    },
    taughtAppData(array_data) {
      this.taughtAppReader.map((item, index) => {
        if (array_data.path) {
          if (item.value === array_data.path[0].value) {
            if (this.taughtAppArrayValue.includes(item.value)) {
              this.taughtAppArrayValue.splice(index, 1)
            }
            else {
              this.taughtAppArrayValue.push(item.text);
            }
          }
        }
      });
      var code = array_data.keyCode ? array_data.keyCode : array_data.which;
      if (code == 13) {
        //Enter keycode
        array_data.preventDefault();
        let taughtAppObj = {
          taughtApp: {},
        };
        this.taughtAppArrayValue.map(taughtData => {
          taughtAppObj.taughtApp[taughtData] = taughtData;
        });
        this.nodeIds.forEach(id => {
          this.$set(this.diffTracker, id, {
            ...(this.diffTracker[id] || {}),
            ...taughtAppObj,
          });
          this.setUnsavedChanges(true);
          this.saveNode(id);
        });
        $('option').mousedown(function (e) {
          $(this).toggleClass('selected');
          $(this).prop('selected', !$(this).prop('selected'));
          return false;
        });
      }
    },
    addNodeTags(tags) {
      this.addTags({ ids: this.nodeIds, tags });
    },
    removeNodeTags(tags) {
      this.removeTags({ ids: this.nodeIds, tags });
    },
    isUnique(value) {
      return value !== nonUniqueValue;
    },
    getValueFromNodes(key) {
      const results = uniq(
        this.nodes.map(node => {
          if (Object.prototype.hasOwnProperty.call(this.diffTracker[node.id] || {}, key)) {
            return this.diffTracker[node.id][key];
          }
          return node[key] || null;
        })
      );
      return getValueFromResults(results);
    },
    getExtraFieldsValueFromNodes(key, defaultValue = null) {
      const results = uniq(
        this.nodes.map(node => {
          if (
            Object.prototype.hasOwnProperty.call(
              this.diffTracker[node.id] || {},
              'extra_fields'
            ) &&
            Object.prototype.hasOwnProperty.call(this.diffTracker[node.id].extra_fields, key)
          ) {
            return this.diffTracker[node.id].extra_fields[key];
          }
          return node.extra_fields[key] || defaultValue;
        })
      );
      return getValueFromResults(results);
    },
    getPlaceholder(field) {
      // Should only show if multiple nodes are selected with different
      // values for the field (e.g. if author field is different on the selected nodes)
      return this.oneSelected || this.isUnique(this[field]) ? '' : '---';
    },
    handleValidation() {
      if (this.$refs.form) {
        !this.newContent ? this.$refs.form.resetValidation() : this.$refs.form.validate();
      }
    },
    setEncoding(encoding) {
      this.thumbnailEncoding = encoding;
    },
    trackClick(label) {
      this.$analytics.trackClick('channel_editor_modal_details', label);
    },
    trackPreview() {
      this.$analytics.trackAction('channel_editor_modal_preview', 'Preview', {
        eventLabel: 'File',
      });
    },
    updateURL() {
      let regEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
      return regEx.test(url)
    },
    openDropdown(dropDownID) {
      $(document).ready(function () {
        $(`#${dropDownID}`)
          .focus(function () {
            $(`#${dropDownID}`).attr('size', "6");
          }).focusout(function () {
            $(`#${dropDownID}`).attr('size', "1");
          })
      });
    },
    languageSelected() {
      this.languageReader.map((item, index) => {
        if (item.id === this.language) {
          this.languageValue = item.native_name
        }
      });
    },
    licenseSelected() {
      this.licenseReader.map((item, index) => {
        if (item.id === this.license) {
          this.licenseValue = item.license_name
        }
      });
    },
    visibilitySelected() {
      this.visibilityReader.map((item, index) => {
        if (item.value === this.role) {
          this.visibilityValue = item.text
        }
      });
    }

  },
  $trs: {
    basicInfoHeader: 'Basic information',
    audienceHeader: 'Audience',
    sourceHeader: 'Source',
    assessmentHeader: 'Assessment options',
    thumbnailHeader: 'Thumbnail',
    titleLabel: 'Title',
    languageHelpText: 'Leave blank to use the folder language',
    languageChannelHelpText: 'Leave blank to use the channel language',
    importedFromButtonText: 'Imported from {channel}',
    detectedImportText:
      '{count, plural,\n =1 {# resource has view-only permission}\n other {# resources have view-only permission}}',
    authorLabel: 'Author',
    authorToolTip: 'Person or organization who created this content',
    // providerLabel: 'Provider',
    // providerToolTip: 'Organization that commissioned or is distributing the content',
    // aggregatorLabel: 'Aggregator',
    // aggregatorToolTip:
    //   'Website or org hosting the content collection but not
    // necessarily the creator or copyright holder',
    copyrightHolderLabel: 'Copyright holder',
    descriptionLabel: 'Description',
    tagsLabel: 'Tags',
    noTagsFoundText: 'No results found for "{text}". Press \'Enter\' key to create a new tag',
    randomizeQuestionLabel: 'Randomize question order for learners',
    channelQuizzesLabel: 'Allow as a channel quiz',
    licenseDescriptionLabel: 'License description'
  },
};
</script>


<style lang="less" scoped>
@space-between-sections: 64px;

/deep/ a,
/deep/ a:hover {
  color: inherit;
  text-decoration: none;
}

.details-edit-view {
  padding: 10px;

  /deep/ .subheading {
    margin-bottom: 8px;
    font-weight: bold;
  }

  .section .flex {
    margin: 24px 0 !important;
  }

  .auth-section {
    /deep/ .v-autocomplete .v-input__append-inner {
      visibility: hidden;
    }
  }

  .v-form {
    max-width: 960px;

    .tagbox {
      /deep/ .v-select__selections {
        min-height: 0 !important;
      }

      /deep/ .v-chip__content {
        color: black; // Read-only tag box grays out tags
      }

      /deep/ .v-input__append-inner {
        display: none;
      }
    }

    /deep/ .v-input--is-readonly {
      /deep/ label {
        color: var(--v-grey-darken2) !important;
      }

      /deep/ .v-input__append-inner {
        display: none;
      }

      /deep/ .v-input__slot {
        &::before {
          border-style: dotted;
        }

        &::after {
          border: 0;
        }
      }
    }

    .basicInfoColumn {
      display: flex;

      /deep/ .v-input {
        // Stretches the "Description" text area to fill the column vertically
        align-items: stretch;
      }

      /deep/ .v-input__control {
        // Makes sure that the character count does not get pushed to second column
        flex-wrap: nowrap;
      }
    }
  }
}

.screenReaderDropdown,
.osValidatorDropdown,
.taughtAppDropdown,
.languageDropdown,
.licenseDropdown,
.visibilityDropdown {
  border-bottom: 1px solid rgba(0, 0, 0, .42);
  height: 56px;
  color: rgba(0, 0, 0, .54);
  background-color: rgb(240 240 240);
  width: 100%;
  padding-left: 15px;
  margin-bottom: 10px;
}
</style>
