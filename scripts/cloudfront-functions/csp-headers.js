// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
function handler(event) {
  var response = event.response;
  var headers = response.headers;

  headers["content-security-policy"] = {
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval'",
      "connect-src 'self' https://api.whereyouad.com",
      "img-src 'self' data: blob: https://*.amazonaws.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; "),
  };

  return response;
}
