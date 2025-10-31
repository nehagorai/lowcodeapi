import React, { memo, Fragment, useEffect, useState } from 'react';
import mime from 'mime-types';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import dynamic from 'next/dynamic';
const JsonView = dynamic(() => import('@microlink/react-json-view'), { ssr: false });


const IMAGE_CONTENT_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const AUDIO_CONTENT_TYPES = /audio\/(.+)?$/;
const PDF_CONTENT_TYPES = ['application/pdf'];

const ApiResponse = ({intentRequestData, view, setView}) => {
    const { headers, data } = intentRequestData;
    if (!data || !headers) return <div className="p-4 flex justify-between items-center text-xs rounded-md bg-white/50 border-2 border-gray-300 border-dashed">
        API response data will be shown here once the request is completed.
    </div>;
    const contentType = headers['content-type'];
    const isImage = IMAGE_CONTENT_TYPES.includes(contentType);
    const isAudio = AUDIO_CONTENT_TYPES.test(contentType);
    const isPDF = PDF_CONTENT_TYPES.includes(contentType);

    const extension = contentType ? mime.extension(contentType.split(';')[0]) : '';
    let blob = '' ;
    try {
        blob = isImage && URL.createObjectURL(data);

    } catch (e) {
        console.log(e);
    }
    const dataObj = (isImage || isPDF || isAudio ) && window.URL.createObjectURL(new Blob([data]));

    return (<>
        <div className=''>
        <div className="flex justify-between items-center mb-4 text-sm ">
            <div className="text-xs">
            {
                false && apiData.data ? <>
                {
                    apiData.data.result ? <>
                    <button className={`p-1 pl-0 mr-2 ${view.type ==='response'? 'cursor-not-allowed	': ''}`} type="button" onClick={()=> setView({ type: 'response',display: apiData.data})}>API Response</button>
                    <button className={`p-1 pl-0 mr-2 ${view.type ==='data'? 'cursor-not-allowed	border-b border-gray-700': ''}`} type="button" onClick={()=> setView({ type: 'data',display: apiData.data.res.data})}>Provider Data</button>
                    <button className={`p-1 pl-0 mr-2 ${view.type ==='headers'? 'cursor-not-allowed	border-b border-gray-700': ''}`} type="button" onClick={()=> setView({ type: 'headers',display: apiData.headers})}>Provider Headers</button> 
                    </>: null
                }
                {
                    view.type === 'error'? 
                    <button className={`p-1 pl-0 mr-2 ${view.type ==='error'? ' cursor-not-allowed	border-b border-gray-700': ''}`} type="button" onClick={()=> setView({ type: 'error',display: apiData.error})}>Error</button>
                    : null
                }
                </> : null
            }
            </div>
        </div>
        
            {
            isImage ? <>
                <div className=''>
                    <img src={`${blob}`} className="border-2 border-gray-600 mb-4 "/>
                    <div>
                    <a href={dataObj} download={`screenshot.${extension}`} target='_blank'  className='underline' title='Save screenshot'>Download</a>
                    </div>
                </div>
            </> : null 
            }
            {
            isPDF ? <div>
                <a href={dataObj} download={`pdf.${extension}`} target='_blank'  className='underline' title='Download pdf'>Download PDF</a>
            </div> : null
            }
            {
            isAudio ? <div>
                <a href={dataObj} download={`audio.${extension}`} target='_blank'  className='underline text-xs' title='Download Audio'>Download Audio</a>
                <div className='mt-2'>
                <AudioPlayer src={dataObj} autoPlay controls/>
                </div>
            </div> : null
            }
            { 
            !isPDF && !isImage && !isAudio ?
                <div className='overflow-y-scroll min-h-full h-[400px] bg-white  rounded-md'>
                    <JsonView name={null} src={view.display} />
                </div> : null
            }
            
        </div>
    </>)
}
export default function API({ intentRequestData, i18n, responseView: view, setResponseView: setView }) {

    return (<div className='h-fll min-h-[400px] bg-gray-100 '>
        <div className=''>
            <div className="pb-4 text-xs flex justify-between">
            <span className={` pl-0 font-semibold`}>Response</span>
            <div className="text-xs">
                {intentRequestData.data && intentRequestData.data.cached ? (
                <span className="mx-1">{i18n.served_from_cache_txt || 'Served from cache'} | </span>
                ) : null}
                {
                intentRequestData.status 
                    ?          
                    <> 
                        { i18n.served_from_cache_txt || 'Status'}:{' '}          
                        <span className="mx-1 text-blue-500">
                        {intentRequestData.status} {intentRequestData.statusText}
                        </span> 
                        | Size: <span className="ml-1 text-blue-500">{intentRequestData.size || 0}</span>
                    </>
                    : null
                }
            </div>
            </div>
            <ApiResponse intentRequestData={intentRequestData} view={view} i18n={i18n} setView={setView} />
        </div>
    </div>)
}
