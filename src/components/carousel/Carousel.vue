<template>
  <div class="carousel-container" @mouseover="pauseAutoPlay" @mouseout="resumeAutoPlay">
    <div class="slides">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="slide"
        :class="{ active: currentIndex === index }"
        :style="{ backgroundImage: `url(${getCarouselPhotoUrlByCarousel(item)})` }"
      >
        <div class="content">
          <h2 class="title">{{ item.title }}</h2>
          <p class="subtitle">{{ item.subTitle }}</p>
        </div>
      </div>
    </div>

    <button class="arrow prev" @click="previous">
      <span>&#10094;</span>
    </button>
    <button class="arrow next" @click="next">
      <span>&#10095;</span>
    </button>

    <div class="indicators">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="indicator"
        :class="{ active: currentIndex === index }"
        @click="goTo(index)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, PropType, ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';

import {
  IServerNewsWithPhotoView,
  IServerUserWithPhotoView,
  IServerSysUser,
  IServerNews,
  IServerCarouselImageView,
  IServerCarousel,
} from '@/server/ServerType';

import { getCarouselPhotoUrlByCarousel } from '@/server/Carousel';

const props = defineProps({
  items: {
    type: Array as PropType<IServerCarousel[]>,
    required: true,
  },
  autoPlay: {
    type: Boolean,
    default: false,
  },
  interval: {
    type: Number,
    default: 5000,
  },
});

const currentIndex = ref(0);
const timer = ref<number | null>(null);

const getTitle = (item: IServerCarouselImageView) => {
  return item.title.toUpperCase();
};

const next = () => {
  if (!props.items.length) return;
  currentIndex.value = (currentIndex.value + 1) % props.items.length;
  resetTimer(); // 每次切换后重置计时器
};

const previous = () => {
  if (!props.items.length) return;
  currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length;
  resetTimer(); // 每次切换后重置计时器
};

const goTo = (index: number) => {
  currentIndex.value = index;
  resetTimer(); // 每次切换后重置计时器
};

// 定时器控制逻辑
const startAutoPlay = () => {
  stopAutoPlay();
  timer.value = window.setTimeout(() => {
    next();
    startAutoPlay(); // 递归调用实现连续播放
  }, props.interval);
};

const stopAutoPlay = () => {
  if (timer.value !== null) {
    clearTimeout(timer.value);
    timer.value = null;
  }
};

const resetTimer = () => {
  if (props.autoPlay) {
    stopAutoPlay();
    startAutoPlay();
  }
};

// 鼠标悬停控制
const pauseAutoPlay = () => {
  if (props.autoPlay) stopAutoPlay();
};

const resumeAutoPlay = () => {
  if (props.autoPlay) startAutoPlay();
};

// 监听autoPlay变化
watch(
  () => props.autoPlay,
  (newVal) => {
    if (newVal) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  },
);

// 监听interval变化
watch(
  () => props.interval,
  () => {
    if (props.autoPlay) resetTimer();
  },
);

// 生命周期钩子
onMounted(() => {
  if (props.autoPlay) startAutoPlay();
});

onBeforeUnmount(stopAutoPlay);
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
  overflow: hidden;
  user-select: none;
}

.slides {
  position: relative;
  isolation: isolate;
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 100px);
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
}

.slide::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%; /* 覆盖底部40%区域 */
  background: linear-gradient(to top, rgba(0, 14, 35, 0.9) 20%, /* 深蓝色 */ rgba(8, 32, 68, 0) 100% /* 渐变到透明 */);
  z-index: 1;
}

.slide.active {
  opacity: 1;
}

/* 调整内容定位 */
.content {
  position: absolute;

  bottom: 19%; /* 从底部15%开始 */
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  color: white;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .slide::after {
    height: 50%; /* 移动端增加覆盖高度 */
  }

  .content {
    bottom: 20%;
    padding: 0 1rem;
  }
}

.title {
  font-size: 7rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  font-family: 'Georgia', serif;
  font-weight: lighter;
}

.subtitle {
  font-size: 1.7rem;
  margin-bottom: 1rem;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  padding: 15px 10px;
  font-size: 26px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.arrow:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.prev {
  left: 20px;
}

.next {
  right: 20px;
}

.indicators {
  position: absolute;
  bottom: 140px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.indicator {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s;
}

.indicator.active {
  width: 35px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.9);
}
</style>
