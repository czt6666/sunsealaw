<script setup lang="ts">
import { onMounted, ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { View, Hide, Search, Plus } from "@element-plus/icons-vue";
import {
  serverContactUsAdd,
  serverContactUsDelete,
  serverContactUsUpdate,
  serverGetContactUsPage,
} from "@/server/ContactUs";
import {
  IServerContactUs,
  Pageable,
  Page,
  SimplePage,
  convertPage,
} from "@/server/ServerType";
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

import LexicalRichTextEditor from "@/components/lexical/LexicalRichTextEditor.vue";
import RenderHtml from "@/components/lexical/RenderHtml.vue";
import { useI18n } from "vue-i18n";
import type { FormInstance, FormRules } from "element-plus";
import type {
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadUserFile,
  UploadRequestOptions,
} from "element-plus";

import { IServerNews } from "@/server/ServerType";
import {
  serverNewsAdd,
  serverNewsUpdate,
  serverNewsDelete,
  serverGetNewsPage,
  serverAddNewsPhotoUploadTempFiles,
  serverDeleteNewsPhotoUploadTempFiles,
  serverGetNewsPhotoFileById,
} from "@/server/News";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const editorResult = ref();
const htmlString = ref("");
const jsonString = ref("");

onMounted(async () => {
  if (!isAdmin()) router.push("/login");
});

const addNews = async () => {
  const text = editorResult.value.convertToHtml();
  htmlString.value = text;
};

const onContentChangedJson = (jsonText: string) => {
  jsonString.value = jsonText;
};

const onContentChangedHtml = (htmlText: string) => {
  htmlString.value = htmlText;
};

const form = reactive<IServerNews>({
  id: 0,
  createDateTime: new Date(),
  title: "",
  brief: "",
  contentJson: "",
  contentHtml: "",
  titlePhoto: "",
  sysUserId: 0,
});
// 表单引用
const formRef = ref<FormInstance>();

// 表单验证规则
const rules = reactive<FormRules>({
  title: [{ required: true, message: "title", trigger: "blur" }],
  brief: [{ required: false, message: "brief", trigger: "blur" }],
  content: [{ required: true, message: "content", trigger: "blur" }],
});

const onOk = async () => {
  let userId = getUserID();
  if (!userId) {
    ElMessageBox.alert("Please login", "Warning", {
      confirmButtonText: "OK",
    });
    router.push("/login");
    return;
  }

  if (!form.title) {
    ElMessageBox.alert("Please input title", "Warning", {
      confirmButtonText: "OK",
    });

    return;
  }

  

  if (!htmlString.value) {
    ElMessageBox.alert("Please input content", "Warning", {
      confirmButtonText: "OK",
    });
    return;
  }
  console.log(form);

  try {
    const news: IServerNews = {
      id: 0,
      createDateTime: new Date(),
      title: form.title,
      brief: form.brief,
      contentJson: jsonString.value,
      contentHtml: htmlString.value,
      titlePhoto: form.titlePhoto,
      sysUserId: userId,
    };
    console.log(news);
    await serverNewsAdd(news);
    ElMessage.success("Success");
    router.push("/manager-news"); // 跳转到新闻列表页面，或者根据需要进行其他操作
  } catch (error) {
    ElMessage.error("Failed");
    console.error("Failed", error);
  }
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
  editorResult.value.clearText();
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

  if (form.titlePhoto) {
    const formData = new FormData();

    formData.append("fileName", form.titlePhoto);

    const ret = await serverDeleteNewsPhotoUploadTempFiles(formData);
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

  const ret = await serverAddNewsPhotoUploadTempFiles(formData);
  if (ret && ret.code == 200 && ret.data) {
    form.titlePhoto = ret.data;
    ElMessage({
      type: "success",
      message: "Success",
    });
  } else ElMessage.error(`Failed`);
};

const onGenerateBrief = async () => {
  if (!htmlString.value) {
    ElMessage.warning(`Please input content`);
    return;
  }

  form.brief = editorResult.value.getBrief();
};
</script>

<template>
  <h1>Add News</h1>
  <div style="text-align: left; margin: 10px">
    <div style="width: 160px">Title</div>
    <div style="margin-left: 20px">
      <el-input v-model="form.title" placeholder="Please input title" />
    </div>

    <div style="width: 160px; margin-top: 20px">Brief</div>
    <div style="margin-left: 20px">
      <el-input v-model="form.brief" placeholder="Please input brief" />
      <el-button type="primary" @click="onGenerateBrief"
        >Auto Generate Brief</el-button
      >
    </div>

    <div style="width: 160px; margin-top: 20px">Title Photo</div>
    <div style="margin-left: 20px">
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
    </div>

    <div style="width: 160px; margin-top: 20px">Content</div>
    <div style="margin-left: 20px">
      <LexicalRichTextEditor
        style="width: calc(100% - 40px)"
        ref="editorResult"
        @onContentChangedHtml="onContentChangedHtml"
        @onContentChangedJson="onContentChangedJson"
      />
    </div>

    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px;
      "
    >
      <el-button type="primary" @click="onOk">{{ t("app.ok") }} </el-button>
      <el-button @click="resetForm">{{ t("app.reset") }}</el-button>
    </div>
  </div>

  <!--Html预览-->
  <div style="margin: 10px">
    <h3>Html预览</h3>
    <div style="margin: 10px; border: 1px solid gray">
      <RenderHtml :html-content="htmlString" />
    </div>
  </div>
</template>

<style scoped></style>
