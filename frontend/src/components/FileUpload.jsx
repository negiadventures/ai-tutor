import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import axios from 'axios';

export default function FileUpload({ onChaptersDetected }) {
  const [uploading, setUploading] = useState(false);
  const [filename, setFilename] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setUploading(true);
      const file = acceptedFiles[0];
      setFilename(file.name);
      const formData = new FormData();
      formData.append('file', file);

            try {
        const res = await axios.post('http://localhost:8000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data?.chapters) {
          onChaptersDetected(res.data);
        } else {
          alert('Upload succeeded but no chapters returned.');
        }
      } catch (err) {
        console.error(err);
        alert('Upload failed or backend is down.');
      }
      setUploading(false);
    },
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer bg-white hover:bg-gray-50 transition">
      <input {...getInputProps()} />
      <p className="text-gray-600">📂 Drag & drop a PDF/Word file here, or click to upload</p>
      {filename && <p className="mt-2 text-sm">Uploaded: {filename}</p>}
      {uploading && <p className="text-blue-500 animate-pulse">Processing...</p>}
    </div>
  );
}