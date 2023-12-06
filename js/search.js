
//搜索完成页面处理
$(function(){
	 chrome.storage.local.get(["covers"]).then((result) => {
		var list = result.covers
		var covers_obj = JSON.parse(list);
		console.log(covers_obj)
		for (var key in covers_obj){
			console.log(key)
			$('div').append("<img style='height:90px;width:90px;' src='"+ covers_obj[key]+"&playlist="+key+"'>");
			}
		chrome.contextMenus.removeAll();
		chrome.contextMenus.create({id:"single-download","title": "下载这张封面","contexts":["image"]});
		$("img").click(function(event){
			layer.open({
			type: 1,
			title: false,
			area: ['680px', '680px'],
			shadeClose: true,
			content: '<img src="'+$(this).attr("src").replace("param=140y140&","").replace("param=180y180&","")+'" style="width:680px;height:auto;">'
			}); 
		});
	  });
    // var storage = window.localStorage;
	// var covers_json = storage.getItem("covers");
	
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    switch(info.menuItemId){
        case 'single-download':
            getCoverBycontextMenu(info, tab)
            break;
    }
});

function getCoverBycontextMenu(info, tab){
  var src = info.srcUrl.replace("param=180y180&","").replace("param=140y140&","");
  var name ="playlist_"+src.substring(src.lastIndexOf("=")+1)+".jpg";
  downloadCover(src,name);
	chrome.notifications.create(src, {
		type: 'basic',
		iconUrl: 'img/icon.png',
		title: '网易云封面',
		message: '1张封面开始下载'
	});
	setTimeout(function(){
			chrome.notifications.clear(src, function(){})
	},2000);
}

function downloadCover(uri,name){
	//var name = uri.replace(/http:\/\/[\w\W]*.music.126.net\//,"").replace("/","");
        chrome.downloads.download({
            url: uri,
            conflictAction: 'overwrite',
            filename: name,
            saveAs: false
        });
}
