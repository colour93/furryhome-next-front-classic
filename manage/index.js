const $ = mdui.$;

const APIURL = "https://api.furryhome.cn:19393";

let currentCateId = 0;
let dataList = [];
let currentCate = {};

let updateCateDialog, updateSiteDialog;

window.onload = async () => {

    initDialog();
    loadCateList();

}

// 初始化对话框
function initDialog() {
    $('#add-cate-dialog').on('confirm.mdui.dialog', addCate);

    // 图标预览
    $('#add-cate-dialog-input-icon').on('input', (e) => {
        $('#add-cate-dialog-input-icon-preview').attr('class', e.target.value);
    })
    $('#update-cate-dialog-input-icon').on('input', (e) => {
        $('#update-cate-dialog-input-icon-preview').attr('class', e.target.value);
    })

    updateCateDialog = new mdui.Dialog('#update-cate-dialog');

    // ======

    $('#add-site-dialog').on('open.mdui.dialog', () => {
        if (currentCateId) {
            $('#add-site-dialog-input-cate').val(`${currentCateId}. ${currentCate.cateName}`);
        }
    });

    $('#add-site-dialog').on('confirm.mdui.dialog', addSite);

    // 图标预览
    $('#add-site-dialog-input-favicon').on('blur', (e) => {
        $('#add-site-dialog-input-favicon-preview').attr('src', e.target.value);
    })
    $('#update-site-dialog-input-icon').on('blur', (e) => {
        $('#update-site-dialog-input-favicon-preview').attr('src', e.target.value);
    })
    
    updateSiteDialog = new mdui.Dialog('#update-site-dialog');

}

// 分类表格信息
async function loadCateList() {

    cateListElem = $('#cate-list table tbody');
    cateListElem.html('');

    // 初始化分类列表
    const cateList = await refreshDataList();

    // 渲染列表
    cateListHtml = "";
    for (let i = 0; i < cateList.length; i++) {
        const { cateId, cateName, cateIcon, cateIntro, siteList } = cateList[i];
        cateListHtml += `
        <tr>
            <td>${cateId}</td>
            <td>${cateName}</td>
            <td><span class="${cateIcon}"></span></td>
            <td>${cateIntro}</td>
            <td>${siteList.length}</td>
            <td>
                <button class="mdui-btn mdui-btn-icon mdui-btn-raised mdui-ripple mdui-color-green-800" onclick="loadSiteList(${cateId})">
                    <i class="mdui-icon material-icons">keyboard_return</i>
                </button>
                <button class="mdui-btn mdui-btn-icon mdui-btn-raised mdui-ripple mdui-color-deep-purple" onclick="updateCateBtn(${cateId})">
                    <i class="mdui-icon material-icons">edit</i>
                </button>
                <button class="mdui-btn mdui-btn-icon mdui-btn-raised mdui-color-red mdui-ripple" onclick="deleteCateBtn(${cateId})">
                    <i class="mdui-icon material-icons">delete</i>
                </button>
            </td>
        </tr>
        `
    };
    cateListElem.html(cateListHtml);
}

// 具体网站信息
async function loadSiteList(cateId) {

    await refreshDataList();

    switchCate(cateId);

    siteListElem = $('#site-list table tbody');
    siteListElem.html('');

    const { siteList, cateName } = await axios.get(APIURL + '/site/cate/' + cateId).then(resp => resp.data.data);

    // 渲染列表
    siteListHtml = "";
    for (let i = 0; i < siteList.length; i++) {
        const { siteId, siteName, siteFavicon, siteUrl, siteParam, siteIntro, siteViews, siteLikes, siteCreateTime } = siteList[i];
        siteListHtml += `
        <tr id="site-${siteId}">
            <td>${siteName}</td>
            <td>${cateName}</td>
            <td><img class="site-favicon" src="${siteFavicon}" /></td>
            <td>${siteUrl}</td>
            <td>${siteParam || "-"}</td>
            <td>${siteIntro}</td>
            <td>${siteViews}</td>
            <td>${siteLikes}</td>
            <td>${(new Date(siteCreateTime)).toLocaleString()}</td>
            <td>
                <button class="mdui-btn mdui-btn-icon mdui-btn-raised mdui-ripple mdui-color-deep-purple" onclick="updateSiteBtn(${cateId}, '${siteId}')">
                    <i class="mdui-icon material-icons">edit</i>
                </button>
                <button class="mdui-btn mdui-btn-icon mdui-btn-raised mdui-ripple mdui-color-red" onclick="deleteSiteBtn(${cateId}, '${siteId}')">
                    <i class="mdui-icon material-icons">delete</i>
                </button>
            </td>
        </tr>
        `
    };
    siteListElem.html(siteListHtml);

}

