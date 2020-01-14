module.exports = {
	logResponse: function logResponse(response, scope, parse = true, showRequestURL = true, response_label = true) {
    let res_label = '';
    if(showRequestURL === true) {
      console.log('Request URL: ' + scope.requestURL);
    }
  
    if(response_label === true) {
      res_label = 'Response:\r\n';
    }
    if(parse === true) {
      console.log(res_label, JSON.parse(response));
    } else {
      console.log(res_label, response);
    }
  }
};
