import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const UploadOptions = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Upload Options | Innoprint</title>
        <meta
          name="description"
          content="Choose how you want to upload your 3D model"
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Upload Options</h1>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Print Option */}
          <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <svg
                className="w-16 h-16 text-blue-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h2 className="text-2xl font-bold mb-4">Quick Print</h2>
              <p className="text-gray-600 mb-6">
                Just want to print your model? Upload your file and proceed
                directly to printing options. No need to add detailed metadata
                or publish to the catalog.
              </p>
              <button
                onClick={() => router.push("/upload/quick-print")}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Quick Print
              </button>
            </div>
          </div>

          {/* Full Upload Option */}
          <div className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <svg
                className="w-16 h-16 text-blue-500 mb-4"
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
              <h2 className="text-2xl font-bold mb-4">Full Upload</h2>
              <p className="text-gray-600 mb-6">
                Want to share your model with the community? Add detailed
                information, tags, and publish your model to our catalog for
                others to discover and print.
              </p>
              <button
                onClick={() => router.push("/upload/full-upload")}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Full Upload
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/catalogue" className="text-blue-500 hover:underline">
            Or browse our existing models
          </Link>
        </div>
      </div>
    </>
  );
};

export default UploadOptions;