// ======

// 选择某个分类
function switchCate(cateId) {
    currentCateId = cateId;
    currentCate = objAryCompare(dataList, 'cateId', cateId);
    return;
}

// 增加分类
async function addCate() {

    let name = $('#add-cate-dialog-input-name').val();
    let intro = $('#add-cate-dialog-input-intro').val();
    let icon = $('#add-cate-dialog-input-icon').val();

    if (
        (!name) ||
        (icon && !/^czs(-\w+)+$/.test(icon))
    ) {
        mdui.snackbar("表单不完整");
        return;
    }

    if (!intro) intro = undefined;
    if (!icon) icon = undefined;

    r = await axios({
        method: 'post',
        url: APIURL + '/manage/site/cate/add',
        data: {
            name,
            intro,
            icon
        }
    }).then(resp => resp.data.data);

    if (!r) return;

    mdui.snackbar(`已增加！${r.cateId}. ${r.cateName}`);

    loadCateList();
}

// 更新分类
async function updateCate(cateId) {

    if (!cateId) return;

    let name = $('#update-cate-dialog-input-name').val();
    let intro = $('#update-cate-dialog-input-intro').val();
    let icon = $('#update-cate-dialog-input-icon').val();

    if (
        (!name) ||
        (icon && !/^czs(-\w+)+$/.test(icon))
    ) {
        mdui.snackbar("表单不完整");
        return;
    }

    if (!intro) intro = undefined;
    if (!icon) icon = undefined;

    r = await axios({
        method: 'post',
        url: APIURL + '/manage/site/cate/update',
        data: {
            id: cateId,
            name,
            intro,
            icon
        }
    }).then(resp => resp.data.data);

    if (!r) return;

    mdui.snackbar(`已更新！${r.cateId}. ${r.cateName}`);
    loadCateList();

}

// 删除分类
async function deleteCate(cateId, force) {

    if (
        (!cateId)
    ) {
        mdui.snackbar("表单不完整");
        return;
    }

    r = await axios({
        method: 'post',
        url: APIURL + '/manage/site/cate/delete',
        data: {
            id: cateId,
            force
        }
    }).then(resp => resp.data);

    if (r.code == 200) {
        loadCateList();
        return r.msg;
    };

    if (r.code == -421) {
        mdui.dialog({
            title: "对应分类下站点非空",
            content: "是否强制删除？",
            buttons: [
                {
                    text: '取消'
                },
                {
                    text: '强制删除',
                    onClick: async () => {
                        r = await deleteCate(cateId, true);
                        return r;
                    }
                }
            ]
        });
    }

}

// ======

// 增加站点
async function addSite() {

    let cateId = currentCateId;
    let name = $('#add-site-dialog-input-name').val();
    let url = $('#add-site-dialog-input-url').val();
    let param = $('#add-site-dialog-input-param').val();
    let intro = $('#add-site-dialog-input-intro').val();
    let favicon = $('#add-site-dialog-input-favicon').val();

    if (!cateId) {
        mdui.snackbar("请先选择分类");
        return;
    }

    if (
        (!name) ||
        (!url)
    ) {
        mdui.snackbar("表单不完整");
        return;
    }

    if (!param) param = undefined;
    if (!intro) intro = undefined;
    if (!favicon) icon = undefined;

    r = await axios({
        method: 'post',
        url: APIURL + '/manage/site/add',
        data: {
            cateId,
            name,
            url,
            param,
            intro,
            favicon
        }
    }).then(resp => resp.data.data);

    if (!r) return;

    mdui.snackbar(`已增加！${r.site.siteName} - ${r.cate.cateName}`);

    loadSiteList(cateId);
}

