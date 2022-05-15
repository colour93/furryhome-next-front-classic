/**
 * FurryHome Classic Ver.
 * 不想写呜呜呜
 */

let dataList;

window.onload = () => {

    axiosInterceptor();
    loadCard();
    let scroll = new SmoothScroll('a[href*="#"]');
    initNotice();

}

// axios拦截器
function axiosInterceptor() {

    axios.defaults.withCredentials = true;

    axios.interceptors.response.use(function (response) {
        if (response.data.code != 200) {
            console.log(`错误: ${response.data.code} - ${response.data.msg}`);
        }
        return response;
    }, function (error) {
        return Promise.reject(error);
    });

}

// 初始化滚动条
function initNotice() {
    var $noticeWrap = $(".notice-carousel-wrap");
    $noticeWrap.each(function () {
        var e = $(this).find(".notice-item").length,
            t = $(this);
        1 < e && setInterval(function () {
            t.stop(!0, !0).animate({
                top: "-44px"
            }, 200, function () {
                t.css("top", "-2px"), t.append(t.find(".notice-item:first"))
            })
        }, 6e3)
    }), $(document).on("click", ".fighting", function () {
        $("body, html").animate({
            scrollTop: 0
        }, 600)
    }), $(window).scroll(function () {
        1e3 < $(document).scrollTop() ? $(".fighting").addClass("active") : $(".fighting").removeClass("active")
    }), window.onload = function () {
        $(window).trigger("scroll")
    }, $(window).resize(function () {
        $(window).trigger("scroll")
    });
}

// 加载站点卡片
async function loadCard() {

    r = await axios.get(APIURL + '/site/list').then(resp => resp.data.data);

    dataList = r;

    let navHtml = "";

    let contentHtml = "";

    let k = 1;

    for (let i = 0; i < r.length; i++) {
        const { cateId, cateName, cateIntro, cateIcon, siteList } = r[i];
        navHtml += `
        <div class="menu-group">
            <a href="#${cateId}" class="menu-item">
                <i class="icon ${cateIcon}"></i>${cateId}. ${cateName} </a>
        </div>
        `

        let cardHtml = "";
        cardHtml += `
        <div class="col-12">
            <div class="section-title " id="${cateId}">
                <i class="icon ${cateIcon}"></i>
                ${cateId}. ${cateName}
            </div>
        </div>
        `
        for (let j = 0; j < siteList.length; j++) {
            k++;

            const { siteId, siteName, siteUrl, siteIntro, siteFavicon, siteViews, siteLikes, liked, siteParam } = siteList[j];

            cardHtml += `
            <div class="col-xl-3 col-lg-4 col-md-6">
                <div class="card tooltip tooltip-bottom " data-tooltip="${siteIntro}"
                    style="z-index: ${10000 - k};">
                    <div class="media">
                        <div class="media-left">
                            <figure class="image image-rounded card-tn">
                                <img src="${siteFavicon}"
                                    alt="card-tn">
                            </figure>
                        </div>
                        <div class="media-content">
                            <a href="${siteUrl}/${siteParam ? siteParam : ""}" target="_blank" onclick="viewSite('${siteId}')">
                                <div class="card-title text-truncate">
                                    ${siteName} </div>
                                <div class="card-desc">
                                    ${siteIntro} </div>
                            </a>
                            <div class="card-meta">
                                <span class="card-read">
                                    <i class="icon czs-eye-l"></i>
                                    ${siteViews} </span>
                                <span class="card-love ${liked ? "active" : ""}" id="site-like-${siteId}" onclick="likeSite('${siteId}')" style="cursor: pointer;">
                                    <i class="icon czs-heart${liked ? "" : "-l"}"></i>
                                    <span class="card-love-count">
                                        ${siteLikes} </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        }

        contentHtml += cardHtml;
    }

    $('nav.menu.menu-collapse').html(navHtml);
    $('.content .row').append(contentHtml);

}

// 喜欢某站点
async function likeSite(siteId) {

    r = await axios.get(APIURL + '/site/like?siteId=' + siteId).then(resp => resp.data);

    if (r.code != 200) return;

    const { data } = r;

    $(`#site-like-${data.site.siteId}`).addClass('active');

    $(`#site-like-${data.site.siteId} .icon`).attr('class', 'icon czs-heart');

    $(`#site-like-${data.site.siteId} .card-love-count`).html(data.site.siteLikes);

}

// 浏览某站点
function viewSite(siteId) {

    axios.get(APIURL + '/site/view?siteId=' + siteId);

}