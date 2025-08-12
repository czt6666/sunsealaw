<script lang="ts" setup>
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
</script>
<template>
  <div
    style="
      background-color: #0c162f;
      height: 400px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    "
  >
    <div style="background-color: #0c162f; height: 300px; color: #fff; display: flex">
      <div class="footer-container" style="flex: 2">
        <div style="font-size: 2em; font-weight: bold">SUNSEA LAW GROUP P.C.</div>
        <div class="footer-container-inner" style="flex-direction: row; gap: 20px; margin-top: 10px">
          <router-link to="/about">{{ t('app.about') }}&gt;&gt;</router-link>
          <router-link to="/news">{{ t('app.news') }}&gt;&gt;</router-link>
          <router-link to="/team">{{ t('app.team_member') }}&gt;&gt;</router-link>
        </div>
        <div style="width: 500px; margin-top: 10px; text-align: left; line-height: 1.5; margin-top: 20px">
          At SUNSEA LAW, we are dedicated to providing high-quality, client-focused legal services across diverse
          practice areas. Our experienced attorneys deliver strategic, practical solutions for businesses, investors,
          and individuals navigating complex legal and regulatory landscapes. We value long-term partnerships built on
          trust, collaboration, and shared success.
        </div>
      </div>
      <div class="footer-container" style="flex: 1">
        <div class="footer-container-inner">
          <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 10px">
            <i class="fa-solid fa-phone"></i>
            <div>(951) 790-3922</div>
          </div>

          <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 10px">
            <!--emali icon-->
            <i class="fa-solid fa-envelope"></i>
            <div>info@sunsealaw.com</div>
          </div>

          <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 10px">
            <i class="fa-solid fa-location-dot"></i>
            <div style="text-align: left">3350 Shelby Street Suite 200, Ontario,CA 91764</div>
          </div>
        </div>
      </div>
      <div class="footer-container" style="flex: 1; align-items: flex-end">
        <div class="footer-container-inner">
          <div>
            <router-link to="/visitus">{{ t('app.visit_us') }}</router-link>
          </div>

          <div>
            <router-link to="/contact">{{ t('app.contact_us') }}</router-link>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 1px; background-color: white"></div>
    <div class="footer-container" style="flex: 1">
      <div class="footer-container-inner" style="flex-direction: row; gap: 20px; margin-top: 10px">
        <div>
          <router-link to="/privacy">{{ t('app.privacy_policy') }}</router-link>
        </div>
        <div>
          <router-link to="/terms">{{ t('app.terms_of_service') }}</router-link>
        </div>
        <div>
          <router-link to="/disclaimer">{{ t('app.disclaimer') }}</router-link>
        </div>
        <div>© 2025 Sunsea Law. All Rights Reserved.</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.footer-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
}
.footer-container-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

.footer-container-inner a {
  color: white;
  text-decoration: none;
  transition: color 0.3s; /* 平滑过渡效果 */
}

.footer-container-inner:has(a:hover) a:not(:hover) {
  color: #888;
}

.footer-container-inner div {
  margin: 5px 0px;
}
</style>
