import React, { useState } from 'react';
import Downshift from 'downshift';
import ReactSelect from 'react-select';

import IconPack from '../IconPack';


const defaultTextClass = 'w-full text-gray-500 text-sm';
const defaultInputClass =
  'w-full h-full p-2 text-sm hover:shadow focus:outline-none text-xs';
const defaultFileClass = '';
const defaultCheckboxClass = 'mr-2 text-sm';
const defaultRadioClass = 'mr-1 text-sm';
const defaultTextareaClass =
  'p-2 w-full rounded-md border border-gray-200 text-sm';
const defaultSelectClass =
  'p-2 w-full rounded-md border border-gray-200 text-sm pr-4 border border-gray-400 hover:shadow';
const defaultTNCClass = 'text-blue-500 text-sm';

const requiredMessage = '*required';
const Message = props => (
  <div className={"p-2 text-gray-500 text-xs font-normal leading-relaxed"}>
    {props.message}
  </div>
);
const Required = props => (
  <sup className={props.rClassName || "text-red-500 ml-0.5 text-[11px]"}>
    {props.required}*
  </sup>
);

const Input = props => {
  const onChange = props.onChange || (() => { });
  const inputProps = {
    className : props.className || defaultInputClass,
    type : props.type || 'text',
    name : props.name || '',
    value : props.value,
    placeholder : props.placeholder || '',
    title : props.title || '',
    onChange : onChange,
    disabled : !!props.submitLock,
    required : !!props.required,
  }

  if (props.id) {
    inputProps.id = props.id
  }

  return (<input {...inputProps}/>);
};

const Text = props => {
  const className = props.class || props.className || props.class_name;
  return <p className={className || defaultTextClass}>{props.placeholder}</p>;
};

const InputUI = props => {
  return (
    <div className='flex items-center'>
      <div className='flex-grow grid grid-cols-6' title={props.title || props.message}>
        {
          !props.hide_label ? (
            <div className="col-span-2 text-xs text-gray-500 p-2 flex justify-between items-center text-sm leading-relaxed">
              <span>
              {props.label || ''} 
              {props.required ? <Required text={requiredMessage} {...props} /> : ''}
              </span>
              <small className='text-gray-900 font-medium rounded-2xl px-0.5' style={{ fontSize: '70%' }}>{props.schema?.type || props.type}</small>
            </div>) : null
        }
        <div className={`col-span-4 h-full border-l border-r-0`}>
          <Input {...props} type={props.type} placeholder={props.placeholder || props.message} />
        </div>
      </div>
      {/* <div className=' flex items-center mx-2 text-gray-500 overflow-y-scroll' data-tooltip-id="form-tooltip" data-tooltip-content={props.message} data-tooltip-variant='dark' data-tooltip-offset='5'>
        <IconPack name='info' title={props.message} />
      </div> */}
    </div>
  );
};

const File = props => {
  return <div className='flex items-center'>
    <div className='flex-grow grid grid-cols-6'>
      <div className="col-span-2 text-xs text-gray-500 p-2 flex items-center justify-between text-sm leading-relaxed">
        <span>
          {props.label || ''} 
          {props.required ? <Required text={requiredMessage} {...props} /> : ''}
        </span>
        <small className='text-gray-900 font-medium rounded-2xl px-0.5' style={{ fontSize: '70%' }}>{props.schema?.type || props.type}</small>
      </div>
      <div className={`col-span-4 h-full border-l border-r-0 bg-white text-xs`}>
        <Input {...props} id={props.name} className={'hidden'} type="file" placeholder={props.placeholder || props.message || 'Uploadfile'} />
        <label className="block flex items-center w-full h-full text-gray-400 p-2 cursor-pointer truncate hover:shadow focus:outline-none" htmlFor={props.name} title={`Select a ${props.enum ? props.enum.join('.') : ''} file to be uploaded.`}>
          <span className='border border-gray-300 rounded-md p-0.5'><IconPack name="upload" /></span>
          <span className='ml-1'>{props.placeholder || `Select a ${props.enum ? props.enum.join('.') : ''} file to be uploaded`}</span>
        </label>
      </div>
    </div>
    {/* <div className=' flex items-center mx-2 text-gray-500 overflow-y-scroll' data-tooltip-id="form-tooltip" data-tooltip-content={props.message} data-tooltip-variant='dark' data-tooltip-offset='5'>
        <IconPack name='info' title={props.message} />
    </div> */}
  </div>
};

