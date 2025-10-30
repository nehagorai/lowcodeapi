/**
 *
 * BadgeUI
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

function BadgeUI({ color, animate = true, className,  }) {
  return (
    <>
      <span
        className={`relative text-xs -mt-2`}
      >
        <span className={`flex ${className ? className : 'h-3 w-3'}`}>
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${animate ? 'animate-ping' : ''} ${color? color : 'bg-green-500'}`}></span>
          <span className={`relative inline-flex rounded-full ${color? color : 'bg-green-600'} ${className ? className : 'h-3 w-3'}`}></span>
        </span>
      </span>
    </>
  );
}

BadgeUI.propTypes = {
  color: PropTypes.string,
};

export default BadgeUI;