// 更新站点
async function updateSite(cateId, siteId) {

    if (!siteId) return;

    let name = $('#update-site-dialog-input-name').val();
    let url = $('#update-site-dialog-input-url').val();
    let param = $('#update-site-dialog-input-param').val();
    let intro = $('#update-site-dialog-input-intro').val();
    let favicon = $('#update-site-dialog-input-favicon').val();

    if (
        (name === "") ||
        (url === "")
    ) {
        mdui.snackbar("表单不完整");
        return;
    }

    if (!param) param = undefined;
    if (!intro) intro = undefined;
    if (!favicon) favicon = undefined;

    r = await axios({
        method: 'post',
        url: APIURL + '/manage/site/update',
        data: {
            id: siteId,
            name,
            url,
            param,
            intro,
            favicon
        }
    }).then(resp => resp.data.data);

    if (!r) return;

    mdui.snackbar(`已更新！${r.site.siteName}`);

    loadSiteList(cateId);

}

// 删除站点
async function deleteSite(cateId, siteId) {

    if (
        (!siteId)
    ) {
        mdui.snackbar("表单不完整");
        return;
    }

    r = await axios({
        method: 'post',
        url: APIURL + '/manage/site/delete',
        data: {
            id: siteId
        }
    }).then(resp => resp.data);

    if (r.code == 200) {
        loadSiteList(cateId);
        return r.msg;
    };

}

// =======

// 更新分类按钮 handler
function updateCateBtn(cateId) {

    const { cateName, cateIntro, cateIcon } = objAryCompare(dataList, 'cateId', cateId);

    $('#update-cate-dialog-input-id').val(cateId);
    $('#update-cate-dialog-input-name').val(cateName);
    $('#update-cate-dialog-input-intro').val(cateIntro);
    $('#update-cate-dialog-input-icon').val(cateIcon);

    $('#update-cate-dialog [mdui-dialog-confirm]').attr('onclick', `updateCate(${cateId})`);

    updateCateDialog.open();

}

// 删除分类按钮 handler
function deleteCateBtn(cateId) {

    const { cateName, siteList } = objAryCompare(dataList, 'cateId', cateId);

    let content = `确定要删除分类 ${cateId}. ${cateName} 吗？`;

    if (siteList.length) {
        content += `该分类下还有 ${siteList.length} 个站点`;
    }

    mdui.dialog({
        title: "删除分类确认",
        content,
        buttons: [
            {
                text: '取消'
            },
            {
                text: '确认',
                onClick: async () => {
                    r = await deleteCate(cateId);
                    if (r) mdui.snackbar(r);
                }
            }
        ]
    });

}

// 更新站点按钮 handler
function updateSiteBtn(cateId, siteId) {

    const { cateName, siteList } = objAryCompare(dataList, 'cateId', cateId);
    const { siteName, siteUrl, siteParam, siteIntro, siteFavicon } = objAryCompare(siteList, 'siteId', siteId);

    $('#update-site-dialog-input-id').val(siteId);
    $('#update-site-dialog-input-cate').val(`${cateId}. ${cateName}`);
    $('#update-site-dialog-input-name').val(siteName);
    $('#update-site-dialog-input-url').val(siteUrl);
    $('#update-site-dialog-input-param').val(siteParam);
    $('#update-site-dialog-input-intro').val(siteIntro);
    $('#update-site-dialog-input-favicon').val(siteFavicon);
    $('#update-site-dialog-input-favicon-preview').attr('src', siteFavicon);

    $('#update-site-dialog [mdui-dialog-confirm]').attr('onclick', `updateSite(${cateId}, "${siteId}")`);

    updateSiteDialog.open();

}

// 删除站点按钮 handler
function deleteSiteBtn(cateId, siteId) {

    const { cateName, siteList } = objAryCompare(dataList, 'cateId', cateId);
    const { siteName } = objAryCompare(siteList, 'siteId', siteId);

    let content = `确定要删除站点 ${cateId}. ${cateName} - ${siteName} 吗？`;


    mdui.dialog({
        title: "删除站点确认",
        content,
        buttons: [
            {
                text: '取消'
            },
            {
                text: '确认',
                onClick: async () => {
                    r = await deleteSite(cateId, siteId);
                    if (r) mdui.snackbar(r);
                }
            }
        ]
    });

}

// =======

async function refreshDataList () {
    r = await axios.get(APIURL + '/site/list').then(resp => resp.data.data);
    dataList = r;
    return r;
}

function objAryCompare(ary, key, value) {
    for (let i = 0; i < ary.length; i++) {
        const obj = ary[i];
        if (obj[key] == value) {
            return obj;
        }
    };
    return null
}