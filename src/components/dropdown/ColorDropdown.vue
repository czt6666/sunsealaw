<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, computed } from "vue";


const props = withDefaults(
  defineProps<{
    toolbarRef: HTMLDivElement | null;
  }>(),
  {}
);
const emit = defineEmits<{
  (e: "update:showColorOptionsDropDown", value: boolean): void;
  (e: "onColorChanged", color: string): void;
}>();
const dropDownRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (props.toolbarRef && dropDownRef.value) {
    const { top, left, width, height } =
      props.toolbarRef.getBoundingClientRect();

    const dropdownRect = dropDownRef.value.getBoundingClientRect();

    dropDownRef.value.style.top = `${top + height}px`;
    if (left + dropdownRect.width > window.innerWidth)
      dropDownRef.value.style.left = `${
        window.innerWidth - dropdownRect.width - 20
      }px`;
    else dropDownRef.value.style.left = `${left}px`;

    document.addEventListener("click", handle);
  }
});

watch(
  () => props.toolbarRef,
  async (val, prevval) => {
    if (val && dropDownRef.value) {
      const { top, left, width, height } = val.getBoundingClientRect();
      const dropdownRect = dropDownRef.value.getBoundingClientRect();

      dropDownRef.value.style.top = `${top + height}px`;
      if (left + dropdownRect.width > window.innerWidth)
        dropDownRef.value.style.left = `${
          window.innerWidth - dropdownRect.width - 20
        }px`;
      else dropDownRef.value.style.left = `${left}px`;
    }
  }
);

function handle(event: Event) {
  const target = event.target as Node;

  if (
    !dropDownRef.value?.contains(target) &&
    !props.toolbarRef?.contains(target)
  )
    emit("update:showColorOptionsDropDown", false);
}

onUnmounted(() => {
  document.removeEventListener("click", handle);
});

