import { defineEventHandler, getQuery } from 'h3';

const car = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const api = await fetch("https://gwapi.fleet.vip/gw/fms/car/items", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "th-TH",
      "cache-control": "no-cache",
      "content-type": "application/json;charset=UTF-8",
      "fms-session-id": query.token,
      "sec-ch-ua": '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "Referer": "https://supplier-th.fleet.vip/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": '{"car_num":"","car_company_id":"","car_state":"","type":"","biz_type":"","size":"","page_num":1,"page_size":200}',
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
      data: data.data.items
    };
  }
});

export { car as default };
//# sourceMappingURL=car.mjs.map
