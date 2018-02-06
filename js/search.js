
$(function(){
	chrome.contextMenus.removeAll();
    chrome.contextMenus.create({"title": "下载这张封面","contexts":["image"],"onclick":getCoverBycontextMenu});
    var storage=window.localStorage;
	var covers_json=storage.getItem("covers");
    var covers_obj=JSON.parse(covers_json);
    for (var key in covers_obj){
          $('div').append("<img src='"+ covers_obj[key]+"&playlist="+key+"'>");
        }
});

function getCoverBycontextMenu(info, tab){
  var src = info.srcUrl.replace("param=180y180&","");
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