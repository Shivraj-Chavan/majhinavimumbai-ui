"use client";

import React, { useState } from 'react';
import { TfiShare } from 'react-icons/tfi';

const ShareButton = ({ businessName = "My Business" }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    const url = window.location.href;
    const title = `${businessName} | MNM Business Listing`;
    const text = `Check out ${businessName} on MNM! View contact details, photos, and more.`;

    if (navigator.share && navigator.canShare?.({ url })) {
      try {
        await navigator.share({ title, text, url });
        console.log('Shared successfully!');
      } catch (err) {
        console.error('Sharing failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        const button = e.target;
        const originalText = button.textContent;

        setCopied(true);
        button.textContent = 'Link Copied!';
        button.classList.add('bg-green-500');

        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('bg-green-500');
          setCopied(false);
        }, 2000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition"
    >
      <TfiShare className="text-lg" />
      {copied ? 'Link Copied!' : 'Share'}
    </button>
  );
};

export default ShareButton;
