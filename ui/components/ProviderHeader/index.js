/**
 *
 * Header
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image'

import getLogoUrl from '@/utils/logo-url';
import BadgeUI from '../BadgeUI';

const ProviderAuthType = ({ auth_type, details, provider }) => {
  if (!auth_type) return null;
  return  <>
      <div className='flex items-center mr-1 '>
          {
              auth_type !== 'TOKEN' ? 
                      <span
                          title={`${provider.name}'s API can be accessed access token generated using OAuth authorization. App internally manages all the complexity of integration.`} 
                          className="flex items-center text-xs "
                      >
                        <span className="ml-1">OAuth Based</span>
                      </span>
                  :
                      <span 
                          title={`API is accessed using ${provider.name}'s API credential`} 
                          className="flex items-center text-xs "
                      >
                          <span className="ml-1">Token Based</span>
                      </span>
          }
      </div>
  </>
}

function Header({ selected, total, details, integrated, children }) {
  console.log(selected);
  return (
    <>
      <div className="relative flex justify-between items-center">
        <div className="flex align-items items-center mt-2">
          <div className='relative flex items-center mb-1'>
            {
              selected && selected.id ? <>
                <span className=' rounded-md p-1 border-2 border-gray-900/75 shadow-sm'>
                  <Image src={getLogoUrl(selected.alias || selected.id)} className='w-6 h-6' width={24} height={24} alt={selected.name} title={selected.name}/>
                </span>
                <div className={ integrated ? 'relative ml-2' : 'relative ml-2'}>
                  <strong className="text-2xl font-semibold text-gray-600 mr-2">{selected.name}</strong>
                  {
                    integrated ? <span className='absolute -ml-2'><BadgeUI /></span> :<span className='absolute -ml-2'><BadgeUI color="bg-gray-300" animate={false} /></span>
                  }
                  
                </div>
                {
                  !selected.ignore ? 
                    <div className={`flex items-center text-gray-600 ${integrated ? 'md:ml-4': 'md:ml-4'}`}>
                        {/* <span className='text-xs'>{total} Endpoints</span>
                        <span className='mx-1'>•</span> */}
                        <ProviderAuthType details={details} provider={selected} auth_type={selected.auth_type} />
                        
                        {/* {
                          details.provider_link ? <>
                            <span className='mx-1'>•</span>
                            <span className='text-xs'><a href={`${details.provider_link}`} className="hover:text-gray-600  text-gray-500 underline" target="_blank">{selected.auth_type  !== 'TOKEN' ? 'OAuth': 'API'} credential link</a></span>
                          </>: null
                        } */}
                    </div>
                  :null
                }

              </> : null
            }
          </div>
        </div>
        <div className='flex items-center'>
        {children}
        </div>
      </div>
    </>
  );
}

Header.propTypes = {
  name: PropTypes.string,
  children: PropTypes.any,
  children2: PropTypes.any,
};

export default memo(Header);
