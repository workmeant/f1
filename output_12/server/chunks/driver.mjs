import { defineEventHandler, getQuery } from 'h3';

const driver = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const api = await fetch("https://gwapi.fleet.vip/gw/fms/grab_order/driver", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "th-TH",
      "cache-control": "no-cache",
      "content-type": "application/json;charset=UTF-8",
      "fms-session-id": query.token,
      "sec-ch-ua": '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "Referer": "https://supplier-th.fleet.vip/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": "{}",
    "method": "POST"
  });
  const data = await api.json();
  if (data.code === 20642) {
    return {
      api_code: api.status,
      data_code: data.code,
      server: "working",
      status: "error",
      message: data.message
    };
  } else if (data.code === 1) {
    return {
      api_code: api.status,
      data_code: data.code,
      server: "working",
      status: data.message,
      data: data.data
    };
  }
});

export { driver as default };
//# sourceMappingURL=driver.mjs.map
