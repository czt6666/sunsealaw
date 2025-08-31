<script setup lang="ts">
import { RouterView } from 'vue-router';
import Header from '@/views/Header.vue';
import Footer from '@/views/Footer.vue';
</script>

<template>
  <el-container>
    <el-header style="padding: 0px; height: 100px; width: 100%; overflow: hidden"><Header></Header></el-header>
    <el-main style="padding: 0px"><router-view></router-view></el-main>
    <el-footer style="padding: 0px"><Footer></Footer></el-footer>
  </el-container>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
}

body {
  margin: 0px;
}
</style>
