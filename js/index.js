$('#download').on('click',function(){
	var page_size = 35;
	var category = $('#category').val();
	var start_page = $('#start_page').val();
	var end_page = $('#end_page').val();

	for(var i = start_page ;i<end_page;i++){
		$.get("http://music.163.com/discover/playlist/?order=hot&cat="+category+"&limit=35&offset="+(i-1)*35, function(result){
	    var imgs = $(result).find("img.j-flag")
	    imgs.each(function(){
	           $('div').append("<img src='"+$(this).attr("src")+"'>");
	           	});
  });
	}
  


});