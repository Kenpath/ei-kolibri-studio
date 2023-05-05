<template>

  <img
    :height="`${height}px`"
    width="auto"
    :src="require('shared/images/ei-logo.svg')"
  >

</template>


<script>

  export default {
    name: 'KolibriLogo',
    props: {
      height: {
        type: Number,
        default: 28,
      },
    },
  };

</script>


<style lang="less" scoped>

  img {
    object-fit: contain;
  }

</style>
