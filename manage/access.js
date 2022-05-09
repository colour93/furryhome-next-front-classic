/**
 * just access and redirect
 */

axios.get('https://api.furryhome.cn:19393/auth')
    .then((resp) => {
        const {code} = resp;
        if (code != 200) {
            window.location = "/";
            return;
        };
        const {data} = resp.data;
        if (data.user.role != 'admin') {
            window.location = "/";
            return;
        }
    })