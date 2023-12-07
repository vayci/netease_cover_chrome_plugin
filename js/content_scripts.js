const patt1 = new RegExp("https://music.163.com/#/song");
const patt2 = new RegExp("https://music.163.com/#/playlist");
const patt3 = new RegExp("https://music.163.com/#/discover/playlist");
const patt4 = new RegExp("https://music.163.com/#/search/m/");
const patt5 = new RegExp("https://music.163.com/#/user/home");

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
				const sendResponseCallback = sendResponse;
	        	var array = new Array();
	           	var songs = $("#g_iframe").contents().find("span.txt a");
	           	songs.each(function(){
					var str = $(this).attr("href");
					var id = str.substring(str.indexOf("=")+1);
	           		array.push(id);
	           	});
				getCoverInfo(array).then(result => {
					sendResponseCallback(result)
				})
				.catch(error => {
					console.error(error);
				});
	            break;
	        case 4:
				var array = new Array();
        		var scrolled = 0 ;
				var i = top.document.getElementById("g_iframe");
				i.contentWindow.scrollTo(0,100000);
				var timer = setInterval(function(){
					i.contentWindow.scrollTo(0,100000);
					var now = i.contentWindow.scrollY;
					if(scrolled == now){
						clearInterval(timer);
						var obj = {};
						var covers_page_one = $("#g_iframe").contents().find("div.u-cover").find("img");
						   		 covers_page_one.each(function(){
						   		 	var href =  $(this).parent().find('a').attr("href");
						   		 	if(href==undefined){
						   		 		console.log($(this));
						   		 	}else{
							   		 	var id = href.substring(href.lastIndexOf('=')+1);
										var data_name = "song_" + id + ".jpg";
										var cover = {
											cover_src: $(this).attr("src"),
											cover_name: data_name
										};
										array.push(cover)
							   			obj[id]=$(this).attr("src");
						   		 	}
						    	});
								console.log(array)
								//sendResponse(array)
								createCoverPage(JSON.stringify(obj));
					}else{
						scrolled = now;
						console.log(now);
					}
				},300);
        	 	
	        	break;
	        default:
	         	break;
	        }
			
	}

});

 function getCoverInfo(songs) {
	return doGetCoverInfo(songs);
}

function doGetCoverInfo(songs) {
	var promises = [];
    for (var i = 0; i < songs.length; i++) {
		var promise = fetch("https://music.163.com/song?id=" + songs[i])
			.then(function(response){
				return response.text()
			})
			.then(function(result) {
				var img_src = $(result).find("img.j-img").attr("data-src");
                var data_name = "song_" + $(result).find("#content-operation").attr("data-rid") + ".jpg";
                var cover = {
                    cover_src: img_src,
                    cover_name: data_name
                };
                return cover;
            });
		promises.push(promise);
    }
	return Promise.all(promises)
        .then(function(results) {
            return results; // 返回包含所有结果的数组
        })
        .catch(function(error) {
            console.error("Error during fetching:", error);
        });
}

function initPage(){
	var type = uriZuul(location.href);
	if(type == 4){
    	getSearchCover(createCoverPage);
    	return;
    }
	 chrome.runtime.sendMessage(type, function(response) {});
}

function showlayer(){
    var bh=$(window).height();//获取屏幕高度
    var bw=$(window).width();//获取屏幕宽度
    $("#layer").css({
        height:bh,
        width:bw,
        display:"block"
    });
    $("#pop").show();
}
 

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
	    }, 500);
	}
});

//url发生变化，通知background重新创建右键菜单
function hashChangeFire(){
	initPage();
}

//url路由
function uriZuul(uri){
	var regexResult = null;
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

	//个人主页歌单封面
	regexResult = patt5.exec(uri);
	if(regexResult!=null)return 5;

	return -1;
}

//获取搜索歌单封面array
function getSearchCover(callback){
	if(!getSource())return;
 	var obj = {};
	var count = 0;
	var next_page = $("#g_iframe").contents().find("a.znxt");
	if(next_page.length == 0){
		console.log("我没有找到翻页按钮啊!");
		return;	
	}
	var covers_page_one = $("#g_iframe").contents().find("div.u-cover").find("img");
	   		 covers_page_one.each(function(){
	   		 	var href =  $(this).parent().attr("href");
	   		 	var id = href.substring(href.lastIndexOf('=')+1);
	   			obj[id]=$(this).attr("src");
	    	});

	//每隔一秒尝试翻页
	var turn_page_timer = setInterval(function(){
	 //每次翻页后0.5秒获取数据	
	 console.log( $(next_page).attr("id"));
	 if($(next_page).hasClass("js-disabled")){
	    	clearInterval(turn_page_timer);
			callback(JSON.stringify(obj));
			return;
	    }else{
			var id = $(next_page).attr("id");
			try{
				top.window.frames["contentFrame"].document.getElementById(id).click();
			}catch(err){
				//翻页翻不动了
				clearInterval(turn_page_timer);
				callback(JSON.stringify(obj));
				return;
			}
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

function getSource(){
	let url = window.location.href;
	return url.indexOf("extension") != -1;
}