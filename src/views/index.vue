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
import { serverGetAllCarousel, serverGetAllCarouselImageView } from '@/server/Carousel';

import {
  IServerNewsWithPhotoView,
  IServerUserWithPhotoView,
  IServerSysUser,
  IServerNews,
  IServerCarouselImageView,
  IServerCarousel,
} from '@/server/ServerType';
import { serverGetTopNews, getNewsPhotoUrlByNews } from '@/server/News';
import { serverGetAllUserWithPhotoViewInBase64, serverGetAllUserWithoutAdmin } from '@/server/SysUser';
import UserPhoto from '@/components/member/UserPhoto.vue';
import NewsPhoto from '@/components/news/NewsPhoto.vue';
import { formatDate0, formatDate01 } from '@/utils/utils';
import Carousel from '@/components/carousel/Carousel.vue';
import MemberSwiper from '@/components/member/MemberSwiper.vue';
import CookieBanner from '@/components/CookieBanner.vue';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const newsList: Ref<IServerNews[]> = ref([]);
const userList: Ref<IServerSysUser[]> = ref([]);

import logoImg from '@/assets/logo.png';
import captialMarkets from '@/assets/captialMarkets.png';
import Corporate from '@/assets/Corporate.png';
import employment from '@/assets/employment.png';
import healthcare from '@/assets/healthcare.png';
import intellectual from '@/assets/intellectual.png';
import immigration from '@/assets/immigration.png';
import wills from '@/assets/wills.png';
import civil from '@/assets/civil.png';

const carouselArray = ref<IServerCarousel[]>([]);
const windowWidth = ref(window.innerWidth);

onMounted(async () => {
  getCarouselAllDataFromServer();
  getUserAllDataFromServer();
  getTopNewsDataFromServer();
});

const visibleCards = computed(() => {
  if (windowWidth.value >= 1080) return 4; // 大屏显示 4 张
  if (windowWidth.value >= 800) return 3; // 中屏显示 3 张
  return 1; // 超小屏显示 1 张
});

const getCarouselAllDataFromServer = async () => {
  carouselArray.value.length = 0;
  const ret = await serverGetAllCarousel();
  if (ret && ret.code == 200 && ret.data && ret.data.length > 0) {
    for (let i = 0; i < ret.data.length; i++) {
      const info = {
        ...ret.data[i],
        subTitle: ret.data[i].subTitle.replace('；', '<br>'),
      };

      carouselArray.value.push(info);
    }
  }

  // console.log('getCarouselAllDataFromServer', carouselArray.value);
};

/**
 * 获取最新的新闻数据
 */
const getTopNewsDataFromServer = async () => {
  newsList.value.length = 0;
  const ret = await serverGetTopNews();
  if (ret && ret.code == 200 && ret.data && ret.data.length > 0) {
    newsList.value = ret.data;
  }
  // console.log('getTopNewsDataFromServer', newsList.value);
};

/**
 * 获取所有的用户数据
 */
