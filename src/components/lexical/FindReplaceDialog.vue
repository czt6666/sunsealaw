import { default } from '../tabs/Tab.vue';
<!-- components/NonModalDialog.vue -->
<template>
  <transition name="slide-fade">
    <div
      v-if="visible"
      ref="dialogRef"
      class="dialog-container"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
      @mousedown="handleDialogMouseDown"
    >
      <div class="dialog-content">
        <!-- 拖动区域 -->
        <div class="dialog-header" @mousedown.stop="startDrag">
          {{ title }}

          <button @click.stop="close">×</button>
        </div>

        <!-- 内容区域 -->
        <div class="dialog-body">
          <div class="toolbar-mini" style="display: flex; align-items: center">
            <button
              v-if="showReplaceItems"
              class="toolbar-item spaced"
              aria-label="Find"
              @click="onShowReplaceItems"
            >
              <i class="format arrow_double_up" />
            </button>
            <button
              v-else
              class="toolbar-item spaced"
              aria-label="Find"
              @click="onShowReplaceItems"
            >
              <i class="format arrow_double_down" />
            </button>
            <input
              v-model="searchText"
              type="text"
              placeholder="Enter search text"
            />
            <div v-if="searchResultsCount > 0">
              {{ editorCurrentMatchIndex + 1 }}/{{ searchResultsCount }}
            </div>
            <button
              :disabled="!searchText"
              class="toolbar-item spaced"
              aria-label="Find"
              @click="onEditFind"
            >
              <i class="format find" />
            </button>
            <button
              :disabled="!searchText || searchResultsCount === 0"
              class="toolbar-item spaced"
              aria-label="Find"
              @click="onEditFindPrevious"
            >
              <i class="format arrow_up" />
            </button>
            <button
              :disabled="!searchText || searchResultsCount === 0"
              class="toolbar-item spaced"
              aria-label="Find"
              @click="onEditFindNext"
            >
              <i class="format arrow_down" />
            </button>
            <button
              :class="`toolbar-item spaced ${isCasesensitive ? 'active' : ''}`"
              aria-label="Find"
              @click="onEditFindCaseSensitive"
            >
              <i class="format casesensitive" />
            </button>
          </div>
          <div
            class="toolbar-mini"
            v-if="showReplaceItems"
            style="display: flex; align-items: center; margin-top: 5px"
          >
            <div v-if="showReplaceItems" style="margin-right: 20px"></div>
            <input
              v-model="replaceText"
              type="text"
              placeholder="Enter replace text"
            />
            <button
              :disabled="!replaceText || searchResultsCount === 0"
              class="toolbar-item spaced"
              aria-label="Replace"
              @click="onEditReplace"
            >
              <i class="format replace" />
            </button>
            <button
              :disabled="!replaceText"
              class="toolbar-item spaced"
              aria-label="Replace All"
              @click="onEditReplaceAll"
            >
              <i class="format replace_all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
  toRef,
  nextTick,
} from "vue";

const props = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: "Dialog",
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true,
  },
  initialPosition: {
    type: Object,
    default: () => ({ x: 30, y: 30 }),
  },
  searchResultsCount: {
    type: Number,
    default: 0,
  },
  currentMatchIndex: {
    type: Number,
    default: -1,
  },
  showReplaceArea: {
    type: Boolean,
    default: false,
  },
});

export interface ISearchOptions {
  caseSensitive?: boolean; //大小写敏感
  wholeWord?: boolean; //匹配整个单词
  regex?: boolean;
}

//const emit = defineEmits(["update:visible"]);

const emit = defineEmits<{
  (e: "update:visible", visible: boolean): void;
  (e: "onEditFind", searchText: string, options: ISearchOptions): void;
  (e: "onEditFindPrevious", searchText: string, options: ISearchOptions): void;
  (e: "onEditFindNext", searchText: string, options: ISearchOptions): void;
  (
    e: "onEditReplace",
    searchText: string,
    replaceText: string,
    options: ISearchOptions
  ): void;
  (
    e: "onEditReplaceAll",
    searchText: string,
    replaceText: string,
    options: ISearchOptions
  ): void;
}>();

