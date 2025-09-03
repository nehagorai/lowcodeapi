import { Response } from 'express';

/*
    Response format
    // 200 OK
    "200" : {
        message: string,
        result: object || array
        provider: string,
        response_headers: object
    }
*/

export default (res: Response, resp: any, options : {[key:string]: any } = { }) => {
  const CONTENT_CHECK_REGEX = /^(text|application)\/(json|xml)(;.+)?$/;
  if (options.headers && !CONTENT_CHECK_REGEX.test(options.headers['content-type'])) {
    res.set('Content-Type', options.headers['content-type']);
    console.log('Response', options.headers['content-type'], CONTENT_CHECK_REGEX.test(options.headers['content-type']));
    return res.send(resp);
  }
  res.json({
    message: resp.message || 'Request completed',
    provider: options.provider,
    result: resp,
    response_headers: options.headers || undefined,
  });
};
