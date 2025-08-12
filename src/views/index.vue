<script lang="ts" setup>
import { computed, onMounted, reactive, ref, Ref, h } from 'vue';

import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import {
  clearCookies,
  setUserCookies,
  getToken,
  getUserID,
  getUserName,
  getUserRealName,
  isAdmin,
} from '@/cookies/user';
import { serverGetAllCarouselPhotoFilesById, serverGetAllCarouselImageView } from '@/server/Carousel';

import {
  IServerNewsWithPhotoView,
  IServerUserWithPhotoView,
  IServerSysUser,
  IServerNews,
  IServerCarouselImageView,
} from '@/server/ServerType';
import { serverGetNewsPhotoView } from '@/server/News';
import { serverGetAllUserWithPhotoView } from '@/server/SysUser';
import UserPhoto from '@/components/member/UserPhoto.vue';
import NewsPhoto from '@/components/news/NewsPhoto.vue';
import { formatDate0, formatDate01 } from '@/utils/utils';
import Carousel from '@/components/carousel/Carousel.vue';
import MemberSwiper from '@/components/member/MemberSwiper.vue';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const newsList: Ref<IServerNewsWithPhotoView[]> = ref([]);
const userView: Ref<IServerUserWithPhotoView[]> = ref([]);

import logoImg from '@/assets/logo.png';
import captialMarkets from '@/assets/captialMarkets.png';
import Corporate from '@/assets/Corporate.png';
import employment from '@/assets/employment.png';
import healthcare from '@/assets/healthcare.png';
import intellectual from '@/assets/intellectual.png';
import immigration from '@/assets/immigration.png';
import wills from '@/assets/wills.png';
import civil from '@/assets/civil.png';

const carouselImageViewArray = ref<IServerCarouselImageView[]>([]);

onMounted(async () => {
  getCarouselAllDataFromServer();
  getUserAllDataFromServer();
  getTopNewsDataFromServer();
});

const getCarouselAllDataFromServer = async () => {
  carouselImageViewArray.value.length = 0;
  const ret = await serverGetAllCarouselImageView();
  if (ret && ret.code == 200 && ret.data && ret.data.length > 0) {
    for (let i = 0; i < ret.data.length; i++) {
      carouselImageViewArray.value.push(ret.data[i]);
    }
  }

  console.log('getCarouselAllDataFromServer', carouselImageViewArray.value);
};

/**
 * 获取最新的新闻数据
 */
const getTopNewsDataFromServer = async () => {
  newsList.value.length = 0;
  const ret = await serverGetNewsPhotoView();
  if (ret && ret.code == 200 && ret.data && ret.data.length > 0) {
    newsList.value.length = 0;
    for (let i = 0; i < ret.data.length; i++) {
      newsList.value.push(ret.data[i]);
    }
  }
  console.log('getTopNewsDataFromServer', newsList.value);
};

/**
 * 获取所有的用户数据
 */
const getUserAllDataFromServer = async () => {
  userView.value.length = 0;
  const ret = await serverGetAllUserWithPhotoView();
  if (ret && ret.code == 200 && ret.data && ret.data.length > 0) {
    userView.value.length = 0;
    for (let i = 0; i < ret.data.length; i++) {
      userView.value.push(ret.data[i]);
    }
    console.log('getUserAllDataFromServer', userView.value);
  }
};

const firstNews = computed(() => {
  if (newsList.value.length > 0) return newsList.value[0];
  return null;
});

//除去第0个，剩余的其它新闻
const newsTails = computed(() => {
  if (newsList.value.length <= 1) return [];
  else {
    return newsList.value.slice(1);
  }
});

const onNewsClick = (newsView: IServerNewsWithPhotoView | null) => {
  if (!newsView) {
    router.push({ path: '/news' });
    return;
  }

  router.push({ path: `/news-detail/${newsView.news.id}` });
};
</script>
<template>
  <!--轮播图
  <el-carousel
    :interval="2000"
    arrow="always"
    motion-blur
    height="600px"
    autoplay
  >
    <el-carousel-item v-for="item in imgs" :key="item">
      <img :src="item" style="" />
    </el-carousel-item>
  </el-carousel>