const predefineColor = [
  //gray
  "#ffffff",
  "#EEEEEE",
  "#DDDDDD",
  "#CCCCCC",
  "#BBBBBB",
  "#AAAAAA",
  "#777777",
  "#555555",
  "#333333",
  "#111111",
  "#000000",
  //Slate

  "#f8fafc",
  "#f1f5f9",
  "#e2e8f0",
  "#cbd5e1",
  "#94a3b8",
  "#64748b",
  "#475569",
  "#334155",
  "#1e293b",
  "#0f172a",
  "#020617",

  //Gray

  "#f9fafb",
  "#f3f4f6",
  "#e5e7eb",
  "#d1d5db",
  "#9ca3af",
  "#6b7280",
  "#4b5563",
  "#374151",
  "#1f2937",
  "#111827",
  "#030712",

  //Zinc
  "#fafafa",
  "#f4f4f5",
  "#e4e4e7",
  "#d4d4d8",
  "#a1a1aa",
  "#71717a",
  "#52525b",
  "#3f3f46",
  "#27272a",
  "#18181b",
  "#09090b",

  //Neutral
  "#fafafa",
  "#f5f5f5",
  "#e5e5e5",
  "#d4d4d4",
  "#a3a3a3",
  "#737373",
  "#525252",
  "#404040",
  "#262626",
  "#171717",
  "#0a0a0a",

  //Stone
  "#fafaf9",
  "#f5f5f4",
  "#e7e5e4",
  "#d6d3d1",
  "#a8a29e",
  "#78716c",
  "#57534e",
  "#44403c",
  "#292524",
  "#1c1917",
  "#0c0a09",

  //Red

  "#fef2f2",
  "#fee2e2",
  "#fecaca",
  "#fca5a5",
  "#f87171",
  "#ef4444",
  "#dc2626",
  "#b91c1c",
  "#991b1b",
  "#7f1d1d",
  "#450a0a",

  //Orange
  "#fff7ed",
  "#ffedd5",
  "#fed7aa",
  "#fdba74",
  "#fb923c",
  "#f97316",
  "#ea580c",
  "#c2410c",
  "#9a3412",
  "#7c2d12",
  "#431407",

  //Amber
  "#fffbeb",
  "#fef3c7",
  "#fde68a",
  "#fcd34d",
  "#fbbf24",
  "#f59e0b",
  "#d97706",
  "#b45309",
  "#92400e",
  "#78350f",
  "#451a03",

  //Yellow
  "#fefce8",
  "#fef9c3",
  "#fef08a",
  "#fde047",
  "#facc15",
  "#eab308",
  "#ca8a04",
  "#a16207",
  "#854d0e",
  "#713f12",
  "#422006",

  //Lime
  "#f7fee7",
  "#ecfccb",
  "#d9f99d",
  "#bef264",
  "#a3e635",
  "#84cc16",
  "#65a30d",
  "#4d7c0f",
  "#3f6212",
  "#365314",
  "#1a2e05",

  //Green
  "#f0fdf4",
  "#dcfce7",
  "#bbf7d0",
  "#86efac",
  "#4ade80",
  "#22c55e",
  "#16a34a",
  "#15803d",
  "#166534",
  "#14532d",
  "#052e16",

  //Emerald
  "#ecfdf5",
  "#d1fae5",
  "#a7f3d0",
  "#6ee7b7",
  "#34d399",
  "#10b981",
  "#059669",
  "#047857",
  "#065f46",
  "#064e3b",
  "#022c22",

  //Teal
  "#f0fdfa",
  "#ccfbf1",
  "#99f6e4",
  "#5eead4",
  "#2dd4bf",
  "#14b8a6",
  "#0d9488",
  "#0f766e",
  "#115e59",
  "#134e4a",
  "#042f2e",

  //Cyan
  "#ecfeff",
  "#cffafe",
  "#a5f3fc",
  "#67e8f9",
  "#22d3ee",
  "#06b6d4",
  "#0891b2",
  "#0e7490",
  "#155e75",
  "#164e63",
  "#083344",

  //Sky

  "#f0f9ff",
  "#e0f2fe",
  "#bae6fd",
  "#7dd3fc",
  "#38bdf8",
  "#0ea5e9",
  "#0284c7",
  "#0369a1",
  "#075985",
  "#0c4a6e",
  "#082f49",

  //Blue
  "#eff6ff",
  "#dbeafe",
  "#bfdbfe",
  "#93c5fd",
  "#60a5fa",
  "#3b82f6",
  "#2563eb",
  "#1d4ed8",
  "#1e40af",
  "#1e3a8a",
  "#172554",

  //Indigo
  "#eef2ff",
  "#e0e7ff",
  "#c7d2fe",
  "#a5b4fc",
  "#818cf8",
  "#6366f1",
  "#4f46e5",
  "#4338ca",
  "#3730a3",
  "#312e81",
  "#1e1b4b",

  //Violet
  "#f5f3ff",
  "#ede9fe",
  "#ddd6fe",
  "#c4b5fd",
  "#a78bfa",
  "#8b5cf6",
  "#7c3aed",
  "#6d28d9",
  "#5b21b6",
  "#4c1d95",
  "#2e1065",

  //Purple
  "#faf5ff",
  "#f3e8ff",
  "#e9d5ff",
  "#d8b4fe",
  "#c084fc",
  "#a855f7",
  "#9333ea",
  "#7e22ce",
  "#6b21a8",
  "#581c87",
  "#3b0764",

  //Fuchsia
  "#fdf4ff",
  "#fae8ff",
  "#f5d0fe",
  "#f0abfc",
  "#e879f9",
  "#d946ef",
  "#c026d3",
  "#a21caf",
  "#86198f",
  "#701a75",
  "#4a044e",

  //Pink
  "#fdf2f8",
  "#fce7f3",
  "#fbcfe8",
  "#f9a8d4",
  "#f472b6",
  "#ec4899",
  "#db2777",
  "#be185d",
  "#9d174d",
  "#831843",
  "#500724",

  //Rose
  "#fff1f2",
  "#ffe4e6",
  "#fecdd3",
  "#fda4af",
  "#fb7185",
  "#f43f5e",
  "#e11d48",
  "#be123c",
  "#9f1239",
  "#881337",
  "#4c0519",
];

const onColorItemClick = (item: string) => {
  emit("onColorChanged", item);

  
};
const colorValue = ref("");
const onColorItemMouseMove = (item: string) => {
  colorValue.value = item;
};

