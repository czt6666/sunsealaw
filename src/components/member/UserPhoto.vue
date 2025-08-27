<script setup lang="ts">
import { computed, onMounted, reactive, ref, Ref } from 'vue';

//服务器返回到前端的类型
import { getUserPhotoUrlBySysUser } from '@/server/SysUser';
import { IServerCarousel } from '../../server/ServerType';

const props = defineProps(['user', 'imgWidth', 'imgHeight']);

const imageData = ref('');

onMounted(async () => {
  await getImgUrl();
});

const getImgUrl = async () => {
  if (!props.user) return '';
  //let res = await serverGetUserPhotoFileById(props.userId);
  //console.log(res);

  //if (res && res.code == 200) imageData.value = res.data;

  imageData.value = getUserPhotoUrlBySysUser(props.user);
  return '';
};
const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const imgRef = ref<HTMLImageElement>();

const onPreview = () => {
  dialogImageUrl.value = imageData.value;
  dialogVisible.value = true;
};

const dialogWidth = ref('1000px');
const onOpen = () => {
  if (imgRef.value?.naturalWidth) return (dialogWidth.value = imgRef.value?.naturalWidth + 30 + 'px');
};
</script>

<template>
  <div class="preview-container" v-if="imgWidth > 0">
    <img id="previewImage" :src="imageData" alt="图片预览" />
  </div>
  <div v-else>
    <img :src="imageData" alt="图片预览" style="width: 64px; border-radius: 5px" />
  </div>
</template>

<style scoped>
.preview-container {
  width: 256px;
  height: 352px;
  overflow: hidden;
  position: relative;
  background-color: #f8f9fa;

  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#previewImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
  background: #f0f0f0;
  border-radius: 20px;
}
</style>
