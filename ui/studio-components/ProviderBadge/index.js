import Image from 'next/image'

import getLogoUrl from '@/utils/logo-url';

export default function ProviderBadge({ provider, name, selected }) {
    return (<>
        {
        selected ?
            <div className={`flex flex-col items-center mx-auto p-4 sm:px-6 md:p-8 `}>
                <Image src={getLogoUrl(selected.logo_path || selected.id)} className='w-14 h-14' width={24} height={24} alt={selected.name} title={selected.name}/>
                {
                    provider ? <>
                        <div className='mt-4 '><strong className='text-gray-600 text-xl'>{provider}</strong></div>
                        <div>
                            <span className='mt-2 text-gray-600 text-sm'>{name}</span>
                        </div>
                    </> : null
                }
                
            </div> : null
        }
    </>)
}