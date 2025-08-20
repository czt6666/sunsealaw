<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { ElMessage } from 'element-plus';

import { View, Hide, Search, Plus } from '@element-plus/icons-vue';
import {
  serverUserAdd,
  serverUserDelete,
  serverUserUpdate,
  serverUserResetPwd,
  serverGetUserPage,
} from '@/server/SysUser';

import {
  serverNewsAdd,
  serverNewsUpdate,
  serverNewsDelete,
  serverGetNewsPage,
  serverAddNewsPhotoUploadTempFiles,
  serverDeleteNewsPhotoUploadTempFiles,
  serverGetNewsPhotoFileById,
} from '@/server/News';

import { IServerSysUser, Pageable, Page, SimplePage, convertPage, IServerNews } from '@/server/ServerType';
import {
  clearCookies,
  setUserCookies,
  getToken,
  getUserID,
  getUserName,
  getUserRealName,
  isAdmin,
  getUserPageSize,
  setUserPageSize,
} from '@/cookies/user';
import NewsPhoto from '@/components/news/NewsPhoto.vue';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const pageData = ref<SimplePage<IServerNews>>();
const pageNo = ref(0); //第几页
const pageSize = ref(getUserPageSize()); //每页多少数据
const loading = ref(false);

const textElipsisValue = ref(true); //超长文本中多余的内容是否用...显示

onMounted(async () => {
  if (!isAdmin()) router.push('/login');
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
  return pageData.value?.content ?? [];
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
  router.push({ path: '/manager-news-add' });
};

const onRowEditButtonClick = async (userItem: IServerNews, userIndex: number) => {
  router.push({ path: `/manager-news-update/${userItem.id}` });
};

const onRowDeleteButtonClick = async (userItem: IServerNews, userIndex: number) => {
  const ret = await serverNewsDelete(userItem);
  await getNewsPageDataFromSever();
};

const goBack = () => {
  history.back();
};
</script>

<template>
  <h1>News Management</h1>

  <el-page-header @back="goBack" style="margin-bottom: 20px">
    <template #content>
      <span class="text-large font-600 mr-3">News Management</span>
    </template>
    <div class="mt-4 text-sm font-bold"></div>
  </el-page-header>
  <!--工具栏-->
  <div class="tab-container">
    <div class="top-toolbar">
      <!--新增按钮-->
      <div>
        <el-button :icon="Plus" type="primary" @click="onNewButtonClick">Add News</el-button>
      </div>

      <div style="margin-left: auto">
        <el-switch
          v-model="textElipsisValue"
          inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-text="Auto size"
          inactive-text="Show All Content"
        />
      </div>
    </div>

    <div>
      <!--显示内容-->
      <div class="project-container">
        <el-row
          style="
            width: 100%;
            font: 1em sans-serif;
            border: 1px solid #eee;
            border-bottom-style: none;
            padding: 5px;
            margin: 5px;
            margin-left: 0px;
            white-space: pre-wrap;
            line-height: 1.5;
            margin-top: 10px;
            margin-bottom: -5px;
          "
        >
          <el-col :span="1">No.</el-col>
          <el-col :span="6">Title</el-col>
          <el-col :span="3">TitlePhoto</el-col>
          <el-col :span="12">Content</el-col>
          <el-col :span="2">操作</el-col>
        </el-row>

        <el-row
          v-for="(newsItem, newsIndex) in tableData"
          style="
            width: 100%;
            height: 80px;
            font: 0.8em sans-serif;
            border: 1px solid #eee;
            padding: 5px;
            margin: 5px;
            margin-left: 0px;
            white-space: pre-wrap;
            line-height: 1.5;
            color: #606266;
          "
          v-loading="loading"
          :gutter="20"
        >
          <!--序号-->
          <el-col :span="1">
            <div style="display: flex; align-items: center">
              <div :class="{ textEllipsis: textElipsisValue }">
                {{ pageNo * pageSize + newsIndex + 1 }}
              </div>
            </div>
          </el-col>

          <!--Title-->
          <el-col :span="6">
            <div style="display: flex; align-items: center">
              <div :class="{ textEllipsis: textElipsisValue }">
                {{ newsItem.title }}
              </div>
            </div>
          </el-col>

          <!--TitlePhoto-->
          <el-col :span="3">
            <div style="display: flex; align-items: center">
              <NewsPhoto :newsId="newsItem.id" :img-width="100" :img-height="100"></NewsPhoto>
            </div>
          </el-col>

          <!--Content-->
          <el-col :span="12">
            <div style="display: flex; align-items: center; text-align: left; overflow: hidden">
              <div :class="{ textEllipsis: textElipsisValue }">
                {{ newsItem.contentHtml }}
              </div>
            </div>
          </el-col>

          <!--操作-->
          <el-col :span="2">
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center">
              <el-button size="small" @click="onRowEditButtonClick(newsItem, newsIndex)">
                {{ t('app.edit') }}
              </el-button>

              <el-button
                size="small"
                type="danger"
                style="margin-left: 0px; margin-top: 5px"
                @click="onRowDeleteButtonClick(newsItem, newsIndex)"
              >
                {{ t('app.delete') }}
              </el-button>
            </div>
          </el-col>
        </el-row>
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
.project-container {
  width: 100vw;
  overflow: hidden;
}
.top-toolbar {
  display: flex;

  margin: 0 10px;
}

.textEllipsis {
  width: 100%;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
}
</style>
