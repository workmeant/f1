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
      build_v: "0.0.10"
    };
  } else if (data.code === 1 && api.status === 200) {
    if (data.data.items.length > 0) {
      var status = null;
      var work_add_1 = null;
      var work_add_2 = null;
      var work_add_data = null;
      const driver_list = await pb.collection("driver").getList(1, 50, {
        filter: 'status = "ready"',
        sort: "-updated",
        expand: "target"
      });
      data.data.items.forEach(async (element) => {
        const serial_no = element.base_info.serial_no;
        const _find = find_work(driver_list, element.base_info.car_type, element.site_info[0].store_name, element.site_info[element.site_info.length - 1].store_name);
        const api_type = _find.find.car_type;
        const api_driver_id = _find.find.driver_id;
        const api_car_id = _find.find.car_id;
        if (_find === "successful") {
          console.log("successful" + serial_no + " : " + api_type + " : " + api_driver_id + " : " + api_car_id + " : " + element.site_info[0].store_name + " - " + element.site_info[element.site_info.length - 1].store_name);
          work_add_1 = element.site_info[0].store_name;
          work_add_2 = element.site_info[element.site_info.length - 1].store_name;
          work_add_data = element.site_info;
          status = "successful";
        } else {
          work_add_1 = element.site_info[0].store_name;
          work_add_2 = element.site_info[element.site_info.length - 1].store_name;
          work_add_data = element.site_info;
          status = "notfound";
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
        build_v: "0.0.10"
      };
    } else {
      return {
        api_code: api.status,
        data_code: data.code,
        server: "working",
        status: "notfound_items",
        count: data.data.items.length,
        items: data.data.items,
        build_v: "0.0.10"
      };
    }
  }
});
function find_work(driver_list, car_type, origin, destination, option) {
  var find = _.find(driver_list, function(w) {
    if (w.expand.target.select_origin_main === "origin") {
      return Number(w.car_type) === Number(car_type) && w.expand.target.origin.indexOf(origin) !== -1 && w.expand.target.destination.indexOf(destination) !== -1;
    } else if (w.expand.target.select_origin_main === "destination") {
      return Number(w.car_type) === Number(car_type) && w.expand.target.origin.indexOf(destination) !== -1 && w.expand.target.destination.indexOf(origin) !== -1;
    }
  });
  if (find) {
    return {
      status: "successful",
      find
    };
  } else {
    return {
      "status": "error"
    };
  }
}

export { workdemo as default };
//# sourceMappingURL=workdemo.mjs.map
