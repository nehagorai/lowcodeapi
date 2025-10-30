import Link from 'next/link';

import google from '@/public/assets/google-login.svg';

import UserLoginUI from '.';

const logo = {
    google: google.src
}
  
export default function UserView({ i18n, info = {}, enable = {}, form, intent, lock, message, onSubmit, endpoint, authProvider, providers = [], altLink = { href: '/login', text: 'Login'} }) {
    const onClick = (url) => {
      if (url && window) {
        window.location.href = url;
        return;
      }
    }
    return (<>
        <div className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-20">
            <div className="md:max-w-7xl md:mx-auto h-full flex flex-row justify-center items-center px-4 sm:px-6 md:px-8 pt-2 pb-6 md:py-6 ">
                <div className="w-full  md:p-10 py-8 text-gray-700">
                    {
                      !enable.disabled_all ? <div className='w-full mt-4 md:mt-0 p-4 md:p-12 rounded-md'>
                        <div className='bg-white w-full m-auto flex flex-col mt-4 md:mt-0 p-4 md:p-12 rounded-md'>
                        {
                            !intent && !enable.disable_google ?
                            <div className='w-full   pt-4 '>
                            {
                                authProvider.map(provider=>(
                                <button key={provider.name} href={`${endpoint}/${provider.href}`} onClick={() => onClick(`${endpoint}/${provider.href}`)} className="w-full flex items-center justify-center shadow md:shdown-md bg-white rounded-md border border-gray-400">
                                    <img src={logo[provider.logo]} className="" alt={`${provider.name} icon`} width='40' height='40' />
                                    <span className='ml-1 text-gray-600   font-semibold'>{provider.text}</span>
                                </button>
                                ))
                            }
                            </div> : null
                        }
                        {!intent && !enable.disable_email ? (<>
                              <div className='w-full   mt-4 text-center text-gray-600 font-semibold text-sm'>
                                { enable.google ? <>Or You can</> : <></>}
                                {form.email.meta.divider_text}
                              </div>
                              <div className="w-full   ">
                                  <UserLoginUI
                                    i18n={i18n}
                                    onChange={() => {}}
                                    form={form}
                                    lock={lock}
                                    endpoint={endpoint}
                                    onSubmit={onSubmit}
                                  />
                              </div>
                              {/* {
                                altLink && enable.alternate && !enable.alternate.disable_email ? <div className='flex justify-end'>
                                  <Link href={altLink.href} className="underline text-sm">{altLink.text}</Link>
                                </div> : null
                              } */}

                          </>
                        ) : ( <>
                          {
                            message ? <div>
                              <p className="text-blue-500 text-sm bg-blue-50 p-2 py-4 text-center leading-relaxed tracking-wide">
                                  {message}
                              </p>
                            </div> : null
                          }
                        </>

                        )}
                        </div>
                      </div> : null
                    }

                </div>
            </div>
      </div>    
    </>)
}