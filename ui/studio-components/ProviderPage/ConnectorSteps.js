import React, { useEffect, useRef} from "react";
import Image from 'next/image';

import IconPack from '../IconPack';
import BadgeUI from '../BadgeUI';

import getLogoUrl from '@/utils/logo-url';
import Link from "next/link";

const OAUTH = ['OAUTH2.0', 'OAUTH1.0', 'OAUTH1.0a'];
const OAUTH2 = ['OAUTH2.0'];

const getTitleForOAuth = (name, connected, auth_type) => {
  const auth_text = OAUTH2.includes(auth_type) ? `ClientID and ClientSecret` : `Key and Secret`;
  if (connected) {
    return `${name}\'s ${auth_text} is configured for accessing apis`;
  }
  return `Configure ${name}\'s ${auth_text} to access apis`;
}
const OAuth = ({ user, selected, details, imgFallback, endpoint, onStep1Click }) => {
  const svgRef0 = useRef(null);
  const svgRef = useRef(null);
  const svgRef2 = useRef(null);
  const svgRef3 = useRef(null);

  useEffect(() => {
    const svg0 = svgRef0.current;
    const svg = svgRef.current;
    const svg2 = svgRef2.current;
    const svg3 = svgRef3.current;

    const step0 = document.getElementById("step0");
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const step4 = document.getElementById("step4");
    
    const step0Rect = step0.getBoundingClientRect();
    const step1Rect = step1.getBoundingClientRect();
    const step2Rect = step2.getBoundingClientRect();
    const step3Rect = step3.getBoundingClientRect();
    const step4Rect = step4.getBoundingClientRect();
    
    const svg0Rect = svg0.getBoundingClientRect();
    const x_01 = step0Rect.left + step0Rect.width - svg0Rect.left;
    const y_01 = step0Rect.top + step0Rect.height / 2 - svg0Rect.top;
    const x_02 = step1Rect.left - svg0Rect.left;
    const y_02 = step1Rect.top + step1Rect.height / 2 - svg0Rect.top;
    
    const line0 = svg0.querySelector("line");
    line0.setAttribute("x1", x_01);
    line0.setAttribute("y1", y_01);
    line0.setAttribute("x2", x_02);
    line0.setAttribute("y2", y_02);

    const svgRect = svg.getBoundingClientRect();
    const x1 = step1Rect.left + step1Rect.width - svgRect.left;
    const y1 = step1Rect.top + step1Rect.height / 2 - svgRect.top;
    const x2 = step2Rect.left - svgRect.left;
    const y2 = step2Rect.top + step2Rect.height / 2 - svgRect.top;
    
    const line = svg.querySelector("line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    const svg2Rect = svg2.getBoundingClientRect();
    const x1_2 = step2Rect.left + step2Rect.width - svg2Rect.left;
    const y1_2 = step2Rect.top + step2Rect.height / 2 - svg2Rect.top;
    const x2_2 = step3Rect.left - svg2Rect.left;
    const y2_2 = step3Rect.top + step3Rect.height / 2 - svg2Rect.top;
    
    const line2 = svg2.querySelector("line");
    line2.setAttribute("x1", x1_2);
    line2.setAttribute("y1", y1_2);
    line2.setAttribute("x2", x2_2);
    line2.setAttribute("y2", y2_2);

    const svg3Rect = svg3.getBoundingClientRect();
    const x1_3 = step3Rect.left + step3Rect.width - svg3Rect.left;
    const y1_3 = step3Rect.top + step3Rect.height / 2 - svg3Rect.top;
    const x2_3 = step4Rect.left - svg3Rect.left;
    const y2_3 = step4Rect.top + step3Rect.height / 2 - svg3Rect.top;
    
    const line3 = svg3.querySelector("line");
    line3.setAttribute("x1", x1_3);
    line3.setAttribute("y1", y1_3);
    line3.setAttribute("x2", x2_3);
    line3.setAttribute("y2", y2_3);

  }, [details]);

  return (<div class="relative w-full flex items-center justify-between text-xs">
    <svg className="absolute top-0 left-0 h-full w-full" ref={svgRef0}>
      <line stroke={`${details.credentials ? "#16a34a": '#e5e7eb'}`} strokeWidth="1" />
    </svg>
    <div id="step0" class="flex items-center relative cursor-pointer" title={`Get ${selected.name} OAuth credential from ${selected.credential_link}`}>
      <>
          <div class="px-2 py-1 font-medium text-gray-800 inline-flex items-center justify-center z-10">
            {
              user? <>
              <Image 
                src={getLogoUrl(selected.logo_path || imgFallback[selected.id] || selected.alias ||selected.id)}
                className={`mr-1`} 
                alt={selected.name} 
                width={14}
                height={14}
                onError={(e) => onError(e, selected.id)}
                onClick={() => onClickTab(view)}
              /> 
              <span>
                <span>Get</span>
                <a href={selected.credential_link} className="mx-0.5 underline" target="_blank">OAuth Credential</a>
                <span>(2 required)</span>
              </span>
            </>
          : 
            <>
              <Link href={`/login`} className="underline">Login / Signup </Link>
              {
              !user ? <span className='mx-1'>
                <BadgeUI className="h-2 w-2 " color='bg-blue-600' />
              </span> : null
              }
            </>
          }
          </div>
      </>
    </div>
    
    <svg className="absolute top-0 left-0 h-full w-full" ref={svgRef}>
      <line stroke={`${details.credentials ? "#16a34a": '#e5e7eb'}`} strokeWidth="1" />
    </svg>
    <div id="step1" class="flex items-center relative cursor-pointer" onClick={onStep1Click} title={getTitleForOAuth(selected.name, details.credentials, selected.auth_type)}>
    {
      (details.credentials) ? 
        <>
          <div class="px-2 py-1 font-medium bg-green-100/80 text-green-800 border border-green-200 rounded-full bg-gray-100 inline-flex items-center justify-center z-10" >
            <span className="">
              <IconPack name="checked"/>
            </span>
            <span className="ml-1">Configured</span>
          </div>
          <div className="mx-1 text-green-700 z-10">
            <IconPack name="cog"/>
          </div>
          <div className="z-10">
            <small className="mr-1 px-1 py-0.5 underline text-gray-700 rounded-md cursor-pointer z-10">
              Re-configure
            </small>
          </div>
        </> : 
        <>
            <div class="px-2 py-1 font-medium bg-gray-100 text-gray-800 border border-gray-200 rounded-full bg-gray-100 inline-flex items-center justify-center z-10">
              <span className="ml-1">Configure Credential</span>
            </div>
            <div className="mx-1 z-10">
              <IconPack name="cog"/>
            </div>
            { 
            user ? 
              <span className='mr-1'>
                <BadgeUI className="h-2 w-2 " color='bg-blue-600' />
              </span>
              : null
            }
        </>
    }
    </div>
    <div id="step2" class="flex items-center relative">
    {
      OAUTH.includes(selected.auth_type) && details.authorized ? 
      <>
        <div class=" px-2 py-1 font-medium bg-green-100/80 text-green-800 border border-green-200 rounded-full  border inline-flex items-center justify-center z-10">
          <span className="">
            <IconPack name="checked"/>
          </span>
          <span className="mx-1">{selected.name} Authorized</span>
        </div>
        <span className="mx-1 text-green-700">
            <IconPack name="info"/>
        </span>
        <div className="z-10">
          <small className="mr-1  underline text-gray-700 cursor-pointer z-10">
            <a href={`${endpoint.app_endpoint}/auth/${selected.id}`} className="">Re-Authorize</a>
          </small>
        </div>
      </> : <>
        <div class="px-2 py-1 font-medium bg-gray-100 text-gray-700 border border-gray-200 rounded-full  border inline-flex items-center justify-center z-10">
          <span className="">
            <IconPack name="warn"/>
          </span>
          <span className="ml-1">
            {
              details.credentials ? 
              <a href={`${endpoint.app_endpoint}/auth/${selected.id}`} className="">Authorize {selected.name}</a>
              :
              <span>Authorize {selected.name}</span>
            }
          </span>
        </div>
        {
          details.credentials ?
          <div className="mx-1 z-10 flex items-center">
            <small className="mx-1 underline text-gray-700 cursor-pointer z-10">
              <a href={`${endpoint.app_endpoint}/auth/${selected.id}`} className="">Authorize</a>
            </small>
            <span className='mx-1'>
              <BadgeUI className="h-2 w-2 " color='bg-purple-600' />
            </span>
          </div>
          : null
        }
      </>
    }
    </div>
    <svg className="absolute top-0 left-0 h-full w-full" ref={svgRef2}>
      <line stroke={`${details.integrated ? "#16a34a": '#e5e7eb'}`} strokeWidth="0" />
    </svg>
    <div id="step3" class="flex items-center relative">
    {
      details.authorized && details.integrated ? 
        <>
          <div class=" px-2 py-1 font-medium bg-green-100/80 text-green-800 border border-green-200 rounded-full  border inline-flex items-center justify-center z-10">
            <span className="">
              <IconPack name="checked"/>
            </span>
            <span className="mx-1">API Access Granted</span>
          </div>
          <span className="mx-1 text-green-700">
            <IconPack name="apis"/>
          </span>
          <span className='mx-1'><BadgeUI className="h-2 w-2" /></span>
        </>
        : <>
        <div class=" px-2 py-1 font-medium bg-gray-100 text-gray-700 border border-gray-200 rounded-full  border inline-flex items-center justify-center z-10">
          <span className="ml-1">Access Endpoints</span>
        </div>
        <span className="mx-1 text-green-700">
            <IconPack name="apis"/>
          </span>
      </>
    }
    </div>
    {
      true ? 
        <div id="step4" class="flex items-center relative">
          {
            details.authorized && details.integrated ? <span className="mx-1 animate-pulse">⚡</span> : null
          }
          <div class="px-2 py-1 font-medium rounded-full  border inline-flex items-center justify-center z-10">
            <Image 
              src={getLogoUrl(selected.logo_path || imgFallback[selected.id] || selected.alias ||selected.id)}
              className={`mr-1`} 
              alt={selected.name} 
              width={14}
              height={14}
              onError={(e) => onError(e, selected.id)}
              onClick={() => onClickTab(view)}
            /> 
            <span>{selected.name}</span>
          </div>
        </div>
        : null
    }
    <svg className="absolute top-0 left-0 h-full w-full" ref={svgRef3}>
      <line stroke={`${details.integrated ? "#16a34a": '#e5e7eb'}`} strokeWidth="0" />
    </svg>
  </div>)
}

const Token = ({ user, selected, details, imgFallback, onStep1Click }) => {
  const svgRef0 = useRef(null);
  const svgRef = useRef(null);
  const svgRef2 = useRef(null);
  const svgRef3 = useRef(null);

  useEffect(() => {
    const svg0 = svgRef0.current;
    const svg = svgRef.current;
    const svg2 = svgRef2.current;
    const svg3 = svgRef3.current;

    const step0 = document.getElementById("step0");
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    
    const step0Rect = step0.getBoundingClientRect();
    const step1Rect = step1.getBoundingClientRect();
    const step2Rect = step2.getBoundingClientRect();
    const step3Rect = step3.getBoundingClientRect();
    
    const svg0Rect = svg0.getBoundingClientRect();
    const x_01 = step0Rect.left + step0Rect.width - svg0Rect.left;
    const y_01 = step0Rect.top + step0Rect.height / 2 - svg0Rect.top;
    const x_02 = step1Rect.left - svg0Rect.left;
    const y_02 = step1Rect.top + step1Rect.height / 2 - svg0Rect.top;
    
    const line0 = svg0.querySelector("line");
    line0.setAttribute("x1", x_01);
    line0.setAttribute("y1", y_01);
    line0.setAttribute("x2", x_02);
    line0.setAttribute("y2", y_02);

    const svgRect = svg.getBoundingClientRect();
    const x1 = step1Rect.left + step1Rect.width - svgRect.left;
    const y1 = step1Rect.top + step1Rect.height / 2 - svgRect.top;
    const x2 = step2Rect.left - svgRect.left;
    const y2 = step2Rect.top + step2Rect.height / 2 - svgRect.top;
    
    const line = svg.querySelector("line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    const svg2Rect = svg2.getBoundingClientRect();
    const x1_2 = step2Rect.left + step2Rect.width - svg2Rect.left;
    const y1_2 = step2Rect.top + step2Rect.height / 2 - svg2Rect.top;
    const x2_2 = step3Rect.left - svg2Rect.left;
    const y2_2 = step3Rect.top + step3Rect.height / 2 - svg2Rect.top;
    
    const line2 = svg2.querySelector("line");
    line2.setAttribute("x1", x1_2);
    line2.setAttribute("y1", y1_2);
    line2.setAttribute("x2", x2_2);
    line2.setAttribute("y2", y2_2);

  }, [details]);

  const step0Text = details.provider_config && (details.provider_config.length > 2 ? `keys` : details.provider_config.map(item => item.label || item.name).join(' & '));
  return (<>
    <div class="relative w-full flex items-center justify-between text-xs">
      <svg className="absolute top-0 left-0 h-full w-full" ref={svgRef0}>
        <line stroke={`${details.credentials ? "#16a34a": '#e5e7eb'}`} strokeWidth="1" />
      </svg>
      <div id="step0" class="flex items-center relative cursor-pointer" title={user ? `Get ${selected.name}'s ${step0Text} from ${selected.credential_link}` : 'Login'}>
        <div class="px-2 py-1 font-medium text-gray-800 inline-flex items-center justify-center z-10"> 
          {
            user ? <>
              <Image 
                src={getLogoUrl(selected.logo_path || imgFallback[selected.id] || selected.alias ||selected.id)}
                className={`mr-1`} 
                alt={selected.name} 
                width={14}
                height={14}
                onError={(e) => onError(e, selected.id)}
              />
              {
                details.provider_config && step0Text ? <span>
                    <span>Get</span>
                    <a href={selected.credential_link} className="underline mx-0.5" target="_blank">{selected.name}'s {step0Text} </a>
                    <span>({details.provider_config.length} required)</span>
                  </span> : <span>Evaluating {selected.name}'s requirement</span>
              } 
            </> : <>
              <Link href={`/login`} className="underline">Login / Signup </Link>
              {
              !user ? <span className='mx-1'>
                <BadgeUI className="h-2 w-2 " color='bg-blue-600' />
              </span> : null
              }
            </>
          }              
        </div>
      </div>
      
      <svg className="absolute top-0 left-0 h-full w-full" ref={svgRef}>
        <line stroke={`${details.integrated ? "#16a34a": '#e5e7eb'}`} strokeWidth="1" />
      </svg>
      <div id="step1" class="flex items-center relative cursor-pointer" onClick={onStep1Click}>
      {
        (details.credentials) ? <div className="flex items-center">
            <div class="px-2 py-1 font-medium bg-green-100/80 text-green-800 border border-green-200 rounded-full bg-gray-100 inline-flex items-center justify-center z-10" >
              <span className="">
                <IconPack name="checked"/>
              </span>
              <span className="ml-1">Configured</span>
            </div>
            <div className="mx-1 text-green-800 z-10">
              <IconPack name="cog"/>
            </div>
            <div className="z-10">
              <small className="mr-1 px-1 py-0.5 underline text-gray-700 rounded-md cursor-pointer z-10">
                Re-configure
              </small>
            </div>
          </div>
          : <>
            <div class="px-2 py-1 font-medium bg-gray-100 text-gray-800 border border-gray-200 rounded-full bg-gray-100 inline-flex items-center justify-center z-10">
              <span className="ml-1 hover:underline">Configure {selected.name} Credential</span>
            </div>
            <div className="mx-1 text-gray-700 z-10">
              <IconPack name="cog"/>
            </div>
            {
              user ? <span className='mr-1'>
                <BadgeUI className="h-2 w-2 " color='bg-blue-600' />
              </span> : null
            }
        </>
      }
      </div> 
      {
        details.credentials && details.integrated ? 
          <div id="step2" class="flex items-center relative">
            <div class=" px-2 py-1 font-medium bg-green-100/80 text-green-800 border border-green-200 rounded-full  border inline-flex items-center justify-center z-10">
              <span className="">
                <IconPack name="checked"/>
              </span>
              <span className="mx-1">Connected</span>
            </div>
            <span className="mx-1 text-green-700">
              <IconPack name="apis"/>
            </span>
            <span className='mx-1'><BadgeUI className="h-2 w-2" /></span>
          </div>
          : <div id="step2" class="relative">
          <div class=" px-2 py-1 font-medium bg-gray-100 text-gray-800 border border-gray-200 rounded-full  border inline-flex items-center justify-center z-10">
            <span>
              <IconPack name="warn"/>
            </span>
            {
              user ? <span className="ml-1">Not Connected</span> : <span className="ml-1">Access {selected.name} API</span>
            }
            
          </div>
        </div>
      }
      {
        true ? 
          <div id="step3" class="flex items-center relative">
            {
              details.credentials && details.integrated ? <span className="mx-1 animate-pulse">⚡</span> : null
            }
            <div class=" px-2 py-1 font-medium rounded-full  border inline-flex items-center justify-center z-10">
              <Image 
                src={getLogoUrl(selected.logo_path || imgFallback[selected.id] || selected.alias ||selected.id)}
                className={`mr-1`} 
                alt={selected.name} 
                width={14}
                height={14}
                onError={(e) => onError(e, selected.id)}
                onClick={() => onClickTab(view)}
              /> 
              <span>{selected.name}</span>
            </div>
          </div>
          : null
      }
        <svg className="absolute top-0 left-0 h-full w-full" ref={svgRef2}>
          <line stroke={`${details.integrated ? "#16a34a": '#e5e7eb'}`} strokeWidth="1" />
        </svg>
    </div>
  </>)
}
export function ConnectorSteps({ wait, user, selected, details, imgFallback, endpoint, onStep1Click }) {
  if (!selected.auth_type) return null;
  if (wait) {
      return (<div className="w-full flex items-center justify-between text-sm p-4">
          <div className='flex items-center justify-start text-xs'>
              <IconPack name="spin" />
          </div> 
      </div>)
  }
  return null;
  return <div className="bg-gray-50  text-sm p-2">
    { 
      OAUTH.includes(selected.auth_type) ? 
        <OAuth user={user} selected={selected} details={details} imgFallback={imgFallback} endpoint={endpoint} onStep1Click={onStep1Click} /> 
        : 
        <Token user={user} selected={selected} details={details} imgFallback={imgFallback} onStep1Click={onStep1Click} />
    }
  </div>
}

export default ConnectorSteps;
