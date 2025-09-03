import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import ProfileTab from '@/studio-components/ProfileTab';

import userAvatar from '@/public/avatar.svg';
import google from '@/public/assets/google-login.svg';

const logo = {
  googleLogin: google.src
}
const defaultTabs = [
  {
    "id": "build",
    "name": "Deploy",
    "title": "Deploy your integration in minutes",
    "disabled": false,
    "released": true,
    "visible": true
  },
  {
    "id": "api-keys",
    "name": "API Token",
    "title": "Generate API Token",
    "disabled": false,
    "released": true,
    "visible": true
  },
];

const navsDefault = [];

const Bar = ({ info = {}, config = {} , home , endpoint, BASE_PATH = '', BASE_PATH_FALLBACK = '/', navs = navsDefault, user, brand, onLogout, hideNav = false }) => {
  const { name, disable_tabs, tabs = defaultTabs } = info;
  const homeLink = home || BASE_PATH || BASE_PATH_FALLBACK;
  const completeRegistration = `${BASE_PATH}/pending-action`;
  const signupLink = `${BASE_PATH}/signup`;
  const loginLink = `${BASE_PATH}/login`;
  
  const [href, setHref] = useState(''); 
  useEffect(() => {
    const href= window && window.location.href;
    setHref(href);
  },[]);

  return <div className="container mx-auto md:px-8 px-4">
      <div className='flex justify-between md:items-center md:h-[40px]'>
        <div className='md:flex md:items-center md:justify-between'>
          <div className="">
            <Link href={homeLink} className='flex items-center '>
              <span className="mr-1 flex font-bold text-gray-700 text-2xl">
                <span>{brand || name} </span>
              </span>
            </Link>
          </div>
          {
            !disable_tabs && tabs.length ? <div className={ tabs.length ? 'md:mx-2' : ''}>
            {
              tabs.map((item)=>(
                user && user.name ? 
                  <Link href={`/${item.id}`} key={item.id} className='text-xs font-medium text-gray-600 underline hover:text-gray-700 p-1 uppercase' title={item.title}>{item.name}</Link> 
                  :  
                  null))
            }
            </div> : null
          }
        </div>
        <div className='flex ml-4 mt-1'>
        {
          user && user.name ? 
            <div className='flex text-xs'>
              <ProfileTab
                title={`${user.email} ${user.subscription_active ? '': ''}`}
                name={user.name}
                data={user}
                pro = {user.subscription_active}
                country_code={user.country_code}
                avatar={Object.keys(user.avatars || {}).length? user.avatars : userAvatar}
                onClick={onLogout}
              />
            </div> 
            : <>
            {
              !hideNav ? <>
                <div className='py-2 border-t border-gray-100  text-xs'>
                {
                  user.guest ? <>
                    {
                      config.signup || config.login ? <>
                          <div className='mt-1 text-xs text-gray-600 p-1 bg-gray-200 rounded-md'>
                            <a href={`${endpoint}/auth/google`} className="w-full flex items-center justify-center pr-3 pl-1 bg-white border border-gray-300 rounded-md">
                                <img src={logo.googleLogin} className="w-8 h-8" alt={`Authenticate with Google`}  />
                                <span className='-ml-1 text-gray-600 font-semibold'>Sign in with Google</span>
                            </a>
                          </div>
                      </> : null
                    }
                  </> : <>
                  
                  </>
                }
                </div> 
              </>  : null
            } 
            </>                              
        }
        </div>
      </div>
    </div>;
};

export default Bar;
