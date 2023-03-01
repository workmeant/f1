import { defineEventHandler, getQuery } from 'h3';
import PocketBase from 'pocketbase';

const pb = new PocketBase("http://203.154.91.6:8090");
const workdemo = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const api = await fetch("https://gwapi.fleet.vip/gw/fms/grab_order/list", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "en-US",
      "cache-control": "no-cache",
      "content-type": "application/json;charset=UTF-8",
      "fms-session-id": query.token,
      "sec-ch-ua": '"Chromium";v="111", "Not(A:Brand";v="8"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "Referer": "https://supplier-th.fleet.vip/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": '{"area":"","car_type":"","page_size":20,"page_num":1}',
    "method": "POST"
  });
  const data = await api.json();
  if (data.code === 20642) {
    return {
      api_code: api.status,
      data_code: data.code,
      server: "working",
      status: "error",
      message: data.message,
      build_v: "0.0.4"
    };
  } else if (data.code === 1 && api.status === 200) {
    if (data.data.items.length > 0) {
      var status = null;
      var work_add_1 = null;
      var work_add_2 = null;
      var work_add_data = null;
      const record = await pb.collection("driver").getFirstListItem('status="ready"', {
        sort: "-created",
        expand: "target.group_name"
      });
      const api_type = record.car_type;
      const api_driver_id = record.driver_id;
      const api_car_id = record.car_id;
      const api_origin = Array(record.expand.target.origin)[0];
      const api_destination = Array(record.expand.target.destination)[0];
      const group_select_origin_main = record.expand.target.expand.group_name.select_origin_main;
      data.data.items.forEach(async (element) => {
        const serial_no = element.base_info.serial_no;
        if (group_select_origin_main === "origin" && api_origin.indexOf(element.site_info[0].store_name) !== -1 && api_destination.indexOf(element.site_info[element.site_info.length - 1].store_name) !== -1 && Number(api_type) === element.base_info.car_type) {
          console.log("successful_origin" + serial_no + " : " + api_type + " : " + api_driver_id + " : " + api_car_id + " : " + element.site_info[0].store_name + " - " + element.site_info[element.site_info.length - 1].store_name);
          work_add_1 = element.site_info[0].store_name;
          work_add_2 = element.site_info[element.site_info.length - 1].store_name;
          work_add_data = element.site_info;
          status = "successful_origin";
        } else if (group_select_origin_main === "destination" && api_origin.indexOf(element.site_info[element.site_info.length - 1].store_name) !== -1 && api_destination.indexOf(element.site_info[0].store_name) !== -1 && Number(api_type) === element.base_info.car_type) {
          console.log("successful_destination" + serial_no + " : " + api_type + " : " + api_driver_id + " : " + api_car_id + " : " + element.site_info[0].store_name + " - " + element.site_info[element.site_info.length - 1].store_name);
          work_add_1 = element.site_info[0].store_name;
          work_add_2 = element.site_info[element.site_info.length - 1].store_name;
          work_add_data = element.site_info;
          status = "successful_destination";
        } else {
          work_add_1 = element.site_info[0].store_name;
          work_add_2 = element.site_info[element.site_info.length - 1].store_name;
          work_add_data = element.site_info;
          status = "notfound";
          console.log("fail" + serial_no + " : " + element.base_info.car_type + " : " + api_driver_id + " : " + api_car_id + " : " + element.site_info[0].store_name + " - " + element.site_info[element.site_info.length - 1].store_name);
        }
      });
      return {
        api_code: api.status,
        data_code: data.code,
        server: "working",
        status,
        work_1: work_add_1,
        work_2: work_add_2,
        site: work_add_data,
        build_v: "0.0.4"
      };
    } else {
      return {
        api_code: api.status,
        data_code: data.code,
        server: "working",
        status: "notfound_items",
        count: data.data.items.length,
        items: data.data.items,
        build_v: "0.0.4"
      };
    }
  }
});

export { workdemo as default };
//# sourceMappingURL=workdemo.mjs.map
