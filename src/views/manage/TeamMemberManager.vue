<script setup lang="ts">
import { onMounted, ref, reactive, computed } from "vue";

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
  IServerSysUser,
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

import UserPhoto from "@/components/member/UserPhoto.vue";
import NewMemberDialog from "@/components/member/NewMemberDialog.vue";
import UpdateMemberDialog from "@/components/member/UpdateMemberDialog.vue";
import { useI18n } from "vue-i18n";

import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const pageData = ref<SimplePage<IServerSysUser>>();
const pageNo = ref(0); //第几页
const pageSize = ref(getUserPageSize()); //每页多少数据
const loading = ref(false);
const dialogNewVisible = ref(false); //新增对话框是否可见
const dialogUpdateVisible = ref(false); //修改对话框是否可见
const updateSysUser = ref<IServerSysUser>(); //修改对话框中要修改的用户
const textElipsisValue = ref(false); //超长文本中多余的内容是否用...显示

onMounted(async () => {
  if (!isAdmin()) router.push("/login");
  await getUserPageDataFromSever();
});

const getUserPageDataFromSever = async () => {
  const ret = await serverGetUserPage(pageNo.value, pageSize.value);
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
  await getUserPageDataFromSever();
};

const onPageSizeChange = async (value: number) => {
  pageSize.value = value;
  setUserPageSize(value);
  await getUserPageDataFromSever();
};

const onNewButtonClick = () => {
  dialogNewVisible.value = true;
};

const handleNewMemberOk = async (sysUser: IServerSysUser) => {
  console.log(sysUser);
  const ret = await serverUserAdd(sysUser);
  dialogNewVisible.value = false;
  await getUserPageDataFromSever();
};

const handleNewMemberCancel = () => {
  dialogNewVisible.value = false;
};

const onRowEditButtonClick = async (
  userItem: IServerSysUser,
  userIndex: number
) => {
  updateSysUser.value = userItem;
  dialogUpdateVisible.value = true;
};

const onRowDeleteButtonClick = async (
  userItem: IServerSysUser,
  userIndex: number
) => {
  ElMessageBox.confirm("Are you sure you want to delete this user?", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(async () => {
      await serverUserResetPwd(userItem);

    

      ElMessage({
        type: "success",
        message: "Success",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Failed",
      });
    });


  await getUserPageDataFromSever();
};

const onResetPasswordByAdminButtonClick=async(  userItem: IServerSysUser,
  userIndex: number
) => {

  ElMessageBox.confirm("Are you sure you want to reset the user's password to 123456?", "Warning", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(async () => {
      await serverUserDelete(userItem);

    

      ElMessage({
        type: "success",
        message: "Success",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Failed",
      });
    });

  
};

const handleUpdateMemberOk = async (sysUser: IServerSysUser) => {
  

  const ret = await serverUserUpdate(sysUser);
  await getUserPageDataFromSever();

  dialogUpdateVisible.value = false;
};

const handleUpdateMemberCancel = () => {
  dialogUpdateVisible.value = false;
};

const goBack = () => {
  history.back();
};
</script>

<template>
  <NewMemberDialog
    :dialog-visible="dialogNewVisible"
    @onDilalogOk="handleNewMemberOk"
    @onDilalogCancel="handleNewMemberCancel"
  />

  <UpdateMemberDialog
    :dialog-visible="dialogUpdateVisible"
    :sys-user="updateSysUser"
    @onDilalogOk="handleUpdateMemberOk"
    @onDilalogCancel="handleUpdateMemberCancel"
  />

  <h1>Lawyer Team Management</h1>

  <el-page-header @back="goBack" style="margin-bottom: 20px">
    <template #content>
      <span class="text-large font-600 mr-3">Lawyer Team</span>
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
            margin-bottom: -5px;text-align: left;
          "
        >
          <el-col :span="1">No. </el-col>
          <el-col :span="3"> User Name</el-col>
          <el-col :span="3"> Real Name</el-col>
          <el-col :span="3"> Email</el-col>
          <el-col :span="2">Role </el-col>
          <el-col :span="6">License Info </el-col>
          <el-col :span="4"> Photo</el-col>
          <el-col :span="2"> Operation </el-col>
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
            text-align: left;
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

          <!--用户登录ID-->
          <el-col :span="3">
            <div style="display: flex; align-items: center">
              <div :class="{ textEllipsis: textElipsisValue }">
                {{ userItem.userName }}
              </div>
            </div>
          </el-col>

          <!--用户名称-->
          <el-col :span="3">
            <div style="display: flex; align-items: center">
              <div :class="{ textEllipsis: textElipsisValue }">
                {{ userItem.realName }}
              </div>
            </div>
          </el-col>

          <!--电子邮件-->
          <el-col :span="3">
            <div style="display: flex; align-items: center">
              <div :class="{ textEllipsis: textElipsisValue }">
                {{ userItem.email }}
              </div>
            </div>
          </el-col>

          <!--公司内角色-->
          <el-col :span="2">
            <div style="display: flex; align-items: center">
              <div :class="{ textEllipsis: textElipsisValue }">
                {{ userItem.companyRole }}
              </div>
            </div>
          </el-col>

          <!--律师执业证信息-->
          <el-col :span="6">
            <div style="display: flex; align-items: center">
              <div :class="{ textEllipsis: textElipsisValue }">
                {{ userItem.licensedInfo }}
              </div>
            </div>
          </el-col>

          <!--照片-->
          <el-col :span="4">
            <div style="display: flex; align-items: center">
              <UserPhoto
                :userId="userItem.id"
                :img-width="40"
                :img-height="40"
              ></UserPhoto>
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
                v-if="userItem.userName != 'admin'"
                size="small"
                type="danger"
                style="margin-left: 0px; margin-top: 5px"
                @click="onRowDeleteButtonClick(userItem, userIndex)"
              >
                {{ t("app.delete") }}
              </el-button>

              <el-button
                v-if="userItem.userName != 'admin'"
                size="small"
                type="danger"
                style="margin-left: 0px; margin-top: 5px"
                @click="onResetPasswordByAdminButtonClick(userItem, userIndex)"
              >
                {{ t("app.reset_password") }}
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
