import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import CredentialFormUI from '@/studio-components/ExplorerView/CredentialFormUI';
import IconPack from '@/studio-components/IconPack';
import Clipbaord from '@/studio-components/Clipbaord';
import getLogoUrl from '@/utils/logo-url';

const meta = {
    loader: true,
    submit_active_text: 'Integrating',
    submit_text: "Integrate"
}

const metaOauth = {
    loader: true,
    submit_active_text: 'Save credential',
    submit_text: "Save credential"
}

const ProviderAuthLinks = ({ selected, provider = '', title = '', endpoint =  {}, config = {} }) => {
    if (!provider) return null;
    const [ep, setEp] =  useState(endpoint);
    const [con, setCon] =  useState(config);
    useEffect(() => {
        setEp(endpoint);
        setCon(config);
    }, [endpoint]);

    return (
        <div className='text-xs mb-4 leading-relaxed p-4 bg-white border border-gray-100'>
            <div>
                <p className='flex items-center'>
                    <span>OAuth 2.0 configuration for</span>
                    <span className='flex items-center mx-0.5'>
                        <Image src={getLogoUrl(selected.id)} alt={selected.name} width={20} height={20} className='mr-0.5'/>
                        <span className='font-semibold'>{selected.name}</span>
                    </span>
                    <span>requires Authorize Origin and Authorize Callback url.</span>
                </p>
                <p>Copy paste the following pre-configured url for the Authorize Origin and Authorize Callback url as shown, in your {selected.name} configuration page.</p>
            </div>
            <div className='my-2 leading-relaxed'>
                <p className='flex items-center mb-1'>
                    <span className='text-green-700'>Authorized Origin:</span>
                    <span className='text-green-700 bg-green-50 mx-2 hover:underline bg-gray-50 border border-green-700/30 rounded-md px-1.5 py-0.5'>{ep.app_endpoint || con.app_endpoint}</span>
                    <Clipbaord text={ep.app_endpoint || con.app_endpoint}/>
                </p>
                <p className='flex items-center mb-1'>
                    <span className='text-green-700'>Authorized Callback:</span>
                    <span className='text-green-700 bg-green-50 mx-2 hover:underline bg-gray-50 border border-green-700/30 rounded-md px-1.5 py-0.5'>{ep.app_endpoint || con.app_endpoint}/auth/{provider}/callback</span>
                    <Clipbaord text={`${ep.app_endpoint || con.app_endpoint}/auth/${provider}/callback`}/>
                </p>
            </div>
            <div>
                Authorize origin is also referred as Request Origin or OAuth origin. Authorized callback is also referred as Callback URL, Request Callback or Redirect URL.
            </div>
            <div>
                Once Authorize Origin and Authorize Callback URL is configured at {selected.name} configuration page, {selected.name} will provide Client ID and Client Secret to you.
            </div>
        </div>
    )
}