const searchText = ref("");
const replaceText = ref("");
const showReplaceItems = ref(false);
const isCasesensitive = ref<boolean>(false); //查找时是否大小写敏感
const isWholeWord = ref<boolean>(false); //查找时是否大小写敏感
const editorCurrentMatchIndex = ref(-1);
//const editorCurrentMatchIndex = toRef(props, "currentMatchIndex");
watch(
  () => props.currentMatchIndex,
  async (val, prevval) => {
    //  console.log("val:" + val);
    editorCurrentMatchIndex.value = val;
  },
  { immediate: true } // 添加立即触发
);

watch(
  () => props.showReplaceArea,
  async (val, prevval) => {
    // console.log("val:" + val);
    showReplaceItems.value = val;
  },
  { immediate: true } // 添加立即触发
);

const onEditFindCaseSensitive = () => {
  isCasesensitive.value = !isCasesensitive.value;
};

/**
 * 查找下一个
 */
const onEditFind = () => {
  const options: ISearchOptions = {
    caseSensitive: isCasesensitive.value,
    wholeWord: isWholeWord.value,
    regex: false,
  };
  emit("onEditFind", searchText.value, options);
};

/**
 * 查找上一个
 */
const onEditFindPrevious = () => {
  const options: ISearchOptions = {
    caseSensitive: isCasesensitive.value,
    wholeWord: isWholeWord.value,
    regex: false,
  };
  emit("onEditFindPrevious", searchText.value, options);
};

/**
 * 查找下一个
 */
const onEditFindNext = () => {
  const options: ISearchOptions = {
    caseSensitive: isCasesensitive.value,
    wholeWord: isWholeWord.value,
    regex: false,
  };
  emit("onEditFindNext", searchText.value, options);
};

/**
 * 替换当前
 */
const onEditReplace = () => {
  const options: ISearchOptions = {
    caseSensitive: isCasesensitive.value,
    wholeWord: isWholeWord.value,
    regex: false,
  };
  emit("onEditReplace", searchText.value, replaceText.value, options);
};

/**
 * 替换所有
 */
const onEditReplaceAll = () => {
  const options: ISearchOptions = {
    caseSensitive: isCasesensitive.value,
    wholeWord: isWholeWord.value,
    regex: false,
  };
  emit("onEditReplaceAll", searchText.value, replaceText.value, options);
};

// 对话框位置
const position = reactive({ ...props.initialPosition });

// 拖动相关状态
const isDragging = ref(false);
const startPos = reactive({ x: 0, y: 0 });
const dialogRef = ref<HTMLDivElement>();

const onShowReplaceItems = () => {
  showReplaceItems.value = !showReplaceItems.value;
};

// 开始拖动
const startDrag = (e: MouseEvent) => {
  isDragging.value = true;
  startPos.x = e.clientX - position.x;
  startPos.y = e.clientY - position.y;

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
};

// 处理拖动
const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;

  // 计算新位置
  let newX = e.clientX - startPos.x;
  let newY = e.clientY - startPos.y;

  // 边界检查（防止拖出可视区域）
  const dialogWidth = dialogRef.value?.offsetWidth || 0;
  const dialogHeight = dialogRef.value?.offsetHeight || 0;

  newX = Math.max(0, Math.min(newX, window.innerWidth - dialogWidth));
  newY = Math.max(0, Math.min(newY, window.innerHeight - dialogHeight));

  position.x = newX;
  position.y = newY;
};

// 停止拖动
const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
};

// 处理对话框点击（防止点击穿透）
const handleDialogMouseDown = (e: MouseEvent) => {
  if (e.target === dialogRef.value && props.closeOnClickOutside) {
    close();
  }
};

// 关闭对话框
const close = () => {
  emit("update:visible", false);
};

// 组件卸载时清理
onUnmounted(() => {
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
});
</script>

<style scoped>
@import url("@/assets/css/toolbar.css");
@import url("@/assets/css/minitoolbar.css");
.dialog-container {
  position: fixed;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.dialog-content {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dialog-header {
  padding: 2px 2px;
  background: #f5f5f5;
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.dialog-header button {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 8px;
}

.dialog-body {
  padding: 5px;
}

/* 拖动时样式 */
.dialog-header:active {
  background: #eee;
}

/* 过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
