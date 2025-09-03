import React from 'react';
import Footer from '@/studio-components/Footer';
import Top from '@/studio-components/Top';

import onLogout from '@/utils/logout';

const Layout = ({ endpoints={}, config, navs, user, children, hideNav=false, info = {}}) => {

  return (
    <div className="bg-gray-100 h-screen flex flex-col relative overflow-y-auto scroll-smooth" >
      <div className=''>
          <Top 
            info={info}
            config={config}
            endpoint={endpoints.ENDPOINT}
            navs={navs}
            user={user}
            hideNav={hideNav}
            onLogout={onLogout(endpoints.ACCOUNT_API)}
          />
      </div>
      <div className='flex-grow '>
        {children}
      </div>
      <div className='text-xs py-2 text-gray-700 relative' >
        <div className='container mx-auto pt-4 px-8'>
          <Footer info={info} />
        </div>
      </div>
    </div>)
};

export default Layout;
