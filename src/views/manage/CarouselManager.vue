<script setup lang="ts">
import { onMounted, ref, reactive, computed } from "vue";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { View, Hide, Search, Plus } from "@element-plus/icons-vue";
import {
  serverUserAdd,
  serverUserDelete,
  serverUserUpdate,
  serverUserResetPwd,
  serverGetUserPage,
} from "@/server/SysUser";
import {
  IServerCarousel,
  Pageable,
  Page,
  SimplePage,
  convertPage,
} from "@/server/ServerType";

import {
  serverCarouselAdd,
  serverCarouselDelete,
  serverCarouselUpdate,
  serverGetCarouselPage,
  serverAddCarouselPhotoUploadTempFiles,
  serverDeleteCarouselPhotoUploadTempFiles,
  serverGetCarouselPhotoFileById,
} from "@/server/Carousel";

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
} from "@/cookies/user";
import CarouselPhoto from "@/components/carousel/CarouselPhoto.vue";
import NewCarouselDialog from "@/components/carousel/NewCarouselDialog.vue";
import UpdateCarouselDialog from "@/components/carousel/UpdateCarouselDialog.vue";
import { useI18n } from "vue-i18n";
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const pageData = ref<SimplePage<IServerCarousel>>();
const pageNo = ref(0); //第几页
const pageSize = ref(getUserPageSize()); //每页多少数据
const loading = ref(false);
const dialogNewVisible = ref(false); //新增对话框是否可见
const dialogUpdateVisible = ref(false); //修改对话框是否可见
const updateCarousel = ref<IServerCarousel>(); //修改对话框中要修改的用户
const textElipsisValue = ref(false); //超长文本中多余的内容是否用...显示

onMounted(async () => {
  if (!isAdmin()) router.push("/login");
  await getCarouselPageDataFromSever();
});

const getCarouselPageDataFromSever = async () => {
  const ret = await serverGetCarouselPage(pageNo.value, pageSize.value);
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
  await getCarouselPageDataFromSever();
};

const onPageSizeChange = async (value: number) => {
  pageSize.value = value;
  setUserPageSize(value);
  await getCarouselPageDataFromSever();
};

const onNewButtonClick = () => {
  dialogNewVisible.value = true;
};

const handleNewMemberOk = async (carousel: IServerCarousel) => {
  console.log(carousel);
  const ret = await serverCarouselAdd(carousel);
  dialogNewVisible.value = false;
  await getCarouselPageDataFromSever();
};

const handleNewMemberCancel = () => {
  dialogNewVisible.value = false;
};

const onRowEditButtonClick = async (
  carousel: IServerCarousel,
  userIndex: number
) => {
  updateCarousel.value = carousel;
  dialogUpdateVisible.value = true;
};

const onRowDeleteButtonClick = async (
  carousel: IServerCarousel,
  userIndex: number
) => {
  const ret = await serverCarouselDelete(carousel);
  await getCarouselPageDataFromSever();
};
const handleUpdateMemberOk = async (carousel: IServerCarousel) => {
  console.log(carousel);
  const ret = await serverCarouselUpdate(carousel);

  dialogUpdateVisible.value = false;

  await getCarouselPageDataFromSever();
};

const handleUpdateMemberCancel = () => {
  dialogUpdateVisible.value = false;
};

const goBack = () => {
  history.back();
};
</script>

<template>
  <NewCarouselDialog
    :dialog-visible="dialogNewVisible"
    @onDilalogOk="handleNewMemberOk"
    @onDilalogCancel="handleNewMemberCancel"
  />

  <UpdateCarouselDialog
    :dialog-visible="dialogUpdateVisible"
    :carousel="updateCarousel"
    @onDilalogOk="handleUpdateMemberOk"
    @onDilalogCancel="handleUpdateMemberCancel"
  />

  <h1>Carousel Management</h1>

  <el-page-header @back="goBack" style="margin-bottom: 20px">
    <template #content>
      <span class="text-large font-600 mr-3">Carousel Management</span>
    </template>
    <div class="mt-4 text-sm font-bold"></div>
  </el-page-header>
  <!--工具栏-->
  <div class="tab-container">
    <div class="top-toolbar">
      <!--新增按钮-->
      <div>
        <el-button :icon="Plus" type="primary" @click="onNewButtonClick">
          {{ t("app.new") }}
        </el-button>
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
          <el-col :span="1">No. </el-col>
          <el-col :span="4"> Title</el-col>
          <el-col :span="10"> Sub Title </el-col>
          <el-col :span="5"> Photo</el-col>

          <el-col :span="2"> Valid</el-col>
          <el-col :span="2"> 操作 </el-col>
        </el-row>

        <el-row
          v-for="(userItem, userIndex) in tableData"
          style="
            width: 100%;
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
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              {{ pageNo * pageSize + userIndex + 1 }}
            </div>
          </el-col>

          <el-col :span="4">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <span class="textEllipsis" :title="userItem.title">
                {{ userItem.title }}
              </span>
            </div>
          </el-col>

          <el-col :span="10">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <span class="textEllipsis" :title="userItem.subTitle">
                {{ userItem.subTitle }}
              </span>
            </div>
          </el-col>

          <!--照片-->
          <el-col :span="5">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <CarouselPhoto
                :carouselId="userItem.id"
                :img-width="100"
                :img-height="100"
              ></CarouselPhoto>
            </div>
          </el-col>

          <!--是否有效-->
          <el-col :span="2">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              {{ userItem.style == 1 ? "Show" : "Hide" }}
            </div>
          </el-col>

          <!--操作-->
          <el-col :span="2">
            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              "
            >
              <el-button
                type="primary"
                size="small"
                @click="onRowEditButtonClick(userItem, userIndex)"
              >
                {{ t("app.edit") }}
              </el-button>

              <el-button
                size="small"
                type="danger"
                style="margin-left: 0px; margin-top: 5px"
                @click="onRowDeleteButtonClick(userItem, userIndex)"
              >
                {{ t("app.delete") }}
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
</style>
