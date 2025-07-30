<script setup lang="ts">
import { computed, onMounted, reactive, ref, Ref, watch } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";

import type { FormInstance, FormRules } from "element-plus";
import {
  IServerSysUser,
  Pageable,
  Page,
  SimplePage,
  convertPage,
} from "@/server/ServerType";

import {
  serverUserAdd,
  serverUserDelete,
  serverUserUpdate,
  serverUserResetPwd,
  serverGetUserBySysUserId,
} from "@/server/SysUser";

import UserPhoto from "@/components/member/UserPhoto.vue";

import { useI18n } from "vue-i18n";
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const userId = ref<number>(0);

const userData = ref<IServerSysUser>({
  id: 0,
  userName: "",
  realName: "",
  password: "",
  companyRole: "",
  licensedInfo: "",
  details: "",
  email: "",
  photo: "",
  auth: 0,
});

onBeforeRouteUpdate(async (to) => {
  console.log(to);
  if (typeof to.params.id === "string") {
    userId.value = parseInt(to.params.id);
    await getUserDataFromSever(parseInt(to.params.id));
  } else {
    getUserDataFromSever(parseInt(to.params.id[0]));
    userId.value = parseInt(to.params.id[0]);
  }

  console.log(userId.value);
});

onMounted(async () => {
  console.log(route.params);
  console.log(typeof route.params.id);
  if (typeof route.params.id === "string") {
    await getUserDataFromSever(parseInt(route.params.id));
    userId.value = parseInt(route.params.id);
  }
  console.log(userId.value);
});

const getUserDataFromSever = async (id: number) => {
  console.log(id);
  if (!id) return;

  const ret = await serverGetUserBySysUserId(id);

  if (ret && ret.code == 200) {
    userData.value = ret.data;
  }

  console.log(userData.value);
};
</script>

<template>
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
      font-size: 3em;
    "
  >
    Team Member
  </div>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px;
    "
  >
    <!--成员主要信息-->
    <div style="display: flex" v-if="userData.id > 0">
      <!--头像-->
      <div
        style="
          width: 400px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
        "
      >
        <UserPhoto :userId="userData.id" :img-width="300"></UserPhoto>
      </div>
      <!--姓名及注册信息等-->
      <div class="user-container" style="margin-left: 40px; flex: 2">
        <div class="user-container-inner">
          <!--姓名-->
          <div style="font-size: 3em; cursor: pointer">
            {{ userData.realName }}
          </div>

          <!--公司内角色---->
          <div style="margin: 10px">{{ userData.companyRole }}</div>

          <!--注册信息-->
          <div style="margin: 10px">{{ userData.licensedInfo }}</div>
        </div>
      </div>
    </div>
  </div>
  <div
    style="
      display: flex;
      margin: 10px;
      padding: 20px;

      width: 1300px;
      margin: auto;
      text-align: left;
    "
  >
    <!--详细信息-->
    <span
      style="
        width: 100%; /* 或具体宽度 */
        overflow-wrap: break-word; /* 兼容性好 */
        word-break: break-word; /* 更现代的方案 */
        hyphens: auto; /* 自动添加连字符 */
        line-height: 1.6; /* 良好的行高提升可读性 */
        white-space: pre-wrap;
      "
      >{{ userData.details }}</span
    >
  </div>
</template>

<style scoped>
.user-container {
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
</style>
