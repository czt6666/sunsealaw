<template>
  <div class="lawyer-carousel-container">
    <button class="nav-btn prev-btn" @click="prevSlide" aria-label="Previous">
      <i class="fas fa-chevron-left"></i>
    </button>

    <div class="lawyer-carousel">
      <div
        class="lawyer-track"
        :style="{ transform: `translateX(${currentPosition}px)` }"
        @mouseenter="pauseAutoPlay"
        @mouseleave="resumeAutoPlay"
      >
        <div
          v-for="(user, index) in displayUsers"
          :key="index"
          class="lawyer-card"
          :class="{ active: isActive(index) }"
        >
          <div class="lawyer-image-container">
            <img :src="getPhotoUrl(user)" :alt="user.sysUser.realName" class="lawyer-image" @error="handleImageError" />
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

    <div class="carousel-dots" v-if="users.length > visibleCards">
      <button
        v-for="(dot, index) in dotCount"
        :key="index"
        class="dot"
        :class="{ active: currentDot === index }"
        @click="goToSlide(index)"
      ></button>
    </div>
  </div>
</template>

<script lang="ts">
import { IServerUserWithPhotoView } from '@/server/ServerType';
import { defineComponent, PropType, ref, computed, onMounted, onBeforeUnmount } from 'vue';

export default defineComponent({
  name: 'LawyerCarousel',
  props: {
    users: {
      type: Array as PropType<IServerUserWithPhotoView[]>,
      required: true,
      default: () => [],
    },
    visibleCards: {
      type: Number,
      default: 3,
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 5000,
    },
  },
  setup(props) {
    const currentPosition = ref(0);
    const currentIndex = ref(0);
    const isPlaying = ref(props.autoPlay);
    let autoPlayInterval: number | null = null;

    // 卡片宽度（包括间距）
    const cardWidth = 320;
    const cardMargin = 20;
    const totalCardWidth = cardWidth + cardMargin * 2;

    // 处理循环显示的用户列表
    const displayUsers = computed(() => {
      if (props.users.length <= props.visibleCards) {
        return props.users;
      }

      // 为了实现无缝循环，复制首尾元素
      return [...props.users.slice(-props.visibleCards), ...props.users, ...props.users.slice(0, props.visibleCards)];
    });

    // 计算圆点数量
    const dotCount = computed(() => Math.ceil(props.users.length / props.visibleCards));
    const currentDot = computed(() => {
      if (currentIndex.value >= props.users.length) {
        return 0;
      }
      if (currentIndex.value < 0) {
        return dotCount.value - 1;
      }
      return Math.floor(currentIndex.value / props.visibleCards);
    });

    // 获取照片URL
    const getPhotoUrl = (user: IServerUserWithPhotoView) => {
      if (user.photoBase64) {
        return user.photoBase64;
      }
      return user.sysUser.photo || 'https://www.whitehouse.gov/administration/donald-j-trump/';
    };

    // 图片加载失败处理
    const handleImageError = (event: Event) => {
      const img = event.target as HTMLImageElement;
      img.src = 'https://www.whitehouse.gov/administration/donald-j-trump/';
    };

    // 截断过长的详细信息
    const truncateDetails = (details: string, maxLength = 100) => {
      if (details.length > maxLength) {
        return details.substring(0, maxLength) + '...';
      }
      return details;
    };

    // 检查卡片是否处于激活状态
    const isActive = (index: number) => {
      const adjustedIndex = index - props.visibleCards;
      return adjustedIndex >= currentIndex.value && adjustedIndex < currentIndex.value + props.visibleCards;
    };

    // 下一组
    const nextSlide = () => {
      if (props.users.length <= props.visibleCards) return;

      currentIndex.value++;

      // 如果到达实际数据的末尾，平滑过渡到复制的开头部分
      if (currentIndex.value > props.users.length) {
        setTimeout(() => {
          currentIndex.value = 0;
          currentPosition.value = -props.visibleCards * totalCardWidth;
        }, 500);
      }

      currentPosition.value = -(currentIndex.value + props.visibleCards) * totalCardWidth;
    };

    // 上一组
    const prevSlide = () => {
      if (props.users.length <= props.visibleCards) return;

      currentIndex.value--;

      // 如果到达实际数据的开头，平滑过渡到复制的末尾部分
      if (currentIndex.value < -props.visibleCards) {
        setTimeout(() => {
          currentIndex.value = props.users.length - props.visibleCards;
          currentPosition.value = -(props.users.length + props.visibleCards) * totalCardWidth;
        }, 500);
      }

      currentPosition.value = -(currentIndex.value + props.visibleCards) * totalCardWidth;
    };

    // 跳转到指定幻灯片
    const goToSlide = (dotIndex: number) => {
      currentIndex.value = dotIndex * props.visibleCards;
      currentPosition.value = -(currentIndex.value + props.visibleCards) * totalCardWidth;
    };

    // 暂停自动播放
    const pauseAutoPlay = () => {
      isPlaying.value = false;
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    };

    // 恢复自动播放
    const resumeAutoPlay = () => {
      if (props.autoPlay) {
        isPlaying.value = true;
        startAutoPlay();
      }
    };

    // 启动自动播放
    const startAutoPlay = () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
      autoPlayInterval = window.setInterval(() => {
        if (isPlaying.value) {
          nextSlide();
        }
      }, props.interval);
    };

    onMounted(() => {
      if (props.autoPlay) {
        startAutoPlay();
      }

      // 初始化位置（跳过前面复制的元素）
      if (props.users.length > props.visibleCards) {
        currentPosition.value = -props.visibleCards * totalCardWidth;
      }
    });

    onBeforeUnmount(() => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    });

    return {
      currentPosition,
      displayUsers,
      dotCount,
      currentDot,
      getPhotoUrl,
      handleImageError,
      truncateDetails,
      isActive,
      nextSlide,
      prevSlide,
      goToSlide,
      pauseAutoPlay,
      resumeAutoPlay,
    };
  },
});
</script>

<style scoped>
.lawyer-carousel-container {
  position: relative;
  max-width: 1200px;
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
  min-width: 300px;
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

.carousel-dots {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ccc;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: #d4af37;
  transform: scale(1.2);
}

@media (max-width: 1024px) {
  .lawyer-card {
    min-width: 280px;
  }
}

@media (max-width: 768px) {
  .lawyer-carousel-container {
    padding: 20px 40px;
  }

  .lawyer-card {
    min-width: 250px;
    margin: 0 10px;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 576px) {
  .lawyer-carousel-container {
    padding: 20px 30px;
  }

  .lawyer-card {
    min-width: 220px;
  }

  .lawyer-name {
    font-size: 1.3rem;
  }
}
</style>
