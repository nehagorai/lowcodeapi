/**
 *
 * Pulse
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

const pulseMap = {
  green: {
    base: 'bg-green-600',
    bg: 'bg-green-500',
    text: 'text-green-600'
  },
  orange: {
    base: 'bg-orange-600',
    bg: 'bg-orange-500',
    text: 'text-orange-600'
  },
  red: {
    base: 'bg-red-600',
    bg: 'bg-red-500',
    text: 'text-red-600'
  },
  gray: {
    base: 'bg-gray-600',
    bg: 'bg-gray-500',
    text: 'text-gray-600'
  }
}
function Pulse({ name, pulse, title, color, size }) {
  return (
    <span className={`flex items-center`}>
      <span className={`relative flex ${ size ? size: "h-3 w-3"}`} title= {title || name}>
        {
          pulse ? <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pulseMap[color].bg || ''} opacity-75`}></span> : null
        }
        
        <span className={`relative ${ size ? size: "h-3 w-3"} inline-flex rounded-full ${pulseMap[color].base || ''} `}></span>
      </span>
      <span className={`text-sm ml-2  ${pulseMap[color].text || ''}`}>{name}</span>
    </span>
  );
}

Pulse.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
};

export default Pulse;
