//语言

import { createI18n } from "vue-i18n"; //引入vue-i18n组件
import zh from "./zh/index";
import en from "./en/index";
import hk from "./hk/index";

/**
 * 获得语言,
 * 1. 从localStorage中获取
 * 2. 从浏览器中获取
 * 3. 默认返回en
 * @param name
 * @returns
 */
export function getLocale() {
  const local = localStorage.getItem("locale");

  if (local) return local;
  else {
    /* 
    navigator.language返回值：
    ["af", "sq", "ar-SA", "ar-IQ", "ar-EG", "ar-LY", "ar-DZ", "ar-MA", "ar-TN", "ar-OM",
  "ar-YE", "ar-SY", "ar-JO", "ar-LB", "ar-KW", "ar-AE", "ar-BH", "ar-QA", "eu", "bg",
    "be", "ca", "zh-TW", "zh-CN", "zh-HK", "zh-SG", "hr", "cs", "da", "nl", "nl-BE", "en",
    "en-US", "en-EG", "en-AU", "en-GB", "en-CA", "en-NZ", "en-IE", "en-ZA", "en-JM",
    "en-BZ", "en-TT", "et", "fo", "fa", "fi", "fr", "fr-BE", "fr-CA", "fr-CH", "fr-LU",
    "gd", "gd-IE", "de", "de-CH", "de-AT", "de-LU", "de-LI", "el", "he", "hi", "hu",
    "is", "id", "it", "it-CH", "ja", "ko", "lv", "lt", "mk", "mt", "no", "pl",
    "pt-BR", "pt", "rm", "ro", "ro-MO", "ru", "ru-MI", "sz", "sr", "sk", "sl", "sb",
    "es", "es-AR", "es-GT", "es-CR", "es-PA", "es-DO", "es-MX", "es-VE", "es-CO",
    "es-PE", "es-EC", "es-CL", "es-UY", "es-PY", "es-BO", "es-SV", "es-HN", "es-NI",
    "es-PR", "sx", "sv", "sv-FI", "th", "ts", "tn", "tr", "uk", "ur", "ve", "vi", "xh",
    "ji", "zu"];
    */
    var defaultValue = navigator.language;

    if (defaultValue == "zh-CN") defaultValue = "zh";
    else {
      defaultValue = defaultValue.substring(0, 2); //截取lang前2位字符
      if (defaultValue == "en") defaultValue = "en";
      else if (defaultValue == "zh") defaultValue = "hk";
      else if (defaultValue == "ja") defaultValue = "jp";
      else if (defaultValue == "fr") defaultValue = "fr";
      else if (defaultValue == "ru") defaultValue = "ru";
      else if (defaultValue == "es") defaultValue = "es";
      else if (defaultValue == "ko") defaultValue = "kr";
      else defaultValue = "en";
    }
    return defaultValue;
  }
}

/**
 * Language string	Description
 * zh-CN	中文（简体）
 * zh-TW	中文（繁体）
 * en	英语
 * en-us	英语（美国）
 * ja	日语
 * ko	韩语
 * pt	葡萄牙语
 * th	泰国语
 */

const i18n = createI18n({
  legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
  globalInjection: true, // 全局注册$t方法
  locale: getLocale(), // 设置语言类型
  fallbackLocale: getLocale(),
  messages: {
    zh,
    en,
    hk,
  },
});

export default i18n;
