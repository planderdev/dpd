import { Editor } from "https://esm.sh/@tiptap/core";
import StarterKit from "https://esm.sh/@tiptap/starter-kit";

const commandMap = {
  bold: (editor) => editor.chain().focus().toggleBold().run(),
  italic: (editor) => editor.chain().focus().toggleItalic().run(),
  strike: (editor) => editor.chain().focus().toggleStrike().run(),
  bulletList: (editor) => editor.chain().focus().toggleBulletList().run(),
  orderedList: (editor) => editor.chain().focus().toggleOrderedList().run(),
  blockquote: (editor) => editor.chain().focus().toggleBlockquote().run(),
  h2: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  h3: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  undo: (editor) => editor.chain().focus().undo().run(),
  redo: (editor) => editor.chain().focus().redo().run()
};

const activeMap = {
  bold: (editor) => editor.isActive("bold"),
  italic: (editor) => editor.isActive("italic"),
  strike: (editor) => editor.isActive("strike"),
  bulletList: (editor) => editor.isActive("bulletList"),
  orderedList: (editor) => editor.isActive("orderedList"),
  blockquote: (editor) => editor.isActive("blockquote"),
  h2: (editor) => editor.isActive("heading", { level: 2 }),
  h3: (editor) => editor.isActive("heading", { level: 3 })
};

window.DpdCmsRichText = {
  mount({ element, toolbar, content, onUpdate }) {
    const editor = new Editor({
      element,
      extensions: [StarterKit],
      content: content || "<p></p>",
      editorProps: {
        attributes: {
          class: "cms-tiptap"
        }
      },
      onUpdate: ({ editor: currentEditor }) => {
        if (typeof onUpdate === "function") {
          onUpdate(currentEditor.getHTML());
        }
        updateActiveButtons();
      },
      onSelectionUpdate: updateActiveButtons
    });

    function updateActiveButtons() {
      if (!toolbar) return;
      toolbar.querySelectorAll("[data-tiptap-command]").forEach((button) => {
        const command = button.dataset.tiptapCommand;
        const check = activeMap[command];
        button.classList.toggle("is-active", Boolean(check && check(editor)));
      });
    }

    if (toolbar) {
      toolbar.querySelectorAll("[data-tiptap-command]").forEach((button) => {
        button.addEventListener("click", () => {
          const command = button.dataset.tiptapCommand;
          if (commandMap[command]) {
            commandMap[command](editor);
            updateActiveButtons();
          }
        });
      });
    }

    updateActiveButtons();
    return editor;
  }
};

window.dispatchEvent(new CustomEvent("dpd:tiptap-ready"));
