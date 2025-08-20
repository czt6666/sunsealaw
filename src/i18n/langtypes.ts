export interface LangeuageOption {
  label: string;
  value: string;
}

export const defaultLanguageOption: LangeuageOption = {
  label: 'English (EN)',
  value: 'en',
};

export const LANGUAGES_OPTIONS: LangeuageOption[] = [
  {
    value: 'en',
    label: 'English (EN)',
  },
  {
    value: 'zh',
    label: '简体中文 (CN)',
  },
  {
    value: 'hk',
    label: '繁體中文 (HK)',
  },
  /*
  {
    value: "tw",
    label: "繁體中文 (TW)",
  },
  
  {
    value: "ja",
    label: "日本語 (JA)",
  },
  {
    value: "de",
    label: "Deutsch (DE)",
  },
  {
    value: "es",
    label: "Español (ES)",
  },
  {
    value: "fr",
    label: "Français (FR)",
  },
  {
    value: "ko",
    label: "한국어 (KO)",
  },
  {
    value: "it",
    label: "Italiano (IT)",
  },
  {
    value: "pl",
    label: "Polski (PL)",
  },
  {
    value: "pt-BR",
    label: "Português (BR)",
  },
  {
    value: "ru",
    label: "Pусский (RU)",
  },
  {
    value: "vi",
    label: "Tiếng Việt (VI)",
  },*/
];
