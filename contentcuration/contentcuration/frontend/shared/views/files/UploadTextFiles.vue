<template>
  <div>
    <div v-if="assessmentFileData && assessmentFileData.original_filename">
      <br /><input type="file" id="imgupload" style="display: none" @change="handleFiles($event.target.files)"/>
      <a href="#" id="OpenImgUpload" @click="triggerUpload">{{
        assessmentFileData.original_filename
      }}</a>
    </div>
    <div v-else>
      <input
        ref="fileUpload"
        type="file"
        multiple="false"
        data-test="upload-dialog"
        @change="handleFiles($event.target.files)"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import isFunction from 'lodash/isFunction';
export default {
  name: 'UploadTextFiles',
  props: {
    assessment_item: Object,
    readonly: {
      type: Boolean,
      default: false,
    },
    allowMultiple: {
      type: Boolean,
      default: false,
    },
    uploadCompleteHandler: {
      type: Function,
      required: false,
    },
    fileUploadId: '',
    assessmentId: '',
    fileStatus: '',
    assessmentFileData: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['availableSpace']),
    ...mapGetters('file', ['getFileUpload']),
    fileUpload() {
      this.getFileUpload(this.fileUploadId);
    },
  },
  mounted() {
    console.log('Action', document.getElementById('imgupload'));
  },
  methods: {
    ...mapActions(['fetchUserStorage']),
    ...mapActions('file', ['uploadTextFile']),
    handleFiles(files) {
      this.$emit('upload');

      files = this.allowMultiple ? files : [files[0]];
      return this.handleUploads(files).then((fileObjects) => {
        const objects = fileObjects.map((f) => f.fileObject);
        if (fileObjects.length) {
          for (let ret of fileObjects) {
            const fileObject = ret.fileObject;
            if (fileObject) {
              ret.promise.then((err) => {
                if (err !== fileErrors.UPLOAD_FAILED && isFunction(this.uploadCompleteHandler)) {
                  this.uploadCompleteHandler(this.getFileUpload(fileObject.id));
                }
              });
            }
          }
          if (isFunction(this.uploadingHandler)) {
            this.uploadingHandler(this.allowMultiple ? objects : objects[0]);
          }
        }
        return objects;
      });
    },
    handleUploads(files) {
      // Catch any errors from file uploads and just
      // return null for the fileUploadObject if so
      return Promise.all(
        // Make sure preset is getting set on files in case
        // need to distinguish between presets with same extension
        // (e.g. high res vs. low res videos)
        [...files].map((file) =>
          this.uploadTextFile({
            file,
            preset: this.presetID,
            assessmentId: this.assessmentId,
            fileStatus: this.fileStatus,
          }).catch(() => null)
        )
      ).then((fileObjects) => {
        // Filter out any null values here
        return fileObjects.filter(Boolean);
      });
    },
    triggerUpload() {
      document.getElementById('imgupload').click();
    },
  },
};
</script>
