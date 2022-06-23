<template>
    <div>
        <iframe width="560" height="315" :src="urlValue" title="Video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <!-- <iframe :src="urlValue" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"/> -->
    </div>
</template>

<script lang="ts">
export default ({
    name:"URLUpload",
    props :{
        urlValue:String,
    }
})
</script>