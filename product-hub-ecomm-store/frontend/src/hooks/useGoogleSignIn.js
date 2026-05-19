import { useEffect } from "react";

// Module-level variable to track if Google Sign-In has been initialized
let googleSignInInitialized = false;

export const useGoogleSignIn = (callback, elementId) => {
  useEffect(() => {
    // Only initialize once globally
    if (window.google && !googleSignInInitialized && callback) {
      googleSignInInitialized = true;

      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: callback,
      });
    }

    // Render button if element exists (can be called multiple times safely)
    if (window.google && elementId) {
      const buttonElement = document.getElementById(elementId);
      if (buttonElement && buttonElement.children.length === 0) {
        google.accounts.id.renderButton(buttonElement, {
          theme: "outline",
          size: "large",
          width: "300",
        });
      }
    }
  }, [callback, elementId]);
};
