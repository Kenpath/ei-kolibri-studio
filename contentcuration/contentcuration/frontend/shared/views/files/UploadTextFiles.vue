<template>
  <div>
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
  },
  computed: {
    ...mapGetters(['availableSpace']),
    ...mapGetters('file', ['getFileUpload']),
    acceptedFiles() {
      return FormatPresetsList.filter((fp) =>
        this.presetID
          ? this.presetID === fp.id
          : !fp.supplementary && (!this.displayOnly || fp.display)
      );
    },
  },
  methods: {
    ...mapActions(['fetchUserStorage']),
    ...mapActions('file', ['uploadTextFile']),
    handleFiles(files) {
      console.log('files', files[0]);
      this.$emit('upload');

      files = this.allowMultiple ? files : [files[0]];
      // files = this.validateFiles(files);

      // Show errors if relevant
      // if (this.totalUploadSize > this.availableSpace) {
      //   this.showStorageExceededAlert = true;
      //   return;
      // } else if (this.unsupportedFiles.length) {
      //   this.showUnsupportedFilesAlert = true;
      // } else if (this.tooLargeFiles.length) {
      //   this.showTooLargeFilesAlert = true;
      // }
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
