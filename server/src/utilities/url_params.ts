import queryString from 'query-string';

export default function urlParams(params: { [x: string]: any; }) {
  return queryString.stringify(params);
}
