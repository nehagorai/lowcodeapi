const aiModels = [
    {
      name: 'gpt-3.5-turbo',
      tokens: '4,096 tokens'
    },
    {
      name: 'gpt-3.5-turbo-16k',
      tokens: '16,384 tokens'
    },
    {
      name: 'gpt-4',
      tokens: '8,192 tokens',
    },
    {
      name: 'gpt-4-32k',
      tokens: '32,768 tokens',
    }
  ]
  
  const { textarea: Textarea } = FieldMap;
  const systemPrompt = {
    role: "system",
    content: "You are an API expert, you deals with API intergrations, you will reply with relevant answer when asked questions. If you are not able to andwer only respond with generic reqeust."
  }
  
  const logo = {
    assistant: 'openai',
  }
  
  const AiChat = ({system, details, api }) => {
    const [model, setModel] = useState('gpt-3.5-turbo');
    const [temperature, setTemperature] = useState(0.7);
    const [wait, setWait] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [userInpit, setUserInput] = useState({});
    const [error, setError] = useState('');
  
    const url = `${system.openai_url}?api_token=${details.api_token}`;
    const content = [
      `Use \`${details.language}\` as programming language.`,
      `API Endpoint: ${api.endpoint}`,
      `HTTP Method: ${api.method}`,
      ``
    ];
  
    if (api.externalDocs.api_ref) {
      content.push(`Use the following link for API documentation reference, ${api.externalDocs.api_ref}`);
    }
  
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(api.method)) {
      content.push(`Return a detailed input payload options for ${api.method} method and return example input payload to copy paste the suggestions. Also,`);
    }
    content.push('Suggest query paramters, path parameters when applicable in the api reqeust');
  
    const onSelect =(e) => {
      const { value } = e.target;
      if (value) {
        setModel(value);
      }
    }
  
    const onUserInput = (e) => {
      const { value } = e.target;
      if (value) {
        const local = {
          label: 'User',
          role: 'user',
          content: value,
        };
        setUserInput(local);
      }
    }
    const onClickAiSuggestions = async (api) => {
      if (!system.aiEnabled) return;
      setWait(true);
  
      const body = {
        model,
        temperature,
        messages: [ 
          systemPrompt,
          {
            role: 'user',
            content: content.join(',')
          },
          ...aiSuggestions,
        ],
      }
  
      if (userInpit && userInpit.content) {
        body.messages.push(userInpit);
      }
      body.messages = body.messages.map((item) => ({ role: item.role, content: item.content}));
  
      const result = await axios({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(body),
      })
      .catch(error => ({
        error
      }));
  
      if (result && result.error) {
        const { data } = result.error.response;
        const { error } = data;
        setError(error.data.error);
      } else if (result && !result.error) {
        const { res } = result.data;
        const { data } = res;
        const { choices } = data;
        const obj = choices[0];
        try {
          const localSuggestions = [...aiSuggestions];
          if (userInpit && userInpit.content) {
            localSuggestions.push(userInpit);
          }
          localSuggestions.push({ label: 'AI Assistant', role: 'assistant', content: JSON.parse(obj.message.content)});
          setAiSuggestions(localSuggestions);
        } catch(err) {
          console.log(err, obj.message.content);
          const localSuggestions = [...aiSuggestions];
          if (userInpit && userInpit.content) {
            localSuggestions.push(userInpit);
          }
          localSuggestions.push({ label: 'AI Assistant', role: 'assistant', content: obj.message.content});
          setAiSuggestions(localSuggestions);
        }
        setUserInput({});
      }
      setWait(false);
    }
  
    if (!details.user) {
      return null
    }
  
    if (!system.aiEnabled) {
      return <div className='bg-gray-200 text-sm leading-loose relative'>
        <div className='flex items-center'>
          To activate AI assistant, integrate your
          <Link 
            href={'/openai'} className='flex items-center mx-1 border border-gray-300 rounded-md p-0 px-1.5 font-bold bg-white hover:drop-shadow-xl'
            title={`Integrate OpenAI`}
          >
            <img src={getLogoUrl('openai')} className="w-4 h-4 mr-1" /> 
            OpenAI 
          </Link>
          api key.
        </div>
        <div className='mt-4'>
          You will have to pay OpenAI separately for your api usage based on token consumed
          <ul className='list-disc ml-4 my-2'>
          {
              aiModels.map(item => (<li key={item.name} className="">{item.name} <small>({item.tokens})</small></li>))
          }
          </ul>
          <div>Note: Your API key will only be used for your account. Nobody can see the api key, we encrypt the `api_key` before storing in database.</div>
        </div>
  
      </div>
    }
    return (<>
      <div className="bg-gray-200 text-sm leading-loose relative">
      {
          !error && system.aiEnabled ? <div className='flex items-ceter justify-between'>
            <div className='flex items-center'>
              <select className='py-1.5 px-1 bg-gray-100 border border-gray-300 rounded-md focus:outline-none' onChange={onSelect}>
                <option name='' value=''>{'Select model'}</option>
                {
                aiModels.map((item)=> (
                    <option key={item.name} value={item.name}>{item.name} ({item.tokens})</option>
                ))
                }
              </select>
            </div>
            {
              !aiSuggestions.length && !error ? <>
              {
                wait ? <span className='flex items-center ml-4 '>
                  <IconPack name='spin'/> 
                  <span className='ml-2 animate-pulse text-gray-800 text-xs'>Wait...</span>
                </span> 
                : <button className={`flex items-center text-xs ml-2 border p-1 px-1.5 rounded-md ${wait ? 'border-purple-200 bg-purple-100 text-purple-600 no-cursor ': 'border-purple-600 bg-purple-600 text-purple-100 hover:text-purple-600 hover:bg-purple-200'} `} onClick={() => !wait && onClickAiSuggestions(api)}>
                  <IconPack name='sparkle' />
                  <span className='ml-1'>Ask AI Assistant</span>
                </button>
              }
              </> 
              : null
            }
          </div>: null
      }
      {
        !error ? <>
          <div className='w-full mt-4 mb-4 overflow-scroll'>
            <div>
              <span className='mr-1 bg-red-500 p-1 px-1.5 text-xs text-red-100 rounded-md uppercase'>{model}</span> model is selected for interacting with AI Assistant.
            </div>
            <div className='overflow-scroll mt-2'>
              Temperature: {temperature}
            </div>
          </div>
        </> : null
      }
      {
        error ? <div className=''>
          <strong>Error returned from OpenAI API:</strong>
          <p className='p-2 bg-red-50 text-orange-700 rounded-md my-2'>{error.message}</p>
          <p className='flex items-center text'>
            Integrate
            <Link 
              href={'/openai'} className='flex items-center mx-1 border border-gray-300 rounded-md p-0 px-1.5 font-bold bg-white hover:drop-shadow-xl'
              title={`Integrate OpenAI`}
            >
              <img src={getLogoUrl('openai')} className="w-4 h-4 mr-1" /> 
              OpenAI 
            </Link>
            api key again and try.
          </p>
        </div> : null
      }
      {
        aiSuggestions.length ? <div className='min-h-full overflow-scroll mb-4' style={{ maxHeight: '980px'}}>
          {
            aiSuggestions.map((item) => (<div key={item.content} className="p-4 bg-white mb-4 rounded-md ">
              <div className='flex items-center mb-2'>
                {
                  logo[item.role] ? <img src={getLogoUrl(logo[item.role])} className='w-6 h-6 mr-1 border border-gray-400 rounded-md p-1'/> : null
                }
                <span className='font-bold'>{item.label}</span>
              </div>
              <ReactMarkdown
                components={components}
              >
              {item.content}
              </ReactMarkdown>
            </div>))
          }
        </div> : null
      }
      {
        aiSuggestions.length ? <div className=''>
          <div>
            <Textarea hide_label={true} placeholder='Ask ...' value={userInpit.content || ''} className="focus:outline-none" onChange={onUserInput} />
          </div>
          <div className='mt-2 flex items-center justify-end'>
          {
            wait ? <span className='flex items-center ml-4 text-xs'>
              <IconPack name='spin'/> 
              <span className='ml-2 animate-pulse text-gray-800'>Wait...</span>
            </span> 
            : <button className={`flex items-center text-xs ml-2 border p-1 px-1.5 rounded-md ${wait ? 'border-purple-200 bg-purple-100 text-purple-600 no-cursor ': 'border-purple-600 bg-purple-600 text-purple-100 hover:text-purple-600 hover:bg-purple-200'} `} onClick={() => !wait && onClickAiSuggestions(api)}>
              <IconPack name='sparkle' />
              <span className='ml-1'>Ask AI Assistant</span>
            </button>
          }
          </div>
        </div>
        : null
      }
      </div>
    </>)
  }
  