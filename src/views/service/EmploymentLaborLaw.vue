<script setup lang="ts">
import { computed, onMounted, reactive, ref, Ref, watch } from 'vue';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';

import type { FormInstance, FormRules } from 'element-plus';
import { IServerNews } from '@/server/ServerType';
import {
  serverNewsAdd,
  serverNewsUpdate,
  serverNewsDelete,
  serverGetNewsPage,
  serverAddNewsPhotoUploadTempFiles,
  serverDeleteNewsPhotoUploadTempFiles,
  serverGetNewsById,
} from '@/server/News';

import NewsPhoto from '@/components/news/NewsPhoto.vue';
import { useI18n } from 'vue-i18n';

import { formatDate0, formatDate01 } from '@/utils/utils';
import serviceArea from './serviceArea.vue';
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

onMounted(async () => {});
</script>

<template>
  <!--新闻信息-->
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
    <!--图像
    <div
      v-if="newsData.titlePhoto"
      style="
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <NewsPhoto
        :newsId="newsData.id"
        :img-width="100"
        :img-height="100"
      ></NewsPhoto>
    </div>-->

    <div class="news-container-outer">
      <div class="news-container-inner">
        <div style="font-size: 3em; cursor: pointer">{{ t('app.service').toUpperCase() }}</div>
      </div>
    </div>
  </div>

  <div class="service-container">
    <h1>Employment & Labor Law</h1>
    <img
      src="/practiceareas/Employment & Labor Law.png"
      alt="Employment & Labor Law"
      style="width: 100%; height: 100%"
    />
    <p>
      We support businesses in building compliant, fair, and productive workplaces. Our attorneys counsel clients on a
      wide range of employment and labor law matters, from workforce structuring to regulatory compliance and dispute
      management.
    </p>

    <p>Our services include:</p>
    <ul>
      <li>Employment law compliance audits and HR policy development</li>
      <li>Risk management related to terminations, layoffs, and wage-hour issues</li>
      <li>Anti-discrimination, harassment, and DEI policy guidance</li>
      <li>Collective bargaining, labor relations, and union negotiations</li>
      <li>Defense against wrongful termination and employment-related claims</li>
    </ul>
  </div>
  <serviceArea />
</template>

<style scoped>
@import './service.css';
</style>
