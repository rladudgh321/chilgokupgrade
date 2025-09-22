import React from 'react';

const CustomIcon = ({className}: {className?: string}) => (
  <svg className={className} viewBox="0 0 24 24">
    <g>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M13 22C7.477 22 3 17.523 3 12S7.477 2 13 2s10 4.477 10 10-4.477 10-10 10zM8 11.5l4 1.5 1.5 4.002L17 8l-9 3.5z" />
    </g>
  </svg>
);

export default CustomIcon;
