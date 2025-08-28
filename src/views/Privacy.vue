<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import {
  clearCookies,
  setUserCookies,
  getToken,
  getUserID,
  getUserName,
  getUserRealName,
  isAdmin,
} from '@/cookies/user';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
</script>

<template>
  <div
    style="
      background-color: #0c162f;
      margin: 0px;
      color: white;
      font-family: 'Instrument Serif', serif;
      font-size: 20px;
      font-weight: 400;
      letter-spacing: 1.2px;
      line-height: 1.08;

      padding-top: 40px;
      padding-bottom: 40px;
    "
  >
    <div class="news-container-outer">
      <div class="news-container-inner">
        <div style="font-size: 3em; cursor: pointer">
          {{ t('app.privacy_policy') }}
        </div>
      </div>
    </div>
  </div>
  <div
    style="
      font-family: Georgia, serif;
      max-width: 800px;
      margin: auto;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      text-align: left;
      border-radius: 8px;
    "
  >
    <h1 style="text-align: center; font-size: 26px; font-weight: bold; margin-bottom: 30px">Privacy Policy</h1>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      1. Introduction
    </h2>
    <p>
      <strong>SUNSEA LAW GROUP P.C.</strong>
      (“we,” “us,” or “our”) takes your privacy and the protection of your personal information seriously. This Privacy
      Policy describes how we collect, use, and disclose personal information in compliance with the California Consumer
      Privacy Act of 2018 (“CCPA”), the California Privacy Rights Act of 2020 (“CPRA”), and other applicable U.S.
      privacy laws.
    </p>
    <p>
      This Policy applies when you visit our website (
      <a href="http://www.us-sunsealaw.com" style="color: #0056b3; text-decoration: none">www.us-sunsealaw.com</a>
      ), engage our legal services, interact with us at events, or otherwise provide us with your personal information.
    </p>
    <p>
      If you have questions about this Policy, or wish to exercise your rights under applicable privacy laws, please
      contact our Privacy Officer (“PO”) using the information in Section 10 below.
    </p>
    <p>We may update this Policy from time to time. Please check our website for the latest version.</p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      2. Personal Information We Collect
    </h2>
    <h3 style="font-size: 18px; margin-top: 20px">2.1 Definition of “Personal Information”</h3>
    <p>
      Under the CCPA/CPRA, “personal information” means information that identifies, relates to, describes, or could
      reasonably be linked with you. Examples include:
    </p>
    <ul style="padding-left: 4cap; list-style-type: disc">
      <li>Name, mailing address, telephone number, email address</li>
      <li>Government-issued identification numbers</li>
      <li>Professional or employment-related information</li>
      <li>Financial information related to payments for legal services</li>
      <li>Internet activity (e.g., IP address, browsing history)</li>
      <li>Audio, video, or photographic records from events or meetings</li>
      <li>Any information you provide in connection with legal representation</li>
    </ul>

    <h3 style="font-size: 18px; margin-top: 20px">2.2 How We Collect Personal Information</h3>
    <ol class="ol-list" style="padding-left: 20px; list-style-type: lower-alpha">
      <li>Directly from you (e.g., emails, calls, intake forms)</li>
      <li>Automatically when you use our website (cookies, analytics)</li>
      <li>Through security systems (e.g., CCTV)</li>
      <li>From third parties (e.g., opposing counsel, service providers, public records)</li>
    </ol>

    <h3 style="font-size: 18px; margin-top: 20px">2.3 Purposes of Collection and Use</h3>
    <ol class="ol-list" style="padding-left: 20px; list-style-type: lower-alpha">
      <li>Providing legal services and managing client relationships</li>
      <li>Responding to inquiries and requests</li>
      <li>Conducting conflict checks and due diligence</li>
      <li>Processing payments and managing accounts receivable</li>
      <li>Sending legal updates, invitations, or announcements</li>
      <li>Managing our website and IT systems</li>
      <li>Complying with legal and regulatory requirements</li>
      <li>Any other purposes with your consent or as permitted by law</li>
    </ol>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      3. Accuracy of Personal Information
    </h2>
    <p>
      We take reasonable steps to ensure the information we hold is accurate and up to date. You are responsible for
      informing us of any changes to your personal information.
    </p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      4. Security of Personal Information
    </h2>
    <p>
      We use reasonable administrative, technical, and physical safeguards to protect personal information against
      unauthorized access, use, or disclosure.
    </p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      5. Disclosure of Personal Information
    </h2>
    <p>We may share personal information with:</p>
    <ul style="padding-left: 4cap; list-style-type: disc">
      <li>Our attorneys, employees, and contractors</li>
      <li>Service providers under confidentiality obligations</li>
      <li>Co-counsel or experts engaged for your matter</li>
      <li>Government authorities as required by law</li>
    </ul>
    <p>
      <strong>We do not sell personal information</strong>
      as defined under the CCPA/CPRA.
    </p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      6. Retention of Personal Information
    </h2>
    <p>
      We retain personal information only as long as necessary to fulfill the purposes for which it was collected, or as
      required by applicable laws.
    </p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      7. Transfer of Personal Information
    </h2>
    <p>
      If we transfer personal information outside California or the United States, we will ensure appropriate safeguards
      are in place.
    </p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      8. Your Privacy Rights under CCPA/CPRA
    </h2>
    <p>California residents have the right to:</p>
    <ul style="padding-left: 4cap; list-style-type: disc">
      <li>Request to know what personal information we collect, use, and disclose</li>
      <li>Request deletion of personal information</li>
      <li>Opt out of sale or sharing of personal information</li>
      <li>Request correction of inaccurate personal information</li>
      <li>Limit use and disclosure of sensitive personal information</li>
    </ul>
    <p>You may exercise your rights by contacting us as set out in Section 10.</p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      9. Cookies and Third-Party Links
    </h2>
    <p>
      We use cookies to improve site functionality and analyze usage. You can control cookie settings in your browser;
      however, disabling cookies may affect functionality.
    </p>
    <p>Our website may contain links to third-party sites. This Policy does not apply to those sites.</p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      10. Contact Us
    </h2>
    <p>If you have questions about this Policy or our privacy practices, please contact our Privacy Officer:</p>
    <div style="margin-top: 20px; padding: 20px; background-color: #f0f0f0; border-radius: 5px">
      <p>
        <strong>Privacy Officer</strong>
        <br />
        SUNSEA LAW GROUP P.C.
        <br />
        18300 Von Karman Ave, Suite 970, Irvine, CA 92612
        <br />
        Email:
        <a href="mailto:info@sunsealaw.com" style="color: #0056b3">info@sunsealaw.com</a>
      </p>
    </div>
  </div>

  <div style="margin-top: 20px"></div>
</template>

<style scoped>
.ol-list li::marker {
  content: '(' counter(list-item, lower-alpha) ') ';
}
</style>
