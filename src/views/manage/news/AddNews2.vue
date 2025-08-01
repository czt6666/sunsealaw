<template>
  <div class="news-publish-container">
    <h1>新闻发布</h1>

    <el-form :model="form" label-position="top" ref="formRef">
      <el-form-item label="标题" required>
        <el-input v-model="form.title" placeholder="请输入新闻标题" size="large" />
      </el-form-item>

      <el-form-item label="摘要" required>
        <el-input v-model="form.brief" type="textarea" placeholder="请输入新闻摘要" :rows="3" resize="none" />
      </el-form-item>

      <el-form-item label="标题图片" required>
        <el-upload
          ref="upload"
          v-model:file-list="fileList"
          action=""
          :limit="1"
          multiple
          :auto-upload="true"
          accept=".png, .jpg, .jpeg, .gif"
          list-type="picture-card"
          :on-exceed="handleExceed"
          :http-request="httpRequest"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="新闻内容" required>
        <div id="editorjs" ref="editorRef" class="editor-container"></div>
      </el-form-item>
    </el-form>

    <el-card class="preview-card" shadow="never">
      <div class="preview-header">
        <span>新闻预览</span>
        <el-tag type="success" size="small">实时更新</el-tag>
      </div>
      <div class="preview-content" v-html="previewHtml"></div>
    </el-card>

    <div class="action-buttons">
      <el-button @click="resetForm" type="info" size="large" plain>
        <el-icon><Refresh /></el-icon> 重置
      </el-button>
      <el-button @click="publishNews" type="primary" size="large">
        <el-icon><Promotion /></el-icon> 发布新闻
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import Embed from "@editorjs/embed";
import {
  ElMessage,
  ElMessageBox,
  FormInstance,
  UploadProps,
  UploadRawFile,
  UploadRequestOptions,
  UploadUserFile,
} from "element-plus";
import { Refresh, Promotion, Plus } from "@element-plus/icons-vue";

import { serverNewsAdd, serverAddNewsPhotoUploadTempFiles, serverDeleteNewsPhotoUploadTempFiles } from "@/server/News";
import router from "@/router";
import { getUserID } from "@/cookies/user";
import { isAdmin } from "@/cookies/user";
import { IServerNews } from "@/server/ServerType";

const formRef = ref<FormInstance>();
const fileList = ref<UploadUserFile[]>([]);
const editorRef = ref<HTMLElement | null>(null);
const editorInstance = ref<EditorJS | null>(null);
const previewHtml = ref("<div class='preview-placeholder'>编辑内容后，此处将显示预览</div>");
const editorData = ref<OutputData | null>(null);

const form = reactive<IServerNews>({
  id: 0,
  createDateTime: new Date(),
  title: "",
  brief: "",
  contentJson: "",
  contentHtml: "",
  titlePhoto: "",
  sysUserId: getUserID() || 0,
});

// 初始化编辑器
const initEditor = async () => {
  if (editorInstance.value) {
    editorInstance.value.destroy();
  }

  editorInstance.value = new EditorJS({
    holder: "editorjs",
    placeholder: "请输入新闻内容...",

    onReady: () => {
      console.log("Editor.js 已就绪");
    },

    tools: {
      header: {
        class: Header as any,
        config: {
          placeholder: "输入标题...",
          levels: [1, 2, 3, 4],
          defaultLevel: 2,
        },
      },
      image: {
        class: ImageTool,
        config: {
          uploader: {
            async uploadByFile(file: File) {
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  resolve({
                    success: 1,
                    file: {
                      url: e.target?.result as string, // 直接返回Base64数据
                    },
                  });
                };
                reader.readAsDataURL(file); // 读取文件为Base64
              });
            },
            async uploadByUrl(url: string) {
              // 可选：处理URL上传（根据需求实现）
              return { success: 0 };
            },
          },
        },
      },
      paragraph: {
        class: Paragraph as any,
        inlineToolbar: true,
        // config: {
        //   defaultAlignment: "left",
        // },
      },
      // list: {
      //   class: List as any,
      //   inlineToolbar: true,
      //   config: {
      //     defaultStyle: "unordered",
      //   },
      // },
      // quote: {
      //   class: Quote,
      //   inlineToolbar: true,
      //   config: {
      //     quotePlaceholder: "输入引用内容...",
      //     captionPlaceholder: "引用来源",
      //     defaultAlignment: "left",
      //   },
      // },
      delimiter: Delimiter,
      embed: Embed as any,
    },

    onChange: async () => {
      await saveEditorContent();
    },
  });
};

