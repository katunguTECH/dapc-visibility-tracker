// src/app/documents/page.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import DocumentUpload from "@/components/DocumentUpload";
import Link from "next/link";

interface Document {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  tags: string[];
  createdAt: string;
}

export default function DocumentsPage() {
  const { isSignedIn } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    const res = await fetch("/api/documents");
    const data = await res.json();
    setDocuments(data.documents || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchDocuments();
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold">Please sign in to access your documents</h1>
          <Link href="/sign-in" className="text-blue-600 underline">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Documents</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <DocumentUpload onUploadComplete={fetchDocuments} />
          </div>
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">All Documents</h2>
              {loading ? (
                <p>Loading...</p>
              ) : documents.length === 0 ? (
                <p className="text-gray-500">No documents yet. Upload your first one.</p>
              ) : (
                <ul className="divide-y">
                  {documents.map((doc) => (
                    <li key={doc.id} className="py-4 flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{doc.title}</h3>
                        {doc.description && <p className="text-sm text-gray-600">{doc.description}</p>}
                        <div className="flex gap-2 mt-1">
                          {doc.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(doc.createdAt).toLocaleDateString()} • {(doc.fileSize / 1024).toFixed(0)} KB
                        </p>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Open →
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}