import { defineEventHandler, getQuery } from 'h3';
import PocketBase from 'pocketbase';

const pb = new PocketBase("http://203.154.91.6:8090");
const works = defineEventHandler(async (event) => {
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
      build_v: "0.0.8"
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
          const add_work = await api_add_work(query.token, api_type, serial_no, api_car_id, api_driver_id);
          await linenotify("ByNHFn35ax4szFzKGxa0Eeq5BhQb5190Q4TqfZTh1v7", "successful : " + add_work.message + " : " + add_work.code + " : " + element.site_info[0].store_name + " : " + element.site_info[element.site_info.length - 1].store_name);
          await linenotify("a6Q86pvn5LoyRDXJgjADJ5C12xYzPDmxEb2CJPe3UEG", "successful : " + add_work.message + " : " + add_work.code + " : " + element.site_info[0].store_name + " : " + element.site_info[element.site_info.length - 1].store_name);
          console.log(add_work);
          const data2 = {
            "status": "busy"
          };
          await pb.collection("driver").update(record.id, data2);
          console.log("successful_origin" + serial_no + " : " + api_type + " : " + api_driver_id + " : " + api_car_id + " : " + element.site_info[0].store_name + " - " + element.site_info[element.site_info.length - 1].store_name);
          work_add_1 = element.site_info[0].store_name;
          work_add_2 = element.site_info[element.site_info.length - 1].store_name;
          work_add_data = element.site_info;
          status = "successful_origin";
        } else if (group_select_origin_main === "destination" && api_origin.indexOf(element.site_info[element.site_info.length - 1].store_name) !== -1 && api_destination.indexOf(element.site_info[0].store_name) !== -1 && Number(api_type) === element.base_info.car_type) {
          const add_work = await api_add_work(query.token, api_type, serial_no, api_car_id, api_driver_id);
          await linenotify("ByNHFn35ax4szFzKGxa0Eeq5BhQb5190Q4TqfZTh1v7", "successful : " + add_work.message + " : " + add_work.code + " : " + element.site_info[0].store_name + " : " + element.site_info[element.site_info.length - 1].store_name);
          await linenotify("a6Q86pvn5LoyRDXJgjADJ5C12xYzPDmxEb2CJPe3UEG", "successful : " + add_work.message + " : " + add_work.code + " : " + element.site_info[0].store_name + " : " + element.site_info[element.site_info.length - 1].store_name);
          console.log(add_work);
          const data2 = {
            "status": "busy"
          };
          await pb.collection("driver").update(record.id, data2);
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
        build_v: "0.0.8"
      };
    } else {
      return {
        api_code: api.status,
        data_code: data.code,
        server: "working",
        status: "notfound_items",
        count: data.data.items.length,
        items: data.data.items,
        build_v: "0.0.8"
      };
    }
  }
});
async function api_add_work(token, car_type, serial_no, car_id, driver_id) {
  var raw = JSON.stringify({
    "car_type": car_type,
    "serial_no": serial_no,
    "car_id": car_id,
    "driver_id": driver_id
  });
  const api = await fetch("https://gwapi.fleet.vip/gw/fms/grab_order/grab", {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "th-TH",
      "cache-control": "no-cache",
      "content-type": "application/json;charset=UTF-8",
      "fms-session-id": token,
      "sec-ch-ua": '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "Referer": "https://supplier-th.fleet.vip/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": raw,
    "method": "POST"
  });
  const data = await api.json();
  return data;
}
async function linenotify(tokenline, msgsend) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", "Bearer " + tokenline);
  var urlencoded = new URLSearchParams();
  urlencoded.append("message", msgsend);
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow"
  };
  const api = await fetch("https://notify-api.line.me/api/notify", requestOptions);
  const data = await api.json();
  return data;
}

export { works as default };
//# sourceMappingURL=works.mjs.map
