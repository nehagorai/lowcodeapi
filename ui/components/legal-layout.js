import { MDXProvider } from '@mdx-js/react'


const components = {
    a  : (props) => <a className="mb-4 text-red-600" href={props.href}>{props.children}</a>,
    p  : (props) => <p className="mb-4">{props.children}</p>,
    ul  : (props) => <ul className="mb-4">{props.children}</ul>,
    li  : (props) => <li className="p-1 pl-0">{props.children}</li>,
    em : (props) => <em className="text-sm">{props.children}</em>,
    h1 : (props) => <h1 className="mb-4">{props.children}</h1>,
    h2 : (props) => <h2 className="mb-4 text-2xl">{props.children}</h2>,
    h3 : (props) => <h3 className="mb-4">{props.children}</h3>,
    h4 : (props) => <h4 className="mb-4">{props.children}</h4>,
    h5 : (props) => <h5 className="mb-4">{props.children}</h5>,
    h6 : (props) => <h6 className="mb-4">{props.children}</h6>,

}
export default function Wrapper({ children }) {
    return (<MDXProvider components={components}>{children}</MDXProvider>)
}

export { components };