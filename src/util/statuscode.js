export const statusCodeOptions = [
  {
    label: "Informational Responses (0 & 100-199)",
    children: [
      {
        label: " 0 Use Default Response",
        value: 0,
      },
      {
        label: "100 Continue",
        value: 100,
      },
      {
        label: "102 Processing",
        value: 102,
      },
      {
        label: "103 Early Hints",
        value: 103,
      },
    ],
  },
  {
    label: "Successful Responses (200 - 299)",
    children: [
      {
        label: "200 OK",
        value: 200,
      },
      {
        label: "201 Created",
        value: 201,
      },
      {
        label: "202 Accepted",
        value: 202,
      },
      {
        label: "203 Non-Authoritative Information",
        value: 203,
      },
      {
        label: "204 No Content",
        value: 204,
      },
      {
        label: "205 Reset Content",
        value: 205,
      },
      {
        label: "206 Partial Content",
        value: 206,
      },
      {
        label: "207 Multi-Status",
        value: 207,
      },
      {
        label: "208 Already Reported",
        value: 208,
      },
      {
        label: "226 IM Used",
        value: 226,
      },
    ],
  },
  {
    label: "Redirection Messages (300-399)",
    children: [
      {
        label: "300 Multiple Choice",
        value: 300,
      },
      {
        label: "301 Moved Permanently",
        value: 301,
      },
      {
        label: "302 Found",
        value: 302,
      },
      {
        label: "303 See Other",
        value: 303,
      },
      {
        label: "304 Not Modified",
        value: 304,
      },
      {
        label: "305 Use Proxy",
        value: 305,
      },
      {
        label: "306 unused",
        value: 306,
      },
      {
        label: "307 Temporary Redirect",
        value: 307,
      },
      {
        label: "308 Permanent Redirect",
        value: 308,
      },
    ],
  },
  {
    label: "Client error response (400 - 499)",
    children: [
      {
        label: "400 Bad Request",
        value: 400,
      },
      {
        label: "401 Unauthorized",
        value: 401,
      },
      {
        label: "402 Payment Required",
        value: 402,
      },
      {
        label: "403 Forbidden",
        value: 403,
      },
      {
        label: "404 Not Found",
        value: 404,
      },
      {
        label: "405 Method Not Allowed",
        value: 405,
      },
      {
        label: "406 Not Acceptable",
        value: 406,
      },
      {
        label: "407 Proxy Authentication Required",
        value: 407,
      },
      {
        label: "408 Request Timeout",
        value: 408,
      },
      {
        label: "409 Conflict",
        value: 409,
      },
      {
        label: "410 Gone",
        value: 410,
      },
      {
        label: "411 Length Required",
        value: 411,
      },
      {
        label: "412 Precondition Failed",
        value: 412,
      },
      {
        label: "413 Payload Too Large",
        value: 413,
      },
      {
        label: "414 URI Too Long",
        value: 414,
      },
      {
        label: "415 Unsupported Media Type",
        value: 415,
      },
      {
        label: "416 Range Not Satisfiable",
        value: 416,
      },
      {
        label: "417 Expectation Failed",
        value: 417,
      },
      {
        label: "418 I'm a teapot",
        value: 418,
      },
      {
        label: "421 Misdirected Request",
        value: 421,
      },
      {
        label: "422 Unprocessable Entity",
        value: 422,
      },
      {
        label: "423 Locked ",
        value: 423,
      },
      {
        label: "424 Failed Dependency",
        value: 424,
      },
      {
        label: "425 Too Early",
        value: 425,
      },
      {
        label: "426 Upgrade Required",
        value: 426,
      },
      {
        label: "428 Precondition Required",
        value: 428,
      },
      {
        label: "429 Too Many Requests",
        value: 429,
      },
      {
        label: "431 Request Header Fields Too Large",
        value: 431,
      },
      {
        label: "451 Unavailable For Legal Reasons",
        value: 451,
      },
    ],
  },
  {
    label: "Server error responses (500-599)",
    children: [
      {
        label: "500 Internal Server Error",
        value: 500,
      },
      {
        label: "501 Not Implemented",
        value: 501,
      },
      {
        label: "502 Bad Gateway",
        value: 502,
      },
      {
        label: "503 Service Unavailable",
        value: 503,
      },
      {
        label: "504 Gateway Timeout",
        value: 504,
      },
      {
        label: "505 HTTP Version Not Supported",
        value: 505,
      },
      {
        label: "506 Variant Also Negotiates",
        value: 506,
      },
      {
        label: "507 Insufficient Storage ",
        value: 507,
      },
      {
        label: "508 Loop Detected",
        value: 508,
      },
      {
        label: "510 Not Extended",
        value: 510,
      },
      {
        label: "511 Network Authentication Required",
        value: 511,
      },
    ],
  },
];
