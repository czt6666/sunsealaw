<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  clearCookies,
  setUserCookies,
  getToken,
  getUserID,
  getUserName,
  getUserRealName,
  isAdmin,
} from '@/cookies/user';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

import locationMap from '@/assets/visit_us_map.png';
import visit_us_1 from '@/assets/visit_us_1.jpg';
import visit_us_2 from '@/assets/visit_us_2.jpg';
import visit_us_3 from '@/assets/visit_us_3.jpg';
</script>

<template>
  <div
    style="
      background-color: #0c162f;
      margin: 0px;
      color: white;
      font-family: 'Instrument Serif', serif;
      font-size: 20px;
      font-weight: 400;
      letter-spacing: 1.2px;
      line-height: 1.08;

      padding-top: 40px;
      padding-bottom: 40px;
    "
  >
    <div class="news-container-outer">
      <div class="news-container-inner">
        <div style="font-size: 3em; cursor: pointer">
          {{ t('app.visit_us') }}
        </div>
      </div>
    </div>
  </div>
  <div style="width: 80%; margin: auto; margin-top: 20px">
    <img :src="locationMap" alt="locationMap" style="width: 100%" />
    <div class="visit-us-pic-container">
      <img :src="visit_us_1" alt="visit_us_1" class="visit-us-pic" />
      <img :src="visit_us_2" alt="visit_us_2" class="visit-us-pic" />
      <img :src="visit_us_3" alt="visit_us_3" class="visit-us-pic" />
    </div>
  </div>
  <div class="ss-text-container" style="margin-top: 20px">
    <div class="visit-us-container" style="flex: 1">
      <div class="visit-us-container-inner">
        <div class="visit-us-title">Location</div>
        <div style="text-align: left">LA Address: 18300 Von Karman Ave, Suite 970, Irvine, CA 92612</div>
      </div>
    </div>
    <div class="visit-us-container" style="flex: 1">
      <div class="visit-us-container-inner">
        <div class="visit-us-title">E-mail</div>
        <div>info@sunsealaw.com</div>
      </div>
    </div>
    <div class="visit-us-container" style="flex: 1">
      <div class="visit-us-container-inner">
        <div class="visit-us-title">Phone</div>
        <div>(951) 790-3922</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.visit-us-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
}
.visit-us-container-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

.visit-us-container-inner a {
  color: white;
  text-decoration: none;
  transition: color 0.3s; /* 平滑过渡效果 */
}

.visit-us-container-inner:has(a:hover) a:not(:hover) {
  color: #888;
}

.visit-us-container-inner div {
  margin: 5px 0px;
}

.visit-us-title {
  font-size: 20px; /* 调整字体大小 */
  font-weight: bold; /* 加粗字体 */
  color: #333; /* 调整字体颜色 */
  margin-bottom: 10px; /* 调整底部间距 */
}

.visit-us-pic-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: auto;
  margin-top: 20px;
}

.visit-us-pic {
  width: 32%;
  border-radius: 10px;
}

@media (max-width: 768px) {
  .footer-container-content-container {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .visit-us-pic-container {
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .visit-us-pic {
    width: 100%;
    margin-top: 20px;
  }
}
</style>
