import { useState } from 'react';

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const [user] = useState({
    loading: true,
  });

  const [config] = useState({ navs: []});
  return (<>
    <Component  user={user} config={config} {...pageProps}/>
  </>)
}

export default MyApp
