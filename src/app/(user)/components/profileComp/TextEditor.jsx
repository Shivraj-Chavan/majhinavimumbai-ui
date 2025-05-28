import React from 'react';
import Editor from 'react-simple-wysiwyg';

const TextEditor = ({ label, name = 'editor', value, onChange, className = '' }) => {
  const handleChange = (e) => {
    onChange(e.target.value); 
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className="flex flex-col col-span-2">
      {label && <label className="mb-1 font-semibold">{label}</label>}
      <Editor
        value={value || ''}
        onChange={handleChange}
        onPaste={handlePaste}
        className={`h-[200px] wysiwyg-editor overflow-auto rounded border ${className}`}
      />
    </div>
  );
};

export default TextEditor;
