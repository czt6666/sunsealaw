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
    <div style="font-size: 2em; font-weight: bold; margin: 20px 0px">Capital Markets</div>

    <p>
      Our attorneys have served as securities counsel for numerous public companies, the majority of which are listed on
      the Nasdaq Stock Market and NYSE American. Our attorneys regularly represent issuers, underwriters, placement
      agents, private equity and venture capital funds, emerging growth companies, and special purpose acquisition
      companies (SPACs) in connection with complex capital markets transactions. Additionally, we advise issuers on
      compliance and corporate governance matters, including periodic disclosures, national stock exchange standards and
      board of director and committee matters.
    </p>

    <p>Our capital markets practice includes:</p>
    <ul>
      <li>Initial Public Offerings (IPOs) and secondary offerings</li>
      <li>Registered direct offerings and at-the-market offerings (ATMs)</li>
      <li>Convertible debt and preferred equity instruments offerings</li>
      <li>Regulation D and Rule 506 private placements</li>
      <li>Rule 144A and Regulation S offerings</li>
      <li>SEC and Stock Exchange reporting, disclosure, and compliance requirements for U.S. and non-U.S. issuers</li>
      <li>Sarbanes-Oxley, Dodd-Frank Act, and JOBS Act compliance and advice</li>
    </ul>
  </div>
</template>

<style scoped></style>
