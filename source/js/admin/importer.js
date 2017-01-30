var EventManagerIntegration = EventManagerIntegration || {};
EventManagerIntegration.loading = false;
EventManagerIntegration.data = {'action' : 'import_events', 'value': ''};
EventManagerIntegration.timerId = null;

jQuery(document).ready(function ($) {
    $('#importevents').click(function() {
        if(!EventManagerIntegration.loadingOccasions)
        {
            EventManagerIntegration.loadingOccasions = true;
            var button = $(this);
            var storedCss = collectCssFromButton(button);
            redLoadingButton(button, function() {
                EventManagerIntegration.data.value = button.attr('id');
                jQuery.post(ajaxurl, EventManagerIntegration.data, function(response) {
                    var newPosts = response;
                    EventManagerIntegration.loadingOccasions = false;
                    restoreButton(button, storedCss);
                    location.reload();
                });
            });
        }
    });
});

function collectCssFromButton(button)
{
    return {
        bgColor: button.css('background-color'),
        textColor: button.css('color'),
        borderColor: button.css('border-color'),
        textShadow: button.css('text-shadow'),
        boxShadow: button.css('box-shadow'),
        width: button.css('width'),
        text: button.text()
    };
}

function redLoadingButton(button, callback)
{
    button.fadeOut(500, function() {
        var texts = [eventIntegrationAdmin.loading + '&nbsp;&nbsp;&nbsp;', eventIntegrationAdmin.loading + '.&nbsp;&nbsp;', eventIntegrationAdmin.loading + '..&nbsp;', eventIntegrationAdmin.loading + '...'];
        button.css('background-color', 'rgb(51, 197, 255)');
        button.css('border-color', 'rgb(0, 164, 230)');
        button.css('color', 'white');
        button.css('text-shadow', '0 -1px 1px rgb(0, 164, 230),1px 0 1px rgb(0, 164, 230),0 1px 1px rgb(0, 164, 230),-1px 0 1px rgb(0, 164, 230)');
        button.css('box-shadow', 'none');
        button.css('width', '85px');
        button.html(texts[0]);
        button.fadeIn(500);

        var counter = 1;
        EventManagerIntegration.timerId = setInterval(function()
        {
            if(counter > 3)
                counter = 0;
            button.html(texts[counter]);
            ++counter;
        }, 500);
        if(callback != undefined)
            callback();
    });
}

function restoreButton(button, storedCss)
{
    button.fadeOut(500, function() {
        button.css('background-color', storedCss.bgColor);
        button.css('color', storedCss.textColor);
        button.css('border-color', storedCss.borderColor);
        button.css('text-shadow', storedCss.textShadow);
        button.css('box-shadow', storedCss.boxShadow);
        button.css('width', storedCss.width);
        button.text(storedCss.text);
        button.fadeIn(500);
        clearTimeout(EventManagerIntegration.timerId);
    });
}
