<script setup lang="ts">
import { computed, onMounted, reactive, ref, Ref } from "vue";

//服务器返回到前端的类型

import { serverGetNewsPhotoFileById } from "@/server/News";

const props = defineProps(["newsId", "imgWidth", "imgHeight"]);

const imageData = ref("");

onMounted(async () => {
  await getImgUrl();
});

const getImgUrl = async () => {
  if (!props.newsId) return "";
  let res = await serverGetNewsPhotoFileById(props.newsId);
  console.log(res);

  if (res && res.code == 200) imageData.value = res.data;
  return "";
};
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const imgRef = ref<HTMLImageElement>();

const onPreview = () => {
  dialogImageUrl.value = imageData.value;
  dialogVisible.value = true;
};

const dialogWidth = ref("1000px");
const onOpen = () => {
  if (imgRef.value?.naturalWidth)
    return (dialogWidth.value = imgRef.value?.naturalWidth + 30 + "px");
};
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    @open="onOpen"
    :z-index="9999"
    :append-to-body="true"
    :width="dialogWidth"
  >
    <img :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>

  <img
    v-if="imageData"
    ref="imgRef"
    :src="imageData"
    alt="news photo"
    style="border-radius: 5px"
    :style="{ width: props.imgWidth + 'px', height: props.imgHeight + 'px' }"
    @click="onPreview"
  />
</template>

<style scoped></style>