-->
  <Carousel :items="carouselImageViewArray" :autoPlay="true" :interval="3000" />

  <!--成员轮播图-->
  <section class="section-card">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px">
      <div class="card-header-title">
        <div class="card-header-title-text">
          {{ t('app.team_member') }}
        </div>
      </div>
      <div class="card-header-read-more">
        <div class="card-header-read-more-button" @click="router.push({ path: '/team' })">View All</div>
      </div>
    </div>

    <MemberSwiper :users="userView"></MemberSwiper>
    <!-- <el-carousel :interval="2000" arrow="always" height="400px" autoplay style="background-color: white; color: black"> -->
    <!-- <el-carousel-item v-for="userItem in userView" :key="userItem.sysUser.id"> -->
    <!-- <div style="display: flex; justify-content: center; align-items: center; margin: 20px"> -->
    <!--成员主要信息-->
    <!-- <div style="display: flex" v-if="userItem.sysUser.id > 0"> -->
    <!--头像-->
    <!-- <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center"> -->
    <!-- <img
                :src="userItem.photoBase64"
                class="memger-photo"
                @click="router.push({ path: `/team-member/${userItem.sysUser.id}` })"
              /> -->
    <!-- <div class="highlight-overlay"></div> -->
    <!-- </div> -->
    <!--姓名及注册信息等-->
    <!-- <div class="user-container"> -->
    <!-- <div class="user-container-inner"> -->
    <!--姓名-->
    <!-- <div
                  style="font-size: 3em; cursor: pointer"
                  @click="router.push({ path: `/team-member/${userItem.sysUser.id}` })"
                >
                  {{ userItem.sysUser.realName }}
                </div> -->

    <!--公司内角色---->
    <!-- <div style="margin: 10px">
                  {{ userItem.sysUser.companyRole }}
                </div> -->

    <!--注册信息-->
    <!-- <div style="margin: 10px">
                  {{ userItem.sysUser.licensedInfo }}
                </div> -->
    <!-- </div> -->
    <!-- </div> -->
    <!-- </div> -->
    <!-- </div> -->
    <!-- </el-carousel-item> -->
    <!-- </el-carousel> -->
  </section>

  <!--Service Area-->

  <section class="section-card">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px">
      <div class="card-header-title">
        <div class="card-header-title-text">
          {{ t('app.service') }}
        </div>
      </div>
    </div>
    <div class="card-content">
      <div class="service-card" @click="router.push({ path: '/service/capital-markets' })">
        <img :src="captialMarkets" style="width: 120px; height: 120px" />
        <div class="service-card-title">Capital Markets</div>
      </div>
      <div class="service-card" @click="router.push({ path: '/service/corporate-m-a-and-private-equity' })">
        <img :src="Corporate" style="width: 120px; height: 120px" />
        <div class="service-card-title">Corporate, M&A,and Private Equity</div>
      </div>
      <div class="service-card" @click="router.push({ path: '/service/employment-labor-law' })">
        <img :src="employment" style="width: 120px; height: 120px" />
        <div class="service-card-title">Employment & Labor Law</div>
      </div>
      <div class="service-card" @click="router.push({ path: '/service/healthcare-life-sciences-compliance' })">
        <img :src="healthcare" style="width: 120px; height: 120px" />
        <div class="service-card-title">Healthcare & Life Sciences Compliance</div>
      </div>
      <div class="service-card" @click="router.push({ path: '/service/intellectual-property' })">
        <img :src="intellectual" style="width: 120px; height: 120px" />
        <div class="service-card-title">Intellectual Property</div>
      </div>
      <div class="service-card" @click="router.push({ path: '/service/immigration-law' })">
        <img :src="immigration" style="width: 120px; height: 120px" />
        <div class="service-card-title">Immigration Law</div>
      </div>
      <div class="service-card" @click="router.push({ path: '/service/wills-trusts-estates-planning' })">
        <img :src="wills" style="width: 120px; height: 120px" />
        <div class="service-card-title">Wills, Trusts & Estates Planning</div>
      </div>
      <div class="service-card" @click="router.push({ path: '/service/civil-commercial-litigation' })">
        <img :src="civil" style="width: 120px; height: 120px" />
        <div class="service-card-title">Civil & Commercial Litigation</div>
      </div>
    </div>
  </section>

  <!--新闻-->
  <section class="section-card">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px">
      <div class="card-header-title">
        <div class="card-header-title-text">
          {{ t('app.news') }}
        </div>
        <div class="card-header-title-text-description">
          The latest news on our deals, insights, events, and achievements
        </div>
      </div>
      <div class="card-header-read-more">
        <div class="card-header-read-more-button" @click="router.push({ path: '/news' })">View All</div>
      </div>
    </div>
    <div class="card-content">
      <!--新闻-->
      <div v-for="newsItem in newsList" class="card-content-item">
        <!--图像-->
        <div class="card-content-item-image-container" @click="onNewsClick(newsItem)">
          <img :src="newsItem.photoBase64" alt="news photo" />
          <div class="highlight-overlay"></div>
        </div>
        <!--新闻-->
        <div
          style="
            box-sizing: border-box;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 180px;
            padding: 0 15px;
            text-align: left;
          "
        >
          <!--新闻标题-->
          <div
            style="color: #06456b; font-size: 1.5em; font-weight: 600; cursor: pointer"
            @click="onNewsClick(newsItem)"
          >
            {{ newsItem.news.title }}
          </div>

          <!--新闻日期---->
          <div>
            {{ formatDate01(newsItem.news.createDateTime) }}
          </div>

          <!--新闻内容-->
          <div style="overflow: hidden; height: 44px; font-size: 0.8em; line-height: 1.5em">
            {{ newsItem.news.brief }}
          </div>

          <div class="card-button-read-more" @click="onNewsClick(newsItem)">READ MORE>></div>
        </div>
      </div>
    </div>
  </section>

  <!--Conclusion-->
  <section class="section-card">
    <div style="display: flex">
      <div style="font-size: x-large; text-align: left">
        We recognize that the needs ofeach client are distinct. Our commitment lies in providing efficient
        andprofessional legal services designed to facilitate your personal and businesssuccess. Please do not hesitate
        to reach out at any time to discover how we can support you.
      </div>
      <div style="flex: 1">
        <img :src="logoImg" style="width: 200px" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.section-card {
  background-color: white;
  padding: 40px 20px;
  width: 100%;
  max-width: 1300px;
  margin: 60px auto;
}

