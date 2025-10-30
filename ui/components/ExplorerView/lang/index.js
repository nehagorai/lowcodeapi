import getJavaScript from './javascript';
import getNodeJS from './nodejs';

import python from '../images/python.svg';
import rust from '../images/rust.svg';
import ruby from '../images/ruby.png';
// import php from '../images/php.svg';
import curl from '../images/curl.svg';
import nodejs from '../images/nodejs.svg';
import javascript from '../images/javascript.svg';

function getCURL(url, method, payload, responseType) {
    if (responseType) return null;
    let curl = `curl -X ${method} \\\n '${url}' \\\n -H 'Cache-Control: no-cache' \\\n -H 'Content-Type: application/json'`;
  
    if (payload) {
      curl = `${curl} --data-raw '${payload ? JSON.stringify(payload, null, 2): '{}'}'`;
    }
    return curl;
  }
  
  
function pythonFn (url, method, payload, responseType) {
  if (responseType) return null;
  return `
  import requests
  import json
  
  url = '${url}'
  
  payload = json.dumps(${payload ? JSON.stringify(payload, null,2): '{}'})
  headers = {
    'Content-Type': 'application/json',
  }
  
  response = requests.request("${method}", url, headers=headers, data=payload)
  
  print(response.text)
  `
}

  const rubyMethod = {
    "POST": "Post",
    "GET": "Get",
    "DELETE": "Delete",
    "PUT": "Put",
    "PATCH": "Patch",
    "HEAD": "Head"
  }

  function rubyFn(url, method, payload, responseType) {
    if (responseType) return null;
    
    return `
    require "uri"
    require "json"
    require "net/http"
    
    url = URI("${url}")
    
    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true
    
    request = Net::HTTP::${rubyMethod[method] || method}.new(url)
    request["Content-Type"] = "application/json"
    request.body = JSON.dump(${payload? JSON.stringify(payload, null,2): '{}'})
    
    response = https.request(request)
    puts response.read_body
    `
}
    
function rustFn(url, method, payload, responseType) {
  if (responseType) return null;
    const urlFragement = url.split('?');
    const api_token = urlFragement[1] && urlFragement[1].split("=")[1];
    const code = [`.post("${urlFragement[0]}")`];
  
  if (api_token) {
    code.push(`    .query(&[("api_token", "${api_token}")])`)
  }
  code.push('    .json(&request_data)', '    .send()', '    .await?;');
  return `
    use reqwest::Client;
    #[tokio::main]
    async fn main() -> Result<(), Box<dyn std::error::Error>> {
      let client = Client::new();
      
      let request_data = json!(${payload ? JSON.stringify(payload, null, 10): '{}'});
    
      let response = client
        ${code.join('\n')}
      let response_data: serde_json::Value = response.json().await?;
      
      /* Process the response_data as per your requirements */
      Ok(())
    }`
}

const codeMap = {
    curl: {
        text: 'cURL',
        logo:curl.src,
        fn: getCURL,
        code: 'curl',
        mode: 'shell',
        activeView: 'shell',
    },
    JavaScript: {
        text: 'JavaScript',
        logo:javascript.src,
        fn: getJavaScript,
        code: 'JavaScript',
        mode: 'javascript',
        activeView: 'javascript',
    },
    nodejs: {
        text: 'NodeJS',
        logo: nodejs.src,
        fn: getNodeJS,
        code: 'nodejs',
        mode: 'javascript',
        activeView: 'nodejs',
    },
    python: {
      text: 'Python',
      logo: python.src,
      fn: pythonFn,
      code: 'python',
      mode: 'python',
      activeView: 'python',
    },
    ruby: {
      text: 'Ruby',
      logo: ruby.src,
      fn: rubyFn,
      code: 'ruby',
      mode: 'ruby',
      activeView: 'ruby',
    },
    // php: {
    //   text: 'Php',
    //   logo: php.src,
    //   fn: () => {},
    //   code: 'php',
    //   mode: 'php',
    //   activeView: 'php',
    // },
    rust: {
      text: 'Rust',
      logo: rust.src,
      fn: rustFn,
      code: 'rust',
      mode: 'rust',
      activeView: 'rust',
    },
};

const generate = (url, snippetKey, method, payload, { responseType }, intent) => {
    const snippet = codeMap[snippetKey].fn(url, method, payload, responseType, intent);
    return snippet;
  };
export {
    generate,
    codeMap
}