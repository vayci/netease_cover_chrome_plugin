$(function() {

    $("section").waypoint({
        handler: function(event, direction) {
            var $activeSection = $(this);
            if (direction === "up") {
                $activeSection = $activeSection.prev();
            }

            $("#navigation a").parent().removeClass("active");
            $('#navigation a[href="#' + $activeSection.attr("id") + '"]')
                .parent().addClass("active");
        },
        offset: '50%'
    });

    // Scroll to top
    $('body').append('<div id="back-top"><span class="glyphicon glyphicon-arrow-up"></span></div>');
    $("#back-top").hide();

    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#back-top').fadeIn();
        } else {
            $('#back-top').fadeOut();
        }
    });

    $('#back-top').click(function() {
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    $('.carousel').carousel({
        interval: 3500,
        pause: "none"
    });
});
