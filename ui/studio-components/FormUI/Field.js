import React, { useState } from 'react';
import Downshift from 'downshift';
import ReactSelect from 'react-select';

import IconPack from '../IconPack';


const defaultTextClass = 'w-full text-gray-500 text-sm';
const defaultInputClass =
  'p-2 w-full rounded-md border border-gray-200 text-sm border border-gray-400 hover:shadow focus:outline-none';
const defaultFileClass = 'p-2 w-full rounded-md text-sm';
const defaultCheckboxClass = 'mr-2 text-sm';
const defaultRadioClass = 'mr-1 text-sm';
const defaultTextareaClass =
  'p-2 w-full rounded-md border border-gray-200 text-sm';
const defaultSelectClass =
  'p-2 w-full rounded-md border border-gray-200 text-sm pr-4 border border-gray-400 hover:shadow';
const defaultTNCClass = 'text-blue-500 text-sm';

const requiredMessage = '*required';
const Message = props => (
  <p className={props.textClassName || "text-gray-400 text-sm pt-2 font-normal leading-relaxed"}>
    {props.message}
  </p>
);
const Required = props => (
  <span className={props.rClassName || "absolute right-0 text-gray-400 ml-1 mt-1 text-xs"}>
    {props.required}
  </span>
);

const Input = props => {
  const className = props.class || props.className || props.class_name;
  const onChange = props.onChange || (() => {});
  return (
    <input
      {...props}
      className={className || defaultInputClass}
      type={props.type || 'text'}
      name={props.name || ''}
      value={props.value}
      placeholder={props.placeholder || ''}
      onChange={onChange}
      disabled={!!props.submitted}
      required={!!props.required}
    />
  );
};

const Text = props => {
  const className = props.class || props.className || props.class_name;
  return <p className={className || defaultTextClass}>{props.placeholder}</p>;
};

const InputUI = props => {
  const className = props.class || props.className || props.class_name;
  return (
    <>
      {
        !props.hide_label ?(
          <label className="relative mb-2 text-gray-500 flex items-center text-sm">
              {props.label || ''}:
              {props.required ? <Required text={requiredMessage} {...props} /> : ''}
          </label>) : null
      }
      <Input {...props} className={className} type={props.type} />
      {props.message ? <Message {...props} /> : null}
    </>
  );
};

const File = props => (
  <>
    <label className="mb-2 text-gray-500 mr-2 flex items-center">
      {props.label || ''}
      {props.required ? <sup className="text-red-600 ml-1 mt-1">*</sup> : ''}
      :
      <Input {...props} className={defaultFileClass} type="file" />
    </label>
  </>
);

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
  const { default_value } = props;
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
    if (props.onChange) props.onChange(value);
  };
  return (
    <>
      {options.length ? (
        <label className="mb-2 text-gray-500 mr-2 flex items-center">
          <>{props.label}</>
          <>
            {props.required ? (
              <sup className="text-red-600 ml-1 mt-1">*</sup>
            ) : null}
          </>
          <>
            {options.map(option => (
              <span key={option} className="ml-2">
                <Input
                  {...props}
                  className={className || defaultRadioClass}
                  type="radio"
                  value={option}
                  checked={checked === option}
                  onChange={onChange}
                />
                {option}
              </span>
            ))}
          </>
        </label>
      ) : null}
    </>
  );
};

const Textarea = props => {
  const className = props.class || props.className || props.class_name;
  const onChange = props.onChange || (() => {});
  return (
    <>
      <label className="mb-2 text-gray-500 mr-2 flex items-center">
        {props.label || ''}
        {props.required ? <sup className="text-red-600 ml-1 mt-1">*</sup> : ''}:
      </label>
      <textarea
        className={className || defaultTextareaClass}
        name={props.name || ''}
        placeholder={props.placeholder || ''}
        onChange={onChange}
        disabled={props.submitted}
        required={props.required}
      />
    </>
  );
};

const Select = props => {
  const className = props.class || props.className || props.class_name;
  const onChange = props.onChange || (() => {});

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
        disabled={props.submitted}
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
  const { extra, dropdownList, submitted, dataSource, dataSourceKey, setDropdownData } = props;

  const [state, setState] = useState('');

  if (!extra && (!dataSource && !dataSource[dataSourceKey])) return null;

  let dropdownData = [];
  if (dataSource[dataSourceKey]) {
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
    console.log(key, props.name, setDropdownData);
    if (setDropdownData[props.name]) setDropdownData[props.name](key);
  };

  return (
    <>
      {
        !props.hide_label ? <>
          <label className="relative mb-2 text-gray-500 flex items-center text-sm">
            {props.label || ''}:
            {props.required ? <Required text={requiredMessage} /> : ''}
          </label>
        </>: null
      }

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
                  onClick={() => !submitted && clearSelection()}
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
                  <IconPack name={isOpen ? 'upward' : 'downward'}  />

                </button>
              )}
              <ul
                {...getMenuProps()}
                className={` ${
                  isOpen
                    ? 'absolute right-0 left-0 h-48 max-h-96 bg-white rounded-bl-md rounded-br-md border-b border-r border-l border-gray-400 z-40 overflow-y-scroll shadow-lg'
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
                        <React.Fragment key={(item && item.key) ? item.key :  `${item}_${index}`}> 
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
                                  <img src={item.icon} className="w-4 mr-2" alt="icon" />
                                ) : null}
                                {
                                  item.component ? <span className='mr-2'>{ item.component }</span> : null
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

const MultiSelect = props => {
  const { dropdownList, onMultiSelect: onSChange } = props;

  const onSelect = selection => {
    const selected = selection.map(i => i.value.trim()).join(',');
    onSChange({
      target: {
        name: props.name,
        value: selected
      }
    })
  };

  return (
    <>
      <label className="relative mb-2 text-gray-500 flex items-center text-sm">
        {props.label || ''}:
        {props.required ? <Required text={requiredMessage} /> : ''}
      </label>
      <ReactSelect
        isMulti
        name={props.name}
        options={dropdownList}
        className="text-sm basic-multi-select"
        classNamePrefix="select"
        onChange={onSelect}
      />
    </>
  );
};


const FieldMap = {
  input: InputUI,
  file1: File,
  textarea: Textarea,
  checkbox: Checkbox,
  select: Select,
  multiSelect : MultiSelect,
  list: SelectDropdown,
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
