import React from 'react';
import moment from 'moment';

const copyright = `© ${moment().format('YYYY')}`;

function Copyright({ extendClass, copyright_name }) {
  return (
    <div className={`text-xs ${extendClass}`}>
      {copyright} - {copyright_name}
    </div>
  );
}

export default Copyright;
