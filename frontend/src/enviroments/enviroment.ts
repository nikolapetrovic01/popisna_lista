const isAndroidWebView = navigator.userAgent.includes('Android');
const backendIP = '192.168.173.139'; //moja IP adresa, staviti ako hoces da se povezes preko telefona
export const environment = {
  production: false,
  backendUrl: 'http://localhost:8080'
};
console.log("Using backendUrl:", environment.backendUrl);
//backendUrl: `http://${backendIP}:8080`
