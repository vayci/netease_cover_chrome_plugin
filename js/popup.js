// i18n
document.getElementById('app-name').textContent = chrome.i18n.getMessage('appName');
document.getElementById('category').textContent = chrome.i18n.getMessage('category');
document.getElementById('start-page').textContent = chrome.i18n.getMessage('startPage');
document.getElementById('end-page').textContent = chrome.i18n.getMessage('endPage');
document.getElementById('load_hot').textContent = chrome.i18n.getMessage('collect');

document.addEventListener('DOMContentLoaded', function () {
  $('#load_hot').on('click',function(){
  var category = $('#category').val();
  var search_words = $('#search_words').val();
  var start_page = $('#start_page').val();
  var end_page = $('#end_page').val();
  var auto_download = $("#auto_download").is(':checked');
  if(search_words!=''&&search_words!=null){
  	 chrome.tabs.create({"url":"https://music.163.com/#/search/m/?id=584701281&s="+search_words+"&type=1000&source=extension"}, function(){});
  	}else{
  	 chrome.tabs.create({"url":"./index.html?category="+category+"&start_page="+start_page+"&end_page="+end_page+"&auto_download="+auto_download}, function(){});
  	}
});
});

// 获取当前选项卡ID
function getCurrentTabId(callback){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if(callback) callback(tabs.length ? tabs[0].id: null);
    });
}

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback){
    getCurrentTabId((tabId) =>{
        chrome.tabs.sendMessage(tabId, message, function(response){
            if(callback) callback(response);
        });
    });
}