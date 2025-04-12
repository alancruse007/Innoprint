import { useEffect } from "react";
import { useRouter } from "next/router";

const UploadRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the upload options page
    // Changed from /upload to /upload/options to avoid duplicate route conflict
    router.replace("/upload/options");
  }, [router]);

  return null; // No UI needed as we're redirecting
};

export default UploadRedirect;