// 保存编辑器内容并更新预览
const saveEditorContent = async (): Promise<void> => {
  if (editorInstance.value) {
    try {
      const outputData = await editorInstance.value.save();
      editorData.value = outputData;
      form.contentJson = JSON.stringify(outputData);
      form.contentHtml = convertToHtml(outputData);
      previewHtml.value = form.contentHtml;
    } catch (error) {
      console.error("保存编辑器内容时出错:", error);
      ElMessage.error("保存内容失败");
    }
  }
};

// 上传图片到服务器
const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const ret = await serverAddNewsPhotoUploadTempFiles(formData);
    if (ret && ret.code === 200 && ret.data) {
      return ret.data;
    } else {
      throw new Error("图片上传失败");
    }
  } catch (error) {
    console.error("图片上传失败:", error);
    throw error;
  }
};

// 将编辑器内容转换为HTML
const convertToHtml = (data: OutputData): string => {
  if (!data || !data.blocks) return "";

  let htmlContent = "";

  data.blocks.forEach((block) => {
    switch (block.type) {
      case "header":
        htmlContent += `<h${block.data.level} class="content-header">${block.data.text}</h${block.data.level}>`;
        break;
      case "paragraph":
        htmlContent += `<p class="content-paragraph">${block.data.text}</p>`;
        break;
      case "image":
        htmlContent += `<div class="image-block"><img src="${block.data.file.url}" alt="${block.data.caption || ""}" class="content-image">`;
        if (block.data.caption) {
          htmlContent += `<p class="image-caption">${block.data.caption}</p>`;
        }
        htmlContent += `</div>`;
        break;
      case "list":
        const tag = block.data.style === "ordered" ? "ol" : "ul";
        htmlContent += `<${tag} class="content-list">`;
        block.data.items.forEach((item: string) => {
          htmlContent += `<li>${item}</li>`;
        });
        htmlContent += `</${tag}>`;
        break;
      case "quote":
        htmlContent += `<blockquote class="quote-block">${block.data.text}`;
        if (block.data.caption) {
          htmlContent += `<cite class="quote-cite">${block.data.caption}</cite>`;
        }
        htmlContent += `</blockquote>`;
        break;
      case "code":
        htmlContent += `<pre class="code-pre"><code class="code-block">${block.data.code}</code></pre>`;
        break;
      case "table":
        htmlContent += `<div class="table-container"><table class="content-table"><tbody>`;
        block.data.content.forEach((row: string[], rowIndex: number) => {
          htmlContent += `<tr>`;
          row.forEach((cell: string) => {
            const tag = rowIndex === 0 ? "th" : "td";
            htmlContent += `<${tag}>${cell}</${tag}>`;
          });
          htmlContent += `</tr>`;
        });
        htmlContent += `</tbody></table></div>`;
        break;
      case "delimiter":
        htmlContent += `<hr class="delimiter">`;
        break;
      case "embed":
        htmlContent += `<div class="embed-block">${block.data.embed}</div>`;
        break;
      default:
        htmlContent += `<div class="block-${block.type}">[${block.type} 内容块]</div>`;
    }
  });

  return htmlContent;
};

// 发布新闻
const publishNews = async (): Promise<void> => {
  const userId = getUserID();
  if (!userId) {
    ElMessageBox.alert("请先登录", "提示", {
      confirmButtonText: "确定",
      callback: () => router.push("/login"),
    });
    return;
  }

  if (!form.title) {
    ElMessage.warning("请输入标题");
    return;
  }

  if (!form.contentHtml) {
    ElMessage.warning("请输入内容");
    return;
  }

  try {
    // 确保获取最新的编辑器内容
    await saveEditorContent();

    // 更新表单数据
    const newsData: IServerNews = {
      ...form,
      sysUserId: userId,
      createDateTime: new Date(),
      contentJson: form.contentJson,
      contentHtml: form.contentHtml,
    };

    console.log("发布数据:", newsData);
    await serverNewsAdd(newsData);
    ElMessage.success("新闻发布成功");
    router.push("/manager-news");
  } catch (error) {
    console.error("发布失败:", error);
    ElMessage.error("新闻发布失败");
  }
};

// 重置表单和编辑器
const resetForm = async () => {
  // 重置表单数据
  Object.assign(form, {
    title: "",
    brief: "",
    contentJson: "",
    contentHtml: "",
    titlePhoto: "",
  });

  // 重置图片上传
  fileList.value = [];

  // 重置编辑器
  if (editorInstance.value) {
    editorInstance.value.clear();
    editorData.value = null;
  }

  // 重置预览
  previewHtml.value = "<div class='preview-placeholder'>编辑内容后，此处将显示预览</div>";

  ElMessage.success("表单已重置");
};