const getUserAllDataFromServer = async () => {
  userList.value.length = 0;
  const ret = await serverGetAllUserWithoutAdmin();
  if (ret && ret.code == 200 && ret.data && ret.data.length > 0) {
    userList.value = ret.data;

    //  console.log('getUserAllDataFromServer', userList.value);
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

const onNewsClick = (news: IServerNews | null) => {
  if (!news) {
    router.push({ path: '/news' });
    return;
  }

  router.push({ path: `/news-detail/${news.id}` });
};

const services = ref([
  {
    field: 'Practice',
    title: 'Capital Markets',
    path: '/service/capital-markets',
    image: captialMarkets,
  },
  {
    field: 'Practice',
    title: 'Corporate, M&A, and Private Equity',
    path: '/service/corporate-m-a-and-private-equity',
    image: Corporate,
  },
  {
    field: 'Practice',
    title: 'Employment & Labor Law',
    path: '/service/employment-labor-law',
    image: employment,
  },
  {
    field: 'Practice',
    title: 'Healthcare & Life Sciences Compliance',
    path: '/service/healthcare-life-sciences-compliance',
    image: healthcare,
  },
  {
    field: 'Practice',
    title: 'Intellectual Property',
    path: '/service/intellectual-property',
    image: intellectual,
  },
  {
    field: 'Practice',
    title: 'Immigration Law',
    path: '/service/immigration-law',
    image: immigration,
  },
  {
    field: 'Practice',
    title: 'Wills, Trusts & Estates Planning',
    path: '/service/wills-trusts-estates-planning',
    image: wills,
  },
  {
    field: 'Practice',
    title: 'Civil & Commercial Litigation',
    path: '/service/civil-commercial-litigation',
    image: civil,
  },
]);
</script>
<template>
  <CookieBanner />
  <Carousel :items="carouselArray" :autoPlay="true" :interval="3000" />

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

    <MemberSwiper :users="userList" :visibleCards="visibleCards"></MemberSwiper>
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
    <div class="flex-cards">
      <div
        v-for="service in services"
        :key="service.path"
        class="flex-card-item service-item"
        @click="router.push({ path: service.path })"
      >
        <div class="service-header">
          {{ service.title }}
        </div>
        <div class="service-body">
          <img :src="service.image" alt="" class="service-icon" />
        </div>
      </div>
    </div>
  </section>

  <!-- 新闻 -->
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
    <!-- 新闻 cards -->
    <div class="flex-cards">
      <div
        v-for="newsItem in newsList"
        :key="newsItem.id"
        class="flex-card-item news-item"
        @click="onNewsClick(newsItem)"
      >
        <div class="news-img">
          <img :src="getNewsPhotoUrlByNews(newsItem)" alt="news photo" />
          <div class="highlight-overlay"></div>
        </div>
        <div class="news-content">
          <h3 class="title">{{ newsItem.title || 'no title' }}</h3>
          <span>{{ formatDate01(newsItem.createDateTime) || 'no date' }}</span>
          <p class="brief">{{ newsItem.brief || 'no brief' }}</p>
          <span class="news-read-more">READ MORE>></span>
        </div>
      </div>
    </div>
  </section>

  <!--Conclusion-->
  <section class="section-card">
    <div style="display: flex">
      <div style="font-size: x-large; text-align: left">
        At SUNSEA LAW, we are dedicated to providing high-quality, client-focused legal services across diverse practice
        areas. Our experienced attorneys deliver strategic, practical solutions for businesses, investors, and
        individuals navigating complex legal and regulatory landscapes. We value long-term partnerships built on trust,
        collaboration, and shared success.
      </div>
      <!-- <div style="flex: 1">
        <img :src="logoImg" style="width: 200px" />
      </div> -->
    </div>
  </section>
</template>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.section-card {
  box-sizing: border-box;
  background-color: white;
  width: 100%;
  max-width: 1300px;
  padding: 0 20px;
  margin: 60px auto;

  .card-header-title {
    display: flex;
    justify-content: left;
    flex-direction: column;
    background-color: white;
  }

  .card-header-title-text {
    font-family: 'Manrope', sans-serif;
    font-size: 48px;
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
}

.flex-cards {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
}

.flex-card-item {
  // border: 1px solid #e4e4e4;
}

.service-item {
  box-sizing: border-box;
  height: 240px;
  width: 240px;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-family: 'Georgia', sans-serif;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }

  .service-header {
    box-sizing: border-box;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #06456b;
    color: white;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
    font-family: 'Georgia', serif;
  }

  .service-body {
    box-sizing: border-box;
    flex: 1 1 0;
    display: flex;
    align-items: center;
    justify-content: center;

    > img {
      width: 150px;
      height: 150px;
      object-fit: contain;
    }
  }
}

.news-item {
  overflow: hidden;
  width: 360px;
  padding-bottom: 12px;
  cursor: pointer;
  border: 1px solid #e4e4e4;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

  .news-img {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 100%;
    height: 260px;

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

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
  }

  .news-content {
    overflow: hidden;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 15px;
    text-align: left;

    .title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; /* 限制显示 2 行 */
      overflow: hidden;
      height: 70px;
      color: #06456b;
      font-size: 1.5em;
      font-weight: 600;
      text-overflow: ellipsis;
      margin: 10px 0;
    }

    .brief {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; /* 限制显示 2 行 */
      overflow: hidden;
      height: 44px;
      margin: 8px 0px;
      color: #333;
      line-height: 1.5em;
      text-overflow: ellipsis;
      height: 44px;
      font-size: 14px;
    }
  }
  .news-read-more {
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
}

@media screen and (max-width: 760px) {
  .flex-cards {
    gap: 20px;
  }
  .service-item {
    width: calc(50% - 10px);
  }
  .news-item {
    width: 100%;
  }
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
