import React from 'react';
import PropTypes from 'prop-types';

import IconPack from '../IconPack';

const iconMap = {
  settings: 'settings',
  apis: 'apis',
  config: 'config',
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function getClass(tab) {
  return (
    <>
      {!tab.lock
        ? 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300 cursor-pointer'
        : 'border-transparent text-gray-400'}
    </>
  );
}
function Tabs({ active, tabs, defaultTabRight, setActive, details }) {
  const onClick = tab => {
    setActive(tab);
  };

  return (
    <>
      <div className="flex justify-between border-b border-gray-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.name}
              type="button"
              className={classNames(
                // eslint-disable-next-line no-nested-ternary
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center',
                tab.id === active
                  ? 'border-gray-400 text-gray-600'
                  : getClass(tab),
              )}
              aria-current={tab.id === active ? 'page' : undefined}
              onClick={() => tab.id !== active && !tab.lock && onClick(tab.id)}
            >
              <span className="mr-1 text-xs">
                {tab.lock ? (
                  <>
                    <IconPack name='lock'/>
                  </>
                ) : (
                  <>
                    <IconPack name={iconMap[tab.id] || ''} />
                  </>
                )}
              </span>
              {tab.name}
            </button>
          ))}
        </nav>
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {defaultTabRight.map(tab => (
            <button
              type="button"
              key={tab.name}
              className={classNames(
                tab.id === active
                  ? 'border-gray-400 text-gray-600'
                  : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300 cursor-pointer',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center',
              )}
              aria-current={tab.id === active ? 'page' : undefined}
              onClick={() => tab.id !== active && onClick(tab.id)}
            >
              <span className="mr-1 text-xs">
                <IconPack name={iconMap[tab.id] || ''} />
              </span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

Tabs.propTypes = {
  details: PropTypes.object,
  history: PropTypes.object,
  defaultTabRight: PropTypes.array,
  tabs: PropTypes.array,
  active: PropTypes.string,
  setActive: PropTypes.func,
};

export default Tabs;
