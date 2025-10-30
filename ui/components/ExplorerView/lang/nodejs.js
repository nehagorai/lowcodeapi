import lodash from 'lodash';

function getNodeJS(url, method, payload, responseType, intent) {
  const provider = intent?.provider;
  if (!intent.route_name) return;
  const action = intent?.route_name.split('/').filter(item => !!item).map(item => lodash.upperFirst(item).replaceAll('-', '_')).join('');
  const fullAction = [method.toLowerCase(), lodash.upperFirst(provider), "__", action].join('');
    let body = "";
    if (payload) {
      body = `data:  ${JSON.stringify(payload)},`;
    }
  
    let responseTypeKey = '';
    let responseTypeKeyCondition = '';
    let responseTypeFormat = '{ data, status }';
    if (responseType) {
      responseTypeKey = `responseType: '${responseType}'`;
      responseTypeKeyCondition = 'const blob = URL.createObjectURL(data); // for image';
      responseTypeFormat = 'blob'
    }
    const tmpl = `
  import axios from 'axios';
  
  const ${fullAction} = async () => {
    try {
      const url = '{{url}}';
      const result = await axios({
        url,
        method: '{{method}}',
        headers: { 
          'Content-Type': 'application/json' 
        },${body? '\t\n{{body}}':""}${responseTypeKey? '\n{{responseTypeKey}}':""}
      });
      const { data, status, statusText, headers } = result;
      {{responseTypeKeyCondition}}
      return {{responseTypeFormat}};
    } catch(error) {
      if (error.response) {
        const { data } = error.response;
        throw data;
      }
      throw error;
    }
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
      body, method, url,
      responseTypeKey,
      responseTypeKeyCondition,
      responseTypeFormat
    });
  
    return final;
  }

export default getNodeJS;