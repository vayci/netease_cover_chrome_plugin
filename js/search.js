document.title = chrome.i18n.getMessage('appName');
var downloadThisCover = chrome.i18n.getMessage('downloadThisCover');
var extName = chrome.i18n.getMessage('extName');
var downloadTips = chrome.i18n.getMessage('downloadTips');

console.log('init listener')

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.data) {
	  // 处理接收到的数据
	  console.log("Received data in search.js:", request.data);
	  var covers_obj = JSON.parse(request.data);
	  console.log(covers_obj)
	  for (var key in covers_obj){
		  console.log(key)
		  $('div').append("<img style='height:90px;width:90px;' src='"+ covers_obj[key]+"&playlist="+key+"'>");
		  }
	  chrome.contextMenus.removeAll();
	  chrome.contextMenus.create({id:"single-download","title": downloadThisCover,"contexts":["image"]});
	  $("img").click(function(event){
		  layer.open({
		  type: 1,
		  title: false,
		  area: ['680px', '680px'],
		  shadeClose: true,
		  content: '<img src="'+$(this).attr("src").replace("param=140y140&","").replace("param=180y180&","")+'" style="width:680px;height:auto;">'
		  }); 
	  });
	}
  });
console.log('init listener end')

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
		title: extName,
		message: '1'+downloadTips
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
