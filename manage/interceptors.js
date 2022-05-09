/**
 * axios 拦截器
 */

axios.defaults.withCredentials = true;

axios.interceptors.response.use(function (response) {
    if (response.data.code != 200) {
        mdui.snackbar(`错误: ${response.data.code} - ${response.data.msg}`);
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});