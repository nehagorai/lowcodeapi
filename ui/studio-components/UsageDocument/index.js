
function UsageDocument({ ENDPOINT }) {
    return (
        <>
            <div className='mt-8 bg-white p-8 text-sm hidden'>
                {/* <p>Use customized LowCodeAPI Build or Docker image and self-host LowCodeAPI in your server, for <b className='underline'>personal & non-commercial</b> use only.</p>
                <p className='mt-2'>LowCodeAPI Build or Docker Image has 2 external dependencies, <code className='text-sm font-medium'>env</code> file and <code className='text-sm font-medium'>sqlite</code> database.</p>
                <ul className='ml-8 mt-2 list-disc leading-relaxed'>
                <li className='mb-4'>
                    <p>Environment file is required for running the LowCodeAPI instance. Create .env and copy the following keys and set the values.</p>
                    <code className='block text-xs mt-4 border border-gray-200 bg-gray-50 p-4 rounded-md leading-loose'>
                    <pre>RATE_LIMIT_WINDOW_IN_MS=60000</pre>
                    <pre>RATE_LIMIT_MAX_REQUEST=2</pre>
                    <pre>JWT_EXPIRES=7d</pre>
                    <pre>SESSION_EXPIRY=8640000</pre>
                    <pre>CACHE_ENABLED=1</pre>
                    <pre>CAHCE_KEY_EXPIRY_VALUE=30</pre>
                    <pre>PROTOCOL=http</pre>
                    <pre>PORT=3445</pre>
                    <pre>APP_DOMAIN=localhost:3445</pre>
                    <pre>ENCRYPTION_KEY=&lt;ENCRYPTION_KEY&gt;</pre>
                    <pre>JWT_SECRET=&lt;JWT_SECRET&gt;</pre>
                    <pre>SESSION_SECRET_KEY=&lt;SESSION_SECRET_KEY&gt;</pre>
                    <pre>SQLITE_DATA_PATH=/data/sqlite.db</pre>
                    </code>

                </li>
                <li className='mb-4 leading-loose'>
                    <p>SQLite database is used for storing user's LowCodeAPI data.</p>
                    <p><a href={`${ENDPOINT}/sqlite/sqlite.db`} target='_blank' className='underline text-blue-700'>Download SQLite database seed (sqlite.db) for LowCodeAPI</a></p>
                    <p>Place this sqlite.db inside docker mount directory.</p>
                </li>
                </ul> */}
            </div>
        </>
    );
}

export default UsageDocument;