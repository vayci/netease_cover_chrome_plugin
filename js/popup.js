$('#check_tab').click(function() {
    sendMessageToContentScript('你好，我是popup！', (response) => {
            if(response) alert('收到来自content-script的回复：'+response);
        });
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