export default function Configure({ user, children, provider, title, i18n, config, details, endpoint, selected, submitLock, onConfigSubmit, onDeleteCredential, }) {
    return (<>
        { user ? <>
        <div className=''>
            {children}
        </div>
        <div className={`grid grid-cols-6 p-4 py-2 bg-gray-50 border border-gray-100 text-xs text-gray-700 min-h-screen`}>
            <div className='col-span-6'>
                <div className=''>
                {
                    selected && details && details.credential_found ? 
                        <div>
                            <div className='mt-4 text-sm p-6 bg-white border border-gray-100 rounded'>
                                <h2 className='text text-gray-800 font-medium' >{i18n.provider.credentials_found_text_head}</h2>
                                <p className='mt-2 text-sm text-gray-500 leading-relaxed' >{i18n.provider.credentials_found_text}</p>
                                <div className=''>
                                    {
                                        details.masked_credentials ? <>
                                            <div className='my-4'>{selected.auth_type !== 'TOKEN' ? <>Saved <strong>{selected.name}</strong> credential for OAuth authorization</> : ''}</div>
                                            {
                                                Object.keys(details.masked_credentials).filter(item => details.masked_credentials[item]).map((item) => <div key={item} className='p-2 grid grid-cols-4 gap-4 border border-b-0 last:border-b border-gray-100'>
                                                    <span className=''>{item}</span> <span className='col-span-3 font-semibold text-green-600'>{details.masked_credentials[item]}</span>
                                                </div>)
                                            }
                                        </>: null
                                    }
                                    {
                                        details.used_scopes && details.used_scopes.length ? 
                                            <>
                                                <div className='my-4'>Scope used for <strong>{selected.name}</strong>'s OAuth authorization</div>
                                                {
                                                    details.used_scopes.map((scope, index)=><div className='p-2 grid grid-cols-4 gap-4 border border-b-0 last:border-b border-gray-100'>
                                                        <span className=''>{index + 1}</span> <span className='col-span-3 text-green-600 truncate'>{scope}</span>
                                                    </div>)
                                                }
                                            </>
                                        : null
                                    }
                                </div>
                            </div> 
                            <div className='mt-4 p-6 bg-white '>
                                <p className='my-2 text-sm leading-relaxed'>To change the credential, click on the below button to remove the existing one and add new credential again.</p>
                                <div className='flex justify-end'>
                                    <button 
                                        className={`flex items-center p-1 px-1.5 text-sm rounded-md border ${submitLock ? "border-gray-200 text-gray-300" : "border-red-400 text-red-500 hover:shadow-md"}`}
                                        onClick={() => onDeleteCredential(provider)}
                                        disabled={!!submitLock}
                                    >
                                        <IconPack name='trash' ></IconPack> 
                                        <span className='ml-1'>{ selected.auth_type !== 'TOKEN' ? `Remove`: `Remove`}</span>
                                    </button>
                                </div>
                            </div>
                        </div> 
                        : 
                        <div>
                            <>
                                <div className='my-4 text-sm text-gray-600'>
                                    <p className='leading-relaxed'>
                                        <span>To access</span>
                                        <span className='mx-0.5'>{title}</span>
                                        <Image src={getLogoUrl(selected.id)} width={20} height={20} alt={selected.name} className='inline-block' />
                                        <span className='mx-0.5'>apis endpoints, get the { details.connectLink ? 'OAuth': 'API'} credential(s) from the this link</span>
                                        <a href={`${details.credential_link}`} className="underline text-blue-600" target="_blank">{details.credential_link}</a>
                                    </p>
                                </div>
                                {
                                    details.connectLink ? <ProviderAuthLinks selected={selected} endpoint={endpoint} title={title} provider={provider} config={config}  /> : null
                                }
                                
                            </>
                            {
                                (details.provider_config && details.provider_config.length) ? 
                                    <div className='md:p-8 md:pt-1 p-2 bg-gray-100 h-[600px] overflow-y-scroll'>
                                        <CredentialFormUI
                                            meta={details.connectLink ? metaOauth : meta}
                                            scopes={selected.scope}
                                            fields={details.provider_config}
                                            setDropdownData={{}}
                                            onSubmit={onConfigSubmit}
                                            dataSource={{}}
                                            submitLock={submitLock}
                                        /> 
                                    </div>
                                    : 
                                    <p className='text-xs'>
                                        <Link className="underline" href='/login'>Login</Link> 
                                        { config && config.signup ? <span className='ml-1'>or <Link className="underline" href='/signup'>Signup</Link></span>: null }
                                        <span className='ml-1'>to integrate {title} in your account</span>
                                    </p>
                            }
                        </div>
                }
                </div>
            </div>
        </div>
        </> : <div className='text-sm p-4 py-2 bg-gray-50 border border-gray-100 text-gray-700 min-h-screen'>
            <p className='text-xs'>
                <Link className="underline" href='/login'>Login</Link> 
                { config && config.signup ? <span className='ml-1'>or <Link className="underline" href='/signup'>Signup</Link></span>: null }
                <span className='ml-1'>to integrate {title} in your account</span>
            </p>
        </div>
        }
    </>)
}