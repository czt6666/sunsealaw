<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  nextTick,
  getCurrentInstance,
  PropType,
  watch,
  shallowRef,
} from "vue";

import { registerDragonSupport } from "@lexical/dragon";
import { createEmptyHistoryState, registerHistory } from "@lexical/history";
import { mergeRegister } from "@lexical/utils";
import { HeadingNode, QuoteNode, registerRichText } from "@lexical/rich-text";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $setBlocksType,
} from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";

import { ElMessage, ElMessageBox } from "element-plus";
import Divider from "./Divider";

import {
  createEditor,
  $getRoot,
  $getSelection,
  $createRangeSelection,
  $setSelection,
  $createParagraphNode,
  $getNodeByKey,
  $createTextNode,
  $isRangeSelection,
  $getNearestNodeFromDOMNode,
  $isTextNode,
  $insertNodes,
  createCommand,
  LexicalCommand,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  CUT_COMMAND,
  COPY_COMMAND,
  PASTE_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  KEY_DOWN_COMMAND,
  TextNode,
  ElementNode,
  LexicalNode,
  Klass,
  RangeSelection,
} from "lexical";

import { $isTableNode, $isTableSelection } from "@lexical/table";

import PlaygroundEditorTheme from "./PlaygroundEditorTheme";

import ColorDropdown from "../dropdown/ColorDropdown.vue";

import FindReplaceDialog from "./FindReplaceDialog.vue";

import { escapeRegExp } from "lodash";

import FontDropdown from "@/components/dropdown/FontDropdown.vue";
import DocumentStyleDropdown from "../dropdown/DocumentStyleDropdown.vue";
import FontSizeDropdown from "../dropdown/FontSizeDropdown.vue";

const props = defineProps({});

const fontButtonRef = ref<HTMLDivElement | null>(null);
const showFontOptionsDropDown = ref(false);
const fontSizeButtonRef = ref<HTMLDivElement | null>(null);
const showFontSizeOptionsDropDown = ref(false);
const documentStyleButtonRef = ref<HTMLDivElement | null>(null);
const showDocumentStyleOptionsDropDown = ref(false);

const textColorButtonRef = ref<HTMLDivElement | null>(null);
const textBackgroundColorButtonRef = ref<HTMLDivElement | null>(null);
const showTextColorOptionsDropDown = ref(false);
const showTextBackgroundColorOptionsDropDown = ref(false);
const color = ref("#000000");
const colorBackground = ref("#ffffff");
const fontfamily = ref("Arial");
const fontsize = ref(12);
const documentStyle = ref("Normal");
//编辑器状态

//编辑器配置

const savedSelection = shallowRef(null);

onMounted(async () => {
  //setText(props.content + "");
});

//event
const emit = defineEmits<{
  (e: "onContentChanged", text: string): void;
  (e: "onContentChangedJson", jsonText: string): void;
  (e: "onContentChangedHtml", text: string): void;
}>();

const findReplaceDialogVisible = ref(false);
const showReplaceArea = ref(false);

const PlaygroundNodes: Array<Klass<LexicalNode>> = [HeadingNode];

const editorConfig = {
  namespace: "LexicalRichTextEditor", // 添加唯一的 namespace
  theme: PlaygroundEditorTheme,
  editable: true,
  nodes: [...PlaygroundNodes],

  onError(error: Error) {
    throw error;
  },
};
const LowPriority = 1;
const canEditorUndo = ref(false);
const canEditorRedo = ref(false);

const canFileOpen = ref(false);
const canFileSaveAsText = ref(false);

const canEditorCut = ref(false);
const canEditorCopy = ref(false);
const canEditorPaste = ref(false);

const canDelete = ref(false);
const canDeleteAll = ref(false);
const canFind = ref(false);
const canReplace = ref(false);
const canFont = ref(false);
const canFontSizeInc = ref(false);
const canFontSizeDec = ref(false);
const canBold = ref(false);
const canItalic = ref(false);
const canUnderline = ref(false);
const canStrikethrough = ref(false);
const isBold = ref(false);
const isItalic = ref(false);
const isUnderline = ref(false);
const isStrikethrough = ref(false);

const FILE_OPEN_COMMAND: LexicalCommand<string> = createCommand();
const FILE_SAVE_AS_TEXT_COMMAND: LexicalCommand<string> = createCommand();

const DELETE_COMMAND: LexicalCommand<string> = createCommand();
const DELETE_ALL_COMMAND: LexicalCommand<string> = createCommand();
const FIND_COMMAND: LexicalCommand<string> = createCommand();
const REPLACE_COMMAND: LexicalCommand<string> = createCommand();

const TEXT_BOLD_COMMAND: LexicalCommand<string> = createCommand();
const TEXT_ITALIC_COMMAND: LexicalCommand<string> = createCommand();
const TEXT_UNDERLINE_COMMAND: LexicalCommand<string> = createCommand();
const TEXT_STRIKETHROUGH_COMMAND: LexicalCommand<string> = createCommand();
const TEXT_FONT_COMMAND: LexicalCommand<string> = createCommand();
const TEXT_DOC_STYLE_COMMAND: LexicalCommand<string> = createCommand();
const FONT_SIZE_COMMAND: LexicalCommand<number> = createCommand();
const FONT_SIZE_INC_COMMAND: LexicalCommand<string> = createCommand();
const FONT_SIZE_DEC_COMMAND: LexicalCommand<string> = createCommand();
const TEXT_COLOR_COMMAND: LexicalCommand<string> = createCommand();
const TEXT_BACKGROUND_COLOR_COMMAND: LexicalCommand<string> = createCommand();

const searchText = ref<string>("");
const replaceText = ref<string>("");
/**
 * 更新工具栏
 */
