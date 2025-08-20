<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue';
import DOMPurify from 'dompurify';

const props = defineProps({
  htmlContent: {
    type: String,
    required: true,
  },
});

const sanitizedHtml = computed(() => {
  return DOMPurify.sanitize(props.htmlContent);
});
</script>

<template>
  <div class="custom-html-content" v-html="sanitizedHtml"></div>
</template>

<style scoped>
/* 深度穿透 Element UI 的样式隔离 */
.custom-html-content ::v-deep p {
  color: #333;
  text-align: left;
}
.custom-html-content ::v-deep h1 {
  color: #333;
  text-align: left;
}
</style>
