<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';

import { View, Hide, Search, Plus } from '@element-plus/icons-vue';
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
import { IServerSysUser, Pageable, Page, SimplePage, convertPage, IServerNews } from '@/server/ServerType';
import { getUserPageSize, setUserPageSize } from '@/cookies/user';
import NewsPhoto from '@/components/news/NewsPhoto.vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { formatDate0, formatDate01 } from '@/utils/utils';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const pageData = ref<SimplePage<IServerNews>>();
const pageNo = ref(0); //第几页
const pageSize = ref(getUserPageSize()); //每页多少数据
const loading = ref(false);
const dialogNewVisible = ref(false); //新增对话框是否可见
const dialogUpdateVisible = ref(false); //修改对话框是否可见
const updateSysUser = ref<IServerSysUser>(); //修改对话框中要修改的用户
const textElipsisValue = ref(false); //超长文本中多余的内容是否用...显示

onMounted(async () => {
  await getNewsPageDataFromSever();
});

const getNewsPageDataFromSever = async () => {
  const ret = await serverGetNewsPage(pageNo.value, pageSize.value);
  console.log(ret);
  if (ret && ret.code == 200) {
    pageData.value = convertPage(ret.data);
  }
};

const tableData = computed(() => {
  const ret = pageData.value?.content ?? [];

  return ret;
});

const totalCount = computed(() => {
  return Number(pageData.value?.totalItems ?? 0);
});

const onPagePrevClick = (value: number) => {};
const onPageNextClick = (value: number) => {};
const onPageCurrentChange = async (value: number) => {
  pageNo.value = value;
  await getNewsPageDataFromSever();
};

const onPageSizeChange = async (value: number) => {
  pageSize.value = value;
  setUserPageSize(value);
  await getNewsPageDataFromSever();
};

const onNewButtonClick = () => {
  dialogNewVisible.value = true;
};

const onMemberClick = (newsItem: IServerNews) => {
  router.push({ path: `/news-detail/${newsItem.id}` });
};
const goBack = () => {
  history.back();
};
</script>

<template>
  <div
    style="
      background-color: #0c162f;
      margin: 0px;
      color: white;
      font-family: 'Instrument Serif', serif;
      font-size: clamp(3.3125rem, 2.9vw + 2.515rem, 5.125rem);
      font-weight: 400;
      letter-spacing: 1.2px;
      line-height: 1.08;

      padding-top: 60px;
      padding-bottom: 60px;
    "
  >
    {{ t('app.news') }}
  </div>

  <div class="tab-container">
    <div style="margin: 20px">
      <div
        v-for="(newsItem, newsIndex) in tableData"
        class="news-container"
        v-loading="loading"
        :gutter="20"
        @click="onMemberClick(newsItem)"
      >
        <!--新闻信息-->

        <!--图像-->
        <!-- <div
            v-if="newsItem.titlePhoto"
            style="
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <NewsPhoto
              :newsId="newsItem.id"
              :img-width="100"
              :img-height="100"
            ></NewsPhoto>
          </div>-->
        <!--新闻-->
        <div class="news-container-outer" @click="onMemberClick(newsItem)">
          <div class="news-container-inner">
            <!--新闻标题-->
            <div>
              {{ newsItem.title }}
            </div>

            <!--新闻日期---->
            <div
              style="font-size: 16px; margin-top: 10px; margin-bottom: 10px; font-family: Arial, Helvetica, sans-serif"
            >
              {{ formatDate01(newsItem.createDateTime) }}
            </div>
          </div>
        </div>
      </div>

      <el-pagination
        :hide-on-single-page="true"
        class="page-class"
        background
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[10, 50, 100, 200, 300, 400]"
        layout="total, sizes, prev, pager, next"
        :total="totalCount"
        @prev-click="onPagePrevClick"
        @next-click="onPageNextClick"
        @current-change="onPageCurrentChange"
        @size-change="onPageSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.top-toolbar {
  display: flex;

  margin: 0 10px;
}

.textEllipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
}

.news-container-outer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  width: 1300px;
}
.news-container-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  font-family: 'Instrument Serif', serif;
  font-size: 2em;
  font-weight: 400;
  letter-spacing: 1.2px;
  line-height: 1.08;
  width: 100%;
  margin: auto;
  text-align: left;
}

.news-container {
  margin: 10px;
  padding: 10px;

  border-radius: 5px;

  display: flex;
  cursor: pointer;
}
</style>
