//监听backgroud消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.opt == 1){
		switch(request.value){
	        case 1:
	            var data_src = $("#g_iframe").contents().find("img.j-img").attr("data-src");
	            sendResponse({cover_src: data_src});
	            break;
	        case 2:
	            var data_src = $("#g_iframe").contents().find("img.j-img").attr("data-src");
	            sendResponse({cover_src: data_src});
	            break;
	        case 3:
	        	var array = new Array();
	           	var songs = $("#g_iframe").contents().find("span.txt a");
	           	songs.each(function(){
	           	var str = $(this).attr("href");
	           	var id = str.substring(str.indexOf("=")+1);
	           		array.push(id);
	           	});
	           	sendResponse({song_ids: array});
	            break;
	        default:
	        }
	}
	   
});

//注入时更新右键菜单
$(function(){
	var type = uriZuul(location.href);
	chrome.runtime.sendMessage(type, function(response) {});
})

//url变化监听器
$(function(){
	if( ('onhashchange' in window) && ((typeof document.documentMode==='undefined') || document.documentMode==8)) {
	    // 浏览器支持onhashchange事件
	    window.onhashchange = hashChangeFire; 
	} else {
	    // 不支持则用定时器检测的办法
	    setInterval(function() {
	        var ischanged = isHashChanged();
	        if(ischanged) {
	            hashChangeFire(); 
	        }
	    }, 150);
	}
});

//url发生变化，通知background重新创建右键菜单
function hashChangeFire(){
    var type = uriZuul(location.href);
	chrome.runtime.sendMessage(type, function(response) {});
}

/**
 * [uriZuul 返回页面类型]
 * @param  {[type]} uri [打开地址]
 * @return {[type]}     []
 */
function uriZuul(uri){
	var regexResult = null;
	var patt1 = new RegExp("http://music.163.com/#/song");
	var patt2 = new RegExp("http://music.163.com/#/playlist");
	var patt3 = new RegExp("http://music.163.com/#/discover/playlist");

	//下载歌曲封面
	regexResult = patt1.exec(uri);
	if(regexResult!=null)return 1;
	
	//下载歌单内歌曲封面
	regexResult = patt2.exec(uri);
	if(regexResult!=null)return 2;
	
	//下载推荐歌单封面
	regexResult = patt3.exec(uri);
	if(regexResult!=null)return 3;

	return -1;
}
