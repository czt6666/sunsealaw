<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';

import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';

import PythonLogo from '@/assets/python-logo-only.png';

import { View, Hide, Refresh } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
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

import {
  serverGetUserBySysUserId,
  serverUserUpdateOwnInfo,
  serverAddUserPhotoUploadTempFilesByAuthenticatedUser,
  serverDeleteUserPhotoUploadTempFilesByAuthenticatedUser,
} from '@/server/SysUser';

import { useI18n } from 'vue-i18n';

import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile, UploadRequestOptions } from 'element-plus';

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
  fileList.value = [];
  if (id) {
    const ret = await serverGetUserBySysUserId(id);
    if (ret && ret.code == 200) {
      userView.value = ret.data;

      form.userName = ret.data.userName;
      form.companyRole = ret.data.companyRole; //公司内角色
      form.licensedInfo = ret.data.licensedInfo; //律师执业证信息
      form.details = ret.data.details; //详细信息
      form.photo = ret.data.photo; //照片
      form.auth = ret.data.auth; //权限

      // let res = await serverGetUserPhotoFileById(ret.data.id);
      // if (res && res.code == 200 && res.data) {
      //   fileList.value.push({ name: form.photo, url: res.data });
      // }
    }
  }
};

const userView = ref<IServerSysUser>();

const ruleFormRef = ref<FormInstance>();

const form = reactive({
  userName: '',
  password: '', //pwd,密码
  companyRole: '', //公司内角色
  licensedInfo: '', //律师执业证信息
  details: '', //详细信息
  photo: '', //照片
  auth: 0, //权限
});

// 表单验证规则
const rules = reactive<FormRules>({
  userName: [{ required: true, message: 'User Name', trigger: 'blur' }],
  password: [{ required: true, message: 'Password', trigger: 'blur' }],
  companyRole: [{ required: true, message: 'Company Role', trigger: 'blur' }],
  licensedInfo: [{ required: true, message: 'Licensed Info', trigger: 'blur' }],
  photo: [{ required: true, message: 'Photo', trigger: 'blur' }],
  auth: [{ required: true, message: 'Auth', trigger: 'blur' }],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  console.log(form);
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid && userView.value) {
      const user: IServerSysUser = {
        id: userView.value.id, //id,主键
        userName: userView.value.userName, //user_name,学号或工号等，用户登录ID
        password: '', //pwd,密码
        companyRole: form.companyRole, //公司内角色
        licensedInfo: form.licensedInfo, //律师执业证信息
        details: form.details, //详细信息
        photo: form.photo, //照片
        auth: userView.value.auth, //权限
      };

      console.log(user);

      await serverUserUpdateOwnInfo(user);
      await getSysUserFromServer();
    } else {
      console.log('error submit!', fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const fileList = ref<UploadUserFile[]>([]);
const imageData = ref<string[]>([]);

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const upload = ref<UploadInstance>();

const handleRemove: UploadProps['onRemove'] = async (uploadFile, uploadFiles) => {
  if (form.photo) {
    const formData = new FormData();

    formData.append('fileName', form.photo);

    const ret = await serverDeleteUserPhotoUploadTempFilesByAuthenticatedUser(formData);
    if (ret && ret.code == 200 && ret.data) {
      ElMessage({
        type: 'success',
        message: '删除成功',
      });
    } else ElMessage.success(`删除失败`);
  }
};

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

/**
 * 超过文件上传最大个数
 * @param files
 * @param uploadFiles
 */
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(`最大上传文件个数为1个，已经超过最大值。`);
};

/**
 * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
 * @param uploadFile
 * @param uploadFiles
 */
const handleUploadImageChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

/**
 * 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
 * @param rawFile
 */
const beforeUpload = (rawFile: UploadRawFile) => {
  const extension = rawFile.name.substring(rawFile.name.lastIndexOf('.') + 1);
};

/**
 * 删除文件之前的钩子，参数为上传的文件和文件列表， 若返回 false 或者返回 Promise 且被 reject，则停止删除。
 * @param uploadFile
 * @param uploadFiles
 */
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(`Cancel the transfert of ${uploadFile.name} ?`).then(
    () => true,
    () => false,
  );
};

/**
 * 向服务器上传数据
 * @param options
 */
const httpRequest = async (options: UploadRequestOptions) => {
  const fileObj = options.file;

  const formData = new FormData();
  formData.append('file', fileObj);

  const ret = await serverAddUserPhotoUploadTempFilesByAuthenticatedUser(formData);
  if (ret && ret.code == 200 && ret.data) {
    form.photo = ret.data;
    ElMessage({
      type: 'success',
      message: 'Success',
    });
  } else ElMessage.error(`Failed`);
};
</script>

<template>
  <div>
    <h1>User Settings</h1>
    <el-form ref="ruleFormRef" :rules="rules" label-width="200px" :model="form" class="form-container">
      <el-form-item label="User Name" prop="userName">
        <el-input v-model="form.userName" placeholder="Please input user name" disabled />
      </el-form-item>

      <el-form-item label="Company Role" prop="companyRole">
        <el-input v-model="form.companyRole" placeholder="Please input company role" disabled />
      </el-form-item>

      <el-form-item label="Licensed Info" prop="licensedInfo">
        <el-input v-model="form.licensedInfo" placeholder="Please input licensed info" />
      </el-form-item>

      <el-form-item label="Photo" prop="photo">
        <el-upload
          ref="upload"
          v-model:file-list="fileList"
          action=""
          :limit="1"
          multiple
          :auto-upload="true"
          accept=".png, .jpg, .jpeg, .gif"
          list-type="picture-card"
          :on-exceed="handleExceed"
          :on-change="handleUploadImageChange"
          :before-upload="beforeUpload"
          :http-request="httpRequest"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-button type="primary" @click="submitForm(ruleFormRef)">修改</el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 20px auto;
}

:deep(.el-form-item__label) {
  width: 120px !important;
}
</style>
