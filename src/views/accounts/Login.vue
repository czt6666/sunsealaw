<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';

import { useRouter, useRoute } from 'vue-router';

import { View, Hide, Refresh, Help } from '@element-plus/icons-vue';

import { serverLogin, serverGetPublicKey, serverSignUp, serverGetCaptchaJpg } from '@/server/SysUser';

import { IServerSysUserLoginResult } from '@/server/ServerType';

import { JSEncrypt } from 'jsencrypt';

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

import { userStore } from '@/store/user';

import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t } = useI18n();
const store = userStore();

const show = ref(false);
const Authorization = ref('');
const captchaLabel = ref('验证码');
const captchaLabelCountDown = ref(120);
const showPwd = ref(false); //是否显示密码明文
const formLogin = reactive({
  userName: '',
  password: '',
  captchaCode: '',
  captchaKey: '',
  code: '',
});

const router = useRouter();

onMounted(async () => {
  await onRefreshCode();
});

/**
 * 单击登录按钮
 */
const onLoginClick = async () => {
  let publicKeyResponse = await serverGetPublicKey();

  if (publicKeyResponse) {
    if (publicKeyResponse.code === 200) {
      //获得了公钥，使用公钥加密，服务器端使用私钥解密
      let encrypt = new JSEncrypt();
      let publicKey = publicKeyResponse.data;
      encrypt.setPublicKey(publicKey);
      let encodePassword = encrypt.encrypt(formLogin.password);
      if (typeof encodePassword == 'string') {
        let ret = await serverLogin(formLogin.userName, encodePassword, formLogin.code, formLogin.captchaKey);
        if (ret && ret.code == 200) {
          let data: IServerSysUserLoginResult = ret.data;
          console.log(data);
          setUserCookies(data);
          console.log(data);

          router.push({ path: `/` });
        } else {
          console.log(ret);
        }
      }
    }
  }
};

/**
 * 注册用户
 */
const onSignUPClick = async () => {
  let publicKeyResponse = await serverGetPublicKey();
  console.log(publicKeyResponse);
  if (publicKeyResponse) {
    if (publicKeyResponse.code === 200) {
      //获得了公钥，使用公钥加密，服务器端使用私钥解密
      let encrypt = new JSEncrypt();
      let publicKey = publicKeyResponse.data;
      encrypt.setPublicKey(publicKey);
      let encodePassword = encrypt.encrypt(formLogin.password);
      if (typeof encodePassword == 'string') {
        let ret = await serverSignUp(formLogin.userName, encodePassword, formLogin.code, formLogin.captchaKey);
        console.log(ret);
      }
    }
  }
};

const countDownTimerId = ref(0);

const countDownTimer = () => {
  window.clearInterval(countDownTimerId.value);

  captchaLabelCountDown.value = 120;

  countDownTimerId.value = window.setInterval(countDownTimerHelper, 1000);
};

const countDownTimerHelper = async () => {
  if (captchaLabelCountDown.value <= 0) {
    window.clearInterval(countDownTimerId.value);
    captchaLabel.value = 'Verification Code ';
    return;
  }

  captchaLabel.value = 'Verification Code (remaining time' + captchaLabelCountDown.value + 'seconds)';

  captchaLabelCountDown.value -= 1;
};

/**
 * 刷新按钮，从服务器端得到新的验证码
 */
const onRefreshCode = async () => {
  let ret = await serverGetCaptchaJpg();
  console.log(ret);
  if (ret) {
    if (ret.code === 200) {
      formLogin.captchaCode = ret.data.code; //验证图像
      formLogin.captchaKey = ret.data.key; //验证图像对应的key
      formLogin.code = '';
    }

    countDownTimer();
  }
};
function onClickBack() {
  show.value = false;
}
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>
    <el-form
      label-position="top"
      label-width="100px"
      :model="formLogin"
      style="max-width: 600px; margin-bottom: 2em; text-align: left"
    >
      <el-form-item label="User ID">
        <el-input v-model="formLogin.userName" placeholder="Please input user ID" @keydown.enter="onLoginClick" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input
          v-model="formLogin.password"
          :type="showPwd ? 'text' : 'password'"
          placeholder="Please input password"
          @keydown.enter="onLoginClick"
        >
          <template #append>
            <el-button :icon="showPwd ? Hide : View" @click="showPwd = !showPwd" />
          </template>
        </el-input>
      </el-form-item>

      <el-form-item :label="captchaLabel">
        <el-col :span="16">
          <el-input v-model="formLogin.code" placeholder="Please input captcha" @keydown.enter="onLoginClick">
            <template #append>
              <el-button :icon="Refresh" @click="onRefreshCode" />
            </template>
          </el-input>
        </el-col>

        <el-col :span="8">
          <img class="login-code" alt="Captcha" id="codeImg" :src="formLogin.captchaCode" @click="onRefreshCode" />
        </el-col>
      </el-form-item>

      <el-button type="primary" @click="onLoginClick" v-if="show === false">Login</el-button>
      <el-button type="primary" @click="onSignUPClick" v-if="show === false" :disabled="true">Register</el-button>
      <el-button type="primary" @click="onClickBack" v-if="show === true">Back</el-button>
    </el-form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: column;

  margin: 0 auto;
  margin-top: 50px;

  text-align: center;
}

.login-code {
  width: 100px;
  height: 30px;
  vertical-align: top;
  text-align: center;
}
</style>