const Checkbox = props => {
  const className = props.class || props.className || props.class_name;
  return (
    <>
      <label className="ml-1 mb-2 text-gray-500 mr-2 flex items-center">
        <Input
          {...props}
          className={className || defaultCheckboxClass}
          type="checkbox"
        />
        {props.label || ''}
        {props.required ? <Required text={requiredMessage} /> : ''}
      </label>
    </>
  );
};

const TNC = props => {
  const className = props.class || props.className || props.class_name;
  return (
    <>
      <label className="ml-1 mb-2 text-gray-500 mr-2 flex items-center">
        <Input
          {...props}
          className={className || defaultCheckboxClass}
          type="checkbox"
        />
        <a
          href={props.default_value}
          target={`_${props.name}`}
          className={className || defaultTNCClass}
        >
          {props.label || ''}
        </a>
        {props.required ? <sup className="text-red-600 ml-1 mt-1">*</sup> : ''}
      </label>
    </>
  );
};

const Radio = props => {
  const className = props.class || props.className || props.class_name;
  const { default_value = '' } = props;

  const options =
    default_value
      .toString()
      .split(',')
      .filter(i => !!i.trim())
      .map(i => i.trim()) || [];
  const [checked, setFn] = useState(options[0] || '');
  const onChange = e => {
    const { value } = e.target;
    setFn(value);
    if (props.onChange) props.onChange({
      target: {
        name: props.name, value
      }
    });
  };
  return (
    <div className='flex items-center'>
      <div className='flex-grow grid grid-cols-6'>
        {options.length ? (<>
          <div className="col-span-2 text-xs text-gray-500 p-2 flex items-center justify-between text-sm leading-relaxed">
            <>{props.label} <small className='text-gray-900 font-medium rounded-2xl px-0.5' style={{ fontSize: '70%' }}>{props.schema?.type || props.type}</small></>
            <>
              {props.required ? (
                <sup className="text-red-600 ml-1 mt-1">*</sup>
              ) : null}
            </>
          </div>
          <div className='bg-white col-span-4 h-full flex items-center p-2 border-l border-r-0 focus:outline-none'>
            {options.map(option => (
              <div key={option} className="flex items-center text-xs mr-2 md:mr-4">
                <Input
                  {...props}
                  className={''}
                  type="radio"
                  value={option}
                  checked={checked === option}
                  onChange={onChange}
                />
                <span className='ml-1'>{option.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </>) : null}
      </div>
      {/* <div className=' flex items-center mx-2 text-gray-500 overflow-y-scroll' data-tooltip-id="form-tooltip" data-tooltip-content={props.message} data-tooltip-variant='dark' data-tooltip-offset='5'>
        <IconPack name='info' title={props.message} />
      </div> */}
    </div>
  );
};

const Textarea = props => {
  const className = props.class || props.className || props.class_name;
  const onChange = props.onChange || (() => { });
  return (
    <>
      {
        !props.hide_label ?
          <label className="mb-2 text-gray-500 mr-2 flex items-center">
            {props.label || ''}
            {props.required ? <sup className="text-red-600 ml-1 mt-1">*</sup> : ''}:
          </label> : null
      }
      <textarea
        className={className ? `${defaultTextareaClass} ${className}` : defaultCheckboxClass}
        name={props.name || ''}
        value={props.value || ''}
        placeholder={props.placeholder || ''}
        onChange={onChange}
        disabled={props.submitLock}
        required={props.required}
      />
      {props.message ? <Message {...props} /> : null}
    </>
  );
};

const SelectO = props => {
  const className = props.class || props.className || props.class_name;
  const onChange = props.onChange || (() => { });

  if (
    !props.extra &&
    !props.dataSource &&
    !props.dataSource[props.dataSourceKey]
  )
    return null;

  const dataSource = props.dataSource || {};
  let data = [];
  if (dataSource[props.dataSourceKey]) {
    data = dataSource[props.dataSourceKey];
  } else {
    const extra = props.extra || '';
    data = extra.split(',').map(i => {
      const item = i.trim().split(':');
      return {
        key: item[0],
        value: item[1] || item[0],
      };
    });
  }
  return (
    <>
      <label className="relative mb-2 text-gray-500 flex items-center text-sm">
        {props.label || ''}:
        {props.required ? <Required text={requiredMessage} /> : ''}
      </label>
      <select
        className={className || defaultSelectClass}
        name={props.name}
        onChange={onChange}
        disabled={props.submitLock}
        defaultValue={props.defaultValue}
        required={props.required}
      >
        {props.placeholder ? (
          <option value="">{props.placeholder}</option>
        ) : null}
        {data.map(item => (
          <option key={item.id || item.key} value={item.key}>
            {item.value || item.key}
          </option>
        ))}
      </select>
      {props.message ? <Message message={props.message} /> : null}
    </>
  );
};


const SelectDropdown = props => {
  console.log(props);
  const { extra, dropdownList, dataSource, dataSourceKey, setDropdownData } = props;

  const [state, setState] = useState('');

  if (!extra && (dataSource && !dataSource[dataSourceKey])) return null;

  let dropdownData = [];
  if (dataSource && dataSource[dataSourceKey]) {
    dropdownData = dataSource[dataSourceKey];
  } else {
    dropdownData = dropdownList || extra.split(',').map(i => {
      const item = i.trim().split(':');
      return {
        key: item[0],
        value: item[1] || item[0],
      };
    });
  }

  const onTypeFilter = (inputValue, item) => {
    let search_target = item && (item.search_value ? item.search_value : item.value) || '';
    search_target = search_target.toLowerCase();
    return (search_target && search_target.includes(inputValue.toLowerCase()));
  }
  const onSelect = selection => {
    const { key } = selection || {};
    setState(key || '');
    if (setDropdownData[props.name]) setDropdownData[props.name](key);
  };

  return (
    <>
      <label className="relative mb-2 text-gray-500 flex items-center text-sm">
        {props.label || ''}:
        {props.required ? <Required text={requiredMessage} /> : ''}
      </label>
      <input name={props.name} type="hidden" value={state} />
      <Downshift
        itemToString={item => (item ? item.value : '')}
        onChange={selection => onSelect(selection)}
      >
        {({
          getInputProps,
          getItemProps,
          getMenuProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem,
          clearSelection,
          getRootProps,
          getToggleButtonProps,
        }) => (
          <div className="w-full relative">
            <div
              {...getRootProps({}, { suppressRefError: true })}
              className="relative"
            >
              <input
                {...getInputProps()}
                required={props.required}
                placeholder={props.placeholder}
                className="p-2 w-full rounded-md border border-gray-200 text-sm border border-gray-400 hover:shadow focus:outline-none"
              />
              {selectedItem ? (
                <button
                  type="button"
                  onClick={clearSelection}
                  className="h-full absolute right-0 py-2 p-4 top-0 border border-gray-400 rounded-br-md rounded-tr-md"
                >
                  <IconPack name='close' />
                </button>
              ) : (
                <button
                  type="button"
                  {...getToggleButtonProps()}
                  className="h-full absolute right-0 py-2 p-4 top-0 border border-gray-400 rounded-br-md rounded-tr-md"
                >
                  <IconPack name={isOpen ? 'upward' : 'downward'} />

                </button>
              )}
              <ul
                {...getMenuProps()}
                className={` ${isOpen
                    ? 'absolute right-0 left-0 h-48 max-h-96 bg-white rounded-bl-md rounded-br-md border-b border-r-0 border-l border-gray-400 z-40 overflow-y-scroll shadow-lg'
                    : ''
                  }`}
              >
                {isOpen ? (
                  <>
                    {dropdownData
                      .filter(
                        item => !inputValue || onTypeFilter(inputValue, item),
                      )
                      .map((item, index) => (
                        <React.Fragment key={(item && item.key) ? item.key : `${item}_${index}`}>
                          {
                            (item && item.key) ?
                              <li
                                className={`flex items-center p-2 cursor-pointer 
                                  ${highlightedIndex === index ? 'bg-gray-50' : ''} 
                                  ${selectedItem === item ? 'bg-gray-100' : ''}`}
                                {...getItemProps({
                                  index,
                                  item,
                                })}
                              >
                                {item.icon ? (
                                  <img src={item.icon} className="w-4 mr-2" alt="" />
                                ) : null}
                                {
                                  item.component ? <span className='mr-2'>{item.component}</span> : null
                                }
                                <span>{item.value}</span>
                                <span>{item.label}</span>
                              </li>
                              : <li className='border-b border-gray-200 p-1 px-2 bg-gray-100 text-gray-400 text-sm'>{item}</li>
                          }

                        </React.Fragment>
                      ))}
                  </>
                ) : null}
              </ul>
            </div>
          </div>
        )}
      </Downshift>
    </>
  );
};

const Select = props => {
  const { dropdownList, onChange } = props;

  const onSelect = selection => {
    if (selection) {
      const selected = selection.value;
      onChange({
        target: {
          name: props.name,
          value: selected
        }
      })
    } else {
      onChange({
        target: {
          name: props.name,
          value: ''
        }
      })
    }

  };

  return (
    <div className='flex items-center'>
      <div className='flex-grow grid grid-cols-6'>
        {
          props.label ? <div className='col-span-2 text-xs text-gray-500 p-2 flex items-center justify-between text-sm leading-relaxed'>
            {props.label || ''} <small className='text-gray-900 font-medium rounded-2xl px-0.5' style={{ fontSize: '70%' }}>{props.schema?.type || props.type}</small>
            {props.required ? <Required text={requiredMessage} /> : ''}
          </div> : null
        }
        <div className='col-span-4 h-full flex items-center border-l border-r-0 focus:outline-none'>
          <ReactSelect
            name={props.name}
            options={dropdownList}
            className="text-xs w-full"
            isClearable={false}
            classNamePrefix="select"
            onChange={onSelect}
          />
        </div>
      </div>
      {/* <div className=' flex items-center mx-2 text-gray-500 overflow-y-scroll' data-tooltip-id="form-tooltip" data-tooltip-content={props.message} data-tooltip-variant='dark' data-tooltip-offset='5'>
        <IconPack name='info' title={props.message} />
      </div> */}
    </div>
  );
};


const MultiSelect = props => {
  const { dropdownList, onChange } = props;

  const onSelect = selection => {
    const selected = selection.map(i => i.value.trim()).join(',');
    onChange({
      target: {
        name: props.name,
        value: selected
      }
    })
  };

  return (
    <div className='flex items-center'>
      <div className='flex-grow grid grid-cols-6'>
        <div className="col-span-2 text-xs text-gray-500 p-2 flex items-center justify-between text-sm leading-relaxed">
          {props.label || ''} <small className='text-gray-900 font-medium rounded-2xl px-0.5' style={{ fontSize: '70%' }}>{props.schema?.type || props.type}</small>
          {props.required ? <Required text={requiredMessage} /> : ''}
        </div>
        <div className='col-span-4 h-full flex items-center border-l border-r-0 focus:outline-none'>
          <ReactSelect
            isMulti
            name={props.name}
            options={dropdownList}
            className="text-xs w-full"
            classNamePrefix="select"
            onChange={onSelect}
          />
        </div>
      </div>
      {/* <div className=' flex items-center mx-2 text-gray-500 overflow-y-scroll' data-tooltip-id="form-tooltip" data-tooltip-content={props.message} data-tooltip-variant='dark' data-tooltip-offset='5'>
        <IconPack name='info' title={props.message} />
      </div> */}
    </div>
  );
};

const FieldMap = {
  input: InputUI,
  file: File,
  textarea: Textarea,
  checkbox: Checkbox,
  select: Select,
  list: Select,
  radio: Radio,
  choose: Radio,
  tnc: TNC,
  disclaimer: Text,
  // file: File
};
const Field = props => (
  <>{FieldMap[props.field] ? FieldMap[props.field]({ ...props }) : null}</>
);

export default Field;
export { FieldMap };
