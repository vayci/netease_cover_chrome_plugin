$('#load_hot').on('click',function(){
  var category = $('#category').val();
  var start_page = $('#start_page').val();
  var end_page = $('#end_page').val();
  var auto_download = $("#auto_download").is(':checked');
  chrome.tabs.create({"url":"./index.html?category="+category+"&start_page="+start_page+"&end_page="+end_page+"&auto_download="+auto_download}, function(){});
});

    // 获取当前选项卡ID
function getCurrentTabId(callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        if(callback) callback(tabs.length ? tabs[0].id: null);
    });
}

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback)
{
    getCurrentTabId((tabId) =>
    {
        chrome.tabs.sendMessage(tabId, message, function(response)
        {
            if(callback) callback(response);
        });
    });
}
