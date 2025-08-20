<script setup lang="ts">
import { computed, onMounted, reactive, ref, Ref, watch } from 'vue';

import { useRouter } from 'vue-router/dist/vue-router';

import store from '@/store';

import type { FormInstance, FormRules } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';

import { ElMessage, ElMessageBox } from 'element-plus';
import type { Action } from 'element-plus';
import type { CascaderValue } from 'element-plus';

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

import { IServerCarousel } from '@/server/ServerType';

import {
  serverCarouselAdd,
  serverCarouselDelete,
  serverCarouselUpdate,
  serverGetCarouselPage,
  serverAddCarouselPhotoUploadTempFiles,
  serverDeleteCarouselPhotoUploadTempFiles,
  serverGetCarouselPhotoFileById,
} from '@/server/Carousel';
import { useI18n } from 'vue-i18n';
import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile, UploadRequestOptions } from 'element-plus';
const { t } = useI18n(); // 解构出t方法

const router = useRouter();

interface Props {
  dialogVisible: boolean; //对话框是否可见
  carousel: IServerCarousel | undefined; //要修改的用户
}

const props = withDefaults(defineProps<Props>(), {
  dialogVisible: false,
});

const form = reactive<IServerCarousel>({
  id: 0,
  photo: '',
  sysUserId: 0,
  createDateTime: new Date(),
  title: '',
  subTitle: '',
  style: 1,
});
// 表单引用
const formRef = ref<FormInstance>();

// 表单验证规则
const rules = reactive<FormRules>({
  photo: [{ required: true, message: 'User Name', trigger: 'blur' }],
});

//event
const emit = defineEmits<{
  (e: 'onDilalogOk', sysUser: IServerCarousel): void;
  (e: 'onDilalogCancel'): void;
}>();

const dialogFormVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(val) {
    return val;
  },
});

const onOpenDialog = async () => {
  fileList.value = [];
  if (props.carousel) {
    form.id = props.carousel.id;
    form.photo = props.carousel.photo;
    form.sysUserId = props.carousel.sysUserId;
    form.createDateTime = props.carousel.createDateTime;
    form.title = props.carousel.title;
    form.subTitle = props.carousel.subTitle;
    form.style = props.carousel.style;

    fileList.value = [];
    let res = await serverGetCarouselPhotoFileById(props.carousel.id);
    if (res && res.code == 200 && res.data) {
      fileList.value.push({ name: form.photo, url: res.data });
    }
  }
};

const handleClose = () => {
  emit('onDilalogCancel');
};
const onOk = () => {
  let userId = getUserID();
  if (!userId) {
    ElMessageBox.alert('Please login', 'Warning', {
      confirmButtonText: 'OK',
    });
    router.push('/login');
    return;
  }
  console.log('1');
  formRef.value?.validate(async (valid) => {
    console.log(form);
    if (valid) {
      try {
        const carousel: IServerCarousel = {
          id: form.id,
          photo: form.photo,
          sysUserId: form.sysUserId,
          createDateTime: new Date(),
          title: form.title,
          subTitle: form.subTitle,
          style: form.style,
        };
        console.log(carousel);

        emit('onDilalogOk', carousel);
      } catch (error) {
        ElMessage.error('Failed');
        console.error('Failed', error);
      }
    } else {
      ElMessage.error('Please check data');
    }
  });
};

const onCancel = () => {
  emit('onDilalogCancel');
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
};

const fileList = ref<UploadUserFile[]>([]);
const imageData = ref<string[]>([]);

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const upload = ref<UploadInstance>();

const handleRemove: UploadProps['onRemove'] = async (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);

  if (form.photo) {
    const formData = new FormData();

    formData.append('fileName', form.photo);

    const ret = await serverDeleteCarouselPhotoUploadTempFiles(formData);
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

  const ret = await serverAddCarouselPhotoUploadTempFiles(formData);
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
  <el-dialog
    title="Update Member"
    v-model="dialogFormVisible"
    :before-close="handleClose"
    @open="onOpenDialog"
    draggable
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="Title" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="Sub Title" prop="subTitle">
        <el-input v-model="form.subTitle" />
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

      <el-form-item label="Visible" prop="style">
        <el-radio-group v-model="form.style">
          <el-radio :label="1">Show</el-radio>
          <el-radio :label="0">Hide</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm">Reset</el-button>
        <el-button @click="onCancel">{{ t('app.cancel') }}</el-button>
        <el-button type="primary" @click="onOk()">{{ t('app.ok') }}</el-button>
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