.section-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 40px;
  background-color: black;
}

.card-header-title {
  display: flex;
  justify-content: left;
  flex-direction: column;
  background-color: white;
}
.card-header-title-text {
  font-family: 'Manrope', sans-serif;
  font-size: 60px;
  text-align: left;
  line-height: 82px;
  font-weight: 600;
  background-color: white;
  color: #c00a30;
}

.card-header-title-text-description {
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
  text-align: left;
  line-height: 42px;
  background-color: white;
}
.card-header-read-more {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-header-read-more-button {
  width: 120px;
  height: 32px;
  padding: 10px 0px;
  background-color: #c00a30;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  line-height: 32px;
  font-family: 'Manrope', sans-serif;
  transition: all 0.3s ease-in-out;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  &:hover {
    background-color: #06456b;
    transform: scale(1.02);
  }
}
.card-content-item-image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  height: 260px;
  margin-bottom: 12px;
}

.card-content-item-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

/* .card-content-item-image-container:hover {
  transform: scale(1.02);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.card-content-item-image-container:hover .highlight-overlay {
  opacity: 1;
} */

.highlight-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%; /* 覆盖图像下半部分 */
  background: linear-gradient(to top, rgba(255, 255, 255, 0.7), transparent);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}
.card-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 20px 0px;
  gap: 40px;
}

.card-content-item {
  box-sizing: border-box;
  height: 440px;
  width: 400px;
  border: 1px solid #e4e4e4;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}

.card-button-read-more {
  color: #06456b;
  font-size: 0.8em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    color: #c00a30;
    transform: scale(1.02);
  }
}

.memger-photo {
  width: 400px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
}
.service-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 20px;
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
  & > img {
    width: 100px;
    height: 100px;
  }
}

.service-card-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  color: #333;
  cursor: pointer;
  &:hover {
    color: #c00a30;
    transform: scale(1.02);
  }
}

.user-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 40px;
}
.user-container-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

.news-container-outer {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 10px;
  padding: 10px;
  padding-left: 20px;
  border-radius: 5px;
}
.news-container-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-self: start;
  text-align: left;
}

.news-container {
  margin: 10px;
  padding: 10px;

  border-radius: 5px;

  display: flex;
}

/* WebKit 内核浏览器 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
/* 通用滚动条样式 */
html {
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #888 #f1f1f1; /* Firefox */
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