const updateToolbar = () => {
  const selection = $getSelection();
  // 判断是否为有效选区且非空
  const hasValidSelection =
    $isRangeSelection(selection) && !selection.isCollapsed();

  canEditorCut.value = hasValidSelection;
  canEditorCopy.value = hasValidSelection;
  canDelete.value = hasValidSelection;

  canDeleteAll.value = $getRoot().getTextContent().length > 0;
  canFind.value = canDeleteAll.value;
  canReplace.value = canDeleteAll.value;
  if ($isRangeSelection(selection) || $isTableSelection(selection)) {
    isBold.value = selection?.hasFormat("bold");
    isItalic.value = selection?.hasFormat("italic");
    isUnderline.value = selection?.hasFormat("underline");
    isStrikethrough.value = selection?.hasFormat("strikethrough");

    fontfamily.value = $getSelectionStyleValueForProperty(
      selection,
      "font-family",
      "Arial"
    );
    fontsize.value = parseInt(
      $getSelectionStyleValueForProperty(selection, "font-size", "15px")
    );
    color.value = $getSelectionStyleValueForProperty(
      selection,
      "color",
      "#000"
    );
    colorBackground.value = $getSelectionStyleValueForProperty(
      selection,
      "background-color",
      "#fff"
    );
  }
};

const editor = createEditor(editorConfig);

const setCanPaste = async () => {
  canEditorPaste.value = !(await isClipboardEmpty());
  //console.log("canEditorPaste", canEditorPaste.value);

  // 从剪贴板读取内容
  // navigator.clipboard.readText().then((text) => {
  // 插入到当前选区位置
  //  canEditorPaste.value = true;
  //});
};

//獲得焦点
const onFocus = async () => {
  canFileOpen.value = true;
  canFileSaveAsText.value = true;

  // 从剪贴板读取内容
  await setCanPaste();
  canFont.value = true;
  canFontSizeInc.value = true;
  canFontSizeDec.value = true;

  canBold.value = true;
  canItalic.value = true;
  canUnderline.value = true;
  canStrikethrough.value = true;

  // handleFocus();
};

//失去焦点
const onBlur = () => {
  //canFileOpen.value = false;
  //canFileSaveAsText.value = false;
  //canEditorPaste.value = false;
  // canDeleteAll.value = false;
};

const applyTextStyle = (
  styles: Record<string, string>,
  skipHistoryStack?: boolean
) => {
  editor.update(
    () => {
      const selection = $getSelection();
      console.log(selection);

      if (selection !== null) {
        console.log("applyTextStyle", styles);
        $patchStyleText(selection, styles);
      }
    },
    skipHistoryStack ? { tag: "historic" } : {}
  );
};

let unregisterMergeListener: (() => void) | undefined;

const documentDirty = ref(false);

async function isClipboardEmpty() {
  // 优先使用 Clipboard API
  if (navigator.clipboard) {
    try {
      const text = await navigator.clipboard.readText();
      //console.log("Clipboard API 访问成功，剪贴板内容：", text);
      return text.trim() === "";
    } catch (error) {
      //console.warn("Clipboard API 访问失败，尝试备用方案");
    }
  }

  // 备用方案：创建临时输入框
  return new Promise((resolve) => {
    const tempInput = document.createElement("input");
    tempInput.style.position = "fixed";
    tempInput.style.opacity = "0";

    tempInput.addEventListener("paste", (e) => {
      if (e && e.clipboardData) {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain").trim();
        document.body.removeChild(tempInput);
        resolve(text === "");
      }
    });

    document.body.appendChild(tempInput);
    tempInput.focus();
    document.execCommand("paste");
  });
}

function prepopulatedRichText() {
  const root = $getRoot();

  root.clear();

  const paragraph = $createParagraphNode();
  paragraph.append(
    $createTextNode("This is a demo environment built with "),
    $createTextNode("lexical").toggleFormat("code"),
    $createTextNode("."),
    $createTextNode(" Try typing in "),
    $createTextNode("some text").toggleFormat("bold"),
    $createTextNode(" with ").setStyle("color: red"),
    $createTextNode("different").toggleFormat("italic"),
    $createTextNode(" formats.")
  );
  root.append(paragraph);
}

