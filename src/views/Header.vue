<script lang="ts" setup>
import { computed, onMounted, reactive, ref, Ref } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import LangDropdown from '@/components/dropdown/LangDropdown.vue';
import { LangeuageOption, defaultLanguageOption } from '@/i18n/langtypes';

import { useI18n } from 'vue-i18n';
import { getLocale } from '@/i18n';

import { LANGUAGES_OPTIONS } from '@/i18n/langtypes';

import { getToken, getUserName, getUserRealName, isAdmin, clearCookies } from '@/cookies/user';

import { serverGetAllCarouselPhotoFilesById } from '@/server/Carousel';

const { t } = useI18n(); // 解构出t方法

const drawer = ref(false);

const router = useRouter();
const route = useRoute();
const { currentRoute } = useRouter();

const textLangButtonRef = ref<HTMLDivElement | null>(null);

const showLangDropDown = ref(false);
const currentLang = ref<LangeuageOption>(defaultLanguageOption);
const { locale: i18nLanguage } = useI18n();

onMounted(async () => {
  getStoreLanguage();
  await getCarouselAllDataFromServer();
});

const getStoreLanguage = () => {
  let langStore = getLocale();

  console.log('getStoreLanguage', langStore);

  if (!langStore) langStore = 'en';

  LANGUAGES_OPTIONS.forEach((item) => {
    if (item.value == langStore) {
      currentLang.value = item;
    }
  });
};

const imgs = reactive<string[]>([]);
const getCarouselAllDataFromServer = async () => {
  imgs.length = 0;
  const ret = await serverGetAllCarouselPhotoFilesById();
  if (ret && ret.code == 200 && ret.data && ret.data.length > 0) {
    for (let i = 0; i < ret.data.length; i++) {
      imgs.push(ret.data[i]);
    }
  }
};

const handleClose = (done: () => void) => {
  done();
};

import loginImg from '@/assets/logo.png';

const logout = () => {
  clearCookies();
  router.push('/login');
};
</script>
<template>
  <el-drawer
    v-model="drawer"
    title="Sunsea Law"
    direction="ltr"
    :before-close="handleClose"
    size="100%"
    :with-header="false"
    :show-close="false"
    :append-to-body="true"
    :wrapper-closable="false"
    class="drawer-body"
    style="user-select: none"
  >
    <div style="background-color: #0d132d; height: 100%; width: 100%; margin: 0px; padding: 0px">
      <div style="display: flex; align-items: center; justify-content: flex-start">
        <i class="fa-solid fa-xmark" style="font-size: 24px; color: #fff; margin: 40px" @click="drawer = false"></i>
        <div style="color: #fff; font-size: larger">Close</div>
      </div>
      <div
        style="
          top: 50%;
          position: absolute;
          color: rgb(255, 255, 255);
          font-size: 24px;
          line-height: 48px;
          cursor: pointer;
          margin-top: 40px;
          text-align: left;
          left: 20%;
          transform: translate(0, -60%);
        "
      >
        <!--About-->
        <div
          @click="
            drawer = false;
            router.push('/about');
          "
        >
          {{ t('app.about') }}
        </div>

        <!--Team Members-->
        <div
          @click="
            drawer = false;
            router.push('/team');
          "
        >
          {{ t('app.team_member') }}
        </div>

        <!--Practice Services-->
        <div
          @click="
            drawer = false;
            router.push('/service/capital-markets');
          "
        >
          {{ t('app.service') }}
        </div>

        <!--News-->
        <div
          @click="
            drawer = false;
            router.push('/news');
          "
        >
          {{ t('app.news') }}
        </div>

        <!--Contact Us-->
        <div
          @click="
            drawer = false;
            router.push('/contact');
          "
        >
          {{ t('app.contact_us') }}
        </div>

        <!--Visit Us-->
        <div
          @click="
            drawer = false;
            router.push('/visitus');
          "
        >
          {{ t('app.visit_us') }}
        </div>
      </div>
      <div style="overflow: hidden; position: absolute; top: 24%; left: 50%; width: 500px; height: 500px">
        <img style="opacity: 0.3; width: 500px" src="@/assets/logo.png" alt="" />
      </div>
    </div>
  </el-drawer>

  <div
    style="
      background-color: #0d132d;
      height: 100px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    "
  >
    <div style="width: 100px">
      <i class="fa-solid fa-bars" style="font-size: 32px; color: #fff" @click="drawer = !drawer"></i>
    </div>

    <div style="flex: 1; font-size: larger">SUNSEA LAW</div>

    <div style="width: 160px">
      <div
        ref="textLangButtonRef"
        class="toolbar-item spaced"
        style="display: flex; align-items: center; cursor: pointer"
        aria-label="Formatting ppt"
        @click="showLangDropDown = !showLangDropDown"
      >
        <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 20px">
          <i class="format linepen" />
          <div :style="`margin-top:2px;; ;width:120px;height:1em;`">
            {{ currentLang?.label }}
          </div>
        </div>
        <i class="chevron-down" />
      </div>
      <Teleport to="body">
        <LangDropdown
          v-if="showLangDropDown"
          v-model:showOptionsDropDown="showLangDropDown"
          :toolbarRef="textLangButtonRef"
          :lang="currentLang"
        />
      </Teleport>
    </div>

    <!--登录-->
    <div class="app-header-menu-item" style="margin-right: 10px" v-if="getUserName()">
      <el-dropdown>
        <el-button>
          {{ getUserName() }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="router.push('/reset-password')">{{ t('app.reset_password') }}</el-dropdown-item>

            <el-dropdown-item @click="router.push('/user-info')">{{ t('app.user_info') }}</el-dropdown-item>

            <el-dropdown-item v-if="isAdmin()" divided @click="router.push('/manager-news')">{{
              t('app.manager_news')
            }}</el-dropdown-item>

            <el-dropdown-item v-if="isAdmin()" @click="router.push('/manager-contact-us')">{{
              t('app.manager_contact_us')
            }}</el-dropdown-item>

            <el-dropdown-item v-if="isAdmin()" @click="router.push('/manager-team-member')">{{
              t('app.manager_team_member')
            }}</el-dropdown-item>

            <el-dropdown-item v-if="isAdmin()" @click="router.push('/manager-carousel')">{{
              t('app.manager_carousel')
            }}</el-dropdown-item>

            <el-dropdown-item divided @click="logout()">{{ t('app.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div>
      <img
        :src="loginImg"
        style="width: 64px; height: 64px; color: #fff; margin-right: 20px; cursor: pointer"
        @click="router.push('/')"
      />
    </div>
  </div>
</template>
<style>
:root {
  --el-drawer-padding-primary: 0px;
}

.drawer-body {
  padding: 0px;
}

.drawer-body .el-drawer {
  padding: 0px;
}

.drawer-body .el-drawer__body {
  padding: 0px;
}

.drawer-body div {
  color: white;
  text-decoration: none;
  transition: color 0.3s; /* 平滑过渡效果 */
}

.drawer-body:has(div:hover) div:not(:hover) {
  color: #888;
}
</style>
