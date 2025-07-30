<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

import {
  clearCookies,
  setUserCookies,
  getToken,
  getUserID,
  getUserName,
  getUserRealName,
  isAdmin,
} from "@/cookies/user";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
</script>

<template>
  <div
    style="
      background-color: #0c162f;
      margin: 0px;
      color: white;
      font-family: &quot;Instrument Serif&quot;, serif;
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
          {{ t("app.disclaimer") }}
        </div>
      </div>
    </div>
  </div>
  <div style="width: 1300px; margin: auto; margin-top: 20px">
    <div style="font-size: 2em; font-weight: bold">OUR VISION</div>
    <div style="font-size: 1.5em; margin-top: 10px; line-height: 1.5; text-align: left">
      Navigating legal seas；Lighting your journey.
    </div>
  </div>
  <div style="width: 1300px; margin: auto; margin-top: 20px">
    <div style="font-size: 2em; font-weight: bold">OUR MISSION</div>
    <div style="font-size: 1.5em; margin-top: 10px; line-height: 1.5; text-align: left">
      At SUNSEA LAW, we are dedicated to providing high-quality, client-focused legal services across diverse practice
      areas. Our experienced attorneys deliver strategic, practical solutions for businesses, investors, and individuals
      navigating complex legal and regulatory landscapes. We value long-term partnerships built on trust, collaboration,
      and shared success.
    </div>
  </div>
  <div style="margin-top: 20px"></div>
</template>

<style scoped></style>
