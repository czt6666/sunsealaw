<script setup lang="ts">
import { computed, onMounted, reactive, ref, Ref, watch } from "vue";

import { useRouter } from "vue-router/dist/vue-router";

import store from "@/store";

import type { FormInstance, FormRules } from "element-plus";
import { Delete } from "@element-plus/icons-vue";

import { ElMessage, ElMessageBox } from "element-plus";
import type { Action } from "element-plus";
import type { CascaderValue } from "element-plus";

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
} from "@/cookies/user";

import { IServerSysUser } from "@/server/ServerType";

import {
  serverAddUserPhotoUploadTempFiles,
  serverDeleteUserPhotoUploadTempFiles,
} from "@/server/SysUser";
import { useI18n } from "vue-i18n";
import type {
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile,
  UploadRequestOptions,
} from "element-plus";
const { t } = useI18n(); // 解构出t方法

const router = useRouter();

interface Props {
  dialogVisible: boolean; //对话框是否可见
}

const props = withDefaults(defineProps<Props>(), {
  dialogVisible: false,
});

const form = reactive<IServerSysUser>({
  id: 0,
  userName: "",
  realName: "",
  password: "123456",
  companyRole: "",
  licensedInfo: "",
  details: "",
  email: "",
  photo: "",
  auth: 0,
});
// 表单引用
const formRef = ref<FormInstance>();

// 表单验证规则
const rules = reactive<FormRules>({
  userName: [{ required: true, message: "User Name", trigger: "blur" }],
  realName: [{ required: true, message: "Real Name", trigger: "blur" }],
  password: [{ required: true, message: "Password", trigger: "blur" }],
  companyRole: [{ required: true, message: "Company Role", trigger: "blur" }],
  licensedInfo: [{ required: true, message: "Licensed Info", trigger: "blur" }],
  email: [{ required: true, message: "Email", trigger: "blur" }],
  photo: [{ required: true, message: "Photo", trigger: "blur" }],
  auth: [{ required: true, message: "Auth", trigger: "blur" }],
});

//event
const emit = defineEmits<{
  (e: "onDilalogOk", sysUser: IServerSysUser): void;
  (e: "onDilalogCancel"): void;
}>();

const dialogFormVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(val) {
    return val;
  },
});

const onOpenDialog = async () => {};

const handleClose = () => {
  emit("onDilalogCancel");
};
const onOk = () => {
  let userId = getUserID();
  if (!userId) {
    ElMessageBox.alert("Please login", "Warning", {
      confirmButtonText: "OK",
    });
    router.push("/login");
    return;
  }
  console.log("1");
  formRef.value?.validate(async (valid) => {
    console.log(form);
    if (valid) {
      try {
        const sysUser: IServerSysUser = {
          id: 0,
          userName: form.userName,
          realName: form.realName,
          password: form.password,
          companyRole: form.companyRole,
          licensedInfo: form.licensedInfo,
          details: form.details,
          email: form.email,
          photo: form.photo,
          auth: form.auth,
        };
        console.log(sysUser);

        emit("onDilalogOk", sysUser);
      } catch (error) {
        ElMessage.error("Failed");
        console.error("Failed", error);
      }
    } else {
      ElMessage.error("Please check data");
    }
  });
};

const onCancel = () => {
  emit("onDilalogCancel");
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
};

const fileList = ref<UploadUserFile[]>([]);
const imageData = ref<string[]>([]);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const upload = ref<UploadInstance>();

const handleRemove: UploadProps["onRemove"] = async (
  uploadFile,
  uploadFiles
) => {
  console.log(uploadFile, uploadFiles);

  if (form.photo) {
    const formData = new FormData();

    formData.append("fileName", form.photo);

    const ret = await serverDeleteUserPhotoUploadTempFiles(formData);
    if (ret && ret.code == 200 && ret.data) {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    } else ElMessage.success(`删除失败`);
  }
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

/**
 * 超过文件上传最大个数
 * @param files
 * @param uploadFiles
 */
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(`最大上传文件个数为1个，已经超过最大值。`);
};

/**
 * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
 * @param uploadFile
 * @param uploadFiles
 */
const handleUploadImageChange: UploadProps["onChange"] = (
  uploadFile,
  uploadFiles
) => {
  console.log(uploadFile, uploadFiles);
};

/**
 * 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
 * @param rawFile
 */
const beforeUpload = (rawFile: UploadRawFile) => {
  const extension = rawFile.name.substring(rawFile.name.lastIndexOf(".") + 1);
};

/**
 * 删除文件之前的钩子，参数为上传的文件和文件列表， 若返回 false 或者返回 Promise 且被 reject，则停止删除。
 * @param uploadFile
 * @param uploadFiles
 */
const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfert of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  );
};

/**
 * 向服务器上传数据
 * @param options
 */
const httpRequest = async (options: UploadRequestOptions) => {
  const fileObj = options.file;

  const formData = new FormData();
  formData.append("file", fileObj);

  const ret = await serverAddUserPhotoUploadTempFiles(formData);
  if (ret && ret.code == 200 && ret.data) {
    form.photo = ret.data;
    ElMessage({
      type: "success",
      message: "Success",
    });
  } else ElMessage.error(`Failed`);
};
</script>

<template>
  <el-dialog
    title="New Member"
    v-model="dialogFormVisible"
    :before-close="handleClose"
    @open="onOpenDialog"
    draggable
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="User Name" prop="userName">
        <el-input
          v-model="form.userName"
          placeholder="Please input user name"
        />
      </el-form-item>

      <el-form-item label="Real Name" prop="realName">
        <el-input
          v-model="form.realName"
          placeholder="Please input real name"
        />
      </el-form-item>

      <!--密码默认为123456-->
      <el-form-item label="Password" prop="password" style="display: none">
        <el-input v-model="form.password" placeholder="Please input password" />
      </el-form-item>

      <el-form-item label="Company Role" prop="companyRole">
        <el-input
          v-model="form.companyRole"
          placeholder="Please input company role"
        />
      </el-form-item>

      <el-form-item label="Licensed Info" prop="licensedInfo">
        <el-input
          v-model="form.licensedInfo"
          placeholder="Please input licensed info"
        />
      </el-form-item>

      <el-form-item label="Details" prop="details">
        <el-input
          v-model="form.details"
          type="textarea"
          autosize
          :rows="4"
          placeholder="Please input details"
        />
      </el-form-item>

      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" placeholder="Please input email" />
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

      <el-form-item label="Auth" prop="auth">
        <el-radio-group v-model="form.auth">
          <el-radio :label="1">Admin</el-radio>
          <el-radio :label="0">Normal</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm">{{ t("app.reset") }}</el-button>
        <el-button @click="onCancel">{{ t("app.cancel") }}</el-button>
        <el-button type="primary" @click="onOk()">{{ t("app.ok") }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.page-class {
  padding: 10px;
}

.top-toolbar {
  display: flex;
  margin: 0 10px;
}

.input-with-select {
  right: 20px;
  margin-left: 10px;
  flex: 1;
}
</style>
