"use strict";EventManagerIntegration=EventManagerIntegration||{},EventManagerIntegration.Event=EventManagerIntegration.Event||{},EventManagerIntegration.Event.Map=function(){function e(){"object"==typeof google&&"object"==typeof google.maps&&this.init()}return e.prototype.init=function(){var e,t,n,a,i,r,o;e=document.getElementById("event-map"),e&&(t={lat:parseFloat(e.getAttribute("data-lat")),lng:parseFloat(e.getAttribute("data-lng"))},n={zoom:15,center:t,disableDefaultUI:!1},a=new google.maps.Map(e,n),o=e.getAttribute("data-title")?e.getAttribute("data-title"):"",r=new google.maps.InfoWindow({content:"<b>"+o+"</b>"}),i=new google.maps.Marker({position:t,map:a}),o&&i.addListener("click",function(){r.open(a,i)}))},new e}();var EventManagerIntegration={};EventManagerIntegration=EventManagerIntegration||{},EventManagerIntegration.Event=EventManagerIntegration.Event||{},EventManagerIntegration.Event.Module=function(e){function t(){e(function(){this.initEventPagination()}.bind(this))}return t.prototype.initEventPagination=function(){e(".modularity-mod-event").each(function(n,a){var i=e(this).find("[data-module-id]").attr("data-module-id"),r=e(this).find(".module-pagination").attr("data-pages"),o=e(this).find(".module-pagination").attr("data-show-arrows"),c=e(this);e(this).find(".module-pagination").pagination({pages:r,displayedPages:4,edges:0,cssStyle:"",ellipsePageSet:!1,prevText:o?"&laquo;":"",nextText:o?"&raquo;":"",currentPage:1,selectOnClick:!1,onPageClick:function(n,a){t.prototype.loadEvents(n,i,c),e(c).find(".module-pagination").pagination("redraw"),e(c).find(".pagination a:not(.current)").each(function(){e(this).parent().addClass("disabled temporary")})}})})},t.prototype.loadEvents=function(t,n,a){var i=e(a).find(".event-module-content").height(),r=e(window).scrollTop(),o=e(a).offset().top;e.ajax({url:eventintegration.ajaxurl,type:"post",data:{action:"ajax_pagination",page:t,id:n},beforeSend:function(){e(a).find(".event-module-list").remove(),e(a).find(".event-module-content").append('<div class="event-loader"><div class="loading-wrapper"><div class="loading"><div></div><div></div><div></div><div></div></div></div></div>'),e(a).find(".event-loader").height(i),o<r&&e("html, body").animate({scrollTop:o},100)},success:function(t){e(a).find(".event-module-content").append(t).hide().fadeIn(80).height("auto")},error:function(){e(a).find(".event-module-content").append('<ul class="event-module-list"><li><p>'+eventIntegrationFront.event_pagination_error+"</p></li></ul>").hide().fadeIn(80).height("auto")},complete:function(){e(a).find(".event-loader").remove(),e(a).find(".pagination .temporary").each(function(){e(this).removeClass("disabled temporary")})}})},new t}(jQuery),EventManagerIntegration=EventManagerIntegration||{},EventManagerIntegration.Event=EventManagerIntegration.Event||{},EventManagerIntegration.Event.Form=function(e){function t(){e(".submit-event").each(function(t,n){var a=eventintegration.apiurl;a=a.replace(/\/$/,""),e("#recurring-event",n).children(".box").hide(),this.handleEvents(e(n),a),this.hyperformExtensions(n),this.datePickerSettings(),null!==document.getElementById("location")&&this.loadPostType(e(n),a,"location"),null!==document.getElementById("organizer")&&this.loadPostType(e(n),a,"organizer"),null!==document.getElementById("user_groups")&&this.loadTaxonomy(e(n),a,"user_groups"),null!==document.getElementById("event_categories")&&this.loadTaxonomy(e(n),a,"event_categories")}.bind(this))}function n(e){this.data=e,this.parent=null,this.children=[]}return t.prototype.hyperformExtensions=function(t){"submitter_repeat_email"in t&&hyperform.addValidator(t.submitter_repeat_email,function(e){var n=e.value===t.submitter_email.value;return e.setCustomValidity(n?"":eventIntegrationFront.email_not_matching),n}),"image_input"in t&&hyperform.addValidator(t.image_input,function(n){if(!e("#image_input").prop("required"))return!0;var a=n.files.length>0,i=t.querySelector(".image-notice"),r=document.createElement("p");return a||i||(r.innerHTML=eventIntegrationFront.must_upload_image,r.className="text-danger image-notice",t.querySelector(".image-box").appendChild(r)),n.setCustomValidity(a?"":eventIntegrationFront.must_upload_image),a})},t.prototype.loadTaxonomy=function(n,a,i){a+="/"+i+"?_jsonp="+i+"&per_page=100";var r=document.getElementById(i);e.ajax({type:"GET",url:a,cache:!1,dataType:"jsonp",jsonpCallback:i,crossDomain:!0,success:function(n){e(r).html("");var a=t.prototype.hierarchicalTax(n);e(a.children).each(function(n,a){t.prototype.addOption(a,r,""),e(a.children).each(function(n,a){t.prototype.addOption(a,r," – "),e(a.children).each(function(e,n){t.prototype.addOption(n,r," – – ")})})})}})},t.prototype.addOption=function(e,t,n){var a=document.createElement("option");a.value=e.data.id,a.innerHTML+=n,a.innerHTML+=e.data.name,t.appendChild(a)},n.comparer=function(e,t){return e.data.name<t.data.name?0:1},n.prototype.sortRecursive=function(){this.children.sort(t.prototype.comparer);for(var e=0,n=this.children.length;e<n;e++)this.children[e].sortRecursive();return this},t.prototype.hierarchicalTax=function(e){var t,a={},i=0,r=e.length;for(a[0]=new n,i=0;i<r;i++)a[e[i].id]=new n(e[i]);for(i=0;i<r;i++)t=a[e[i].id],t.parent=a[t.data.parent],t.parent.children.push(t);return a[0].sortRecursive()},t.prototype.loadPostType=function(t,n,a){n+="/"+a+"/complete?_jsonp=get"+a,new autoComplete({selector:"#"+a+"-selector",minChars:1,source:function(t,i){t=t.toLowerCase(),e.ajax({type:"GET",url:n,cache:!1,dataType:"jsonp",jsonpCallback:"get"+a,crossDomain:!0,success:function(n){var r=[];e(n).each(function(e,n){~n.title.toLowerCase().indexOf(t)&&r.push([n.title,n.id,a])}),i(r)}})},renderItem:function(e,t){t=t.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");var n=new RegExp("("+t.split(" ").join("|")+")","gi");return'<div class="autocomplete-suggestion" data-type="'+e[2]+'" data-langname="'+e[0]+'" data-lang="'+e[1]+'" data-val="'+t+'"> '+e[0].replace(n,"<b>$1</b>")+"</div>"},onSelect:function(t,n,a){e("#"+a.getAttribute("data-type")+"-selector").val(a.getAttribute("data-langname")),e("#"+a.getAttribute("data-type")).val(a.getAttribute("data-lang"))}})},t.prototype.jsonData=function(n){var a=n.serializeArray(),i={},r=[],o=[];return e.each(a,function(t,n){switch(n.name){case"user_groups":r=e.map(n.value.split(","),function(e){return parseInt(e,10)});break;case"event_categories":o.push(parseInt(n.value));break;default:i[n.name]=n.value}}),i.occasions=[],e(".occurance-group-single",n).each(function(n){var a=t.prototype.formatDate(e('[name="start_date"]',this).val(),e('[name="start_time_h"]',this).val(),e('[name="start_time_m"]',this).val()),r=t.prototype.formatDate(e('[name="end_date"]',this).val(),e('[name="end_time_h"]',this).val(),e('[name="end_time_m"]',this).val());a&&r&&i.occasions.push({start_date:a,end_date:r,status:"scheduled",content_mode:"master"})}),i.rcr_rules=[],e(".occurance-group-recurring",n).each(function(n){var a=e('[name="recurring_start_h"]',this).val(),r=e('[name="recurring_start_m"]',this).val(),o=!(!a||!r)&&t.prototype.addZero(a)+":"+t.prototype.addZero(r)+":00",c=e('[name="recurring_end_h"]',this).val(),s=e('[name="recurring_end_m"]',this).val(),l=!(!c||!s)&&t.prototype.addZero(c)+":"+t.prototype.addZero(s)+":00",d=!!t.prototype.isValidDate(e('[name="recurring_start_d"]',this).val())&&e('[name="recurring_start_d"]',this).val(),u=!!t.prototype.isValidDate(e('[name="recurring_end_d"]',this).val())&&e('[name="recurring_end_d"]',this).val();o&&l&&d&&u&&i.rcr_rules.push({rcr_week_day:e('[name="weekday"]',this).val(),rcr_weekly_interval:e('[name="weekly_interval"]',this).val(),rcr_start_time:o,rcr_end_time:l,rcr_start_date:d,rcr_end_date:u})}),e("#organizer",n).val()&&(i.organizers=[{organizer:e(n).find("#organizer").val(),main_organizer:!0}]),i.accessibility=[],e.each(e("input[name='accessibility']:checked"),function(){i.accessibility.push(e(this).val())}),i.user_groups=r,i.event_categories=o,i},t.prototype.submitImageAjax=function(t,n){return n.append("action","submit_image"),e.ajax({url:eventintegration.ajaxurl,type:"POST",cache:!1,contentType:!1,processData:!1,data:n,error:function(e,t){console.log(t)}})},t.prototype.submitEventAjax=function(n,a){e.ajax({url:eventintegration.ajaxurl,type:"POST",data:{action:"submit_event",data:a},success:function(a){a.success?(e(".submit-success",n).removeClass("hidden"),e(".submit-success .success",n).empty().append('<i class="fa fa-send"></i>Evenemanget har skickats!</li>'),t.prototype.cleanForm(n)):(console.log(a.data),e(".submit-success",n).addClass("hidden"),e(".submit-error",n).removeClass("hidden"),e(".submit-error .warning",n).empty().append('<i class="fa fa-warning"></i>'+a.data+"</li>"))},error:function(t,a){e(".submit-success",n).addClass("hidden"),e(".submit-error",n).removeClass("hidden"),e(".submit-error .warning",n).empty().append('<i class="fa fa-warning"></i>'+a+"</li>")}})},t.prototype.endHourChange=function(e){var t=e.target.closest(".occurrence");if(t){var n=t.querySelector('input[name="start_date"]').value,a=t.querySelector('input[name="end_date"]').value,i=t.querySelector('input[name="start_time_h"]').value;n>=a?e.target.setAttribute("min",i):e.target.setAttribute("min",0)}},t.prototype.endMinuteChange=function(e){var t=e.target.closest(".occurrence");if(t){var n=t.querySelector('input[name="start_date"]').value,a=t.querySelector('input[name="end_date"]').value,i=t.querySelector('input[name="start_time_h"]').value,r=t.querySelector('input[name="end_time_h"]').value,o=t.querySelector('input[name="start_time_m"]').value;n>=a&&i>=r?(o=parseInt(o)+10,o>=60?t.querySelector('input[name="end_time_h"]').setAttribute("min",parseInt(i)+1):e.target.setAttribute("min",o)):e.target.setAttribute("min",0)}},t.prototype.initPickerEvent=function(){var t=document.querySelectorAll('input[name="start_date"]');Array.from(t).forEach(function(t){t.onchange=function(t){if(t.target.value){var n=t.target.closest(".occurrence");e(n).find('input[name="end_date"]').datepicker("option","minDate",new Date(t.target.value))}}.bind(this)}.bind(this))},t.prototype.initEndHourEvent=function(){var e=document.querySelectorAll('input[name="end_time_h"]');Array.from(e).forEach(function(e){e.onchange=this.endHourChange}.bind(this))},t.prototype.initEndMinuteEvent=function(){var e=document.querySelectorAll('input[name="end_time_m"]');Array.from(e).forEach(function(e){e.onchange=this.endMinuteChange}.bind(this))},t.prototype.initRecurringEndHourEvent=function(){var e=document.querySelectorAll('input[name="recurring_end_h"]');Array.from(e).forEach(function(e){e.onchange=function(e){var t=e.target.closest(".occurrence");if(t){var n=t.querySelector('input[name="recurring_start_h"]').value;e.target.setAttribute("min",n)}}}.bind(this))},t.prototype.initRecurringEndMinuteEvent=function(){var e=document.querySelectorAll('input[name="recurring_end_m"]');Array.from(e).forEach(function(e){e.onchange=function(e){var t=e.target.closest(".occurrence");if(t){var n=t.querySelector('input[name="recurring_start_h"]').value,a=t.querySelector('input[name="recurring_end_h"]').value,i=t.querySelector('input[name="recurring_start_m"]').value;n>=a?(i=parseInt(i)+10,i>=60?t.querySelector('input[name="recurring_end_h"]').setAttribute("min",parseInt(n)+1):e.target.setAttribute("min",i)):e.target.setAttribute("min",0)}}}.bind(this))},t.prototype.initDateEvents=function(){this.initPickerEvent(),this.initEndHourEvent(),this.initEndMinuteEvent(),this.initRecurringEndHourEvent(),this.initRecurringEndMinuteEvent()},t.prototype.datePickerSettings=function(){e.datepicker.setDefaults({minDate:"now",maxDate:(new Date).getDate()+365})},t.prototype.handleEvents=function(n,a){this.initDateEvents(),e(n).on("submit",function(a){a.preventDefault();var i=n.find("#image_input"),r=this.jsonData(n),o=new FormData;e(".submit-error",n).addClass("hidden"),e(".submit-success",n).removeClass("hidden"),e(".submit-success .success",n).empty().append('<i class="fa fa-send"></i>Skickar...</li>'),i.val()?(o.append("file",i[0].files[0]),e.when(this.submitImageAjax(n,o)).then(function(a,i){a.success?(r.featured_media=a.data,t.prototype.submitEventAjax(n,r)):(e(".submit-success",n).addClass("hidden"),e(".submit-error",n).removeClass("hidden"),e(".submit-error .warning",n).empty().append('<i class="fa fa-warning"></i>'+eventIntegrationFront.something_went_wrong+"</li>"))})):this.submitEventAjax(n,r)}.bind(this)),e(".img-button",n).click(function(t){t.preventDefault(),e(".image-box",n).hide(),e(".image-approve",n).fadeIn()}),e("input[name=approve]",n).change(function(){var t=e("input:checkbox[id=first-approve]:checked",n).length>0,a=e("input:checkbox[id=second-approve]:checked",n).length>0;t&&a&&(e(".image-approve",n).hide(),e(".image-upload",n).fadeIn())}),e("input:radio[name=occurance-type]",n).change(function(t){var n=e(this).data("id");e("#"+n).children(".form-group .box").show().find("input").prop("required",!0),e("#"+n).siblings(".event-occasion").children(".box").hide().find("input").prop("required",!1)}),e(".add-occurance",n).click(function(t){t.preventDefault();var n=e(t.target).parent().prev("[class*=occurance-group]"),a=n.clone().find("input").val("").removeClass("hasDatepicker").removeAttr("id").end().insertAfter(n).find(".datepicker").datepicker().end();if(this.initDateEvents(),0===e(".remove-occurance",a).length){var i=e('<div class="form-group"><button class="btn btn btn-sm remove-occurance"><i class="pricon pricon-minus-o"></i> Ta bort</button></div>');a.append(i)}}.bind(this)),e(document).on("click",".remove-occurance",function(t){t.preventDefault(),e(this).closest("[class*=occurance-group]").remove()})},t.prototype.cleanForm=function(t){e(":input",t).not(":button, :submit, :reset, :hidden, select").val("").removeAttr("selected")},t.prototype.formatDate=function(e,t,n){var a="";return this.isValidDate(e)&&t&&n&&(a=e+" "+this.addZero(t)+":"+this.addZero(n)+":00"),a},t.prototype.isValidDate=function(e){var t=/^\d{4}-\d{2}-\d{2}$/;return null!=e.match(t)},t.prototype.addZero=function(e){return 1===e.toString().length&&(e="0"+e),e},new t}(jQuery),EventManagerIntegration=EventManagerIntegration||{},EventManagerIntegration.Widget=EventManagerIntegration.Widget||{},EventManagerIntegration.Widget.TemplateParser=function(e){function t(){this.init()}var n=new Date,a=n.getDate(),i=n.getMonth()+1,r=n.getFullYear(),o=["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];return t.prototype.init=function(){e(".event-api").each(function(t,n){var o=e(n).attr("data-apiurl");o=o.replace(/\/$/,""),o=o+"/event/time?start="+r+"-"+i+"-"+a+"&end="+(r+1)+"-"+i+"-"+a;var c=e(n).attr("post-limit"),s=e(n).attr("group-id"),l=e(n).attr("category-id"),d=e(n).attr("latlng"),u=e(n).attr("distance"),p="undefined"!=typeof c&&e.isNumeric(c)?o+"&post-limit="+c:o+"&post-limit=10";p+="undefined"!=typeof s&&s?"&group-id="+s:"",p+="undefined"!=typeof l&&l?"&category-id="+l:"",p+="undefined"!=typeof d&&d?"&latlng="+d:"",p+="undefined"!=typeof u&&u?"&distance="+u:"",p+="&_jsonp=getevents",this.storeErrorTemplate(e(n)),this.storeTemplate(e(n)),this.storeModalTemplate(e(n)),this.loadEvent(e(n),p)}.bind(this))},t.prototype.storeTemplate=function(t){t.data("template",e(".template",t).html()),t.find(".template").remove()},t.prototype.storeErrorTemplate=function(t){t.data("error-template",e(".error-template",t).html()),t.find(".error-template").remove()},t.prototype.storeModalTemplate=function(t){t.data("modal-template",e(".modal-template",t).html()),t.find(".modal-template").remove()},t.prototype.loadEvent=function(n,a){e.ajax({type:"GET",url:a,cache:!1,dataType:"jsonp",jsonpCallback:"getevents",crossDomain:!0,success:function(a){n.data("json-response",a),t.prototype.clear(n),e(a).each(function(t,a){var i="";e.each(a.occasions,function(e,t){if("undefined"!=typeof t.current_occasion&&1==t.current_occasion)return i=t,!1});var r=new Date(i.start_date),c=n.data("template");c=c.replace("{event-id}",a.id),c=c.replace("{event-occasion}",r.getDate()+'<div class="clearfix"></div>'+o[r.getMonth()]),c=c.replace("{event-title}",'<p class="link-item">'+a.title.rendered+"</p>"),n.append(c)}),t.prototype.click(n)},error:function(e){t.prototype.clear(n),n.html(n.data("error-template"))}})},t.prototype.clear=function(e){jQuery(e).html("")},t.prototype.addZero=function(e){return e<10&&(e="0"+e),e},t.prototype.click=function(t){jQuery("li a",t).on("click",{},function(n){var a=jQuery(n.target).closest("a.modal-event").data("event-id");e.each(t.data("json-response"),function(n,i){if(i.id==a){var r=t.data("modal-template");r=r.replace("{event-modal-title}",i.title.rendered),r=r.replace("{event-modal-content}",null!=i.content.rendered?i.content.rendered:""),r=r.replace("{event-modal-link}",null!=i.event_link?'<p><a href="'+i.event_link+'" target="_blank">'+i.event_link+"</a></p>":""),r=r.replace("{event-modal-image}",null!=i.featured_media?"<img src="+i.featured_media.source_url+' alt="'+i.title.rendered+'" style="display:block; width:100%;">':"");var c="";e.each(i.occasions,function(e,t){var n=new Date(t.start_date),a=this.addZero(n.getDate())+" "+o[n.getMonth()]+" "+n.getFullYear()+" kl. "+this.addZero(n.getHours())+":"+this.addZero(n.getMinutes()),i=new Date(t.end_date),r="";r=i.getDate()===n.getDate()?"kl. "+this.addZero(i.getHours())+":"+this.addZero(i.getMinutes()):i.getDate()+" "+o[i.getMonth()]+" "+i.getFullYear()+" kl. "+this.addZero(i.getHours())+":"+this.addZero(i.getMinutes()),c=c+'<li class="text-sm gutter-sm gutter-vertical">'+a+" - "+r+"</li>"}.bind(this)),r=r.replace("{event-modal-occations}",'<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-1"><label class="accordion-toggle" for="accordion-section-1"><h2>Evenemanget inträffar</h2></label><div class="accordion-content"><ul id="modal-occations">'+c+"</ul></div></section>");var s="";s+=null!=i.location&&null!=i.location.title?"<li><strong>"+i.location.title+"</strong></li>":"",s+=null!=i.location&&null!=i.location.street_address?"<li>"+i.location.street_address+"</li>":"",s+=null!=i.location&&null!=i.location.postal_code?"<li>"+i.location.postal_code+"</li>":"",s+=null!=i.location&&null!=i.location.city?"<il>"+i.location.city+"</li>":"";var l=s?'<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-2"><label class="accordion-toggle" for="accordion-section-2"><h2>Plats</h2></label><div class="accordion-content"><ul>'+s+"</ul></div></section>":"";r=r.replace("{event-modal-location}",l);var d="";d+=null!=i.booking_phone?"<li>Telefon: "+i.booking_phone+"</li>":"",d+=null!=i.price_adult?"<li>Pris: "+i.price_adult+" kr</li>":"",d+=null!=i.price_children?"<li>Barnpris: "+i.price_children+" kr</li>":"",d+=null!=i.price_senior?"<li>Pensionärspris: "+i.price_senior+" kr</li>":"",d+=null!=i.price_student?"<li>Studentpris: "+i.price_student+" kr</li>":"",d+=null!=i.age_restriction?"<li>Åldersgräns: "+i.age_restriction+" kr</li>":"";var u="";e.each(i.membership_cards,function(e,t){u=u+"<li>"+t.post_title+"</li>"}.bind(this)),d+=u?"<li>&nbsp;</li><li><strong>Ingår i medlemskort</strong></li>"+u:"",d+=null!=i.booking_link?'<li>&nbsp;</li><li><a href="'+i.booking_link+'" class="link-item" target="_blank">Boka bljetter här</a></li>':"";var p=d?'<section class="accordion-section"><input type="radio" name="active-section" id="accordion-section-3"><label class="accordion-toggle" for="accordion-section-3"><h2>Bokning</h2></label><div class="accordion-content"><ul>'+d+"</ul></div></section>":"";r=r.replace("{event-modal-booking}",p),e("#modal-event").remove(),e("body").append(r)}}.bind(this))}.bind(this))},new t}(jQuery);