/**
 *
 * UserInput
 *
 */

import PropTypes from 'prop-types';
import React from 'react';

function UserInput({
  id = '',
  name,
  customClassName,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
}) {
  const className =
    customClassName ||
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';

  const inputObj = {};
  if (id) {
    inputObj.id = id;
  }

  if (placeholder) {
    inputObj.placeholder = placeholder;
  }
  return (
    <>
      {label && (
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <input
        {...inputObj}
        className={className}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

UserInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  customClassName: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default UserInput;
