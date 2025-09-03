import Image from 'next/image';
import Link from 'next/link';

import IconPack from '@/studio-components/IconPack';

import IntentAction from '@/studio-components/ProviderPage/IntentAction';
import IntentMetrics from '@/studio-components/ProviderPage/IntentMetrics';

function IntentHead({ children, userAuthorized, view, selected, metrics, activeCategory, activePath, total_providers, api_endpoints, intentAction, uriLocation = '', bookmark=true, pin=true, onClickTab, onSaveAction = () => {}, onDeleteAction = () =>{} }) {

    if (!view || !view.route_name || !selected) return null;

    return (<>
        <div className='p-4 py-0 pb-2 bg-gray-50'>
            <div className='flex items-center justify-between text-xs p-2 bg-gray-100'>
                <div className='flex items-center font-medium '>
                    {
                    view.sponsors || view.featured ? 
                        <a href={`https://lowcodeapi.com/${selected.id}?ref=${uriLocation}`} target={'_blank'} className='flex items-center font-medium '>
                            <Image 
                                src={selected.logo_url}
                                className={``} 
                                alt={selected.name} 
                                width={14}
                                height={14}
                                onClick={() => onClickTab(view)}
                            /> 
                            <span className='ml-1'>{selected.name}</span>
                        </a> 
                    : 
                        <>
                            { activeCategory || activePath || selected.featured ? 
                                <Link href={`/${selected.id}`} className='flex items-center font-medium hover:underline'>
                                        <Image 
                                            src={selected.logo_url}
                                            className={``} 
                                            alt={selected.name} 
                                            width={14}
                                            height={14}
                                            onClick={() => onClickTab(view)}
                                        /> 
                                        <span className='ml-1'>{selected.name}</span>
                                    </Link>
                                : <>
                                    <Image 
                                        src={selected.logo_url}
                                        className={``} 
                                        alt={selected.name} 
                                        width={14}
                                        height={14}
                                        onClick={() => onClickTab(view)}
                                    />
                                    <span className='ml-1'>{selected.name}</span>
                                </>
                            }
                        </>
                    }

                    <IconPack name="rightangle"/> 
                    {
                        (!activeCategory || (activeCategory.trim() !== view.tags.join(''))) ? <>
                            <Link href={`/${selected.id}?category=${view.tags}`} className='font-medium hover:underline'>
                                <span className=''>{view.tags}</span>
                            </Link>
                            <span className=''>
                                <IconPack name="rightangle"/> 
                            </span>
                        </>
                        : 
                        <>
                            <span className='font-medium text-green-700'>{view.tags}</span>
                            <span className='font-medium text-green-700'>
                                <IconPack name="rightangle"/> 
                            </span>
                        </>
                    }
                    
                    {
                        (activeCategory || selected.featured || !activePath) ? <> 
                            <Link href={`/${selected.id}?path=${view.route_name}`} className="font-medium hover:underline">
                                <span className="mr-2">{view.summary}</span></Link> </> 
                        :
                        <> <span className={`font-medium mr-2 ${activePath  ? 'text-green-700': ''}`}>{view.summary} </span></>
                    }
                    {
                        userAuthorized ? <div className='mr-1 flex items-center'>
                            <IntentMetrics view={view} provider={selected.id} metrics={metrics} />
                            <IntentAction 
                                view={view}
                                bookmark={bookmark}
                                pin={pin}
                                intentAction={intentAction}
                                provider={selected.id}
                                api_endpoints={api_endpoints}
                                onDeleteAction={onDeleteAction}
                                onSaveAction={onSaveAction}
                            />
                        </div> : null
                    }
                    {
                        !pin ? <>
                            <Link href={`/${selected.id}`} className='flex items-center font-medium text-gray-700/80 bg-gray-200 border border-gray-300/50 p-1 px-1.5 text-gray-700 rounded-md underline'>
                                <span className=''>View Other {selected.total_api -1} APIs of {selected.name}</span>
                            </Link>
                        </> : null 
                    }
                </div>
                <div className='flex items-center'>
                {
                    userAuthorized ? <div className='flex items-center'>
                        {children}
                        </div>
                    : null
                }
                </div>
            </div>
        </div>
    </>)
}

export default IntentHead;