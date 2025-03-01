import { useEffect } from "react";

export default function RedirectPage() {
  useEffect(() => {
    window.location.href = "http://192.168.7.36:8501/"; // Replace with the desired URL
  }, []);

  return null;
}
