<template>
  <section class="section-card">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px">
      <div class="card-header-title">
        <div class="card-header-title-text">
          {{ t('app.service') }}
        </div>
      </div>
    </div>
    <div class="card-content">
      <div
        v-for="service in services"
        :key="service.path"
        class="service-card"
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
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref, Ref, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import captialMarkets from '@/assets/captialMarkets.png';
import Corporate from '@/assets/Corporate.png';
import employment from '@/assets/employment.png';
import healthcare from '@/assets/healthcare.png';
import intellectual from '@/assets/intellectual.png';
import immigration from '@/assets/immigration.png';
import wills from '@/assets/wills.png';
import civil from '@/assets/civil.png';
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
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
<style scoped>
.section-card {
  background-color: white;
  padding: 40px 20px;
  width: 100%;
  max-width: 1300px;
  margin: 60px auto;
}
.card-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 20px 0px;
  gap: 40px;
}
.service-card {
  box-sizing: border-box;
  height: 240px;
  width: 240px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-family: 'Georgia', sans-serif;
}
.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
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
</style>
