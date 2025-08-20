<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from 'vue';
import svgIcon from '@/components/SvgIcon.vue';

const { toolbarRef } = defineProps<{
  toolbarRef?: HTMLDivElement | null | undefined;
}>();

const emit = defineEmits<{
  (e: 'update:showOptionsDropDown', value: boolean): void;
  (e: 'onDocStyleClick', style: string): void;
}>();
const dropDownRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (toolbarRef && dropDownRef.value) {
    const { top, left, width, height } = toolbarRef.getBoundingClientRect();

    const dropdownRect = dropDownRef.value.getBoundingClientRect();

    dropDownRef.value.style.top = `${top + height}px`;
    if (left + dropdownRect.width > window.innerWidth)
      dropDownRef.value.style.left = `${window.innerWidth - dropdownRect.width - 20}px`;
    else dropDownRef.value.style.left = `${left}px`;

    document.addEventListener('click', handle);
  }
});

watch(
  () => toolbarRef,
  async (val, prevval) => {
    if (val && dropDownRef.value) {
      const { top, left, width, height } = val.getBoundingClientRect();
      const dropdownRect = dropDownRef.value.getBoundingClientRect();

      dropDownRef.value.style.top = `${top + height}px`;
      if (left + dropdownRect.width > window.innerWidth)
        dropDownRef.value.style.left = `${window.innerWidth - dropdownRect.width - 20}px`;
      else dropDownRef.value.style.left = `${left}px`;
    }
  },
);

function handle(event: Event) {
  const target = event.target as Node;

  if (!dropDownRef.value?.contains(target) && !toolbarRef?.contains(target)) emit('update:showOptionsDropDown', false);
}

onUnmounted(() => {
  document.removeEventListener('click', handle);
});

const onDocStyleClick = (style: string) => {
  emit('onDocStyleClick', style);
};
</script>
<template>
  <div ref="dropDownRef" class="dropdown" style="z-index: 9999">
    <div class="drop-down-container">
      <div class="doc-style-item" @click="onDocStyleClick('Normal')">
        <i class="icon paragraph_normal" />
        Normal
      </div>
      <div class="doc-style-item" @click="onDocStyleClick('Heading 1')">
        <i class="icon h1" />
        Heading 1
      </div>
      <div class="doc-style-item" @click="onDocStyleClick('Heading 2')">
        <i class="icon h2" />
        Heading 2
      </div>
      <div class="doc-style-item" @click="onDocStyleClick('Heading 3')">
        <i class="icon h3" />
        Heading 3
      </div>
    </div>
  </div>
</template>

<style>
@import url('@/assets/css/toolbar.css');
@import url('@/assets/css/dropdown.css');

.doc-style-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  padding: 5px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
}

.doc-style-item:hover {
  background-color: rgb(121.3, 187.1, 255);
  color: #000;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
</style>
