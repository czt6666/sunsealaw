<template>
  <div class="maintenance-container">
    <el-card class="maintenance-card" shadow="hover">
      <div class="icon-box">
        <el-icon color="#409EFF" size="50">
          <Setting />
        </el-icon>
      </div>
      <h2>网站正在维护中</h2>
      <p class="desc">我们正在进行系统升级，请稍后再来访问。</p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue';
</script>

<style scoped>
.maintenance-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f7fa;
}

.maintenance-card {
  text-align: center;
  padding: 40px;
  width: 400px;
  border-radius: 16px;
}

.icon-box {
  margin-bottom: 20px;
}

.desc {
  color: #606266;
  margin: 10px 0 20px 0;
}
</style>