onMounted(() => {
  //  insert();
  const contentEditableElement = document.getElementById("richtexteditor");

  editor.setRootElement(contentEditableElement);

  // Registring Plugins
  unregisterMergeListener = mergeRegister(
    registerRichText(editor),
    registerDragonSupport(editor),
    registerHistory(editor, createEmptyHistoryState(), 300),
    editor.registerRootListener((rootElement) => {
      if (rootElement) {
        rootElement.addEventListener("focus", onFocus);
        rootElement.addEventListener("blur", onBlur);
      }
    }),
    editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        editorState.read(() => {
          updateToolbar();
        });

        const json = editorState.toJSON();
        emit("onContentChangedJson", JSON.stringify(json));

        const html = convertToHtml();
        emit("onContentChangedHtml", html);

        // 检查是否有实际内容变更（避免光标移动等无关操作）
        if (dirtyElements.size > 0 || dirtyLeaves.size > 0) {
          //  const currentState = editor.getEditorState();
          // const currentText = currentState.read(() =>
          //   $getRoot().getTextContent()
          // );

          // console.log("内容已修改:", currentText);
          documentDirty.value = true;
        }
      }
    ),
    editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        //    console.log("SELECTION_CHANGE_COMMAND");
        editor.read(() => {
          updateToolbar();
          //  const currentSelection = $getSelection();
          // savedSelection.value = currentSelection?.clone() || null;
          //   console.log("selection", currentSelection);
        });

        return false;
      },
      LowPriority
    ),

    editor.registerCommand(
      FILE_OPEN_COMMAND,
      (payload) => {
        onFileOpen();

        return true; // Return true to stop propagation.
      },
      LowPriority
    ),

    editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload: boolean) => {
        canEditorUndo.value = payload;
        return false;
      },
      LowPriority
    ),
    editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload: boolean) => {
        canEditorRedo.value = payload;
        return false;
      },
      LowPriority
    ),
    // Cut, Copy, Paste
    editor.registerCommand(
      CUT_COMMAND,
      (event: ClipboardEvent | null) => {
        //   console.log("CUT_COMMAND");
        //   if (!event) return false;
        //   console.log("event", event);
        //  event.preventDefault();

        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;

        // 1. 复制内容到剪贴板
        const textContent = selection.getTextContent();
        // console.log("textContent", textContent);
        if (!textContent) return false;
        //  if (event) {
        //  event.clipboardData?.setData("text/plain", textContent);
        //  }

        navigator.clipboard.writeText(textContent);

        // 2. 删除选区内容
        selection.removeText();

        return true; // Return true to stop propagation.
      },
      LowPriority
    ),
    editor.registerCommand(
      COPY_COMMAND,
      (event: ClipboardEvent | null) => {
        //if (!event) return false;
        // 阻止默认复制行为
        //event.preventDefault();

        // 获取当前选区
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;

        // 将选区内容序列化为文本（或自定义格式）
        const textContent = selection.getTextContent();
        if (!textContent) return false;

        // 写入剪贴板（使用 Clipboard API）
        navigator.clipboard.writeText(textContent);

        return true;
      },
      // 优先级（数字越小优先级越高）
      LowPriority
    ),
    editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent | null) => {
        // console.log("PASTE_COMMAND");
        if (!event) return false;
        event.preventDefault();

        //console.log("event", event);

        // 从剪贴板读取内容
        navigator.clipboard.readText().then((text) => {
          // 插入到当前选区位置
          // console.log("text", text);
          editor.update(() => {
            const selection = $getSelection();

            // 删除当前选区内容
            if (selection !== null) {
              selection.insertRawText(text);
            }
            /*
            // 分割多行文本
            const lines = text.split("\n");

            lines.forEach((line, index) => {
              // 创建段落节点
              const paragraph = $createParagraphNode();
              paragraph.append($createTextNode(line));

              // 插入到编辑器
              selection.append(paragraph);
            });*/
          });
        });

        return true;
      },
      LowPriority
    ),

    editor.registerCommand(
      DELETE_COMMAND,
      (payload: string) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;

        // 2. 删除选区内容
        selection.removeText();

        return true; // Return true to stop propagation.
      },
      LowPriority
    ),
    editor.registerCommand(
      DELETE_ALL_COMMAND,
      (payload: string) => {
        editor.update(() => {
          // Get the RootNode from the EditorState
          const root = $getRoot();

          root.clear();
        });

        return true; // Return true to stop propagation.
      },
      LowPriority
    ),

    // 查找
    editor.registerCommand(
      FIND_COMMAND,
      (payload: string) => {
        editor.update(() => {
          // Get the RootNode from the EditorState
          findReplaceDialogVisible.value = true;
          showReplaceArea.value = false;
        });

        return true; // Return true to stop propagation.
      },
      LowPriority
    ),
    //替换
    editor.registerCommand(
      REPLACE_COMMAND,
      (payload: string) => {
        editor.update(() => {
          // Get the RootNode from the EditorState
          findReplaceDialogVisible.value = true;
          showReplaceArea.value = true;
        });

        return true; // Return true to stop propagation.
      },
      LowPriority
    ),
    //字体
    editor.registerCommand(
      TEXT_FONT_COMMAND,
      (fontfamily: string) => {
        editor.update(() => {
          // Get the RootNode from the EditorState
          showFontOptionsDropDown.value = false;
          applyTextStyle({ "font-family": fontfamily });
        });

        return true; // Return true to stop propagation.
      },
      LowPriority
    ),
    //字体大小
    editor.registerCommand(
      FONT_SIZE_COMMAND,
      (fontsize: number) => {
        editor.update(() => {
          // Get the RootNode from the EditorState
          showFontSizeOptionsDropDown.value = false;
          applyTextStyle({ "font-size": fontsize + "px" });
        });

        return true; // Return true to stop propagation.
      },
      LowPriority
    ),
    //样式
    editor.registerCommand(
      TEXT_DOC_STYLE_COMMAND,
      (payload: string) => {
        editor.update(() => {
          const selection = $getSelection();
          // Get the RootNode from the EditorState
          showDocumentStyleOptionsDropDown.value = false;
          documentStyle.value = payload;

          if (payload === "Normal")
            $setBlocksType(selection, () => $createParagraphNode());
          else if (payload === "Heading 1") {
            console.log("documentStyle 1");
            $setBlocksType(selection, () => $createHeadingNode("h1"));
          } else if (payload === "Heading 2")
            $setBlocksType(selection, () => $createHeadingNode("h2"));
          else if (payload === "Heading 3")
            $setBlocksType(selection, () => $createHeadingNode("h3"));
        });

        return true; // Return true to stop propagation.
      },
      LowPriority
    ),
    //增加字体大小
    editor.registerCommand(
      FONT_SIZE_INC_COMMAND,
      (payload) => {
        editor.update(() => {
          // Get the RootNode from the EditorState

          applyTextStyle({ "font-size": fontsize.value + 2 + "px" });

          //  editorConfiguration.value.fontsize = val + "px";
        });

        return true; // Return true to stop propagation.
      },
      LowPriority
    ),
    //减小字体大小
    editor.registerCommand(
      FONT_SIZE_DEC_COMMAND,
      (payload) => {
        editor.update(() => {
          // Get the RootNode from the EditorState
          let temp = fontsize.value - 2;
          if (temp <= 5) temp = 5;
          applyTextStyle({ "font-size": temp + "px" });
          // editorConfiguration.value.fontsize = val + "px";
        });

        return true; // Return true to stop propagation.
      },
      LowPriority
    ),
    // 字体颜色
    editor.registerCommand(
      TEXT_COLOR_COMMAND,
      (payload: string) => {
        editor.update(() => {
          color.value = payload;
          showTextColorOptionsDropDown.value = false;
          applyTextStyle({ color: color.value });
          // editorConfiguration.value.textColor = payload;
        });

        return true; // Return true to stop propagation.
      },
      LowPriority
    ),
    // 背景色
    editor.registerCommand(
      TEXT_BACKGROUND_COLOR_COMMAND,
      (payload: string) => {
        editor.update(() => {
          // Get the RootNode from the EditorState
          colorBackground.value = payload;
          showTextBackgroundColorOptionsDropDown.value = false;
          applyTextStyle({ "background-color": colorBackground.value });
        });

        return true; // Return true to stop propagation.
      },
      LowPriority
    )
  );

  editor.focus();

  //editor.update(prepopulatedRichText, { tag: "history-merge" });
  editor.update(() => {
    //  prepopulatedRichText();
  });
});

