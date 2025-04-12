import React, { useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const FullUpload = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Form state for model metadata
  const [modelData, setModelData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    license: "cc-by",
    allowDerivatives: true,
    allowCommercialUse: false,
  });

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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setModelData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setModelData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const validateForm = () => {
    if (!file) {
      setError("Please select a file to upload.");
      return false;
    }

    if (!modelData.title.trim()) {
      setError("Please enter a title for your model.");
      return false;
    }

    if (!modelData.description.trim()) {
      setError("Please enter a description for your model.");
      return false;
    }

    if (!modelData.category) {
      setError("Please select a category for your model.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
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
      // In a real app, implement actual file upload to server with metadata
      // For now, simulate a successful upload after 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));

      clearInterval(interval);
      setUploadProgress(100);

      // Redirect to model preview page after successful upload
      setTimeout(() => {
        router.push("/model/1"); // In a real app, redirect to the actual model ID
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
        <title>Full Upload | Innoprint</title>
        <meta
          name="description"
          content="Upload your 3D model with detailed information"
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Full Upload</h1>
        <p className="text-center text-gray-600 mb-8">
          Upload your 3D model with detailed information to share with the
          community.
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

          {/* Model Metadata Form */}
          <div className="mt-8 bg-white p-6 rounded-md border">
            <h2 className="text-xl font-bold mb-4">Model Information</h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={modelData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter a title for your model"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={modelData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your model, its features, and intended use"
                  required
                ></textarea>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={modelData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="art">Art</option>
                  <option value="fashion">Fashion</option>
                  <option value="gadgets">Gadgets</option>
                  <option value="home">Home</option>
                  <option value="tools">Tools</option>
                  <option value="toys">Toys & Games</option>
                  <option value="engineering">Engineering</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={modelData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter tags separated by commas (e.g., figurine, decoration, gift)"
                />
              </div>

              {/* License */}
              <div>
                <label
                  htmlFor="license"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  License
                </label>
                <select
                  id="license"
                  name="license"
                  value={modelData.license}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cc-by">Creative Commons - Attribution</option>
                  <option value="cc-by-sa">
                    Creative Commons - Attribution-ShareAlike
                  </option>
                  <option value="cc-by-nd">
                    Creative Commons - Attribution-NoDerivs
                  </option>
                  <option value="cc-by-nc">
                    Creative Commons - Attribution-NonCommercial
                  </option>
                  <option value="cc-by-nc-sa">
                    Creative Commons - Attribution-NonCommercial-ShareAlike
                  </option>
                  <option value="cc-by-nc-nd">
                    Creative Commons - Attribution-NonCommercial-NoDerivs
                  </option>
                  <option value="cc0">
                    Creative Commons - CC0 (Public Domain)
                  </option>
                  <option value="custom">Custom License</option>
                </select>
              </div>

              {/* License Options */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowDerivatives"
                    name="allowDerivatives"
                    checked={modelData.allowDerivatives}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="allowDerivatives"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Allow others to modify or remix this model
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowCommercialUse"
                    name="allowCommercialUse"
                    checked={modelData.allowCommercialUse}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="allowCommercialUse"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Allow commercial use of this model
                  </label>
                </div>
              </div>
            </div>
          </div>

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
              disabled={uploading}
              className={`flex-1 py-3 rounded-md ${
                uploading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white transition-colors`}
            >
              Upload to Catalog
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

export default FullUpload;
