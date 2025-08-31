<template>
  <div v-if="showBanner" class="cookie-banner">
    <div class="cookie-banner-content">
      <!-- 关闭按钮 -->
      <button class="close-btn" @click="closeBanner">&times;</button>

      <h4>We Value Your Privacy</h4>
      <p>
        We use cookies to improve your browsing experience, analyze site traffic, and personalize content. By clicking
        “Accept All,” you consent to our use of cookies. You may customize your cookie preferences or withdraw your
        consent at any time.
      </p>
      <div class="cookie-banner-buttons">
        <button class="btn accept" @click="acceptCookies">Accept All</button>
        <button class="btn settings" @click="openCookieSettings">Cookie Settings</button>
        <button class="btn reject" @click="rejectCookies">Reject Non-Essential</button>
      </div>
      <p class="cookie-banner-note">
        For more information, please review our
        <RouterLink to="/privacy">Privacy Policy</RouterLink>
        .
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';

const showBanner = ref(true);

onMounted(() => {
  if (localStorage.getItem('cookieConsent')) {
    showBanner.value = false;
  }
});

const acceptCookies = () => {
  localStorage.setItem('cookieConsent', 'all');
  showBanner.value = false;
};

const rejectCookies = () => {
  localStorage.setItem('cookieConsent', 'essential');
  showBanner.value = false;
};

const openCookieSettings = () => {
  alert('Open cookie settings modal here.');
};

const closeBanner = () => {
  showBanner.value = false;
};
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #f8f9fa;
  border-top: 1px solid #ddd;
  font-family: Georgia, serif;
  padding: 16px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}

.cookie-banner-content {
  max-width: 960px;
  margin: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.cookie-banner h4 {
  margin-top: 0;
  font-weight: normal;
  color: #333;
}

.cookie-banner p {
  margin: 8px 0;
  color: #555;
  line-height: 1.5;
}

.cookie-banner-buttons {
  margin-top: 12px;
}

.cookie-banner .btn {
  padding: 8px 14px;
  margin-right: 8px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.cookie-banner .btn.accept {
  background-color: #007bff;
  color: white;
}

.cookie-banner .btn.settings {
  background-color: #6c757d;
  color: white;
}

.cookie-banner .btn.reject {
  background-color: #dc3545;
  color: white;
}

.cookie-banner-note {
  margin-top: 12px;
  font-size: 0.9em;
  color: #777;
}

.cookie-banner-note a {
  color: #007bff;
  text-decoration: none;
}
</style>