const getText = () => {
  return editor.getEditorState().read(() => {
    return $getRoot().getTextContent();
  });
};

const getBrief = () => {
  const text = editor.getEditorState().read(() => {
    return $getRoot().getTextContent();
  });

  if (text.length > 100) return text.substring(0, 100) + "...";
  return text;
};

/**
 * 设置文本
 */
const setText = (content: string) => {
  editor.update(() => {
    // Get the RootNode from the EditorState
    const root = $getRoot();

    root.clear();

    // Create a new ParagraphNode
    const paragraphNode = $createParagraphNode();

    // Create a new TextNode
    const textNode = $createTextNode(content);

    // Append the text node to the paragraph
    paragraphNode.append(textNode);

    // Finally, append the paragraph to the root
    root.append(paragraphNode);
  });
};

const loadJson = (json: string) => {
  // 检查 JSON 字符串是否为空或仅包含空格
  const isEmptyJson = json.trim() === "";

  if (isEmptyJson) {
    // 如果 JSON 字符串为空或仅包含空格，不执行任何操作
    return;
  }

  editor.update(() => {
    const editorState = editor.parseEditorState(json);
    editor.setEditorState(editorState);
  });
};

const loadHtml = (htmlString: string) => {
  editor.update(() => {
    const root = $getRoot();
    root.clear();

    const parser = new DOMParser();
    const dom = parser.parseFromString(htmlString, "text/html");

    // Once you have the DOM instance it's easy to generate LexicalNodes.
    const nodes = $generateNodesFromDOM(editor, dom);

    // Select the root
    $getRoot().select();

    // Insert them at a selection.
    $insertNodes(nodes);
  });
};

const convertToJson = () => {
  return editor.getEditorState().toJSON();
};

const convertToHtml = (): string => {
  return editor.getEditorState().read(() => {
    return $generateHtmlFromNodes(editor);
  });
};

const convertToLexicalDocument = () => {
  return convertToJson();
};

function highlightTextRange(
  startPos: number, //开始位置
  endPos: number, //结束位置
  setColor: boolean, //是否设置颜色
  color: string, //颜色
  setBgColor: boolean, //是否设置背景色
  bgColor: string, //背景色
  bold: boolean, //加粗
  italic: boolean, //斜体
  underline: boolean, //下划线
  strikethrough: boolean //删除线
): void {
  editor.update(() => {
    const root = $getRoot();
    const textNodes: TextNode[] = [];

    // 收集所有段落中的文本节点（假设无嵌套）
    root.getChildren().forEach((paragraph) => {
      if (paragraph instanceof ElementNode) {
        paragraph.getChildren().forEach((node) => {
          if (node instanceof TextNode) {
            textNodes.push(node);
          }
        });
      }
    });

    // 边界检查
    const totalLength = textNodes.reduce(
      (acc, node) => acc + node.getTextContent().length,
      0
    );
    if (startPos < 0 || endPos > totalLength || startPos > endPos) {
      console.error("无效的位置范围");
      return;
    }

    let currentPos = 0;
    let startNode: TextNode | null = null;
    let startOffset = 0;
    let endNode: TextNode | null = null;
    let endOffset = 0;

    // 遍历定位节点
    for (const node of textNodes) {
      const text = node.getTextContent();
      const nodeLength = text.length;
      const nodeStart = currentPos;
      const nodeEnd = currentPos + nodeLength;

      // 计算起始位置
      if (startNode === null && nodeEnd >= startPos) {
        startNode = node;
        startOffset = Math.max(0, startPos - nodeStart);
      }

      // 计算结束位置
      if (endNode === null && nodeEnd >= endPos) {
        endNode = node;
        endOffset = Math.max(0, endPos - nodeStart);
        break;
      }

      currentPos = nodeEnd;
    }

    // 创建选区
    if (startNode && endNode) {
      const rangeSelection: RangeSelection = $createRangeSelection();
      rangeSelection.anchor.set(startNode.getKey(), startOffset, "text");
      rangeSelection.focus.set(endNode.getKey(), endOffset, "text");
      $setSelection(rangeSelection);

      // 应用前景色样式
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (setColor) $patchStyleText(selection, { color: color });
        if (setBgColor)
          $patchStyleText(selection, { "background-color": bgColor });
        if (bold) $patchStyleText(selection, { "font-weight": "bold" });
        if (italic) $patchStyleText(selection, { "font-style": "italic" });
        if (underline)
          $patchStyleText(selection, { "text-decoration": "underline" });
        if (strikethrough)
          $patchStyleText(selection, { "text-decoration": "line-through" });
      }
    } else {
      console.error("无法定位文本节点");
    }
  });
}

/**
 * 清除文本
 */
const clearText = () => {
  editor.update(() => {
    // Get the RootNode from the EditorState
    const root = $getRoot();

    root.clear();
  });
};

/**
 * 在指定行号后面插入文本
 * @param beginLineNo 行号，从1开始计数
 * @param newText 插入的文本
 */
