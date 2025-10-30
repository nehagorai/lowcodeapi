import React, { useState } from 'react';
import Field, { FieldMap } from './Field';
import IconPack from '../../IconPack';


const FormGenerator = props => {
  const {
    fields,
    meta,
    dataSource = null,
    submitLock,
    submitted,
    setDropdownData,
    children,
  } = props;
  const [loading] = useState(false);
  const [selectMap, setSelectMap] = useState({});

  const formSubmitted = submitted || submitLock;
  const onSubmit = e => {
    e.preventDefault();
    if (formSubmitted) return;
    let body = {};

    const data = [...e.target];
    data.pop();
    data.forEach(item => {
      if (item.name && item.value) {
        if (item.type === 'checkbox') {
          body[item.name] = item.checked;
        } else if (item.type === 'radio') {
          body[item.name] = (item.checked && item.value) || body[item.name] || '';
        } else {
          body[item.name] = item.value;
        }
      }
    });


    if(Object.keys(selectMap).length) {
      body = { ...body, ...selectMap,  };
    }

    props.onSubmit({ ...body });
  };
  const onMultiSelect = (event) => {
    const { name, value } = event.target;

    let local = { ...selectMap };
    
    delete local[name];

    if (value) {
      local = {
        ...local,
        [name]: value.split(',')
      };
    } 

    console.log(event.target);
    setSelectMap({
      ...local,
    });
  };

  return (
    <>
      {loading ? (
        <div>Loading form</div>
      ) : (
        <form onSubmit={onSubmit} {...meta.form} className="text-xs">
          {fields.map(item => (
            <React.Fragment key={item.name}>
              {FieldMap[item.field] ? (
                <div key={item.name} className="mt-4">
                  <Field
                    {...item}
                    submitLock={formSubmitted}
                    submitted={submitted}
                    setDropdownData={{ provider: setDropdownData }}
                    dataSource={dataSource}
                    onChange={() => {}}
                    onMultiSelect={onMultiSelect}
                  />
                </div>
              ) : null}
            </React.Fragment>
          ))}
          {fields.length ? (
            <div className="mt-8 flex justify-end">
              {
                children ? children :
              
                <button
                  type="submit"
                  className={`p-2 px-8 text-sm rounded-md ${meta.block? 'w-full' : ''} ${
                    formSubmitted
                      ? 'text-gray-400 bg-gray-100 no-cursor bg-blue-500 border border-gray-200'
                      : 'text-gray-100 shadow bg-blue-500 border border-blue-600 hover:shadow-lg'
                  }`}
                  disabled={formSubmitted}
                >
                  {formSubmitted ? 
                    <>
                      {
                        meta.loader ? <IconPack name='spin' /> : meta.submit_active_text
                      }
                    </> : meta.submit_text
                  }
                </button>
              }
            </div>
          ) : null}
        </form>
      )}
    </>
  );
};

export default FormGenerator;
