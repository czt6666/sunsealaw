<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from "vue";
import svgIcon from "@/components/SvgIcon.vue";


const { toolbarRef } = defineProps<{
  toolbarRef?: HTMLDivElement | null | undefined;
}>();

const emit = defineEmits<{
  (e: "update:showOptionsDropDown", value: boolean): void;
  (e: "onFontSizeClick", fontsize: number): void;
}>();
const dropDownRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (toolbarRef && dropDownRef.value) {
    const { top, left, width, height } = toolbarRef.getBoundingClientRect();

    const dropdownRect = dropDownRef.value.getBoundingClientRect();

    dropDownRef.value.style.top = `${top + height}px`;
    if (left + dropdownRect.width > window.innerWidth)
      dropDownRef.value.style.left = `${
        window.innerWidth - dropdownRect.width - 20
      }px`;
    else dropDownRef.value.style.left = `${left}px`;

    document.addEventListener("click", handle);
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
        dropDownRef.value.style.left = `${
          window.innerWidth - dropdownRect.width - 20
        }px`;
      else dropDownRef.value.style.left = `${left}px`;
    }
  }
);

function handle(event: Event) {
  const target = event.target as Node;

  if (!dropDownRef.value?.contains(target) && !toolbarRef?.contains(target))
    emit("update:showOptionsDropDown", false);
}

onUnmounted(() => {
  document.removeEventListener("click", handle);
});

const onFontSizeClick = (fontsize: number) => {
  emit("onFontSizeClick", fontsize);
};

const range = (start: number, end: number) => {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};
</script>

<template>
  <div ref="dropDownRef" class="dropdown" style="z-index: 9999">
    <div class="drop-down-container">
      <div
        v-for="item in range(5, 120)"
        :key="item"
        class="font-item"
        @click="onFontSizeClick(item)"
      >
        <div>
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url("@/assets/css/dropdown.css");
.font-item {
  text-align: left;
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
  cursor: pointer;
}

.font-item:hover {
  background-color: rgb(121.3, 187.1, 255);
  color: #000;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
</style>
