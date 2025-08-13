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

import locationMap from '@/assets/staticmap_zh-CN.png';
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
  <div style="margin: 40px">
    <img :src="locationMap" alt="locationMap" style="width: 80%" />
  </div>
  <div
    style="
      display: flex;
      margin: auto;
      width: 1300px;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    "
  >
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
</style>
