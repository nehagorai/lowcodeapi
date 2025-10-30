import humanizeText from '@/utils/humanize-text';

function IntentMetrics( { metrics, provider, view }) {
    return (<>
        {
            metrics[provider] && metrics[provider][view.hash] ? 
                <div className='flex items-center text-purple-700'>{humanizeText(metrics[provider][view.hash])}</div> : null
        }
    </>)
}

export default IntentMetrics;