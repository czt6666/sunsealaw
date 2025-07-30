<script setup lang="ts">
import { onMounted, ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { View, Hide, Search, Plus } from "@element-plus/icons-vue";
import {
  serverContactUsAdd,
  serverContactUsDelete,
  serverContactUsUpdate,
  serverGetContactUsPage,
} from "@/server/ContactUs";
import {
  IServerContactUs,
  Pageable,
  Page,
  SimplePage,
  convertPage,
} from "@/server/ServerType";
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
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const pageData = ref<SimplePage<IServerContactUs>>();
const pageNo = ref(0); //第几页
const pageSize = ref(getUserPageSize()); //每页多少数据
const loading = ref(false);
const dialogNewVisible = ref(false); //新增对话框是否可见
const dialogUpdateVisible = ref(false); //修改对话框是否可见
const updateSysUser = ref<IServerContactUs>(); //修改对话框中要修改的用户
const textElipsisValue = ref(false); //超长文本中多余的内容是否用...显示

onMounted(async () => {
  if (!isAdmin()) router.push("/login");
  await getPageDataFromSever();
});

const getPageDataFromSever = async () => {
  const ret = await serverGetContactUsPage(pageNo.value, pageSize.value);
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
  await getPageDataFromSever();
};

const onPageSizeChange = async (value: number) => {
  pageSize.value = value;
  setUserPageSize(value);
  await getPageDataFromSever();
};

/**
 * 点击删除按钮，删除内容
 * @param index
 * @param row
 */
const onRowDeleteButtonClick = async (row: IServerContactUs, index: number) => {
  console.log(index, row);

  ElMessageBox.confirm("是否真的删除数据？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await serverContactUsDelete(row);
      await getPageDataFromSever();
      ElMessage({
        type: "success",
        message: "完成删除",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "删除失败",
      });
    });
};

const goBack = () => {
  history.back();
};
</script>

<template>
  <h1>Contact Us Management</h1>

  <el-page-header @back="goBack" style="margin-bottom: 20px">
    <template #content>
      <span class="text-large font-600 mr-3">Contact Us</span>
    </template>
    <div class="mt-4 text-sm font-bold"></div>
  </el-page-header>

  <!--工具栏-->
  <div class="tab-container">
    <div class="top-toolbar">
      <!--新增按钮-->
      <div></div>

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
          <el-col :span="1" style="display: flex; align-items: center"
            >No.
          </el-col>
          <el-col :span="3" style="display: flex; align-items: center"
            >Name
          </el-col>
          <el-col :span="3" style="display: flex; align-items: center">
            address</el-col
          >
          <el-col :span="2" style="display: flex; align-items: center">
            phone</el-col
          >
          <el-col :span="3" style="display: flex; align-items: center">
            email</el-col
          >
          <el-col :span="10" style="display: flex; align-items: center"
            >message
          </el-col>
          <el-col :span="2" style="display: flex; align-items: center">
            操作
          </el-col>
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
            <div style="display: flex; align-items: center">
              <div :class="{ textEllipsis: textElipsisValue }">
                {{ pageNo * pageSize + userIndex + 1 }}
              </div>
            </div>
          </el-col>

          <!--Name-->
          <el-col :span="3">
            <div style="display: flex; align-items: center">
              <div :class="{ textEllipsis: textElipsisValue }">
                {{ userItem.name }}
              </div>
            </div>
          </el-col>

          <!--address-->
          <el-col :span="3">
            <div style="display: flex; align-items: center">
              <div :class="{ textEllipsis: textElipsisValue }">
                {{ userItem.address }}
              </div>
            </div>
          </el-col>

          <!--phone-->
          <el-col :span="2">
            <div style="display: flex; align-items: center">
              <div :class="{ textEllipsis: textElipsisValue }">
                {{ userItem.phone }}
              </div>
            </div>
          </el-col>

          <!--email-->
          <el-col :span="3">
            <div style="display: flex; align-items: center">
              <div :class="{ textEllipsis: textElipsisValue }">
                {{ userItem.email }}
              </div>
            </div>
          </el-col>

          <!--message-->
          <el-col :span="10">
            <div style="display: flex; align-items: center; text-align: left">
              <div :class="{ textEllipsis: textElipsisValue }">
                {{ userItem.message }}
              </div>
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
