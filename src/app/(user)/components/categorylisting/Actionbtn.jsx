import React from 'react';

export default function Actionbtn({ href, icon, label, ringColor = 'blue', isButton = false }) {
  const baseClasses = ` inline-flex items-center gap-2 px-4 py-2 border rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-${ringColor}-400 transition-all duration-200 `;

  const content = (
    <>
      <span className="text-xl">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </>
  );

  return isButton ? (
    <button type="button" className={baseClasses}> {content} </button>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses} aria-label={label} >
      {content}
    </a>
  );
}
