import qs from 'qs';

export default function urlParams(params: { [x: string]: any; }) {
  return qs.stringify(params);
}