const color0 = computed(() => {
  
  return "#000000";
});
const color1 = computed(() => {
 
  return "#000000";
});
const color2 = computed(() => {
 
  return "#000000";
});
const color3 = computed(() => {
  
  return "#000000";
});
const color4 = computed(() => {
 
  return "#000000";
});
const color5 = computed(() => {
  
  return "#000000";
});
const color6 = computed(() => {
  
  return "#000000";
});
const color7 = computed(() => {
  
  return "#000000";
});
const color8 = computed(() => {
  
  return "#000000";
});
const color9 = computed(() => {

  return "#000000";
});
const color10 = computed(() => {
 
  return "#000000";
});
</script>

<template>
  <div ref="dropDownRef" class="dropdown" style="z-index: 9999">
    <div class="colorContainer">
      <div
        class="colorItem"
        :style="`background-color: ${color0};`"
        @click="onColorItemClick(color0)"
        @mousemove="onColorItemMouseMove(color0)"
      ></div>
      <div
        class="colorItem"
        :style="`background-color: ${color1};`"
        @click="onColorItemClick(color1)"
        @mousemove="onColorItemMouseMove(color1)"
      ></div>
      <div
        class="colorItem"
        :style="`background-color: ${color2};`"
        @click="onColorItemClick(color2)"
        @mousemove="onColorItemMouseMove(color2)"
      ></div>
      <div
        class="colorItem"
        :style="`background-color: ${color3};`"
        @click="onColorItemClick(color3)"
        @mousemove="onColorItemMouseMove(color3)"
      ></div>
      <div
        class="colorItem"
        :style="`background-color: ${color4};`"
        @click="onColorItemClick(color4)"
        @mousemove="onColorItemMouseMove(color4)"
      ></div>
      <div
        class="colorItem"
        :style="`background-color: ${color5};`"
        @click="onColorItemClick(color5)"
        @mousemove="onColorItemMouseMove(color5)"
      ></div>
      <div
        class="colorItem"
        :style="`background-color: ${color6};`"
        @click="onColorItemClick(color6)"
        @mousemove="onColorItemMouseMove(color6)"
      ></div>
      <div
        class="colorItem"
        :style="`background-color: ${color7};`"
        @click="onColorItemClick(color7)"
        @mousemove="onColorItemMouseMove(color7)"
      ></div>
      <div
        class="colorItem"
        :style="`background-color: ${color8};`"
        @click="onColorItemClick(color8)"
        @mousemove="onColorItemMouseMove(color8)"
      ></div>
      <div
        class="colorItem"
        :style="`background-color: ${color9};`"
        @click="onColorItemClick(color9)"
        @mousemove="onColorItemMouseMove(color9)"
      ></div>
      <div
        class="colorItem"
        :style="`background-color: ${color10};`"
        @click="onColorItemClick(color10)"
        @mousemove="onColorItemMouseMove(color10)"
      ></div>
      <div
        style="
          width: 100%;
          height: 1px;
          background-color: #d4d4d8;
          margin-top: 4px;
          margin-bottom: 4px;
        "
      ></div>
      <div
        v-for="(item, index) in predefineColor"
        :key="index"
        class="colorItem"
        :style="`background-color: ${item};`"
        @click="onColorItemClick(item)"
        @mousemove="onColorItemMouseMove(item)"
      ></div>
    </div>
    <div
      style="
        width: 100%;
        height: 1px;
        background-color: #d4d4d8;
        margin-top: 4px;
        margin-bottom: 4px;
      "
    ></div>
    <div
      class="colorItemText"
      :style="`background-color: ${colorValue};`"
    ></div>
  </div>
</template>

<style>
@import url("@/assets/css/toolbar.css");
.colorContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 250px;
  padding: 10px;
}
.colorItem {
  width: 18px;
  height: 18px;
  border: solid 1px white;
  margin: 1px;
  border-radius: 6px;
}
.colorItem:hover {
  border: solid 1px brown;
  border-radius: 2px;
}
.colorItemText {
  margin: auto;
  margin-bottom: 5px;
  width: calc(100% - 10px);
  height: 20px;
  border: solid 1px black;
}
</style>
