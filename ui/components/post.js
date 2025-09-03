import Wrapper from './mdx-wrapper';
import SEO from './seo';

export default function Post(props) {
    const { meta, width, info } = props;
    return (<Wrapper info={{...info, show_legal: false}}>
        <SEO {...info} ogDescription={meta.description} title={`${meta.title} - ${info.name}`} />
        <div className='pt-6 pb-16 sm:pb-24 lg:pb-3'>
            <div className='m-auto mt-4'>
                {
                    meta.image ? <img src={meta.image} className=" bg-white" alt={meta.image_alt}/> : null
                }
                <div className={`md:m-auto md:w-1/2 ${width} text-gray-600 md:mt-16 rounded-md leading-loose tracking-wide`}>
                    {props.children}
                </div>
            </div>
        </div>

    </Wrapper>)

}