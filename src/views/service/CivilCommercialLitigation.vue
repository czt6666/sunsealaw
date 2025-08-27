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
    <h1>Civil & Commercial Litigation</h1>
    <img
      src="/practiceareas/Civil & Commercial Litigation.png"
      alt="Civil & Commercial Litigation"
      style="width: 100%; height: 100%"
    />
    <p>
      Our litigation team is highly experienced in civil and commercial dispute resolution, protecting clients’ rights
      and business interests through strategic litigation and arbitration approaches.
    </p>

    <p>Our litigation practice includes:</p>
    <ul>
      <li>Contract and commercial disputes</li>
      <li>Shareholder, partnership, and corporate governance litigation</li>
      <li>Employment and intellectual property disputes</li>
      <li>Mediation, arbitration, and alternative dispute resolution (ADR)</li>
      <li>Pre-litigation counseling and risk mitigation strategy</li>
    </ul>
  </div>
  <serviceArea />
</template>

<style scoped>
@import './service.css';
</style>
