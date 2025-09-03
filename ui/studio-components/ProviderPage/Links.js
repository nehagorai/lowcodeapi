import React from 'react';

import BadgeUI from '../BadgeUI';
import IconPack from '../IconPack';

const OAUTH_MODE = ['OAUTH2.0', 'OAUTH1.0', 'OAUTH1.0a'];

export function Links ({ wait, auth_type, integrated, authorized, credentials, system_creds, name , provider, endpoint }) {
    if (!auth_type) return null;
    if (wait) {
        return (<>
            <div className='flex items-center relative text-xs'>
                <IconPack name="spin" />
            </div> 
        </>)
    }
    return <>
        <div className='flex items-center relative'>
            {
                OAUTH_MODE.includes(auth_type) ?
                    <>
                        {
                            authorized ? <>
                                {/* <span 
                                    className={`flex items-center px-2 py-1 text-xs text-green-600 border border-green-500 rounded-xl`}
                                >
                                    <span className=''>
                                        <BadgeUI animate={false} className="h-2 w-2"/>
                                    </span>
                                    <span className='ml-1'>Connected</span>
                                </span> */}
                                <a 
                                    href={`${endpoint.app_endpoint}/auth/${provider}`}
                                    title={`App is Authorized to access ${name || provider} APIs. Authorize again to update the access.`} 
                                    className="flex items-center text-xs border border-blue-500 bg-blue-500 text-blue-100 px-1.5 py-1 ml-1.5 rounded-md shadow-md hover:shadow-sm cursor-pointer"
                                >

                                    <span className="">Authorize Again</span>
                                </a>
                            </> : <> 
                                {
                                    system_creds || credentials ? <div className='text-xs'>
                                        <div className='flex items-center justify-end'>
                                            {/* <span 
                                                className={`text-xs text-orange-700`}
                                            >
                                                Not Connected
                                            </span> */}
                                            <a 
                                                href={`${endpoint.app_endpoint}/auth/${provider}`}
                                                title={`Authorize ${name || provider} to access APIs`} 
                                                className="flex items-center text-xs border border-blue-500 bg-blue-500 text-blue-100 px-1.5 py-1 ml-1.5 rounded-md shadow-md hover:shadow-sm cursor-pointer"
                                            >

                                                <span className="">Authorize</span>
                                            </a>  
                                        </div> 
                                        <div className='mt-1'>
                                            {
                                                system_creds ? 
                                                    <>{`Authorize using pre-configured credential.`}</>: null
                                            }
                                        </div>                                     
                                    </div> : <span className='flex items-center text-orange-700' title={`Click on configuration tab and configure your ${name || provider} OAuth credential`}>
                                        {/* <IconPack name="warn" /> 
                                        <span className='ml-1 text-xs'>Configuration Pending</span> */}
                                    </span>
                                }
                            </>
                        }
                    </>
                :
                    <>
                        {/* {
                            integrated ? <>
                                <span
                                    title={`${provider} is connected`} 
                                    className={`flex items-center px-2 py-1 text-xs text-green-600 border border-green-500 rounded-xl`}
                                >
                                    <span className=''>
                                        <BadgeUI animate={false} className="h-2 w-2"/>
                                    </span>
                                    <span className='ml-1'>Integrated</span>
                                </span>
                            </> : <>
                                <span className='flex items-center text-orange-700' title={`Click on configuration tab and configure your ${name || provider} OAuth credential`}>
                                    <IconPack name="warn" /> 
                                    <span className='ml-1 text-xs'>Configuration Pending</span>
                                </span>
                            </>
                        } */}
                    </>
            }
        </div>
    </>
}

export default Links;
