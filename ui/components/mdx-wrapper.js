import { MDXProvider } from '@mdx-js/react'
import Link from 'next/link';

import Layout from '../studio-components/Layout';

const components = {
    a  : (props) => <a target="_blank" {...props } href={props.href} className={props.className ? props.className : "underline text-blue-600"}>{props.children}</a>,
    p  : (props) => <p className={ props.className ? props.className : "mb-4"}>{props.children}</p>,
    ul  : (props) => <ul className={ props.className ? props.className : "mb-4 ml-8 list-disc"}>{props.children}</ul>,
    li  : (props) => <li className={ props.className ? props.className : "pl-0"}>{props.children}</li>,
    em : (props) => <em className={ props.className ? props.className : "text-sm"}>{props.children}</em>,
    h1 : (props) => <h1 className={ props.className ? props.className : "mb-6 text-4xl leading-normal font-bold" }>{props.children}</h1>,
    h2 : (props) => <h2 className={ props.className ? props.className : "mb-4 text-2xl font-semibold" }>{props.children}</h2>,
    h3 : (props) => <h3 className={ props.className ? props.className : "mb-4 text-xl font-semibold leading-relaxed" }>{props.children}</h3>,
    h4 : (props) => <h4 className={ props.className ? props.className : "mb-4" }>{props.children}</h4>,
    h5 : (props) => <h5 className={ props.className ? props.className : "mb-4 text-sm opacity-80 leading-loose" }>{props.children}</h5>,
    h6 : (props) => <h6 className={ props.className ? props.className : "mb-4" }>{props.children}</h6>,
    blockquote : (props) => <blockquote className={ props.className ? props.className : "bg-gray-100 px-2 text-gray-500 border-l-4 border-gray-500" }>{props.children}</blockquote>,
    code : (props) => <code className={ props.className ? props.className : "bg-gray-50 text-sm p-1 px-1.5 text-gray-500 rounded-md"} >{props.children}</code>,
    pre : (props) => <pre className={ props.className ? props.className : "overflow-hidden overflow-x-scroll bg-gray-50 text-sm p-2  mb-4 text-gray-500 border border-gray-200 rounded-md" }>{props.children}</pre>,

}

export default function Wrapper(props) {
    return (<MDXProvider  components={components}>
        <Layout meta={props.meta} user={{guest: true}} show={false} hideNav={true} info={props.info}>
            <div className='max-w-7xl mx-auto px-8'>
            {props.children}
            </div>
        </Layout>
    </MDXProvider>)
}