import React from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TextAreaProps {
  value: string;
  setValue: (val: string) => void;
}

declare const tinymce: any;

const TextArea: React.FC<TextAreaProps> = ({ value, setValue }) => {
  const handleEditorChange = (content: string, editor: any) => {
    const bookmark = editor.selection.getBookmark(2, true);
    setValue(content);
    editor.selection.moveToBookmark(bookmark);
  };

  return (
    <div className="Textarea">
      <Editor
        apiKey={process.env.REACT_APP_TINY_API}
        value={value}
        init={{
          menubar: true,
          branding: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "anchor",
            "charmap",
            "preview",
            "searchreplace",
            "wordcount",
            "visualblocks",
            "visualchars",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
          ],
          toolbar:
            "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | link image | code",
          style_formats: [
            {
              title: "Headings",
              items: [
                { title: "Heading 1", format: "h1" },
                { title: "Heading 2", format: "h2" },
                { title: "Heading 3", format: "h3" },
              ],
            },
          ],
          image_advtab: true,
          automatic_uploads: true,
          file_picker_types: "image",
          file_picker_callback: function (cb, value, meta) {
            let input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");

            input.onchange = function () {
              const inputElement = this as HTMLInputElement;
              const file =
                inputElement.files && inputElement.files.length > 0
                  ? inputElement.files[0]
                  : null;

              if (file) {
                const reader = new FileReader();
                reader.onload = function () {
                  const readerElement = this as FileReader;
                  const id = "blobid" + new Date().getTime();
                  const blobCache = tinymce.activeEditor.editorUpload.blobCache;
                  const base64 = readerElement.result
                    ? (readerElement.result as string).split(",")[1]
                    : "";
                  const blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);
                  cb(blobInfo.blobUri(), { title: file.name, alt: file.name });
                };
                reader.readAsDataURL(file);
              }
            };
            input.click();
          },
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
};

export default TextArea;
