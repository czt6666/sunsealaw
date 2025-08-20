<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from 'vue';

import { LangeuageOption, defaultLanguageOption, LANGUAGES_OPTIONS } from '@/i18n/langtypes';

import { useI18n } from 'vue-i18n';
import { getLocale } from '@/i18n';
const { locale: i18nLanguage } = useI18n();

const { t } = useI18n(); // 解构出t方法

const { toolbarRef } = defineProps<{
  toolbarRef?: HTMLDivElement | null | undefined;
}>();

const emit = defineEmits<{
  (e: 'update:showOptionsDropDown', value: boolean): void;
  (e: 'onItemClick', lang: LangeuageOption): void;
}>();
const dropDownRef = ref<HTMLDivElement | null>(null);
const currentLang = ref<LangeuageOption>(defaultLanguageOption);

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

  getStoreLanguage();
});

/**
 * 获取语言配置
 */
const getStoreLanguage = () => {
  let langStore = getLocale();

  if (!langStore) langStore = 'en';

  LANGUAGES_OPTIONS.forEach((item) => {
    if (item.value == langStore) {
      currentLang.value = item;
    }
  });

  console.log('currentLang', currentLang.value);
};

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

const onItemClick = (lang: LangeuageOption) => {
  emit('onItemClick', lang);
  currentLang.value = lang;

  console.log('onChangeLang', lang);
  localStorage.setItem('locale', lang.value); // 存入缓存
  i18nLanguage.value = lang.value;

  window.location.reload(); // 刷新页面，也可以不刷新，但是一般要修改ui框架的语言，就需要刷新
};
</script>

<template>
  <div ref="dropDownRef" class="dropdown" style="z-index: 9999">
    <div class="drop-down-container">
      <div
        v-for="(item, index) in LANGUAGES_OPTIONS"
        :key="index"
        style="width: 160px"
        class="drop-down-line-width-item"
        :class="`${item.value == currentLang.value ? 'drop-down-line-width-item-active' : ''}`"
        @click="onItemClick(item)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<style>
@import url('@/assets/css/toolbar.css');
@import url('@/assets/css/dropdown.css');

.drop-down-line-width-item {
  display: flex;
  margin: auto;

  border: solid 1px white;

  border-radius: 6px;
  padding: 10px;
  width: 100px;
  align-items: center;
  justify-content: center;
}

.drop-down-line-width-item:hover {
  border: solid 1px #d4d7de;
  border-radius: 2px;
  color: blue;
}

.drop-down-line-width-item-active {
  border: solid 1px #d4d7de;
  border-radius: 2px;
  color: blue;
}
</style>
