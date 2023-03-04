export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    var raw = JSON.stringify({
        "mobile": query.usr,
        "password": query.pass
    });
    const api = await fetch("https://gwapi.fleet.vip/gw/fms/auth/login", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "cache-control": "no-cache",
            "content-type": "application/json;charset=UTF-8",
            "fms-session-id": "undefined",
            "Referer": "https://supplier-th.fleet.vip/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": raw,
        "method": "POST"
    })

    const data = await api.json();
        if (data.code === 20626) {

        return {
            api_code: api.status,
            data_code: data.code,
            server: "working",
            status: "error",
            message: data.message
        }

    } else if (data.code === 1) {
       
        return {
            api_code: api.status,
            data_code: data.code,
            server: "working",
            status: data.message,
            data: data.data.fms_session_id
        }


    }



})


