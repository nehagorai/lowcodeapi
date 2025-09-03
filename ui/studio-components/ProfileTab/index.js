import React from 'react';

const ProfileTab = ({
  name,
  title='',
  avatar,
  i18n = {},
  children,
  onClick,
}) => {
  let image = null;
  if (typeof avatar === 'object' && !avatar.src) {
    image = avatar.google || avatar.googlesheet || avatar.googledocs || avatar.twitter;
  } else {
    image = avatar.src;
  }

  return (
    <>
      <div className="flex-shrink-0 flex ">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex" >
            <div className={`rounded-full p-1 `}>
              <img
                data-tip={title}
                title={title}
                className="inline-block h-6 w-6 rounded-full"
                src={image}
                alt={name}
              />
            </div>
            <div className="md:ml-1">
              <p className="flex items-center leading-5 font-medium text-gray-700 group-hover:text-gray-900">
                <span className="mr-2" title={title}>{name}</span>
              </p>
              {
                onClick ? 
                  <p className="text-xs leading-4 font-medium text-gray-500 group-hover:text-gray-700 transition ease-in-out duration-150">
                    <button
                      type="button"
                      className="underline cursor-pointer"
                      onClick={onClick}
                    >
                      {i18n.logout_txt || 'Logout'}
                    </button>
                  </p> 
                : <>{children}</>
              }

            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default ProfileTab;
