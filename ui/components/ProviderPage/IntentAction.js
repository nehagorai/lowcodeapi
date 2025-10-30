import { useEffect, useState } from 'react';
import queryString from 'query-string';

import IconPack from '@/components/IconPack';
import apiRequest from '@/utils/request';

export function IntentAction({ bookmark= true, pin = true, provider, view, intentAction, api_endpoints, onSaveAction = () =>{} , onDeleteAction = () =>{} }) {
    if (!intentAction) return null;
    
    const { BASE_API } = api_endpoints;
    const [buttonLock, setButtonLock] = useState(false);
    const [loadingWait, setLoadingWait] = useState(() => true);
    // useEffect(() => {
    //     if (view) {
    //         setLoadingWait(true);
    //         ;(async () => {
    //             try {
    //                 const method = view.method;
    //                 const intent = view.route_name;
    
    //                 const qs1 = queryString.stringify({ mode: 'fav', method, provider,  intent });
    //                 const fav = await apiRequest(`${BASE_API}/intent?${qs1}`, {}).catch((error) => ({ error }));
    //                 const qs2 = queryString.stringify({ mode: 'pin', method, provider,  intent });
    //                 const pinned = await apiRequest(`${BASE_API}/intent?${qs2}`, {}).catch((error) => ({ error }));
    //                 const localIntentAction = { ...intentAction };
    //                 setIntentAction({
    //                     ...localIntentAction,
    //                     [intent]: {
    //                         fav: !!fav.results,
    //                         pin: !!pinned.results
    //                     } 
    //                 });
    //             } catch(e) {
    //                 console.log(e);
    //             }
    //             console.log({ loadingWait })
    //             setLoadingWait(false);
    //         })();
    //     }
    // }, [view]);

    const saveUsersIntentAction = async(apiView, mode = '') => {
        if (!mode || buttonLock) return;
        setButtonLock(true);
        const intent = apiView.route_name;
        const body = {
            provider,
            intent,
            method: apiView.method,
            mode
        };

        const url = `${BASE_API}/intent`;

        try {
            await apiRequest(url, {
                method: "POST",
                body,
            });

            const localIntentAction = { ...intentAction };

            if (onSaveAction && typeof onSaveAction === 'function') {
                onSaveAction({
                    ...localIntentAction,
                    [intent]: {
                        ...localIntentAction[intent],
                        [mode]: true,
                    } 
                });
            }
            setButtonLock(false);
        } catch (e) {
            console.error('Error saving intent action', e);
            setButtonLock(false);
        }
    }

    const deleteUsersIntentAction = async(apiView, mode = '') => {
        if (!mode || buttonLock) return;
        setButtonLock(true);
        const intent = apiView.route_name;
        const qs = queryString.stringify({
            provider,
            intent,
            method: apiView.method,
            mode
        });

        const url = `${BASE_API}/intent?${qs}`;

        try {
            await apiRequest(url, {
                method: "DELETE",
            });
            const localIntentAction = { ...intentAction };
            setButtonLock(false);
            if (onDeleteAction && typeof onDeleteAction === 'function') {
                onDeleteAction({
                    ...localIntentAction,
                    [intent]: {
                        ...localIntentAction[intent],
                        [mode]: null,
                    } 
                });
            };
        } catch (e) {
            console.error('Error delete intent action', e);
            setButtonLock(false);
        }
    }

    return (<>
        <div className='flex items-center'>
            {
                bookmark  ? <>
                {
                    intentAction[view.route_name] && intentAction[view.route_name].fav ? <>
                        <button className="flex items-center text-yellow-700/80 hover:text-yellow-700/90" onClick={() => deleteUsersIntentAction(view, 'fav',)}
                        title='You have bookmarked this API. All bookmarked apis can be viewed on /bookmarks.'    
                        >
                            <span className='flex items-center '>
                                <IconPack name='starSolid' className=""/>
                            </span>
                        </button>
                    </> : <>
                        <button className="flex items-center text-gray-700/80 hover:text-gray-900" onClick={() => saveUsersIntentAction(view, 'fav')}>
                            <span className='flex items-center'>
                                <IconPack name='star' className=""/>
                            </span>
                        </button>                                                    
                    </>
                }
                </> : null 
            }
        </div> 
    </>)
}

export default IntentAction;
