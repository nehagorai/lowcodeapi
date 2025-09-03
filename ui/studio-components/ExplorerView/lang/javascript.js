import lodash from 'lodash';

export default function getJavaScript(url, method, payload, responseType, intent = {}) {
  const provider = intent?.provider;
  if (!intent.route_name) return;

  const action = intent?.route_name?.split('/').filter(item => !!item).map(item => lodash.upperFirst(item).replaceAll('-', '_')).join('');
  const fullAction = [method.toLowerCase(), lodash.upperFirst(provider), "__", action].join('');
    if (responseType) return null;
    let body = "";
    if (payload) {
      body = `body:  ${JSON.stringify(payload, null, 8)}`;
    }
    let tmpl = `
  /* Browser fetch */

  const ${fullAction} = async () => {
    const url = '{{url}}';
    const result = await fetch(url, {
      method: '{{method}}',
      headers: { 
        'Content-Type': 'application/json' 
      },${body? '\n{{body}}':""}
    });
    const resp = await result.json();
    const data = await resp.json();

    return data;
  };

  ;(async() => {
    try {
      const result = await ${fullAction}();
    } catch(error) {
      throw error;
    }
  })();
  `;
  
    const final = lodash.template(tmpl)({
      body, method, url
    });
  return final;
  }