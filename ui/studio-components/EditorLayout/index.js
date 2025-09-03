import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div className="flex flex-col min-h-screen" >
      {children}
      {
      sponsor.map((item)=> <div key={item.name} className='mb-2 font-medium'>
          <button onClick={() =>openSponsor(item)} >{item.text}</button>
        </div>)
      }
    </div>)
};

export default Layout;
