document.title = chrome.i18n.getMessage('appName');
var downloadThisCover = chrome.i18n.getMessage('downloadThisCover');
var extName = chrome.i18n.getMessage('extName');
var downloadTips = chrome.i18n.getMessage('downloadTips');

$(function(){
	  chrome.contextMenus.removeAll();
    chrome.contextMenus.create({id:"single-download","title": downloadThisCover,"contexts":["image"]});
  	var category = getQueryString('category');
  	var start_page = getQueryString('start_page');
  	var end_page = getQueryString('end_page');
  	var auto_download = getQueryString('auto_download');
    dealCovers(auto_download,category,start_page,end_page);
    $('div').on('click', 'img', function() {
    		    layer.open({
		          type: 1,
		          title: false,
		          area: ['680px', '680px'], 
		          shadeClose: true,
		          content: '<img src="'+$(this).attr("src").replace("param=140y140&","")+'" style="width:680px;height:auto;">'
		        });
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  switch(info.menuItemId){
      case 'single-download':
          getCoverBycontextMenu(info, tab)
          break;
  }
});

//下载封面
function downloadCover(uri,name){
	//var name = uri.replace(/http:\/\/[\w\W]*.music.126.net\//,"").replace("/","");
        chrome.downloads.download({
            url: uri,
            conflictAction: 'overwrite',
            filename: name,
            saveAs: false
                });
            }

//右击封面时操作：下载
function getCoverBycontextMenu(info, tab){
  var src = info.srcUrl.replace("param=140y140&","");
  var name ="playlist_"+src.substring(src.lastIndexOf("=")+1)+".jpg";
  downloadCover(src,name);
	chrome.notifications.create(src, {
		type: 'basic',
		iconUrl: 'img/icon.png',
		title: extName,
		message: '1'+downloadTips
	});
	setTimeout(function(){
			chrome.notifications.clear(src, function(){})
	},2000);
}

//获取封面并添加到页面
function dealCovers(auto_download,category,start_page,end_page){
  if(auto_download=="true"){
    for(var i = start_page ;i<end_page;i++){
      var url = "https://music.163.com/discover/playlist/?order=hot&cat="+category+"&limit=35&offset="+(i-1)*35;
      console.log(url)
      $.get(url, function(result){
        var imgs = $(result).find("img.j-flag");
        imgs.each(function(){
               var href =  $(this).next().attr("href");
               if(href!=undefined){
	               $('div').append("<img style='height:90px;width:90px;' src='"+$(this).attr('src')+"&playlist="+href.substring(href.lastIndexOf('=')+1)+"'>");
	               var name ="playlist_"+href.substring(href.lastIndexOf("=")+1)+".jpg";
	               downloadCover($(this).attr("src").replace("?param=140y140",""),name);
          		 }
                });
    });
    }
    	var total = (end_page-start_page+1)*35;
    	chrome.notifications.create("hot_covers", {
		type: 'basic',
		iconUrl: 'img/icon.png',
		title: extName,
		message: total+downloadTips
	});
	setTimeout(function(){
			chrome.notifications.clear("hot_covers", function(){})
	},2000);
  }else{
    for(var i = start_page ;i<end_page;i++){
      var url = "https://music.163.com/discover/playlist/?order=hot&cat="+category+"&limit=35&offset="+(i-1)*35;
      console.log(url)
        $.get(url, function(result){
          var imgs = $(result).find("img.j-flag")
          imgs.each(function(){
                  var href =  $(this).next().attr("href");
                  if(href!=undefined){
                  	 $('div').append("<img style='height:90px;width:90px;' src='"+$(this).attr('src')+"&playlist="+href.substring(href.lastIndexOf('=')+1)+"'>");
                  }
                  });

      });
    }
  }
}

//获取popup参数
function getQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  decodeURI(r[2]); return null;
}
