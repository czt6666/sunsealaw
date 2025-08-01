<template>
  <div class="lawyer-carousel-container">
    <button class="nav-btn prev-btn" @click="prevSlide" aria-label="Previous">
      <i class="fas fa-chevron-left"></i>
    </button>

    <div class="lawyer-carousel">
      <div
        class="lawyer-track transition"
        :style="trackStyle"
        @mouseenter="pauseAutoPlay"
        @mouseleave="resumeAutoPlay"
        @transitionend="handleTransitionEnd"
      >
        <div v-for="(user, index) in loopedUsers" :key="index" class="lawyer-card">
          <div class="lawyer-image-container">
            <img :src="user.photoBase64" :alt="user.sysUser.realName" class="lawyer-image" />
            <div class="lawyer-badge" v-if="user.sysUser.licensedInfo">
              <i class="fas fa-balance-scale"></i>
            </div>
            <h3 class="lawyer-name">{{ user.sysUser.realName }}</h3>
          </div>
          <p class="lawyer-role">{{ user.sysUser.companyRole }}</p>
        </div>
      </div>
    </div>

    <button class="nav-btn next-btn" @click="nextSlide" aria-label="Next">
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, watch } from "vue";
import type { IServerUserWithPhotoView } from "@/server/ServerType";

const props = defineProps<{
  users: IServerUserWithPhotoView[];
  visibleCards?: number;
  interval?: number;
}>();

const visibleCards = props.visibleCards ?? 3;
const interval = props.interval ?? 5000;
const cardWidth = 320 + 20 * 2;

const currentIndex = ref(visibleCards);
const isPlaying = ref(true);

let autoTimer: number | null = null;

// 拼接前后元素，实现首尾循环
const loopedUsers = computed(() => {
  if (props.users.length <= visibleCards) return props.users;
  return [...props.users.slice(-visibleCards), ...props.users, ...props.users.slice(0, visibleCards)];
});

const totalItems = computed(() => props.users.length);
const maxIndex = computed(() => totalItems.value + visibleCards - 1);

const trackStyle = computed(() => ({
  transform: `translateX(${-currentIndex.value * cardWidth}px)`,
}));

function nextSlide() {
  if (totalItems.value <= visibleCards) return;
  currentIndex.value++;
}

function prevSlide() {
  if (totalItems.value <= visibleCards) return;
  currentIndex.value--;
}

function handleTransitionEnd() {
  // 循环平滑跳转
  if (currentIndex.value === totalItems.value + visibleCards) {
    currentIndex.value = visibleCards;
  } else if (currentIndex.value === 0) {
    currentIndex.value = totalItems.value;
  }
}

function pauseAutoPlay() {
  isPlaying.value = false;
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}

function resumeAutoPlay() {
  isPlaying.value = true;
  startAutoPlay();
}

function startAutoPlay() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = setInterval(() => {
    if (isPlaying.value) nextSlide();
  }, interval);
}

onMounted(() => {
  startAutoPlay();
});

onBeforeUnmount(() => {
  if (autoTimer) clearInterval(autoTimer);
});
</script>

<style scoped>
.lawyer-carousel-container {
  position: relative;
  max-width: 1200px;
  height: 500px;
  margin: 0 auto;
  padding: 20px 60px;
  display: flex;
  align-items: center;
}

.lawyer-carousel {
  width: 100%;
}

.lawyer-track {
  display: flex;
  transition: transform 0.5s ease;
}

.lawyer-card {
  position: relative;
  /* width: 320px; */
  margin: 0 20px;
  background: white;
  transition: all 0.3s ease;
  opacity: 0.8;
  transform: scale(0.95);
}

.lawyer-card.active {
  opacity: 1;
  transform: scale(1);
}

.lawyer-image-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.lawyer-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  vertical-align: middle;
  transition: transform 0.5s ease;
  -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
}

.lawyer-card.active .lawyer-image {
  transform: scale(1.05);
}

.lawyer-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background: #d4af37;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.lawyer-name {
  font-size: 53px;
  font-weight: 800;
  margin-bottom: 5px;
  color: #0b132c;
  position: absolute;
  bottom: 0;
  z-index: 99;
  width: 100%;
}

.lawyer-role {
  position: absolute;
  bottom: -30px;
  font-size: 22px;
  color: #d4af37;
  font-weight: 500;
  margin-bottom: 10px;
  width: 100%;
}

.lawyer-id,
.lawyer-license,
.lawyer-email {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.lawyer-id i,
.lawyer-license i,
.lawyer-email i {
  margin-right: 8px;
  color: #666;
  width: 20px;
  text-align: center;
}

.lawyer-license {
  color: #2a7f62;
  font-weight: 500;
}

.lawyer-details {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #555;
  margin: 15px 0;
}

.lawyer-email {
  color: #0a2c5e;
  text-decoration: none;
  transition: color 0.3s ease;
}

.lawyer-email:hover {
  color: #d4af37;
}

.nav-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.nav-btn:hover {
  background: #f0f0f0;
  transform: translateY(-50%) scale(1.1);
}

.nav-btn i {
  color: #333;
  font-size: 1.2rem;
}

.prev-btn {
  left: 0;
}

.next-btn {
  right: 0;
}
</style>
