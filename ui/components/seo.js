import Head from 'next/head'

import defaultImage from '@/public/seo/lowcodeapi-graph.png';


function SEO({ 
  info = {}, 
  scale= true,
  favicon="/favicon.svg",
  title= '',
  ogTitle,
  ogDescription=info.description,
  keywords=info.keywords,
  image,
  lang, meta, author
}) {
  const url = info.url;
  const site = info.name;
  const defaultOgImage = `${url}${defaultImage.src}`;

  const ddImage = image || defaultOgImage;

  return (
    <Head>
      <title>{title || ogTitle}</title>
      <meta name="robots" content="follow, index" />

      {
        scale ? <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />:
        <meta name="viewport" content="width=device-width, initial-scale=0, maximum-scale=1.0,user-scalable=0" />

      }

      <meta name="description" content={ogDescription} key='description' />
      <meta name="keywords" content={keywords} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} key='og:description' />
      <meta property="og:image" name="image" content={ddImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@lowcodeapi" />
      <meta name="twitter:title" content={ogTitle} key='twitter:title' />
      <meta name="twitter:description" content={ogDescription} key='twitter:description' />
      <meta name="twitter:image" content={ddImage} key='twitter:image'/>
      <meta name="twitter:creator" content="@samalgorai" key='twitter:creator' />

      {/* <link rel="canonical" href={seo.canonical} /> */}
      <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
    {/* 
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" /> 
    */}

    {/* 
      <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-icon-192x192.png" />
      <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png" /> 
    */}

    </Head>
  )
}

export default SEO
