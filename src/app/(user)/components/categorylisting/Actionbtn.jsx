import React from 'react';

export default function Actionbtn({ href, icon, label, ringColor, isButton }) {
  const classes = `flex items-center gap-2 border border-gray-200 rounded-xl px-18 py-2 text-sm text-gray-700 hover:ring-2 hover:ring-${ringColor}-400 transition`;

  if (isButton) {
    return (
      <button className={classes}>
        <span className="text-xl">{icon}</span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <a href={href} target="_blank" className={classes}>
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </a>
  );
}
