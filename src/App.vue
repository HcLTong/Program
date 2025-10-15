<script setup>
import HomeView from './views/HomeView.vue';
</script>

<template>
  <HomeView />
</template>

<style>
/* 重置全局样式，确保页面铺满屏幕 */
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5; /* 添加背景色 */
}
</style>
