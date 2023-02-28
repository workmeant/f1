import { defineEventHandler, getQuery } from 'h3';

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
      build_v: "0.0.4"
    };
  } else if (data.code === 1 && api.status === 200) {
    if (data.data.items.length > 0) {
      var status = null;
      var work_add_1 = null;
      var work_add_2 = null;
      var work_add_data = null;
      const target_add1 = [
        "16 CENTRAL_HUB-\u0E27\u0E31\u0E07\u0E19\u0E49\u0E2D\u0E22",
        "23 AYU_BHUB-\u0E27\u0E31\u0E07\u0E19\u0E49\u0E2D\u0E22"
      ];
      const target_add2 = [
        "SAP_SP-\u0E2A\u0E32\u0E21\u0E1E\u0E23\u0E32\u0E19",
        "KRL_SP-\u0E01\u0E23\u0E30\u0E17\u0E38\u0E48\u0E21\u0E25\u0E49\u0E21",
        "OAM_SP-\u0E2D\u0E49\u0E2D\u0E21\u0E43\u0E2B\u0E0D\u0E48",
        "MAC_SP-\u0E21\u0E2B\u0E32\u0E0A\u0E31\u0E22",
        "2SAS_BDC-\u0E2A\u0E21\u0E38\u0E17\u0E23\u0E2A\u0E32\u0E04\u0E23",
        "SAS_SP-\u0E2A\u0E21\u0E38\u0E17\u0E23\u0E2A\u0E32\u0E04\u0E23",
        "BTR_SP-\u0E1A\u0E32\u0E07\u0E42\u0E17\u0E23\u0E31\u0E14",
        "TAC_SP-\u0E17\u0E48\u0E32\u0E08\u0E35\u0E19",
        "KSV_SP-\u0E04\u0E25\u0E2D\u0E07\u0E2A\u0E35\u0E48\u0E27\u0E32",
        "KKB_SP-\u0E04\u0E2D\u0E01\u0E01\u0E23\u0E30\u0E1A\u0E37\u0E2D",
        "BNJ_SP-\u0E1A\u0E32\u0E07\u0E19\u0E49\u0E33\u0E08\u0E37\u0E14",
        "PNS_SP-\u0E1E\u0E31\u0E19\u0E17\u0E49\u0E32\u0E22\u0E19\u0E23\u0E2A\u0E34\u0E07\u0E2B\u0E4C",
        "KKM_SP-\u0E42\u0E04\u0E01\u0E02\u0E32\u0E21",
        "KTB_SP-\u0E01\u0E23\u0E30\u0E17\u0E38\u0E48\u0E21\u0E41\u0E1A\u0E19",
        "TMI_SP-\u0E17\u0E48\u0E32\u0E44\u0E21\u0E49",
        "2KTB_BDC-\u0E01\u0E23\u0E30\u0E17\u0E38\u0E48\u0E21\u0E41\u0E1A\u0E19",
        "KLM_SP-\u0E04\u0E25\u0E2D\u0E07\u0E21\u0E30\u0E40\u0E14\u0E37\u0E48\u0E2D",
        "CAL_SP-\u0E41\u0E04\u0E23\u0E32\u0E22",
        "BAW_SP-\u0E1A\u0E49\u0E32\u0E19\u0E41\u0E1E\u0E49\u0E27",
        "2BAW_BDC-\u0E1A\u0E49\u0E32\u0E19\u0E41\u0E1E\u0E49\u0E27",
        "LSM_SP-\u0E2B\u0E25\u0E31\u0E01\u0E2A\u0E32\u0E21",
        "BTE_SP-\u0E1A\u0E32\u0E07\u0E40\u0E15\u0E22",
        "TSI_SP-\u0E17\u0E48\u0E32\u0E17\u0E23\u0E32\u0E22",
        "2KKB_BDC-\u0E04\u0E2D\u0E01\u0E01\u0E23\u0E30\u0E1A\u0E37\u0E2D",
        "2ANO_BDC-\u0E2D\u0E49\u0E2D\u0E21\u0E19\u0E49\u0E2D\u0E22",
        "PUS_SP-\u0E1E\u0E38\u0E17\u0E18\u0E2A\u0E32\u0E04\u0E23",
        "PEC_SP-\u0E40\u0E1E\u0E0A\u0E23\u0E1A\u0E38\u0E23\u0E35",
        "2CAM_BDC-\u0E0A\u0E30\u0E2D\u0E33",
        "SYA_SP-\u0E2A\u0E32\u0E21\u0E1E\u0E23\u0E30\u0E22\u0E32",
        "TYA_SP-\u0E17\u0E48\u0E32\u0E22\u0E32\u0E07",
        "MPG_SP-\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E1B\u0E23\u0E30\u0E08\u0E27\u0E1A\u0E04\u0E35\u0E23\u0E35\u0E02\u0E31\u0E19\u0E18\u0E4C",
        "2PRK_BDC-\u0E1B\u0E23\u0E30\u0E08\u0E27\u0E1A\u0E04\u0E35\u0E23\u0E35\u0E02\u0E31\u0E19\u0E18\u0E4C",
        "KBR_SP-\u0E01\u0E38\u0E22\u0E1A\u0E38\u0E23\u0E35",
        "PRK_SP-\u0E1B\u0E23\u0E30\u0E08\u0E27\u0E1A\u0E04\u0E35\u0E23\u0E35\u0E02\u0E31\u0E19\u0E18\u0E4C",
        "TSK_SP-\u0E17\u0E31\u0E1A\u0E2A\u0E30\u0E41\u0E01",
        "BHP_SP-\u0E1A\u0E32\u0E07\u0E2A\u0E30\u0E1E\u0E32\u0E19",
        "2BHP_BDC-\u0E1A\u0E32\u0E07\u0E2A\u0E30\u0E1E\u0E32\u0E19",
        "NOI_SP-\u0E1A\u0E32\u0E07\u0E2A\u0E30\u0E1E\u0E32\u0E19\u0E19\u0E49\u0E2D\u0E22",
        "PNB_SP-\u0E1B\u0E23\u0E32\u0E13\u0E1A\u0E38\u0E23\u0E35",
        "HUH_SP-\u0E2B\u0E31\u0E27\u0E2B\u0E34\u0E19",
        "MHU_SP-\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E2B\u0E31\u0E27\u0E2B\u0E34\u0E19",
        "2HUH_BDC-\u0E2B\u0E31\u0E27\u0E2B\u0E34\u0E19",
        "NGK_SP-\u0E2B\u0E19\u0E2D\u0E07\u0E41\u0E01",
        "SYO_SP-\u0E2A\u0E32\u0E21\u0E23\u0E49\u0E2D\u0E22\u0E22\u0E2D\u0E14",
        "2TYA_BDC-\u0E17\u0E48\u0E32\u0E22\u0E32\u0E07",
        "KKJ_SP-\u0E41\u0E01\u0E48\u0E07\u0E01\u0E23\u0E30\u0E08\u0E32\u0E19",
        "ROT_SP-\u0E23\u0E48\u0E2D\u0E19\u0E17\u0E2D\u0E07",
        "2PNB_BDC-\u0E1B\u0E23\u0E32\u0E13\u0E1A\u0E38\u0E23\u0E35",
        "KNO_SP-\u0E40\u0E02\u0E32\u0E19\u0E49\u0E2D\u0E22",
        "BPG_SP-\u0E1A\u0E49\u0E32\u0E19\u0E42\u0E1B\u0E48\u0E07",
        "2BPG_BDC-\u0E1A\u0E49\u0E32\u0E19\u0E42\u0E1B\u0E48\u0E07",
        "TPA_SP-\u0E17\u0E48\u0E32\u0E1C\u0E32",
        "PAI_SP-\u0E40\u0E1A\u0E34\u0E01\u0E44\u0E1E\u0E23",
        "BGP_SP-\u0E1A\u0E32\u0E07\u0E41\u0E1E",
        "POR_SP-\u0E42\u0E1E\u0E18\u0E32\u0E23\u0E32\u0E21",
        "NGE_SP-\u0E19\u0E32\u0E07\u0E41\u0E01\u0E49\u0E27",
        "TPU_SP-\u0E17\u0E2D\u0E07\u0E1C\u0E32\u0E20\u0E39\u0E21\u0E34",
        "THM_SP-\u0E17\u0E48\u0E32\u0E21\u0E48\u0E27\u0E07",
        "VHS_SP-\u0E27\u0E31\u0E07\u0E28\u0E32\u0E25\u0E32",
        "KRM_SP-\u0E15\u0E30\u0E04\u0E23\u0E49\u0E33\u0E40\u0E2D\u0E19",
        "TMG_SP-\u0E17\u0E48\u0E32\u0E21\u0E30\u0E01\u0E32",
        "2TMG_BDC-\u0E17\u0E48\u0E32\u0E21\u0E30\u0E01\u0E32",
        "2SYG_BDC-\u0E44\u0E17\u0E23\u0E42\u0E22\u0E04",
        "SYG_SP-\u0E44\u0E17\u0E23\u0E42\u0E22\u0E04",
        "BOP_SP-\u0E1A\u0E48\u0E2D\u0E1E\u0E25\u0E2D\u0E22",
        "2BOP_BDC-\u0E1A\u0E48\u0E2D\u0E1E\u0E25\u0E2D\u0E22",
        "PNT_SP-\u0E1E\u0E19\u0E21\u0E17\u0E27\u0E19",
        "TKA_SP-\u0E17\u0E48\u0E32\u0E21\u0E30\u0E02\u0E32\u0E21",
        "KAN_SP-\u0E01\u0E32\u0E0D\u0E08\u0E19\u0E1A\u0E38\u0E23\u0E35",
        "2KAN_BDC-\u0E01\u0E32\u0E0D\u0E08\u0E19\u0E1A\u0E38\u0E23\u0E35",
        "RYA_SP-\u0E25\u0E32\u0E14\u0E2B\u0E0D\u0E49\u0E32",
        "LAK_SP-\u0E40\u0E25\u0E32\u0E02\u0E27\u0E31\u0E0D",
        "HKG_SP-\u0E2B\u0E49\u0E27\u0E22\u0E01\u0E23\u0E30\u0E40\u0E08\u0E32",
        "POH_SP-\u0E42\u0E1E\u0E2B\u0E31\u0E01",
        "2POR_BDC-\u0E42\u0E1E\u0E18\u0E32\u0E23\u0E32\u0E21",
        "DMT_SP-\u0E14\u0E48\u0E32\u0E19\u0E21\u0E30\u0E02\u0E32\u0E21\u0E40\u0E15\u0E35\u0E49\u0E22",
        "DKM_SP-\u0E14\u0E2D\u0E19\u0E02\u0E21\u0E34\u0E49\u0E19",
        "SWD_SP-\u0E28\u0E23\u0E35\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E34\u0E4C",
        "NOP_SP-\u0E2B\u0E19\u0E2D\u0E07\u0E1B\u0E23\u0E37\u0E2D",
        "2NAP_BDC-\u0E19\u0E04\u0E23\u0E1B\u0E10\u0E21",
        "NAP_SP-\u0E19\u0E04\u0E23\u0E1B\u0E10\u0E21",
        "SNG_SP-\u0E2A\u0E19\u0E32\u0E21\u0E08\u0E31\u0E19\u0E17\u0E23\u0E4C",
        "TNK_SP-\u0E16\u0E19\u0E19\u0E02\u0E32\u0E14",
        "BPP_SP-\u0E1A\u0E48\u0E2D\u0E1E\u0E25\u0E31\u0E1A",
        "NHL_SP-\u0E2B\u0E19\u0E2D\u0E07\u0E1B\u0E32\u0E01\u0E42\u0E25\u0E07",
        "LYA_SP-\u0E25\u0E33\u0E1E\u0E22\u0E32",
        "KPS_SP-\u0E01\u0E33\u0E41\u0E1E\u0E07\u0E41\u0E2A\u0E19",
        "2KPS_BDC-\u0E01\u0E33\u0E41\u0E1E\u0E07\u0E41\u0E2A\u0E19",
        "SSM_SP-\u0E2A\u0E23\u0E30\u0E2A\u0E35\u0E48\u0E21\u0E38\u0E21",
        "NCS_SP-\u0E19\u0E04\u0E23\u0E0A\u0E31\u0E22\u0E28\u0E23\u0E35",
        "2NCS_BDC-\u0E19\u0E04\u0E23\u0E0A\u0E31\u0E22\u0E28\u0E23\u0E35",
        "WRM_SP-\u0E27\u0E31\u0E14\u0E25\u0E30\u0E21\u0E38\u0E14",
        "DTT_SP-\u0E14\u0E2D\u0E19\u0E15\u0E39\u0E21",
        "BAL_SP-\u0E1A\u0E32\u0E07\u0E40\u0E25\u0E19",
        "LRK_SP-\u0E15\u0E25\u0E32\u0E14\u0E1A\u0E32\u0E07\u0E2B\u0E25\u0E27\u0E07",
        "PTO_SP-\u0E40\u0E1B\u0E42\u0E15\u0E23",
        "2SAP_BDC-\u0E2A\u0E32\u0E21\u0E1E\u0E23\u0E32\u0E19",
        "KMI_SP-\u0E04\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48",
        "YCA_SP-\u0E22\u0E32\u0E22\u0E0A\u0E32",
        "PUT_SP-\u0E1E\u0E38\u0E17\u0E18\u0E21\u0E13\u0E11\u0E25",
        "2SNG_BDC-\u0E2A\u0E19\u0E32\u0E21\u0E08\u0E31\u0E19\u0E17\u0E23\u0E4C",
        "PMD_SP-\u0E42\u0E1E\u0E23\u0E07\u0E21\u0E30\u0E40\u0E14\u0E37\u0E48\u0E2D",
        "TLN_SP-\u0E17\u0E38\u0E48\u0E07\u0E25\u0E39\u0E01\u0E19\u0E01",
        "TTN_SP-\u0E17\u0E48\u0E32\u0E15\u0E33\u0E2B\u0E19\u0E31\u0E01",
        "2BAL_BDC-\u0E1A\u0E32\u0E07\u0E40\u0E25\u0E19",
        "SLY_SP-\u0E28\u0E32\u0E25\u0E32\u0E22\u0E32",
        "MKL_SP-\u0E41\u0E21\u0E48\u0E01\u0E25\u0E2D\u0E07",
        "2SAK_BDC-\u0E2A\u0E21\u0E38\u0E17\u0E23\u0E2A\u0E07\u0E04\u0E23\u0E32\u0E21",
        "SAK_SP-\u0E2A\u0E21\u0E38\u0E17\u0E23\u0E2A\u0E07\u0E04\u0E23\u0E32\u0E21",
        "APW_SP-\u0E2D\u0E31\u0E21\u0E1E\u0E27\u0E32",
        "MPC_SP-\u0E40\u0E21\u0E37\u0E2D\u0E07\u0E40\u0E1E\u0E0A\u0E23\u0E1A\u0E38\u0E23\u0E35",
        "2PEC_BDC-\u0E40\u0E1E\u0E0A\u0E23\u0E1A\u0E38\u0E23\u0E35",
        "KGS_SP-\u0E04\u0E25\u0E2D\u0E07\u0E01\u0E23\u0E30\u0E41\u0E0A\u0E07",
        "KYY_SP-\u0E40\u0E02\u0E32\u0E22\u0E49\u0E2D\u0E22",
        "LAD_SP-\u0E1A\u0E49\u0E32\u0E19\u0E25\u0E32\u0E14",
        "BNL_SP-\u0E1A\u0E49\u0E32\u0E19\u0E41\u0E2B\u0E25\u0E21",
        "RAT_SP-\u0E23\u0E32\u0E0A\u0E1A\u0E38\u0E23\u0E35",
        "2RAT_BDC-\u0E23\u0E32\u0E0A\u0E1A\u0E38\u0E23\u0E35",
        "JDH_SP-\u0E40\u0E08\u0E14\u0E35\u0E22\u0E4C\u0E2B\u0E31\u0E01",
        "DTG_SP-\u0E14\u0E2D\u0E19\u0E15\u0E30\u0E42\u0E01",
        "KMH_SP-\u0E42\u0E04\u0E01\u0E2B\u0E21\u0E49\u0E2D",
        "HNG_SP-\u0E2B\u0E34\u0E19\u0E01\u0E2D\u0E07",
        "SPH_SP-\u0E2A\u0E27\u0E19\u0E1C\u0E36\u0E49\u0E07",
        "DSK_SP-\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E2A\u0E30\u0E14\u0E27\u0E01",
        "TND_SP-\u0E17\u0E48\u0E32\u0E19\u0E31\u0E14",
        "PKT_SP-\u0E1B\u0E32\u0E01\u0E17\u0E48\u0E2D",
        "JBG_SP-\u0E08\u0E2D\u0E21\u0E1A\u0E36\u0E07",
        "2JBG_BDC-\u0E08\u0E2D\u0E21\u0E1A\u0E36\u0E07",
        "KPK_SP-\u0E40\u0E02\u0E32\u0E1E\u0E23\u0E30\u0E40\u0E2D\u0E01",
        "BGT_SP-\u0E1A\u0E32\u0E07\u0E04\u0E19\u0E17\u0E35"
      ];
      data.data.items.forEach(async (element) => {
        var serial_no = element.base_info.serial_no;
        var car_type = element.base_info.car_type;
        if (target_add2.indexOf(element.site_info[0].store_name) !== -1 && target_add1.indexOf(element.site_info[element.site_info.length - 1].store_name) !== -1) {
          const add_work = await api_add_work(query.token, car_type, serial_no, 3823, 6979);
          await linenotify("ByNHFn35ax4szFzKGxa0Eeq5BhQb5190Q4TqfZTh1v7", "successful : " + element.site_info[0] + " : " + element.site_info[element.site_info.length - 1] + " : " + add_work.code);
          work_add_1 = element.site_info[0];
          work_add_2 = element.site_info[element.site_info.length - 1];
          work_add_data = element.site_info;
          status = "successful";
          console.log(add_work);
        } else {
          work_add_1 = element.site_info[0];
          work_add_2 = element.site_info[element.site_info.length - 1];
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
