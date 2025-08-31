<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';

import PythonLogo from '@/assets/python-logo-only.png';

import { View, Hide, Refresh } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
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

//服务器返回到前端的类型
import { IServerSysUser } from '@/server/ServerType';

import { serverGetUserBySysUserId, serverUserUpdateOwnInfo, serverUserUpdateOwnPwd } from '@/server/SysUser';

import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const store = userStore();

const show = ref(false);
const Authorization = ref('');
const captchaLabel = ref('验证码');
const captchaLabelCountDown = ref(120);
const showPwd = ref(false); //是否显示密码明文

onMounted(async () => {
  await getSysUserFromServer();
});

const getSysUserFromServer = async () => {
  const id = getUserID();
  if (id) {
    const ret = await serverGetUserBySysUserId(id);
    if (ret && ret.code == 200) {
      userView.value = ret.data;

      ruleForm.userName = ret.data.userName;
    }
  }
};

const userView = ref<IServerSysUser>();

const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive({
  userName: '',
  oldPwd: '',
  newPwd: '',
  confirmNewPwd: '',
});

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input new password'));
  } else {
    if (value.length <= 3 || value.length >= 64) callback(new Error('The length of  password is not correct.'));
    if (ruleForm.confirmNewPwd !== '') {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField('confirmNewPwd', async () => {});
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input confirm password'));
  } else if (value !== ruleForm.newPwd) {
    callback(new Error('The new passwords you entered do not match. Please try again.'));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  newPwd: [{ validator: validatePass, trigger: 'blur' }],
  confirmNewPwd: [{ validator: validatePass2, trigger: 'blur' }],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid && userView.value) {
      const user: IServerSysUser = {
        id: userView.value.id, //id,主键
        userName: '', //user_name,学号或工号等，用户登录ID
        password: ruleForm.oldPwd, //pwd,密码
        companyRole: '', //公司内角色
        licensedInfo: '', //律师执业证信息
        details: '', //详细信息
        photo: '', //照片
        auth: 0, //权限
      };

      try {
        const ret = await serverUserUpdateOwnPwd(user);
        if (ret) {
          console.log(ret);
          if ((ret.code = 200))
            ElMessage({
              type: 'success',
              message: 'Your password has been successfully updated',
            });
        }
      } catch (error) {
        ElMessage({
          type: 'error',
          message: 'Password modification failed',
        });
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<template>
  <div>
    <h1>Reset Password</h1>
    <el-form
      ref="ruleFormRef"
      :rules="rules"
      label-width="200px"
      :model="ruleForm"
      style="width: 600px; margin: auto; margin-bottom: 20px"
    >
      <el-form-item label="Login Id" prop="userName">
        <el-input v-model="ruleForm.userName" disabled />
      </el-form-item>

      <el-form-item label="Old Password" prop="oldPwd">
        <el-input v-model="ruleForm.oldPwd" placeholder="Old Password" type="password" show-password />
      </el-form-item>

      <el-form-item label="New Password" prop="newPwd">
        <el-input v-model="ruleForm.newPwd" placeholder="New Password" type="password" show-password />
      </el-form-item>

      <el-form-item label="Confirm Password" prop="confirmNewPwd">
        <el-input
          v-model="ruleForm.confirmNewPwd"
          show-password
          type="password"
          placeholder="Please confirm the new password"
        />
      </el-form-item>

      <el-button type="primary" @click="submitForm(ruleFormRef)">
        {{ t('app.submit') }}
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">{{ t('app.reset') }}</el-button>
    </el-form>
  </div>
</template>

<style scoped></style>
