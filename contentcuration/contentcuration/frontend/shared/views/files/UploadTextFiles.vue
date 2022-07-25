<template>
  <div>
    <span v-if="fileUpload"></span>
    <input
      ref="fileUpload"
      type="file"
      multiple="false"
      data-test="upload-dialog"
      @change="handleFiles($event.target.files)"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import isFunction from 'lodash/isFunction';
export default {
  name: 'UploadTextFiles',
  props: {
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
    data() {
      return {
        fileUploadId: null,
      };
    }
  },
  computed: {
    ...mapGetters(['availableSpace']),
    ...mapGetters('file', ['getFileUpload']),
    fileUpload(){
      console.log('this.fileUploadId', this.fileUploadId)
      this.getFileUpload(this.fileUploadId)
    }
  },
  methods: {
    ...mapActions(['fetchUserStorage']),
    ...mapActions('file', ['uploadTextFile']),
    handleFiles(files) {
      console.log('files', files[0]);
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
          this.uploadTextFile({ file, preset: this.presetID }).catch(() => null)
        )
      ).then((fileObjects) => {
        // Filter out any null values here
        return fileObjects.filter(Boolean);
      });
    },
  },
};
</script>