function insertText(beginLineNo: number, newText: string) {
  let text = getText();
  let beginIndex = 0;
  let index = 0;
  let line = 0;
  while (index >= 0 && index < text.length) {
    if (line == beginLineNo) {
      beginIndex = index;
      break;
    }
    index = text.indexOf("\n", index);
    if (index >= 0) {
      index++;
      line++;
    } else {
      beginIndex = text.length;
      break;
    }
  }

  //插入的是新行。如果插在最后面的话，需要判断最后的结尾有无\n
  if (beginIndex == text.length) {
    if (text.substring(text.length - 1) != "\n") text = text + "\n";
  }
  text = text.substring(0, beginIndex) + newText + text.substring(beginIndex);

  setText(text);
}

const undo = () => {
  editor.dispatchCommand(UNDO_COMMAND, undefined);
};

const redo = () => {
  editor.dispatchCommand(REDO_COMMAND, undefined);
};

const canRedo = computed(() => {
  return canEditorRedo.value;
});

const canUndo = computed(() => {
  return canEditorUndo.value;
});

onUnmounted(() => {
  unregisterMergeListener?.();
});

const filePath = ref("");
const fileOpenRef = ref<HTMLTextAreaElement>();
/**
 * 打开文件
 */
const onFileOpen = () => {
  if (fileOpenRef.value) {
    fileOpenRef.value.dispatchEvent(new MouseEvent("click"));
  }
};
const fileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  const reader = new FileReader();
  if (
    /*
    file.name.includes(".txt") ||
    file.name.includes(".csc") ||
    file.name.includes(".c") ||
    file.name.includes(".cc") ||
    file.name.includes(".cpp") ||
    file.name.includes(".cxx") ||
    file.name.includes(".h") ||
    file.name.includes(".hpp") ||
    file.name.includes(".hxx") ||
    file.name.includes(".java") ||
    file.name.includes(".js") ||
    file.name.includes(".m") ||
    file.name.includes(".mm") ||
    file.name.includes(".php") ||
    file.name.includes(".py") ||
    file.name.includes(".ps1") ||
    file.name.includes(".rb") ||
    file.name.includes(".swift") ||
    file.name.includes(".ts") ||
    file.name.includes(".tsx") ||
    file.name.includes(".sh") ||
    file.name.includes(".vue")*/
    true
  ) {
    //文件加载完成后的回调函数
    reader.onload = () => {
      clearText();
      setText(reader.result + "");
    };

    //读取文件
    if (file) {
      //  const encoding = await chardet.detectFile(file);
      //  if (encoding) reader.readAsText(file, encoding);
      //  else reader.readAsText(file, "utf-8");
      reader.readAsText(file, "utf-8");
    }
  } else {
    ElMessageBox.alert("Only txt files can be opened", "warning", {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: "OK",
    });
    return;
  }
};

const onFindReplaceDilalogOk = () => {
  findReplaceDialogVisible.value = false;
};
const onFindReplaceDilalogCancel = () => {
  findReplaceDialogVisible.value = false;
};

const instance = getCurrentInstance();
const forceUpdate = () => instance?.proxy?.$forceUpdate();

const showDialog = ref<boolean>(false); //查找对话框

/**
 * 查找下一个
 */
const onEditFind = async (searchText: string, options: ISearchOptions) => {
  findNext(searchText, options);
  forceUpdate();
};

/**
 * 查找下一个
 */
const onEditFindNext = (searchText: string, options: ISearchOptions) => {
  findNext(searchText, options);
  forceUpdate();
};
/**
 * 查找上一个
 */
const onEditFindPrevious = (searchText: string, options: ISearchOptions) => {
  findPrevious(searchText, options);
  forceUpdate();
};

interface MatchResult {
  node: TextNode;
  start: number;
  end: number;
}

import { ISearchOptions } from "@/components/lexical/FindReplaceDialog.vue";

let searchResults = ref<MatchResult[]>([]);
let currentMatchIndex = ref(-1);
let lastSearchQuery = ref("");
let lastOptions = ref<ISearchOptions>({});

function shallowEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (!(a instanceof Object) || !(b instanceof Object)) return false;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (!(key in b)) return false;
    if (a[key] !== b[key]) return false;
  }

  return true;
}
/**
 * 查找文本
 * @param query
 * @param options
 */
function searchNodes(query: string, options: ISearchOptions): MatchResult[] {
  const matches: MatchResult[] = [];
  // const regExp = options.regex
  //  ? new RegExp(query, options.caseSensitive ? "g" : "gi")
  //  : new RegExp(escapeRegExp(query), options.caseSensitive ? "g" : "gi");

  editor.getEditorState().read(() => {
    const root = $getRoot();
    root.getAllTextNodes().forEach((node: TextNode) => {
      const text = node.getTextContent();
      let match;

      // 为每个节点创建独立的正则实例
      const regExp = new RegExp(
        options.regex ? query : escapeRegExp(query),
        options.caseSensitive ? "g" : "gi"
      );

      while ((match = regExp.exec(text)) !== null) {
        matches.push({
          node,
          start: match.index,
          end: match.index + match[0].length,
        });
      }
    });
  });

  return matches;
}

/**
 * 查找下一个
 * @param query
 * @param options
 */
function findNext(query: string, options: ISearchOptions = {}) {
  //console.log(content.value);
  searchResults.value = searchNodes(query, options);
  if (searchResults.value.length === 0) return;
  //console.log(searchResults);
  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const focusNode = selection.focus.getNode();

      if ($isTextNode(anchorNode)) {
        //  console.log("起始节点文本:", anchorNode.getTextContent());
        // console.log("起始偏移量:", selection.anchor.offset);
      }

      if ($isTextNode(focusNode)) {
        //  console.log("结束节点文本:", focusNode.getTextContent());
        //  console.log("结束偏移量:", selection.focus.offset);
      }

      //当前选择节点的下一个节点
      let nextNodeIndex = -1;
      for (let i = 0; i < searchResults.value.length; i++) {
        if (searchResults.value[i].start >= selection.focus.offset) {
          nextNodeIndex = i;
          break;
        }
      }
      if (nextNodeIndex != -1) currentMatchIndex.value = nextNodeIndex;
      else currentMatchIndex.value = 0;
      console.log(currentMatchIndex);
      highlightMatch(searchResults.value[currentMatchIndex.value]);
    } else {
      console.log("selection:", selection);
    }
  });
}

