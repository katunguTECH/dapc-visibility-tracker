"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { createBrowserClient } from '@supabase/ssr';

export default function FileUpload() {
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);

    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // 2. Get public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // 3. Save document metadata to your database
    await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: file.name,
        fileUrl: publicUrl,
        fileType: file.type,
        fileSize: file.size,
      }),
    });

    setUploading(false);
    setFile(null);
    alert('Upload successful!');
  };

  return (
    <div className="p-4 border rounded-lg">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} disabled={uploading} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}