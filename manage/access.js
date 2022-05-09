/**
 * just access and redirect
 */

axios.get('https://api.furryhome.cn:19393/auth')
    .then((resp) => {
        const {code} = resp.data;
        if (code != 200) {
            window.location = "/";
            return;
        };
        const {data} = resp.data;
        if (data.role != 'admin') {
            window.location = "/";
            return;
        }
    })