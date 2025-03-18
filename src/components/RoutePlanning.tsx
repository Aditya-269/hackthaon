import { useEffect } from "react";

export default function RedirectPage() {
  useEffect(() => {
    window.location.href = "http://192.168.170.188:8501";  // Correct Streamlit URL
  }, []);

  return null;
}
