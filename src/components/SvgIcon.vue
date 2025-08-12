<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  iconDir: {
    type: String,
    required: true,
  },
  iconName: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
  size: {
    type: [Number, String],
    default: 18,
  },
  enable: {
    type: Boolean,
    default: true,
  },
});
const symbolId = computed(() => `#icon-${props.iconDir}-${props.iconName}`);

const iconOpacity = computed(() => {
  if (props.enable) return 1;
  else return 0.1;
});
</script>

<template>
  <svg
    aria-hidden="true"
    :style="{
      width: size + 'px',
      height: size + 'px',
      opacity: iconOpacity,
    }"
  >
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

​
<style scoped>
.svg-icon {
  fill: currentColor;
  vertical-align: middle;
}
</style>
