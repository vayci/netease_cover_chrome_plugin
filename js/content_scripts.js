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
	    if(type == 4){
    	getSearchCover(createCoverPage);
    	return;
    }
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
    if(type == 4){
    	getSearchCover(createCoverPage);
    	return;
    }
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
	var patt4 = new  RegExp("http://music.163.com/#/search/m/");

	//下载歌曲封面
	regexResult = patt1.exec(uri);
	if(regexResult!=null)return 1;
	
	//下载歌单内歌曲封面
	regexResult = patt2.exec(uri);
	if(regexResult!=null)return 2;
	
	//下载推荐歌单封面
	regexResult = patt3.exec(uri);
	if(regexResult!=null)return 3;

	//搜索歌单封面
	regexResult = patt4.exec(uri);
	if(regexResult!=null)return 4;

	return -1;
}

/**
 * 获取搜索歌单封面array
 * @param  {[type]} array [description]
 * @return {[type]}       [description]
 */
function getSearchCover(callback){
 var array = new Array();
	var next_page = $("#g_iframe").contents().find("a.znxt");
	var covers_page_one = $("#g_iframe").contents().find("div.u-cover").find("img");
	   		 covers_page_one.each(function(){
	   			array.push($(this).attr("src"));
	    	});

	//每隔一秒尝试翻页
	var turn_page_timer = setInterval(function(){
	 //每次翻页后0.5秒获取数据	
	 //console.log("翻页");

	 if($(next_page).hasClass("js-disabled")){
	    	clearInterval(turn_page_timer);
	    		//console.log("翻页结束");
				callback(array);
	    }else{
	    	var id = $(next_page).attr("id");
			document.getElementById('g_iframe').contentWindow.document.getElementById(id).click();
				 setTimeout(function(){
			 	var covers = $("#g_iframe").contents().find("div.u-cover").find("img");
			   		 covers.each(function(){
			   			array.push($(this).attr("src"));
			    	});
			   		},500);
	    }
	},1000);

	
}

/**
 * 生成页面
 * @param  {[type]} array [description]
 * @return {[type]}       [description]
 */
function createCoverPage(array){
chrome.runtime.sendMessage(array, function(response) {});
}

