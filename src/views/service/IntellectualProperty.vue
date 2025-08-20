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
  serverGetNewsPhotoFileById,
  serverGetNewsById,
} from '@/server/News';

import NewsPhoto from '@/components/news/NewsPhoto.vue';
import { useI18n } from 'vue-i18n';

import { formatDate0, formatDate01 } from '@/utils/utils';

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
    <!--新闻-->
    <div class="news-container-outer">
      <div class="news-container-inner">
        <div style="font-size: 3em; cursor: pointer">PRACTICE AREAS</div>
      </div>
    </div>
  </div>

  <div style="width: 1300px; margin: auto; text-align: left; line-height: 1.5">
    <div style="font-size: 2em; font-weight: bold; margin: 20px 0px">Intellectual Property</div>

    <p>
      We help clients secure and enforce their intellectual property rights, reduce risk exposure, and maximize the
      commercial value of innovation. Our team advises across the full lifecycle of IP assets, from registration to
      enforcement and dispute resolution, both domestically and internationally.
    </p>

    <p>Our IP services include:</p>
    <ul>
      <li>Trademark, patent, and copyright protection and portfolio management</li>
      <li>IP litigation and enforcement actions</li>
      <li>Licensing, technology transfer, and IP transactional support</li>
      <li>Cross-border infringement analysis for e-commerce and tech companies</li>
      <li>Pre-litigation strategy, negotiation, and settlement of IP disputes</li>
    </ul>
  </div>
</template>

<style scoped></style>
