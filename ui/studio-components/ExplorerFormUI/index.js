import React, { useState } from 'react';
import Field, { FieldMap } from './Field';

const FormGenerator = props => {
  const {
    fields,
    query = {},
    meta,
    dataSource = null,
    submitLock,
    setDropdownData,
    onChange
  } = props;
  const [loading] = useState(false);

  const onSubmit = e => {
    e.preventDefault();
  };

  return (
    <>
      {loading ? (
        <div>Loading form</div>
      ) : (
        <form onSubmit={onSubmit} {...meta.form} className="">
          {fields.map(item => (
            <React.Fragment key={item.name}>
              {FieldMap[item.field] ? (
                <div key={item.name} className="border border-gray-300 border-b-0 last:border-b">
                  <Field
                    {...item}
                    value={query[item.name]}
                    submitLock={submitLock}
                    setDropdownData={{ provider: setDropdownData }}
                    dataSource={dataSource}
                    onChange={onChange}
                  />
                </div>
              ) : null}
            </React.Fragment>
          ))}
        </form>
      )}
    </>
  );
};

export default FormGenerator;
