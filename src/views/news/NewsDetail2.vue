<script setup lang="ts">
import { computed, onMounted, reactive, ref, Ref, watch } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";

import type { FormInstance, FormRules } from "element-plus";
import { IServerNews } from "@/server/ServerType";
import {
  serverNewsAdd,
  serverNewsUpdate,
  serverNewsDelete,
  serverGetNewsPage,
  serverAddNewsPhotoUploadTempFiles,
  serverDeleteNewsPhotoUploadTempFiles,
  serverGetNewsPhotoFileById,
  serverGetNewsById,
} from "@/server/News";

import NewsPhoto from "@/components/news/NewsPhoto.vue";
import { useI18n } from "vue-i18n";

import { formatDate0, formatDate01 } from "@/utils/utils";
import RenderHtml from "@/components/lexical/RenderHtml.vue";
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const newsId = ref(0);
const newsData = ref<IServerNews>({
  id: 0,
  createDateTime: new Date(),
  title: "",
  brief: "",
  contentJson: "",
  contentHtml: "",
  titlePhoto: "",
  sysUserId: 0,
});

onBeforeRouteUpdate(async (to) => {
  console.log(to);
  if (typeof to.params.id === "string") {
    newsId.value = parseInt(to.params.id);
    await getNewsDataFromSever(parseInt(to.params.id));
  } else {
    getNewsDataFromSever(parseInt(to.params.id[0]));
    newsId.value = parseInt(to.params.id[0]);
  }

  console.log(newsId.value);
});

onMounted(async () => {
  console.log(route.params);
  console.log(typeof route.params.id);
  if (typeof route.params.id === "string") {
    await getNewsDataFromSever(parseInt(route.params.id));
    newsId.value = parseInt(route.params.id);
  }
  console.log(newsId.value);
});

const getNewsDataFromSever = async (id: number) => {
  console.log(id);
  if (!id) return;

  const ret = await serverGetNewsById(id);

  if (ret && ret.code == 200) {
    newsData.value = ret.data;
  }

  console.log(newsData.value);
};
</script>

<template>
  <!--新闻信息-->
  <div class="news-title-container">
    <!--新闻-->
    <div class="news-container-outer">
      <div class="news-container-inner">
        <!--新闻标题-->
        <div style="font-size: 3em; cursor: pointer">
          {{ newsData.title }}
        </div>

        <!--新闻日期---->
        <div style="text-align: center; margin: auto; margin-top: 10px">
          {{ formatDate01(newsData.createDateTime) }}
        </div>
      </div>
    </div>
  </div>
  <div class="news-info">
    <!--详细信息-->
    <RenderHtml :html-content="newsData.contentHtml" />
  </div>
</template>

<style scoped>
.news-title-container {
  background-color: #0c162f;
  margin: 0px;
  color: white;
  font-family: "Instrument Serif", serif;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 1.2px;
  line-height: 1.08;
  padding-top: 40px;
  padding-bottom: 40px;
}
.news-container-outer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 10px;
  padding-left: 40px;
  border-radius: 5px;
}
.news-container-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
.news-info {
  padding: 20px;
  width: 800px;
  margin: 0 auto;
}
::v-deep(.image-block) {
  text-align: center;
}
::v-deep(.image-block img) {
  max-width: 554px;
  max-height: 369px;
}
::v-deep(p.content-paragraph) {
  text-indent: 2em;
}
</style>
