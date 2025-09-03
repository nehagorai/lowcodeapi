import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '@/studio-components/Footer';
import Top from '@/studio-components/Top';

import onLogout from '@/utils/logout';

const Layout = ({ endpoints={}, config, navs, user, children, show = true, hideNav=false, info = {}}) => {
  const [sponsor, setSponsor] = useState([]);
  const [sponsorSrc, setSponsorSrc] = useState({ url: '', location: ''}); 
  useEffect(() => {
    ;(async() => {
      const location = window.location.href;
      const url = `https://telemetry.lowcodeapi.com/send?location=${location}&date=${info.BUILD_DATE}&ref=${info.BUILD_FOR}`
      try {
        await axios(url);
      } catch (e) {
        const url = `${endpoints.BASE_API}/telemetry?fallback=1&location=${location}&error=${e.message}&date=${info.BUILD_DATE}&ref=${info.BUILD_FOR}`
        try {
          await axios(url);
        } catch(e) {
          console.log('failed telemetry', e);
        }
      }
    })();

    ;(async() => {
      const location = window.location.href;
      const url = `https://sponsor.lowcodeapi.com/list?location=${location}&date=${info.BUILD_DATE}&ref=${info.BUILD_FOR}`;
      setSponsorSrc({ url: 'https://sponsor.lowcodeapi.com', location });
      try {
        const { data } = await axios(url);
        if (data.res) {
          setSponsor(data.res);
        }
      } catch (e) {
        console.log(e.message);
        setSponsorSrc({ url: `${endpoints.BASE_API}/sponsor`, location });
        const url = `${endpoints.BASE_API}/sponsor?fallback=1&location=${location}&error=${e.message}&date=${info.BUILD_DATE}&ref=${info.BUILD_FOR}`
        try {
          await axios(url);
          const { data } = await axios(url);
          if (data.res) {
            setSponsor(data.res);
          }
        } catch(e) {
          console.log('failed sponsor', e);
        }
      }
    })();
  }, []);

  const openSponsor = async(item) => {
    try {
      const url = `${sponsorSrc.url}?location=${sponsorSrc.location}&click=1`;
      await axios(url);
      window.location.href = `${item.link}?ref=${sponsorSrc.location}&product=lowcodeapi.com`;
    } catch(e) {
      console.log('failed sponsor', e);
    }
  }

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
        {
          sponsor.map((item)=> <div key={item.name} className='mb-2 font-medium'>
              <button onClick={() =>openSponsor(item)} >{item.text}</button>
            </div>)
        }
        <div className='container mx-auto pt-4 px-8'>
          <Footer info={info} />
        </div>
      </div>
    </div>)
};

export default Layout;
