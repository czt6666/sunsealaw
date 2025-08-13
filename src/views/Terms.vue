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
          {{ t('app.terms_of_service') }}
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
    "
  >
    <h1 style="text-align: center; font-size: 26px; font-weight: bold; margin-bottom: 30px">
      Terms and Conditions – SUNSEA LAW GROUP P.C.
    </h1>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      1. Introduction and Acceptance of Terms
    </h2>
    <p>
      Welcome to the website of
      <strong>SUNSEA LAW GROUP P.C.</strong>
      (“we,” “us,” or “our”). These Terms and Conditions (“Terms”) govern your access to and use of our website located
      at
      <a href="http://www.sunsealaw.com" style="color: #0056b3; text-decoration: none">www.sunsealaw.com</a>
      (the “Website”).
    </p>
    <p>
      By accessing or using our Website, you acknowledge that you have read, understood, and agree to be bound by these
      Terms and any additional terms incorporated by reference. If you do not agree with these Terms, you must not
      access or use our Website.
    </p>
    <p>
      We reserve the right to amend or update these Terms at any time without prior notice. Changes will be posted on
      the Website and are effective immediately upon posting. Your continued use of the Website constitutes acceptance
      of such changes.
    </p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      2. Intellectual Property Rights
    </h2>
    <p>
      <strong>2.1 Ownership –</strong>
      All content on this Website, including but not limited to text, graphics, logos, images, audio clips, video clips,
      data compilations, software, and the compilation thereof (the “Content”), is the property of SUNSEA LAW GROUP P.C.
      or its licensors, and is protected by United States and international copyright laws.
    </p>
    <p>
      <strong>2.2 Trademarks –</strong>
      All trademarks, service marks, and trade names displayed on the Website (collectively, the “Marks”) are the
      property of SUNSEA LAW GROUP P.C., its affiliates, or third parties. Unauthorized use of any Marks without the
      prior written consent of the owner is strictly prohibited under applicable U.S. trademark law.
    </p>
    <p>
      <strong>2.3 Restrictions –</strong>
      You may not reproduce, republish, upload, post, transmit, distribute, or otherwise use any Content or Marks
      without our prior written consent, except for personal, non-commercial use that does not infringe upon our
      intellectual property rights.
    </p>
    <p>
      <strong>2.4 Protection of Rights –</strong>
      You agree to use reasonable efforts to protect our intellectual property and to promptly notify us of any
      suspected infringement, misappropriation, or unauthorized use.
    </p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      3. Limited License
    </h2>
    <p>
      We grant you a limited, non-exclusive, revocable license to access and use the Website solely for lawful purposes
      and in accordance with these Terms. This license does not permit you to:
    </p>
    <ol class="ol-list" style="padding-left: 20px; list-style-type: lower-alpha">
      <li>Frame or mirror any part of the Website without our written consent;</li>
      <li>Modify or copy any Content except as necessary for personal viewing;</li>
      <li>Use the Website or Content for commercial purposes without authorization;</li>
      <li>Create derivative works from the Website or Content;</li>
      <li>Use automated tools (bots, crawlers, scrapers) without permission;</li>
      <li>Circumvent or attempt to circumvent any Website security features; or</li>
      <li>Take any action that imposes an unreasonable or disproportionately large load on our infrastructure.</li>
    </ol>
    <p>Any unauthorized use will terminate the license granted herein.</p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">4. Disclaimer</h2>
    <p>
      <strong>4.1 No Legal Advice –</strong>
      The materials on this Website are provided for general informational purposes only and do not constitute legal
      advice. Use of this Website does not create an attorney-client relationship between you and SUNSEA LAW GROUP P.C.
    </p>
    <p>
      <strong>4.2 Accuracy –</strong>
      We strive to ensure the accuracy of information, but we make no warranties or representations regarding the
      completeness, accuracy, or reliability of any Content. We disclaim all liability for any loss or damage resulting
      from reliance on information posted on this Website.
    </p>
    <p>
      <strong>4.3 Security –</strong>
      While we make reasonable efforts to safeguard communications, no method of transmission over the Internet is 100%
      secure. We cannot guarantee the security or confidentiality of information transmitted to us through the Website.
    </p>
    <p>
      <strong>4.4 Force Majeure –</strong>
      We shall not be liable for any delay or failure caused by circumstances beyond our reasonable control, including
      natural disasters, power outages, cyberattacks, governmental actions, or other events of a similar nature.
    </p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      5. Links to Third-Party Websites
    </h2>
    <p>
      This Website may contain links to third-party websites for convenience. We do not control and are not responsible
      for the content, policies, or practices of such websites. Accessing third-party websites is at your own risk.
    </p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      6. Limitation of Liability
    </h2>
    <p style="color: #900">
      <strong>
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SUNSEA LAW GROUP P.C. SHALL NOT BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
      </strong>
    </p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      7. Governing Law and Jurisdiction
    </h2>
    <p>
      These Terms and any dispute arising out of or relating to your use of the Website shall be governed by and
      construed in accordance with the laws of the State of California, without regard to its conflict of laws
      principles.
    </p>
    <p>
      You agree to submit to the exclusive jurisdiction of the state and federal courts located in Orange County,
      California, for the resolution of any disputes.
    </p>

    <h2 style="font-size: 20px; margin-top: 30px; border-bottom: 2px solid #ccc; padding-bottom: 5px">
      8. General Provisions
    </h2>
    <p>
      <strong>8.1 Entire Agreement –</strong>
      These Terms constitute the entire agreement between you and SUNSEA LAW GROUP P.C. regarding Website use and
      supersede all prior agreements or understandings.
    </p>
    <p>
      <strong>8.2 No Waiver –</strong>
      Our failure to enforce any provision of these Terms shall not be considered a waiver of our rights.
    </p>
    <p>
      <strong>8.3 Severability –</strong>
      If any provision of these Terms is found invalid or unenforceable, the remaining provisions will remain in full
      force and effect.
    </p>
    <p>
      <strong>8.4 No Third-Party Rights –</strong>
      These Terms do not create any rights for third-party beneficiaries.
    </p>

    <div style="margin-top: 40px; padding: 20px; background-color: #f0f0f0; border-radius: 5px">
      <p>
        <strong>Contact Information:</strong>
        <br />
        SUNSEA LAW GROUP P.C.
        <br />
        18300 Von Karman Ave, Suite 970
        <br />
        Irvine, CA 92612
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
