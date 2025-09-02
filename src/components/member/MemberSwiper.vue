<template>
  <div class="lawyer-carousel-container">
    <button class="nav-btn prev-btn" @click="prevSlide" :disabled="totalItems <= visibleCards" aria-label="Previous">
      <i class="fas fa-chevron-left"></i>
    </button>

    <div class="lawyer-carousel" ref="carouselRef">
      <div
        class="lawyer-track"
        :class="{ 'no-transition': !isTransition }"
        :style="trackStyle"
        @mouseenter="pauseAutoPlay"
        @mouseleave="resumeAutoPlay"
      >
        <div
          v-for="(user, index) in loopedUsers"
          :key="`${user.id || index}-${index}`"
          class="lawyer-card"
          :class="{ active: isCardActive(index) }"
          @click="() => router.push({ path: `/team-member/${user.id}` })"
        >
          <div class="lawyer-image-container">
            <div class="image-wrapper">
              <img :src="getUserPhotoUrlBySysUser(user)" :alt="user.userName || 'Lawyer'" class="lawyer-image" />
              <div class="image-overlay"></div>
            </div>

            <div class="lawyer-info">
              <h3 class="lawyer-name">{{ user.userName || 'Unknown' }}</h3>
              <p class="lawyer-role">{{ user.companyRole || 'Attorney' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="nav-btn next-btn" @click="nextSlide" :disabled="totalItems <= visibleCards" aria-label="Next">
      <i class="fas fa-chevron-right"></i>
    </button>

    <!-- 指示器 -->
    <div class="carousel-indicators" v-if="totalItems > visibleCards">
      <button
        v-for="(_, index) in totalItems"
        :key="index"
        class="indicator"
        :class="{ active: isIndicatorActive(index) }"
        @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IServerSysUser } from '@/server/ServerType';
import { getUserPhotoUrlBySysUser } from '@/server/SysUser';
import { useRouter, useRoute } from 'vue-router';
import { onMounted, onBeforeUnmount, ref, computed, nextTick } from 'vue';

const router = useRouter();
const props = withDefaults(
  defineProps<{
    users: IServerSysUser[];
    visibleCards?: number;
    interval?: number;
  }>(),
  {
    visibleCards: 4,
    interval: 5000,
  },
);

// 响应式数据
const carouselRef = ref<HTMLElement>();
const currentIndex = ref(0);
const isPlaying = ref(true);
const isTransition = ref(true);
const cardWidth = ref(0);

let autoTimer: number | null = null;

// 计算属性
const totalItems = computed(() => props.users.length);

const loopedUsers = computed(() => {
  if (totalItems.value <= props.visibleCards) return props.users;

  // 为了实现无缝循环，在前后各添加 visibleCards 数量的卡片
  const beforeItems = props.users.slice(-props.visibleCards);
  const afterItems = props.users.slice(0, props.visibleCards);

  return [...beforeItems, ...props.users, ...afterItems];
});

const trackStyle = computed(() => {
  const translateX = -(currentIndex.value + props.visibleCards) * cardWidth.value;
  return {
    transform: `translateX(${translateX}px)`,
    width: `${loopedUsers.value.length * cardWidth.value}px`,
    '--card-width': `${cardWidth.value - 20}px`, // 减去 margin，避免超出
  };
});

function nextSlide() {
  if (totalItems.value <= props.visibleCards) return;

  currentIndex.value++;

  // 检查是否需要循环
  if (currentIndex.value >= totalItems.value) {
    currentIndex.value = 0;
    // isTransition.value = false;
    // setTimeout(() => {
    //   isTransition.value = true;
    // }, 0);
  }
}

function prevSlide() {
  if (totalItems.value <= props.visibleCards) return;

  currentIndex.value--;

  // 检查是否需要循环
  if (currentIndex.value < 0) {
    currentIndex.value = totalItems.value - 1;
    // isTransition.value = false;
    // nextTick(() => {
    //   isTransition.value = true;
    // });
  }
}

function goToSlide(index: number) {
  if (totalItems.value <= props.visibleCards) return;
  currentIndex.value = index;
}

function isCardActive(index: number): boolean {
  if (totalItems.value <= props.visibleCards) return true;

  const actualIndex = currentIndex.value + props.visibleCards;
  const centerStart = actualIndex;
  const centerEnd = actualIndex + props.visibleCards - 1;

  return index >= centerStart && index <= centerEnd;
}

function isIndicatorActive(index: number): boolean {
  return index === currentIndex.value;
}

function pauseAutoPlay() {
  isPlaying.value = false;
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}

function resumeAutoPlay() {
  if (totalItems.value > props.visibleCards) {
    isPlaying.value = true;
    startAutoPlay();
  }
}

function startAutoPlay() {
  if (totalItems.value <= props.visibleCards) return;

  if (autoTimer) clearInterval(autoTimer);
  autoTimer = setInterval(() => {
    if (isPlaying.value) nextSlide();
  }, props.interval);
}

// 生命周期
onMounted(() => {
  if (carouselRef.value) {
    const containerWidth = carouselRef.value.offsetWidth;
    cardWidth.value = containerWidth / props.visibleCards;
  }
  startAutoPlay();
});

onBeforeUnmount(() => {
  if (autoTimer) clearInterval(autoTimer);
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.lawyer-carousel-container {
  overflow: hidden;
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 80px 10px;
  border-radius: 20px;
}

.lawyer-carousel {
  border-radius: 16px;
  background: transparent;
}

.lawyer-track {
  display: flex;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform;
}

.lawyer-track.no-transition {
  transition: none !important;
}

.lawyer-card {
  flex: 0 0 auto;
  width: var(--card-width); /* 用 CSS 变量代替固定值 */
  margin: 0 10px;
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  opacity: 0.7;
  transform: scale(0.92) translateY(10px);
  position: relative;
}

.lawyer-card.active {
  opacity: 1;
  transform: scale(1) translateY(0);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

.lawyer-image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
}

.lawyer-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
  background: #f0f0f0;
}

.lawyer-card:hover .lawyer-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.7) 100%);
  pointer-events: none;
}

.lawyer-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 16px rgba(212, 175, 55, 0.4);
  z-index: 3;
  transition: all 0.3s ease;
}

.lawyer-badge:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
}

.badge-tooltip {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.lawyer-badge:hover .badge-tooltip {
  opacity: 1;
  transform: translateY(0);
}

.lawyer-info {
  height: 120px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9));
  z-index: 3;
}

.lawyer-name {
  width: 100%;
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #333;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: absolute;
  left: 50%;
  bottom: 5px;
  transform: translateX(-50%);
}

.lawyer-role {
  width: 100%;
  font-size: 22px;
  color: #d4af37;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
  position: absolute;
  left: 50%;
  bottom: -30px;
  transform: translateX(-50%);
  z-index: 99;
}

.nav-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 10;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.nav-btn:hover:not(:disabled) {
  background: #f8f9fc;
  border-color: #d4af37;
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: translateY(-50%) scale(0.9);
}

.nav-btn i {
  color: #4a5568;
  font-size: 20px;
  transition: color 0.3s ease;
}

.nav-btn:hover:not(:disabled) i {
  color: #d4af37;
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 60px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: #cbd5e0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.indicator:hover {
  background: #a0aec0;
  transform: scale(1.2);
}

.indicator.active {
  background: #d4af37;
  transform: scale(1.3);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
}
</style>
