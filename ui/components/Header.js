import React, { useEffect, useState, Fragment } from 'react';
import Link from 'next/link'
import { Popover, Transition } from '@headlessui/react'
import navs from '@/static-json/nav';

import getLogoUrl from "@/utils/logo-url";

const navigation = [];

const Header = ({ api_count =0 ,brand ="", BASE_PATH = '', BASE_PATH_FALLBACK= '/' }) => {
  const signupLink = `${BASE_PATH}/signup`;
  const loginLink = `${BASE_PATH}/login`;

  const dashboard = BASE_PATH || BASE_PATH_FALLBACK;

  const logo = brand.toLowerCase();
  const [ auth, setAuth ] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuth(token);
  },[]);
  return <>
          <Popover>
          <nav
            className="flex items-center justify-between"
            aria-label="Global"
          >
            <div className="flex items-center flex-1 justify-between">
              <header className="text-gray-800 md:flex md:flex-1 md:items-center md:m-auto -mx-4 p-2 px-0">
                <div className='md:flex md:flex-grow md:items-center'>
                  <div className='ml-6 md:ml-0'>
                    <Link
                      href={"/"}
                      className="flex items-center font-bold text-gray-700 text-2xl "
                      >
                      <span className='flex'>
                        <span className="mr-1 flex">
                          <img src={getLogoUrl(logo)} className="w-6 mr-1.5" alt={brand} />
                          {brand}
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
                <div className='mr-2 ml-6 pb-2'>
                  {
                      navs.right.map(item => (
                        <React.Fragment key={item.name}>
                          {
                            auth ?               
                              <Link href={item.path} className="font-semibold hover:underline">
                                <span>{item.auth_text}</span>
                              </Link> : null
                          }
                        </React.Fragment>

                      ))
                  }
                  {
                    !auth ?   
                      <div className='md:flex md:items-center'>
                        <Link
                          href={signupLink}
                          className="hidden md:block text-gray-700 mr-4 p-2 px-3 text-white bg-blue-600 hover:shadow-md">
                          
                          <span>Signup</span>
                        </Link> 
                        <Link
                          href={loginLink}
                          className="hidden md:block text-gray-700 hover:underline">
                          
                          <span>Login</span>
                        </Link> 
                      </div>            
                      : 
                      <Link
                        href={dashboard}
                        className="hidden md:block bg-gray-50 shadow hover:shadow-lg text-sm border border-gray-200 p-2 rounded-md">
                        
                        <span>Access Interface</span>
                      </Link> 
                  }        
                </div>
              </header>
            </div>
          </nav>

          <Transition
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
            >
              <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="px-5 pt-4 flex items-center justify-between">
                  <div>
                    <img
                      className="h-8 w-auto"
                      src={getLogoUrl(logo)}
                      alt=""
                    />
                  </div>
                  <div className="-mr-2">
                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="sr-only">Close main menu</span>
                    </Popover.Button>
                  </div>
                </div>
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <a
                  href="/auth/googlesheet"
                  className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100"
                >
                  Log in
                </a>
              </div>
            </Popover.Panel>
          </Transition>
    </Popover>
  </>;
}
export default Header