const handleRemove: UploadProps["onRemove"] = async (uploadFile, uploadFiles) => {
  if (form.titlePhoto) {
    const formData = new FormData();
    formData.append("fileName", form.titlePhoto);

    try {
      const ret = await serverDeleteNewsPhotoUploadTempFiles(formData);
      if (ret && ret.code == 200 && ret.data) {
        ElMessage.success("图片删除成功");
        form.titlePhoto = "";
      } else {
        ElMessage.error("图片删除失败");
      }
    } catch (error) {
      console.error("删除图片失败:", error);
      ElMessage.error("图片删除失败");
    }
  }
};

const handleExceed: UploadProps["onExceed"] = () => {
  ElMessage.warning("最多只能上传一张标题图片");
};

const httpRequest = async (options: UploadRequestOptions) => {
  const fileObj = options.file;

  const formData = new FormData();
  formData.append("file", fileObj);

  try {
    const ret = await serverAddNewsPhotoUploadTempFiles(formData);
    if (ret && ret.code == 200 && ret.data) {
      form.titlePhoto = ret.data;
      ElMessage.success("图片上传成功");
    } else {
      ElMessage.error("图片上传失败");
    }
  } catch (error) {
    console.error("图片上传失败:", error);
    ElMessage.error("图片上传失败");
  }
};

onMounted(() => {
  if (!isAdmin()) {
    ElMessage.warning("您没有权限访问此页面");
    router.push("/login");
    return;
  }

  nextTick(() => {
    initEditor();
  });
});
</script>

<style scoped>
.news-publish-container {
  text-align: left;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

h1 {
  text-align: center;
  color: #1a365d;
  margin-bottom: 30px;
  font-weight: 600;
  font-size: 28px;
}

.editor-container {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  min-height: 400px;
  background-color: white;
  transition: border-color 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.editor-container:hover {
  border-color: #cbd5e0;
}

.preview-card {
  margin-top: 30px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f2f5;
  font-weight: 600;
  color: #1a365d;
}

.preview-content {
  padding: 25px;
  min-height: 300px;
  text-align: left;
  background-color: #f9fafb;
  border-radius: 0 0 12px 12px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

/* 预览内容样式 */
.content-header {
  color: #1a365d;
  margin: 25px 0 15px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
}

.content-paragraph {
  line-height: 1.8;
  margin-bottom: 15px;
  color: #4a5568;
}

.image-block {
  margin: 20px 0;
  text-align: center;
}

.content-image {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.image-caption {
  text-align: center;
  font-style: italic;
  color: #718096;
  margin-top: 8px;
}

.content-list {
  margin: 15px 0;
  padding-left: 25px;
}

.content-list li {
  margin-bottom: 8px;
}

.quote-block {
  background-color: #f8fafc;
  border-left: 4px solid #4299e1;
  padding: 15px 20px;
  margin: 20px 0;
  font-style: italic;
  color: #4a5568;
}

.quote-cite {
  display: block;
  margin-top: 10px;
  color: #718096;
}

.code-pre {
  background-color: #2d3748;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 20px 0;
}

.table-container {
  overflow-x: auto;
  margin: 20px 0;
}

.content-table {
  width: 100%;
  border-collapse: collapse;
}

.content-table th,
.content-table td {
  border: 1px solid #cbd5e0;
  padding: 12px;
  text-align: left;
}

.content-table th {
  background-color: #edf2f7;
  font-weight: 600;
}

.delimiter {
  border: none;
  border-top: 2px dashed #cbd5e0;
  margin: 30px 0;
}

.preview-placeholder {
  text-align: center;
  color: #a0aec0;
  padding: 40px 0;
  font-style: italic;
}

::v-deep(.editor-container) {
  /* 文字居左 */
  .codex-editor__redactor {
    padding-left: 70px;
  }
  .ce-block__content {
    max-width: 100%;
    margin: 0px;
    text-align: left;
  }
  .ce-toolbar__content {
    max-width: 100%;
    margin: 0;
    position: relative;
  }
  .ce-toolbar__actions {
    position: absolute;
    left: 0;
    right: unset;
  }

  /* 图片居中 */
  .image-tool {
    text-align: center;
  }
  .image-tool__image img {
    margin: 0 auto;
  }
}

::v-deep(.preview-content) {
  .image-block {
    text-align: center;
  }
}
</style>
