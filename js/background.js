var menu_1 = null;
var menu_2 = null;

// i18n
var downloadSong = chrome.i18n.getMessage('downloadSong');
var downloadPlaylist = chrome.i18n.getMessage('downloadPlaylist');
var downloadSongInPlaylist = chrome.i18n.getMessage('downloadSongInPlaylist');
var downloadDiscoverPlaylist = chrome.i18n.getMessage('downloadDiscoverPlaylist');
var downloadCollectPlaylist = chrome.i18n.getMessage('downloadCollectPlaylist');

// 根据页面内容创建右键菜单
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    chrome.contextMenus.removeAll();
    switch(request)
        {
        case -1:
            break;
        case 1:
            menu_1 = chrome.contextMenus.create({id: "song-cover", "title": downloadSong,"contexts":["all"]});
            break;
        case 2:
            menu_1 = chrome.contextMenus.create({id: "playlist-cover", "title": downloadPlaylist,"contexts":["all"]});
            menu_2 = chrome.contextMenus.create({id: "song-cover-in-playlist", "title": downloadSongInPlaylist,"contexts":["all"]});
            break;
        case 3:
            menu_1 = chrome.contextMenus.create({id: "discover-playlist", "title": downloadDiscoverPlaylist,"contexts":["all"]});
            break;
        case 4:
            var storage = window.localStorage;
            storage.setItem("covers",request);
            chrome.tabs.create({"url":"./search.html"}, function(){});
             break;
        case 5:
             menu_1 = chrome.contextMenus.create({id: "collect-playlist", "title": downloadCollectPlaylist,"contexts":["all"]});
            break;
        default:
            console.log('msg', request)
            chrome.tabs.create({"url":"./search.html"}, function(newTab){
                setTimeout(function() {
                    console.log(newTab.id)
                    chrome.tabs.sendMessage(newTab.id, { data: request });
                  }, 1000);
                
            });
            break;
        }
     //return true;
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    switch(info.menuItemId){
        case 'song-cover':
            getSongCover(info, tab)
            break;
        case 'playlist-cover':
            getPlayListCover(info, tab)
            break;
        case 'song-cover-in-playlist':
            getSongCoverInPlayList(info, tab)
            break;
        case 'discover-playlist':
            getDiscoverPlayListCover(info, tab)
            break;
        case 'collect-playlist':
            getCollectPlayListCover(info, tab)
            break;
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
            console.log('send', tab.id)
            chrome.tabs.sendMessage(tab.id, message, function(response) {
                callback(response);
            });
        });
    
}

//向content_script发送消息，获取封面uri
function sendMessageToContentScript2(message)
{
    chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            var tab = tabs[0];
            console.log('send', tab.id)
            chrome.tabs.sendMessage(tab.id, message);
        });
    
}

//从ContentScript response下载封面
function downloadCoverFromResponse(response){
     var uri = response.cover_src;
     var name = response.cover_name;
     downloadCover(uri,name);
     chrome.notifications.create(uri, {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('img/icon.png'),
        title: '网易云封面',
        message: '1张封面开始下载'
    });
    setTimeout(function(){
            chrome.notifications.clear(uri, function(){})
    },2000);
}

//从ContentScript response下载封面
function downloadCoverListFromResponse(cover_list){
    if(cover_list==undefined || cover_list.length == 0){
        return
    }
    for(var i = 0 ; i < cover_list.length ; i++){
        downloadCover(cover_list[i].cover_src,cover_list[i].cover_name);
    }
    chrome.notifications.create("playlist_covers", {
       type: 'basic',
       iconUrl: chrome.runtime.getURL('img/icon.png'),
       title: '网易云封面',
       message: cover_list.length+'张封面开始下载'
   });
   setTimeout(function(){
           chrome.notifications.clear("playlist_covers", function(){})
   },2000);
}

//下载封面
function downloadCover(uri,name){
       // var name = uri.replace(/http:\/\/[\w\W]*.music.126.net\//,"").replace("/","");
        chrome.downloads.download({
            url: uri,
            conflictAction: 'overwrite',
            filename: name,
            saveAs: false
        });
}

/**菜单绑定方法**/
//歌曲封面
function getSongCover(info, tab) {  
        sendMessageToContentScript({"opt":1,"value":1}, downloadCoverFromResponse);
}   
//歌单封面
function getPlayListCover(info, tab) {  
        sendMessageToContentScript({"opt":1,"value":2}, downloadCoverFromResponse);
}   
//歌单内歌曲封面
function getSongCoverInPlayList(info, tab){
        sendMessageToContentScript({"opt":1,"value":3}, downloadCoverListFromResponse);
}

//推荐歌单封面
function getDiscoverPlayListCover(info, tab){
         chrome.tabs.create({"url":"./index.html"}, function(){});
}

//个人收藏歌单封面
function getCollectPlayListCover(info, tab){
     sendMessageToContentScript2({"opt":1,"value":4});
}




