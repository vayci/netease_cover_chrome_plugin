var menu_1 = null;
var menu_2 = null;

// 根据页面内容创建右键菜单
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    chrome.contextMenus.removeAll();
    switch(request)
        {
        case 1:
            menu_1 = chrome.contextMenus.create({"title": "下载歌曲封面","contexts":["all"],"onclick":getSongCover});
            break;
        case 2:
            menu_1 = chrome.contextMenus.create({"title": "下载专辑封面","contexts":["all"],"onclick":getPlayListCover});
            menu_2 = chrome.contextMenus.create({"title": "下载专辑内歌曲封面","contexts":["all"],"onclick":getSongCoverInPlayList});
            break;
        case 3:
            menu_1 = chrome.contextMenus.create({"title": "下载推荐专辑封面","contexts":["all"],"onclick":getDiscoverPlayListCover});
            break;
        default:
        }
});

//向content_script发送消息，获取封面uri
function sendMessageToContentScript(message, callback)
{
    chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            var tab = tabs[0];
            chrome.tabs.sendMessage(tab.id, message, function(response) {
                callback(response);
            });
        });
    
}

function downloadCoverFromResponse(response){
     var uri = response.cover_src;
     downloadCover(uri);
}

//下载封面
function downloadCover(uri){
        var name = uri.replace(/http:\/\/[\w\W]*.music.126.net\//,"").replace("/","");
        chrome.downloads.download({
            url: uri,
            conflictAction: 'overwrite',
            filename: name,
            saveAs: false
                });
            }

//通过歌曲id下载封面
function downloadCoverBySongId(response){
    var songs = response.song_ids;
   for(var i = 0 ;i<songs.length;i++){
      $.get("http://music.163.com/song?id="+songs[i], function(result){
               var img_src = $(result).find("img.j-img").attr("data-src");
               downloadCover(img_src);
        });
    }
    //todo 模拟请求 获取封面路径并遍历下载  此处需加代理
}

/**菜单绑定方法**/
//歌曲封面
function getSongCover(info, tab) {  
        sendMessageToContentScript({"opt":1,"value":1},downloadCoverFromResponse);
}   
//歌单封面
function getPlayListCover(info, tab) {  
        sendMessageToContentScript({"opt":1,"value":2},downloadCoverFromResponse);
}   
//歌单内歌曲封面
function getSongCoverInPlayList(info, tab){
        sendMessageToContentScript({"opt":1,"value":3},downloadCoverBySongId);
}

//推荐歌单封面
function getDiscoverPlayListCover(info, tab){
         chrome.tabs.create({"url":"./index.html"}, function(){});
}




