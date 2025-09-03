import Link from 'next/link'
import React from 'react'

import footer from "../static-json/footer.json";
import getLogoUrl from "../utils/logo-url";

const backlinks = footer.backlinks;

const segments = [] || Object.keys(backlinks);

const Footer = ({ year, copyright, brand = '' }) => (
  <>
  <footer className="text-gray-200 bg-gray-800 md:p-12 pb-4">
    <div className='md:mb-6 p-8 md:py-0 '>
      <div className='md:w-11/12 md:m-auto md:flex md:flex-wrap md:justify-between '>
      {
        segments ? segments.map(segment => (
          <React.Fragment key={segment}>
            <div className='pl-2 mb-6 md:mb-4'>
              <h2 className='font-semibold text-xl pb-4 mb-4 border-b border-gray-600'>{backlinks[segment].title}</h2>
              <ul className='mt-2'>        {
                backlinks[segment].list.map(item =>(
                  <li key={item.name} className="leading-loose">
                    <Link
                      href={item.link}
                      target={item.target ? '_blank' :''}
                      className={`${item.active ? 'hover:underline mt-2':'text-gray-500'}`}
                      >{item.name}</Link>
                  </li>
                ))
              } 
              </ul>
              {
                !backlinks[segment].extra ? null : (
                  <div className='mt-2 text-sm text-gray-300'>
                    <a href={backlinks[segment].extra.link} className="text-gray-500">{backlinks[segment].extra.title}</a>
                  </div>
                ) 
              }
            </div>
          </React.Fragment>
        )) : null
      }
      </div>
    </div>
    <div className='md:mb-6 px-8 py-0'>
      <div className='md:w-11/12 md:m-auto'>
        <div className='md:flex md:justify-between'>

        </div>
      </div>
    </div>
    <div className="">
      <div className="w-5/6 mx-auto">
        <div className="block text-center font-light text-sm p-1">
          <span className="">&copy; {year} <Link href={"/"} >{copyright}</Link> - All Rights Reserved</span>
        </div>
        <div className="block text-center text-xs font-light my-1">
          <a href="/legal/terms" className="mx-1" target='_blank'>Terms</a> | 
          <a href="/legal/privacy" className="mx-1" target='_blank'>Privacy Policy</a>
          <div className='flex justify-center mt-4'>
            <Link
              href={"/"}
              className="flex font-bold text-gray-700 text-2xl bg-white p-1 px-1.5"
            >
              <span className="mr-1 flex ">
                <img src={getLogoUrl(brand.toLowerCase())} className="w-6 mr-1.5" alt={brand} />
                {brand}
              </span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  </footer>
</>
)

export default Footer
