<script setup lang="ts">
import { computed, onMounted, reactive, ref, Ref, watch } from 'vue';
import { useRouter } from 'vue-router/dist/vue-router';

import type { FormInstance, FormRules } from 'element-plus';
import { IServerContactUs } from '@/server/ServerType';

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

import {
  serverContactUsAdd,
  serverContactUsDelete,
  serverContactUsUpdate,
  serverGetContactUsPage,
} from '@/server/ContactUs';

import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
const { t } = useI18n(); // 解构出t方法
const router = useRouter();

const form = reactive<IServerContactUs>({
  id: 0,
  name: '',
  address: '',
  phone: '',
  email: '',
  message: '',
});

// 表单引用
const formRef = ref<FormInstance>();

// 表单验证规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: 'User Name', trigger: 'blur' }],
  address: [{ required: true, message: 'Real Name', trigger: 'blur' }],
  phone: [{ required: true, message: 'Password', trigger: 'blur' }],
  email: [{ required: true, message: 'Company Role', trigger: 'blur' }],
  message: [{ required: true, message: 'Licensed Info', trigger: 'blur' }],
});

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
};

const onOk = () => {
  formRef.value?.validate(async (valid) => {
    console.log(form);
    if (valid) {
      try {
        const contactUs: IServerContactUs = {
          id: 0,
          name: form.name,
          address: form.address,
          phone: form.phone,
          email: form.email,
          message: form.message,
        };

        const res = await serverContactUsAdd(contactUs);
        if (res && res.code == 200) {
          ElMessage({
            type: 'success',
            message: 'Success',
          });
          router.push('/');
        } else {
          ElMessage.error(`Failed`);
        }
      } catch (error) {
        ElMessage.error('Failed');
        console.error('Failed', error);
      }
    } else {
      ElMessage.error('Please check data');
    }
  });
};

const onCancel = () => {};
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
    "
  >
    <div class="news-container-outer">
      <div class="news-container-inner">
        <div style="font-size: 3em; cursor: pointer">
          {{ t('app.contact_us') }}
        </div>
      </div>
    </div>
  </div>

  <el-form
    ref="formRef"
    :rules="rules"
    :model="form"
    label-width="auto"
    style="max-width: 600px; margin: auto; margin-top: 60px"
    class="ss-section"
  >
    <el-form-item label="Name" prop="name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="Address" prop="address">
      <el-input v-model="form.address" />
    </el-form-item>
    <el-form-item label="Phone" prop="phone">
      <el-input v-model="form.phone" />
    </el-form-item>
    <el-form-item label="Email" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item label="Message" prop="message">
      <el-input v-model="form.message" type="textarea" :rows="4" />
    </el-form-item>
    <el-form-item style="float: right">
      <el-button type="primary" @click="onOk">{{ t('app.submit') }}</el-button>
      <el-button @click="onCancel">{{ t('app.cancel') }}</el-button>
      <el-button @click="resetForm">{{ t('app.reset') }}</el-button>
    </el-form-item>
  </el-form>

  <div
    style="
      margin-top: 100px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      margin-right: auto;
      justify-items: flex-end;
      padding-right: 10%;
      background-color: #ebedf0;
    "
  >
    <div class="visit-us-container">
      <div class="visit-us-container-inner">
        <div class="visit-us-title">SUNSEA LAW GROUP P.C.</div>
        <div style="text-align: left">Address: 18300 Von Karman Ave, Suite 970, Irvine, CA 92612</div>
        <div>Email: info@sunsealaw.com</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
.visit-us-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.visit-us-container-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

.visit-us-container-inner a {
  color: white;
  text-decoration: none;
  transition: color 0.3s; /* 平滑过渡效果 */
}

.visit-us-container-inner:has(a:hover) a:not(:hover) {
  color: #888;
}

.visit-us-container-inner div {
  margin: 5px 0px;
}

.visit-us-title {
  font-size: 20px; /* 调整字体大小 */
  font-weight: bold; /* 加粗字体 */
  color: #333; /* 调整字体颜色 */
  margin-bottom: 10px; /* 调整底部间距 */
}
</style>
