
import _ from 'underscore';


import PocketBase from 'pocketbase';

const pb = new PocketBase('http://203.154.91.6:8090');




export default defineEventHandler(async (event) => {

    const query = getQuery(event)




    var stooges = [
        {
            "base_info": {
                "serial_no": "VA2023030217270000141",
                "track": "BAGH-BHDY",
                "area": "B",
                "car_type": 203,
                "car_type_text": "6W7.2",
                "running_mileage": "956",
                "stop_time": 1677780000,
                "finish_for_time": "5h 59m",
                "plan_arrived_time": 1677783600,
                "price": 1770000
            },
            "site_info": [
                {
                    "order_no": 1,
                    "store_name": "88 BAG_HUB-บางปลา",
                    "address": " หมู่ 23  อาคาร 9 เลขที่ 88/40-42, 88/53-55 และอาคาร 10 เลขที่ 88/43-46, 88/56-59  บางพลีใหญ่ บางพลี สมุทรปราการ",
                    "running_mileage": null,
                    "plan_arrived_time": 1677783600,
                    "plan_departure_time": 1677790800,
                    "lat": 13.594066,
                    "lng": 100.680541
                },
                {
                    "order_no": 2,
                    "store_name": "39 HDY_BHUB-หาดใหญ่",
                    "address": "13/1 ถนน ชุมแสง ตำบลบ้านพรุ อำเภอหาดใหญ่ สงขลา 90250 บ้านพรุ หาดใหญ่ สงขลา",
                    "running_mileage": "956",
                    "plan_arrived_time": 1677862740,
                    "plan_departure_time": null,
                    "lat": 7.02914,
                    "lng": 100.393253
                }
            ]
        },
        {
            "base_info": {
                "serial_no": "VA2023030217270000141_2",
                "track": "BAGH-BHDY",
                "area": "B",
                "car_type": 100,
                "car_type_text": "6W7.2",
                "running_mileage": "956",
                "stop_time": 1677780000,
                "finish_for_time": "5h 26m",
                "plan_arrived_time": 1677783600,
                "price": 1770000
            },
            "site_info": [
                {
                    "order_no": 1,
                    "store_name": "11 BAG_HUB-บางปลา",
                    "address": " หมู่ 23  อาคาร 9 เลขที่ 88/40-42, 88/53-55 และอาคาร 10 เลขที่ 88/43-46, 88/56-59  บางพลีใหญ่ บางพลี สมุทรปราการ",
                    "running_mileage": null,
                    "plan_arrived_time": 1677783600,
                    "plan_departure_time": 1677790800,
                    "lat": 13.594066,
                    "lng": 100.680541
                },
                {
                    "order_no": 2,
                    "store_name": "22 HDY_BHUB-หาดใหญ่",
                    "address": "13/1 ถนน ชุมแสง ตำบลบ้านพรุ อำเภอหาดใหญ่ สงขลา 90250 บ้านพรุ หาดใหญ่ สงขลา",
                    "running_mileage": "956",
                    "plan_arrived_time": 1677862740,
                    "plan_departure_time": null,
                    "lat": 7.02914,
                    "lng": 100.393253
                }
            ]
        }
    ];

    const api_w_1 = "DEMO"
    const api_w_2 = "D_1"

    console.log(api_w_1 + " : " + api_w_2);

    const resultList = await pb.collection('driver').getList(1, 50, {
        filter: 'status = "ready"',sort: '-updated',expand: 'target'
    });



    return find_work(resultList.items,100,api_w_1,api_w_2)


})


function find_work(driver_list,car_type,origin,destination,option){
    
    var find = _.find(driver_list, function(w){ 
        if (w.expand.target.select_origin_main === "origin"){
            return Number(w.car_type) === Number(car_type) && w.expand.target.origin.indexOf(origin) !== -1 && w.expand.target.destination.indexOf(destination) !== -1; 
        }else if (w.expand.target.select_origin_main === "destination"){
            return Number(w.car_type) === Number(car_type) && w.expand.target.origin.indexOf(destination) !== -1 && w.expand.target.destination.indexOf(origin) !== -1; 
        }
    });
    
    if(find){
        return {
            status: "successful",
            find
        }
    }else{
        return {
            "status": "error"
        }
    }
}