/**
 * 查找上一个
 */
function findPrevious(query: string, options: ISearchOptions = {}) {
  searchResults.value = searchNodes(query, options);
  if (searchResults.value.length === 0) return;

  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const focusNode = selection.focus.getNode();

      if ($isTextNode(anchorNode)) {
        //  console.log("起始节点文本:", anchorNode.getTextContent());
        //  console.log("起始偏移量:", selection.anchor.offset);
      }

      if ($isTextNode(focusNode)) {
        //  console.log("结束节点文本:", focusNode.getTextContent());
        // console.log("结束偏移量:", selection.focus.offset);
      }

      //当前选择节点的下一个节点
      let nextNodeIndex = -1;
      for (let i = searchResults.value.length - 1; i >= 0; i--) {
        if (searchResults.value[i].end <= selection.anchor.offset) {
          nextNodeIndex = i;
          break;
        }
      }
      if (nextNodeIndex != -1) currentMatchIndex.value = nextNodeIndex;
      else currentMatchIndex.value = searchResults.value.length - 1;
      highlightMatch(searchResults.value[currentMatchIndex.value]);
    } else {
      // console.log("selection:", selection);
    }
  });
}

/**
 * 高亮匹配
 * @param match
 */
function highlightMatch(match: MatchResult) {
  // console.log(match);
  editor.update(() => {
    const { node, start, end } = match;

    if (!(node instanceof TextNode)) {
      // 根据实际类型调整
      //  console.error("Invalid node type");
      return;
    }
    const domElement1 = editor.getElementByKey(node.getKey());
    if (!domElement1) {
      // 确保DOM元素存在
      // console.error("domElement1 not exists");
      return;
    }

    const domElement = editor.getElementByKey(node.getKey());
    if (!domElement) {
      // 确保DOM元素存在
      //   console.error("domElement not exists");
      return;
    }

    const domNode = $getNearestNodeFromDOMNode(domElement);

    if (domNode && domNode.isAttached()) {
      const rangeSelection = $createRangeSelection();
      rangeSelection.anchor.set(domNode.__key, start, "text");
      rangeSelection.focus.set(domNode.__key, end, "text");
      $setSelection(rangeSelection);
    }
  });
}

/**
 * 移动光标到指定位置
 * @param targetKey - 目标节点 key
 * @param targetOffset - 目标偏移量
 * @param focusEditor - 是否聚焦编辑器（默认 true）
 */
function moveCursorToPosition(
  targetKey: string,
  targetOffset: number,
  focusEditor = true
) {
  editor.update(() => {
    // 创建新选区
    const newSelection = $createRangeSelection();

    // 获取目标节点
    const targetNode = $getNodeByKey(targetKey);

    if (!targetNode) {
      console.error("Node not exists");
      return;
    }

    // 设置选区起终点（折叠选区）
    newSelection.anchor.set(targetKey, targetOffset, "text");
    newSelection.focus.set(targetKey, targetOffset, "text");

    // 应用新选区
    $setSelection(newSelection);
  });

  // 保持编辑器聚焦状态
  if (focusEditor) {
    const rootElement = editor.getRootElement();
    rootElement?.focus();
  }
}

function safeMoveCursor(targetKey: string, targetOffset: number) {
  editor.update(() => {
    const node = $getNodeByKey(targetKey);
    if (!$isTextNode(node)) return;

    // 确保偏移量不超过文本长度
    const maxOffset = node.getTextContent().length;
    const safeOffset = Math.min(Math.max(0, targetOffset), maxOffset);

    moveCursorToPosition(targetKey, safeOffset);
  });
}

function moveCursorToDocumentStart() {
  editor.update(() => {
    // 创建新的选区
    const selection = $createRangeSelection();

    // 获取根节点
    const root = $getRoot();

    // 获取第一个有效子节点
    let firstNode = root.getFirstChild();

    // 处理空文档情况
    if (!firstNode) {
      // 如果文档完全为空，需要先创建默认节点
      const paragraph = $createParagraphNode();
      root.append(paragraph);
      firstNode = paragraph;
    }

    // 查找第一个可定位的位置
    let targetKey: string = "";
    let targetOffset: number = 0;

    if ($isTextNode(firstNode)) {
      // 直接是文本节点
      targetKey = firstNode.getKey();
      targetOffset = 0;
    }

    // 设置选区位置
    selection.anchor.set(targetKey, targetOffset, "text");
    selection.focus.set(targetKey, targetOffset, "text");

    // 应用选区
    $setSelection(selection);
  });

  // 保持编辑器聚焦
  editor.getRootElement()?.focus();
}

//Vue3 暴漏到父组件的内容
defineExpose({
  canRedo,
  canUndo,
  undo,
  redo,
  getText,
  setText,
  clearText,
  convertToHtml,
  convertToLexicalDocument,
  convertToJson,
  loadJson,
  loadHtml,
  getBrief,
});

const clipboardEventPasteHandler = async () => {
  const data = new DataTransfer();
  const items = await navigator.clipboard.readText();
  data.setData("text/plain", items);

  const event = new ClipboardEvent("paste", {
    clipboardData: data,
  });
  editor.dispatchCommand(PASTE_COMMAND, event);
};
</script>

