<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';

import { View, Hide, Search, Plus } from '@element-plus/icons-vue';
import {
  serverUserAdd,
  serverUserDelete,
  serverUserUpdate,
  serverUserResetPwd,
  serverGetUserPage,
} from '@/server/SysUser';
import { IServerSysUser, Pageable, Page, SimplePage, convertPage } from '@/server/ServerType';
import { getUserPageSize, setUserPageSize } from '@/cookies/user';
import UserPhoto from '@/components/member/UserPhoto.vue';
import { useRouter, useRoute } from 'vue-router';

import { useI18n } from 'vue-i18n';
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
  const ret = pageData.value?.content ?? [];
  if (ret.length > 0) {
    for (let i = 0; i < ret.length; i++) {
      if (ret[i].userName == 'admin') {
        ret.splice(i, 1);
        i--;
        break;
      }
    }
  }
  return ret;
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
};

const handleNewMemberCancel = () => {
  dialogNewVisible.value = false;
};

const onRowEditButtonClick = async (userItem: IServerSysUser, userIndex: number) => {
  updateSysUser.value = userItem;
  dialogUpdateVisible.value = true;
};

const onRowDeleteButtonClick = async (userItem: IServerSysUser, userIndex: number) => {
  await getUserPageDataFromSever();
};
const handleUpdateMemberOk = async (sysUser: IServerSysUser) => {
  console.log(sysUser);
  const ret = await serverUserUpdate(sysUser);

  dialogUpdateVisible.value = false;

  await getUserPageDataFromSever();
};

const handleUpdateMemberCancel = () => {
  dialogUpdateVisible.value = false;
};

const onMemberClick = (userItem: IServerSysUser) => {
  console.log(userItem);

  router.push({ path: `/team-member/${userItem.id}` });
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
      user-select: none;
    "
  >
    {{ t('app.core_team_members') }}
  </div>

  <div style="margin: 20px; padding: 20px; text-align: left; font-style: italic">
    {{ t('app.core_team_members_desc') }}
  </div>
  <!--工具栏-->
  <div class="member-container">
    <div
      v-for="(userItem, userIndex) in tableData"
      class="user-container"
      :key="userItem.id"
      v-loading="loading"
      :gutter="20"
      @click="onMemberClick(userItem)"
    >
      <!--成员主要信息-->
      <div style="display: flex; align-items: center; justify-content: center; flex-direction: column">
        <!--头像-->
        <div class="member-photo">
          <UserPhoto :userId="userItem.id" :img-width="300" :img-height="300"></UserPhoto>
        </div>
        <!--姓名及注册信息等-->
        <div class="user-container-outter" @click="onMemberClick(userItem)">
          <div class="user-container-inner">
            <!--姓名-->
            <div style="font-size: 2em; cursor: pointer">
              {{ userItem.realName }}
            </div>

            <!--公司内角色---->
            <div style="margin: 10px">{{ userItem.companyRole }}</div>

            <!--注册信息-->
            <div style="margin: 10px">{{ userItem.licensedInfo }}</div>
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
.member-container {
  width: 100%;

  margin: 50px 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px;
}

.member-photo {
  width: 400px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  &:hover {
    transform: scale(1.02);
  }
}
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

.user-container-outter {
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-container-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

.user-container {
  margin: 10px;
  padding: 10px;

  border-radius: 5px;

  display: flex;
  cursor: pointer;
}
</style>
