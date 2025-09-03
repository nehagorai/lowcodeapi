import humanFormat from 'human-format';

const humanizeText = (value) => {
    return <>        
        <span className='mx-1 flex items-center font-medium bg-gray-200/70 border border-gray-300/50 px-1 text-gray-700 rounded-md' title={`Used ${humanFormat(value)} (${value}) ${ value > 1 ? '⚡': '⚡'}`}>{humanFormat(value)}{ value > 1 ? ' ⚡': ' ⚡'}</span>
        
    </>
}

export default humanizeText;