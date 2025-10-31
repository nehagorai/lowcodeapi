
import React, { use, useEffect, useState } from 'react';
import Image from 'next/image';

import Highlight from 'react-highlight'
import Clipbaord from '../Clipbaord';
import('../../../node_modules/highlight.js/styles/vs2015.css');

export default function GeneratorSnippet({ language, codeMap, query, onLanguageSelect, readOnly= false }) {
    const languages = Object.keys(codeMap);
    const [activeClipboard, setActiveClipboard] = useState('');

    useEffect(() => {
        return () => {
            setActiveClipboard('');
        }
    }, []);

    const onCopyToClipboard = (text) => {
        setActiveClipboard(text);
    }
    return (<>
        <div className="">
            <div className="flex items-center justify-between mb-4">
                <div className='flex items-center text-xs mr-2'>
                    <select className='p-1 px-1 bg-gray-100 border border-gray-300 rounded-md focus:outline-none' 
                        onChange={onLanguageSelect}
                    >
                        <option>{codeMap[language].text}</option>
                        {
                        languages.filter((item) => !(item === language)).map((item)=> (
                            <option key={item} value={codeMap[item].code}>{codeMap[item].text}</option>
                        ))
                        }
                    </select>
                    {
                        language ? <span className='mx-2'>
                            <Image src={codeMap[language].logo} className="w-4 h-4" width={16} height={16} alt={codeMap[language].text} title={codeMap[language].text}/>
                        </span>: null
                    }
                </div>
                <div className='relative flex items-center p-1 text-xs rounded-md shadown-sm'>
                    {
                    true ? <>
                        <Clipbaord text={query.buildUrl} active={query.displayUrl === activeClipboard} onCopy={onCopyToClipboard}>
                            <span className='ml-1 mx-2' title={`Copy url\n\n${query.displayUrl}`}>Copy API url</span>
                        </Clipbaord>
                        <Clipbaord text={query.snippet}  active={query.snippet === activeClipboard} onCopy={onCopyToClipboard}>
                            <span className='ml-1' title={`Copy Snippet\n\n${query.snippet}`}>
                                Copy Snippet
                            </span>
                        </Clipbaord>
                    </> 
                    : null
                }
                </div>
            </div>
            <div className={`relative h-full text-xs rounded-md border border-gray-900 ${query.snippet ? "rounded-md transition-all duration-300 delay-150 " : ""}`}>
                <Highlight className={`${(query.mode || '').toString().toUpperCase()} h-[300px]`} >
                    {query.snippet}
                </Highlight>
                {/* <CodeEditor
                    value={query.snippet}
                    options={{
                        mode: query.mode,
                        theme,
                        lineNumbers: true,
                        // lineWrapping: true,
                        readOnly
                    }}
                /> */}
            </div>
        </div>
    </>)
}