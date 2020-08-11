// https://auth0.com/blog/2015/08/05/creating-your-first-aurelia-app-from-authentication-to-calling-an-api/
import { PageConfig } from './common/elements/pagination/pagination';

const apiHosts = {
  'localhost': 'http://localhost:8081/api/v1',
  'server-pc': 'http://server-pc/ampbiz/api/',
  'DBDC-SERVER': 'http://DBDC-SERVER/ampbiz/api/',
  'nicont130server': 'http://nicont130server/ampbiz/api/',
  'ampbiz': 'http://ampbiz/api',
  'ampbiz.local': 'http://ampbiz-api.local',
  'ampbiz.gear.host': 'http://ampbiz-api.gear.host',
};

export const appConfig = {
  api: {
    baseUrl: apiHosts[window.location.hostname] 
      || `${window.location.origin}${window.location.pathname}api/`,
  },
  page: <PageConfig>{
    maxSize: 5,
    pageSize: 9,
    boundaryLinks: true,
    directionLinks: true,
    firstText: 'fas fa-angle-double-left fa-sm',
    previousText: 'fas fa-angle-left fa-sm',
    nextText: 'fas fa-angle-right fa-sm',
    lastText: 'fas fa-angle-double-right fa-sm',
    // firstText: '«',
    // previousText: '‹',
    // nextText: '›',
    // lastText: '»',
    rotate: true
  },
  default: {
    dateFormat: 'MM/DD/YYYY',
    numberFormat: '0,0.00'
  },
  spinnerDebounce: 300 //
}