<template>
  <div>
    <!--打开文件的控件，处于隐藏模式
  accept=".txt,,csc,.c,.cc,.cpp,.cxx,.cxx,.h,.hpp,.hxx,.hxx,.java,.js,.m,.mm,.php,.py,.ps1,.rb,.swift,.ts,.tsx,.sh,.vue"
  -->
    <input
      v-show="false"
      ref="fileOpenRef"
      accept=".*"
      type="file"
      :value="filePath"
      @change="fileChange"
    />
    <div ref="toolbarRef" class="toolbar">
      <button
        :disabled="!canFileOpen"
        class="toolbar-item spaced"
        aria-label="File Open..."
        @click="editor.dispatchCommand(FILE_OPEN_COMMAND, '')"
      >
        <i class="format open" />
      </button>

      <Divider />
      <!--Undo-->
      <button
        :disabled="!canUndo"
        class="toolbar-item spaced"
        aria-label="Undo"
        @click="editor.dispatchCommand(UNDO_COMMAND, undefined)"
      >
        <i class="format undo" />
      </button>
      <!--Redo-->
      <button
        :disabled="!canRedo"
        class="toolbar-item spaced"
        aria-label="Redo"
        @click="editor.dispatchCommand(REDO_COMMAND, undefined)"
      >
        <i class="format redo" />
      </button>
      <Divider />
      <!--Cut-->
      <button
        :disabled="!canEditorCut"
        class="toolbar-item spaced"
        aria-label="Cut"
        @click="(event) => editor.dispatchCommand(CUT_COMMAND, null)"
      >
        <i class="format cut" />
      </button>
      <!--Copy-->
      <button
        :disabled="!canEditorCopy"
        class="toolbar-item spaced"
        aria-label="Copy"
        @click="(event) => editor.dispatchCommand(COPY_COMMAND, null)"
      >
        <i class="format copy" />
      </button>
      <!--Paste-->
      <button
        :disabled="!canEditorPaste"
        class="toolbar-item spaced"
        aria-label="Paste"
        @click="clipboardEventPasteHandler()"
      >
        <i class="format paste" />
      </button>
      <!--Delete-->
      <button
        :disabled="!canDelete"
        class="toolbar-item spaced"
        aria-label="Delete"
        @click="editor.dispatchCommand(DELETE_COMMAND, '')"
      >
        <i class="format delete" />
      </button>

      <!--Delete All-->
      <button
        :disabled="!canDeleteAll"
        class="toolbar-item spaced"
        aria-label="Delete All"
        @click="editor.dispatchCommand(DELETE_ALL_COMMAND, '')"
      >
        <i class="format deleteall" />
      </button>

      <!--Find-->
      <!--   <button
        :disabled="!canFind"
        class="toolbar-item spaced"
        aria-label="Find"
        @click="editor.dispatchCommand(FIND_COMMAND, '')"
      >
        <i class="format find" />
      </button>-->

      <!--Replace-->
      <!--  <button
        :disabled="!canReplace"
        class="toolbar-item spaced"
        aria-label="Replace"
        @click="editor.dispatchCommand(REPLACE_COMMAND, '')"
      >
        <i class="format replace" />
      </button>-->
      <Divider />

      <!--Bold-->
      <button
        :disabled="!canBold"
        :class="`toolbar-item spaced ${isBold ? 'active' : ''}`"
        aria-label="Bold"
        @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')"
      >
        <i class="format bold" />
      </button>

      <!--Italic-->
      <button
        :disabled="!canItalic"
        :class="`toolbar-item spaced ${isItalic ? 'active' : ''}`"
        aria-label="Italic"
        @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')"
      >
        <i class="format italic" />
      </button>

      <!--Underline-->
      <button
        :disabled="!canUnderline"
        :class="`toolbar-item spaced ${isUnderline ? 'active' : ''}`"
        aria-label="Underline"
        @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')"
      >
        <i class="format underline" />
      </button>

      <!--Strikethrough-->
      <button
        :disabled="!canStrikethrough"
        :class="`toolbar-item spaced ${isStrikethrough ? 'active' : ''}`"
        aria-label="Strikethrough"
        @click="editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')"
      >
        <i class="format strikethrough" />
      </button>

      <Divider />

      <!--样式-->
      <button
        ref="documentStyleButtonRef"
        class="toolbar-item spaced"
        aria-label="Formatting ppt"
        @click="
          showDocumentStyleOptionsDropDown = !showDocumentStyleOptionsDropDown
        "
      >
        <i class="format h1" v-if="documentStyle === 'Headling 1'" />
        <i class="format h2" v-else-if="documentStyle === 'Headling 2'" />
        <i class="format h3" v-else-if="documentStyle === 'Headling 3'" />
        <i
          class="format paragraph_normal"
          v-else-if="documentStyle === 'Normal'"
        />
        <div
          style="
            width: 100px;
            border: solid 1px;
            text-align: left;
            display: flex;
            align-items: center;
          "
        >
          <div style="margin-left: 5px">{{ documentStyle }}</div>
        </div>
        <i class="chevron-down" />
      </button>
      <Teleport to="body">
        <DocumentStyleDropdown
          v-if="showDocumentStyleOptionsDropDown"
          v-model:showOptionsDropDown="showDocumentStyleOptionsDropDown"
          :toolbar-ref="documentStyleButtonRef"
          @onDocStyleClick="
            (style:string) =>
              editor.dispatchCommand(TEXT_DOC_STYLE_COMMAND, style)
          "
        />
      </Teleport>

      <!--字体-->
      <button
        ref="fontButtonRef"
        class="toolbar-item spaced"
        aria-label="Font"
        @click="showFontOptionsDropDown = !showFontOptionsDropDown"
      >
        <i class="format font" />
        <div
          style="
            width: 100px;
            border: solid 1px;
            text-align: left;
            display: flex;
            align-items: center;
          "
        >
          <div style="margin-left: 5px">{{ fontfamily }}</div>
        </div>
        <i class="chevron-down" />
      </button>
      <Teleport to="body">
        <FontDropdown
          v-if="showFontOptionsDropDown"
          v-model:showOptionsDropDown="showFontOptionsDropDown"
          :toolbar-ref="fontButtonRef"
          @onFontClick="
            (fontfamily:string) => editor.dispatchCommand(TEXT_FONT_COMMAND, fontfamily)
          "
        />
      </Teleport>

      <!--字体大小-->
      <button
        ref="fontSizeButtonRef"
        class="toolbar-item spaced"
        aria-label="Font"
        @click="showFontSizeOptionsDropDown = !showFontSizeOptionsDropDown"
      >
        <i class="format fontsize2" />

        <div
          style="
            width: 60px;
            border: solid 1px;
            text-align: left;
            display: flex;
            align-items: center;
          "
        >
          <div style="margin-left: 5px">{{ fontsize }}px</div>
        </div>
        <i class="chevron-down" />
      </button>
      <Teleport to="body">
        <FontSizeDropdown
          v-if="showFontSizeOptionsDropDown"
          v-model:showOptionsDropDown="showFontSizeOptionsDropDown"
          :toolbar-ref="fontSizeButtonRef"
          @onFontSizeClick="
            (fontsize:number) => editor.dispatchCommand(FONT_SIZE_COMMAND, fontsize)
          "
        />
      </Teleport>

      <!--增加字体大小-->
      <button
        :disabled="!canFontSizeInc"
        class="toolbar-item spaced"
        aria-label="Font Size Inc"
        @click="editor.dispatchCommand(FONT_SIZE_INC_COMMAND, '')"
      >
        <i class="format fontsizeinc" />
      </button>

      <!--减少字体大小-->
      <button
        :disabled="!canFontSizeDec"
        class="toolbar-item spaced"
        aria-label="Font Size Dec"
        @click="editor.dispatchCommand(FONT_SIZE_DEC_COMMAND, '')"
      >
        <i class="format fontsizedec" />
      </button>

      <!--文本颜色-->
      <button
        ref="textColorButtonRef"
        class="toolbar-item spaced"
        aria-label="Formatting ppt"
        @click="showTextColorOptionsDropDown = !showTextColorOptionsDropDown"
      >
        <i class="format color" />
        <span
          :style="`background-color:${color};width:20px;height:100%;border:solid 1px;`"
        ></span>
        <i class="chevron-down" />
      </button>
      <Teleport to="body">
        <ColorDropdown
          v-if="showTextColorOptionsDropDown"
          v-model:showColorOptionsDropDown="showTextColorOptionsDropDown"
          :toolbar-ref="textColorButtonRef"
          @onColorChanged="
            (colorval:string) => editor.dispatchCommand(TEXT_COLOR_COMMAND, colorval)
          "
        />
      </Teleport>

      <!--文本背景颜色-->
      <button
        ref="textBackgroundColorButtonRef"
        class="toolbar-item spaced"
        aria-label="Formatting ppt"
        @click="
          showTextBackgroundColorOptionsDropDown =
            !showTextBackgroundColorOptionsDropDown
        "
      >
        <i class="format bgcolor" />
        <span
          :style="`background-color:${colorBackground};width:20px;height:100%;border:solid 1px;`"
        ></span>
        <i class="chevron-down" />
      </button>
      <Teleport to="body">
        <ColorDropdown
          v-if="showTextBackgroundColorOptionsDropDown"
          v-model:showColorOptionsDropDown="
            showTextBackgroundColorOptionsDropDown
          "
          :toolbar-ref="textBackgroundColorButtonRef"
          @onColorChanged="
            (colorval:string) =>
              editor.dispatchCommand(TEXT_BACKGROUND_COLOR_COMMAND, colorval)
          "
        />
      </Teleport>
    </div>

    <div
      id="richtexteditor"
      class="lexical-editor-simple-container"
      contenteditable
      @focus="onFocus"
      @blur="onBlur"
    />
  </div>
