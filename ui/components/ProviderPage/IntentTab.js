import React, { useRef, useEffect} from 'react';

import Image from 'next/image';

import HTTPMethodLabel from '@/components/HTTPMethodLabel';
import IconPack from '@/components/IconPack';
import getLogoUrl from '@/utils/logo-url';

const classHelper = (tabView, ative, renderingWait) => {
    if (tabView.hash === ative.hash && renderingWait) {
        return `bg-green-50/50 border-green-600`;
    } else if (tabView.hash === ative.hash) {
        return `bg-gray-50/50 border-green-600 text-gray-800`;
    } else if (tabView.hash !== ative.hash && renderingWait) {
        return `bg-gray-50/50 border-red-200/50 text-gray-700 cursor-not-allowed`;
    } else {
        return `bg-white border-gray-100 text-gray-700 hover:border-gray-600`;
    }
}
export function IntentTab ({ fixed = false, renderingWait=false, selected, provider, view, title, tabView, onClickTab, imgFallback, onError, onClose }) {
    const name = title.trim() || `${title.trim().split(' ')[0]}`;
    const activeTab = useRef(null);

    return (<div className={`flex-none relative truncate min-w-24 max-w-48 flex items-center justify-between text-xs p-2 pr-3 border-t-2 ${classHelper(tabView, view, renderingWait)}`} ref={ view.hash === tabView.hash ? activeTab : null}>
        <div className='flex items-center'>
            <small className='absolute top-0 ml-2 left-0'>
                <small className='font-semibold'>
                    <HTTPMethodLabel name={view.method} />
                </small>
            </small>
            <button className='mt-1.5 flex-grow'
                title={`${selected.name || provider} > ${title}`}
                onClick={() => !renderingWait && onClickTab(view)}
            >
                {
                    view.sponsors ? <small className='absolute top-0 mr-1 right-0 text-green-700'>
                        <small>
                            Ad
                        </small>
                    </small> : <>
                    {
                        view.featured ? <small className='absolute top-0 mr-1 right-0 text-orange-700'>
                            <small>
                                Featured
                            </small>
                        </small> : <>
                            {
                                view.home ? <small className='absolute top-0 mr-1 right-0 '>
                                    <small>
                                        Pinned
                                    </small>
                                </small> : null
                            }
                        </>
                    }
                    </>
                }
                <div className='flex-grow flex flex-col items-start'>
                    <div className='flex items-center'>
                        <Image 
                            src={getLogoUrl(selected.logo_path || imgFallback[selected.id] || selected.alias ||selected.id, { full_url: selected.logo_url})}
                            className={`mr-1`} 
                            alt={selected.name} 
                            width={14}
                            height={14}
                            onError={(e) => onError(e, selected.id)}
                            onClick={() => onClickTab(view)}
                        />
                        <span type="button" className={`flex-grow flex items-center text-xs truncate ${view.featured ? 'text-orange-700': ''} ${view.sponsors ? 'text-green-700': ''}`} >
                            <span className={``}>
                                {name} 
                            </span>
                        </span>
                    </div>
                </div>
            </button>
            {
                (tabView.hash !== view.hash) && !fixed ? 
                    <button className='absolute top-0 mr-1 right-0' onClick={() => onClose(view)}>
                        <IconPack name='close' />
                    </button>
                : null 
            }
            {
                renderingWait && (tabView.hash === view.hash) ? <span className='absolute top-0 mr-1 mt-1 right-0'><IconPack name="spin" animate={true} /></span> : null
            }
        </div>
    </div>)
}

export default IntentTab;
