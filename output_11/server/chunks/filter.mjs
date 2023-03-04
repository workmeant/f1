import { defineEventHandler, getQuery } from 'h3';
import _ from 'underscore';
import PocketBase from 'pocketbase';

const pb = new PocketBase("http://203.154.91.6:8090");
const filter = defineEventHandler(async (event) => {
  getQuery(event);
  const api_w_1 = "DEMO";
  const api_w_2 = "D_1";
  console.log(api_w_1 + " : " + api_w_2);
  const resultList = await pb.collection("driver").getList(1, 50, {
    filter: 'status = "ready"',
    sort: "-updated",
    expand: "target"
  });
  return find_work(resultList.items, 100, api_w_1, api_w_2);
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

export { filter as default };
//# sourceMappingURL=filter.mjs.map