</template>

<style>
@import url("@/assets/css/toolbar.css");
@import url("@/assets/css/minitoolbar.css");

.editor-wrapper {
  border: 2px solid gray;
}
#lexical-state {
  width: 100%;
  height: 300px;
}

.PlaygroundEditorTheme__quote {
  margin: 0;
  margin-left: 20px;
  margin-bottom: 10px;
  font-size: 15px;
  color: rgb(101, 103, 107);
  border-left-color: rgb(206, 208, 212);
  border-left-width: 4px;
  border-left-style: solid;
  padding-left: 16px;
}

.ltr {
  text-align: left;
}

.rtl {
  text-align: right;
}

.lexical-editor-simple-container {
  background: #fff;
  margin: 0px auto 0px auto;

  border-radius: 2px;
  min-height: 200px;
  width: 100%;
  color: #000;
  position: relative;

  text-align: left;

  border: 1px solid #ccc;
  resize: none;
  overflow: auto;
  padding: 10px 10px;
  white-space: pre-wrap; /* 保留换行 */
  word-break: break-word; /* 自动换行 */
}

.lexical-editor-simple-container:active,
.lexical-editor-simple-container:focus {
  border: 1px solid yellow;
}

.lexical-editor-simple-input {
  min-height: 150px;
  resize: none;
  font-size: 15px;
  caret-color: rgb(5, 5, 5);
  position: relative;
  tab-size: 1;
  outline: 0;
  padding: 15px 10px;
}

.lexical-editor-simple-placeholder {
  color: #999;
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  top: 15px;
  left: 10px;
  font-size: 15px;
  user-select: none;
  display: inline-block;
  pointer-events: none;
}

.lexical-editor-simple-paragraph {
  margin: 0 0 15px 0;
  position: relative;
}

pre::-webkit-scrollbar {
  background: transparent;
  width: 10px;
}

pre::-webkit-scrollbar-thumb {
  background: #999;
}
</style>
