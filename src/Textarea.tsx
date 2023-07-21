import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TextArea: React.FC = () => {
  const [value, setValue] = React.useState('');

  return (
    <div className="Textarea">
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={setValue} 
        placeholder="Enter your content here for analysis..."
        modules={modules}
        formats={formats}
      />
    </div>
  );
}

// https://quilljs.com/docs/modules/  https://quilljs.com/docs/formats/
const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],
    ['link', 'image', 'video']
  ]
};

const formats = [
  'header', 'font', 'size', 'color', 'background',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent', 'script', 'align', 
  'direction', 'link', 'image', 'video', 'code-block'
];

export default TextArea;
