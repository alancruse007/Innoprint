import React, { useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const QuickPrint = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Supported file formats
  const supportedFormats = ["stl", "obj", "stp", "step", "igs", "iges"];

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) {
        setIsDragging(true);
      }
    },
    [isDragging]
  );

  const validateFile = (file: File) => {
    // Check file extension
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    if (!supportedFormats.includes(extension)) {
      setError(
        `Unsupported file format. Please upload ${supportedFormats.join(
          ", "
        )} files.`
      );
      return false;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("File size exceeds 50MB limit.");
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError("");

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length) {
      const droppedFile = droppedFiles[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    try {
      // In a real app, implement actual file upload to server
      // For now, simulate a successful upload after 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));

      clearInterval(interval);
      setUploadProgress(100);

      // Redirect to print specifications page after successful upload
      setTimeout(() => {
        router.push("/print-specifications/1"); // In a real app, redirect to the actual model ID
      }, 500);
    } catch (error) {
      clearInterval(interval);
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Quick Print | Innoprint</title>
        <meta
          name="description"
          content="Upload your 3D model for quick printing"
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Quick Print</h1>
        <p className="text-center text-gray-600 mb-8">
          Upload your 3D model file and proceed directly to printing options.
        </p>

        <div className="max-w-3xl mx-auto">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center h-64 ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="w-full max-w-md">
                <div className="mb-2 flex justify-between">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                <svg
                  className="w-12 h-12 text-blue-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Drag & drop</span> or click to
                  choose files
                </p>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".stl,.obj,.stp,.step,.igs,.iges"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Select file
                </label>
              </>
            )}
          </div>

          {/* Selected File Info */}
          {file && !uploading && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="w-8 h-8 text-blue-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <button
              onClick={handleSubmit}
              disabled={!file || uploading}
              className={`flex-1 py-3 rounded-md ${
                !file || uploading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white transition-colors`}
            >
              Proceed to Print Options
            </button>
            <Link
              href="/upload"
              className="flex-1 py-3 text-center bg-white text-blue-500 rounded-md border border-blue-500 hover:bg-blue-50 transition-colors"
            >
              Back to Upload Options
            </Link>
          </div>

          {/* Supported Formats */}
          <p className="mt-6 text-center text-gray-500">
            Currently support stl, obj, stp, step, igs, iges file formats.
          </p>
        </div>
      </div>
    </>
  );
};

export default QuickPrint;
