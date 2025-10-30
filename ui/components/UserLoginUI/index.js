/**
 *
 * UserLoginUI
 *
 */
import PropTypes from 'prop-types';
import React from 'react';

import FormUI from '../FormUI';

function UserLoginUI({ i18n, form, intent, message, endpoint, lock, onSubmit }) {
  return (
    <>
      <div className="flex flex-col justify-center pb-4 sm:rounded-lg">
          {!intent ? (
            <FormUI
              i18n={i18n}
              onChange={() => {}}
              {...form.email}
              endpoint={endpoint}
              submitLock={lock}
              onSubmit={onSubmit}
            >
              <div className=''>
                <button 
                    className={`flex items-center p-2 text-sm rounded-md border ${lock ? "border-gray-200 text-gray-300" : "border-blue-400 text-blue-500 hover:shadow-md"}`}
                    type='submit'
                    disabled={!!lock}
                    onSubmit={onSubmit}
                >
                    <span className='ml-1'>{ lock? form.email.meta.submit_text: form.email.meta.submit_text_disable}</span>
                </button>
              </div>
            </FormUI>
          ) : (
            <div className='py-4'>
              <p className="text-blue-600 text-sm bg-blue-50 p-2 py-4 text-center tracking-wide">
                {message}
              </p>
            </div>
          )}
      </div>
    </>
  );
}

UserLoginUI.propTypes = {
  i18n: PropTypes.object,
  message: PropTypes.string,
  onSubmit: PropTypes.func,
};

export default UserLoginUI;
