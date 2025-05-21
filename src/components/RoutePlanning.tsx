import { useEffect } from "react";

export default function RedirectPage() {
  useEffect(() => {
    window.location.href = "https://skk402-safety-main-vbsdsd.streamlit.app/"; 
  }, []);

  return null;
}
