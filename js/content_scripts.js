//监听backgroud消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.opt == 1){
		switch(request.value){
	        case 1:
	            var data_src = $("#g_iframe").contents().find("img.j-img").attr("data-src");
	            var data_name ="song_"+$("#g_iframe").contents().find("#content-operation").attr("data-rid")+".jpg";
	            sendResponse({cover_src: data_src,cover_name: data_name});
	            break;
	        case 2:
	            var data_src = $("#g_iframe").contents().find("img.j-img").attr("data-src");
	            var data_name ="palylist_"+$("#g_iframe").contents().find("#content-operation").attr("data-rid")+".jpg";
	            sendResponse({cover_src: data_src,cover_name: data_name});
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

function initPage(){
	var type = uriZuul(location.href);
	    if(type == 4){
    	getSearchCover(createCoverPage);
    	return;
    }
    var netease_img =  $(top.window.frames["contentFrame"].document).find("div.u-cover").find("img.j-img");
    var wrap = $(top.window.frames["contentFrame"].document).find("div.u-cover");
   	$(wrap).click(function(){ 
   			console.log($(netease_img).attr("src").replace("?param=130y130","").replace("?param=200y200","")); 
   			window.open($(netease_img).attr("src").replace("?param=130y130","").replace("?param=200y200",""));   
		 //   layer.open({
			//   type: 1,
			//   title: false,
			//   area: ['680px', '680px'],
			//   shadeClose: true,
			//   content: '<img src="'+$(netease_img).attr("src").replace("?param=130y130","")+'" style="width:680px;height:auto;">'
			// }); 
		});  
 //   	$("div").on("click",".u-cover",function(){  
	//    console.log($(netease_img).attr("src").replace("?param=130y130","").replace("?param=200y200","")); 
 //   	   window.open($(netease_img).attr("src").replace("?param=130y130","").replace("?param=200y200",""));   
	// }); 
	chrome.runtime.sendMessage(type, function(response) {});
}

//注入时更新右键菜单
$(function(){
	initPage();
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
   initPage();
}

//url路由
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

//获取搜索歌单封面array
function getSearchCover(callback){
 	var obj = new Object();
	var next_page = $("#g_iframe").contents().find("a.znxt");
	var covers_page_one = $("#g_iframe").contents().find("div.u-cover").find("img");
	   		 covers_page_one.each(function(){
	   		 	var href =  $(this).parent().attr("href");
	   		 	var id = href.substring(href.lastIndexOf('=')+1);
	   			obj[id]=$(this).attr("src");
	    	});

	//每隔一秒尝试翻页
	var turn_page_timer = setInterval(function(){
	 //每次翻页后0.5秒获取数据	
	 if($(next_page).hasClass("js-disabled")){
	    	clearInterval(turn_page_timer);
	    	//console.log(obj);
				callback(JSON.stringify(obj));
	    }else{
	    	var id = $(next_page).attr("id");
			top.window.frames["contentFrame"].document.getElementById(id).click();
				 setTimeout(function(){
			 		var covers = $(top.window.frames["contentFrame"].document).find("div.u-cover").find("img");
				   		 covers.each(function(){
				   		 	var href =  $(this).parent().attr("href");
		   		 			var id = href.substring(href.lastIndexOf('=')+1);
				   			obj[id]=$(this).attr("src");
				    	});
			   		},500);
	    }
	},1000);

	
}

//发送数据值context_menu.js(background),写入本地存储
function createCoverPage(json_map){
	chrome.runtime.sendMessage(json_map, function(response) {});
}

