jQuery(document).ready(function(){
	jQuery('#PaginationExample a').live('click', function(e){
		e.preventDefault();
		var link = jQuery(this).attr('href');
		jQuery('#ID').html('Loading...');
		jQuery('#ID').load(link+' #contentInner');
	 });
});
