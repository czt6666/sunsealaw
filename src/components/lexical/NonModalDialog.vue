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
          <slot> </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";

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
});

const emit = defineEmits(["update:visible"]);

// 对话框位置
const position = reactive({ ...props.initialPosition });

// 拖动相关状态
const isDragging = ref(false);
const startPos = reactive({ x: 0, y: 0 });
const dialogRef = ref(null);

// 开始拖动
const startDrag = (e) => {
  isDragging.value = true;
  startPos.x = e.clientX - position.x;
  startPos.y = e.clientY - position.y;

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
};

// 处理拖动
const onDrag = (e) => {
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
const handleDialogMouseDown = (e) => {
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
