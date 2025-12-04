import React, { useState } from "react";
import { encodeSettingsToURL } from "../../services/urlEncoder";
import { validateURLLength } from "../../services/urlValidator";
import ErrorMessage from "../OverlayPlugins/ErrorMessage";

const ShareLink = (props) => {
  const [url, setUrl] = useState("");
  const [fullUrl, setFullUrl] = useState("");
  const [error, setError] = useState(null);

  const copyToClipBoard = (text) => {
    navigator.clipboard.writeText(text);
  };

  /**
   * Generates a shareable URL from current settings.
   * Synchronous operation - no database writes required.
   */
  const generateShareURL = () => {
    try {
      // Encode current settings to URL parameters
      // Pass empty string as baseURL to get just "?param=value" format (or empty string if no params)
      const queryStringWithQuestion = encodeSettingsToURL(props.settings, '');

      // Build URLs:
      // - url: relative path for href (e.g., "/?s=Chromatic" or "/")
      // - fullUrl: complete URL for clipboard (e.g., "http://localhost:3000/?s=Chromatic")
      const url = queryStringWithQuestion ? '/' + queryStringWithQuestion : '/';
      const fullUrl = window.location.origin + url;

      // Validate URL length before proceeding
      const validation = validateURLLength(fullUrl);

      if (!validation.valid) {
        // URL is too long - show error with suggestions
        setError({
          message: `URL too long (${validation.length} / ${validation.limit} characters)`,
          suggestions: validation.suggestions.slice(1) // Skip the first item which just repeats the error
        });
        return null;
      }

      // URL is valid - clear any previous errors
      setError(null);

      setUrl(url);
      setFullUrl(fullUrl);

      return fullUrl;
    } catch (error) {
      console.error("Error generating share URL:", error);
      setError({
        message: "Failed to generate share link",
        suggestions: ["Please try again", "If the problem persists, contact support"]
      });
      return null;
    }
  };

  /**
   * Handles the share button click.
   * Generates URL on first click, then copies to clipboard on subsequent clicks.
   */
  const handleShareClick = () => {
    if (url === "") {
      // First click - generate URL
      const generated = generateShareURL();
      if (generated) {
        // Automatically copy to clipboard on generation
        copyToClipBoard(generated);
      }
    } else {
      // Subsequent clicks - just copy
      copyToClipBoard(fullUrl);
    }
  };

  return (
    <div className="share-link">
      <h2>Share</h2>
      <p>Share your current setup:</p>

      {error && (
        <ErrorMessage
          message={error.message}
          suggestions={error.suggestions}
          onDismiss={() => setError(null)}
        />
      )}

      <a
        href={url}
        className={`message ${url !== "" ? "show" : ""}`}
        title=""
        target="_blank"
        rel="noopener noreferrer">
        {fullUrl}
      </a>
      <br></br>
      <button onClick={handleShareClick}>
        {url ? "Copy to clipboard" : "Create Share Link"}
      </button>
      <br></br>
      <span>
        {url
          ? "The link is copied to your clipboard and can be sent to others to open the same setup"
          : "Generate a shareable link instantly - no account needed."}
      </span>
    </div>
  );
};

export default ShareLink;
