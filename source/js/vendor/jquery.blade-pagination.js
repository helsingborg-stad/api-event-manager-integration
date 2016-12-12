/*!
 * Blade Pagination - v1.0.0 - 2016-06-11
 * jQuery Plug-in
 * http://github.com/panfeng-pf/blade-pagination
 * Copyright (c) 2016 Blade Pan; Licensed Apache 2.0
 * Dependency: jQuery (test with jQuery v1.11.2)
 */
(function($) {
	/*==============================================
	 * pagination
	 *==============================================
	 */
	$.fn.bladePagination = function(options) {
		var opts = $.extend({}, $.fn.bladePagination.defaults, options);
		return this.each(function() {
			var jqPagination = $(this);
			if(jqPagination.hasClass('module-pagination')) {
				//create all pages
				createPagination(jqPagination, opts);

				//key parameters
				var keyParams = {
					jqFirstPage: jqPagination.find('li.page.first'),
					jqPrevPage: jqPagination.find('li.page.prev'),
					jqNextPage: jqPagination.find('li.page.next'),
					jqLastPage: jqPagination.find('li.page.last'),
					jqPageSet: jqPagination.find('li.page')
				};

				//event handler
				keyParams.jqPageSet.off('click');
				keyParams.jqPageSet.click(function() {

					var jqPage = $(this);
					if(! jqPage.hasClass('active')) {
						var page = jqPage.data('page');
						opts.clickPage(page, jqPage);

						$(this).closest(".module-pagination").attr('data-current', page).change();
					}
				});
			}
		});
	};

	/*==============================================
	 * default options
	 *==============================================
	 */
	$.fn.bladePagination.defaults = {
		maxPageNum: 5,
		firstLabel: '|&lt;', // |<
		prevLabel: '&lt;',   // <
		nextLabel: '&gt;',   // >
		lastLabel: '&gt;|',  // >|
		moreLabel: '',
		clickPage: function(page) {}
	};

	/*==============================================
	 * private functions
	 *==============================================
	 */
	function createPagination(jqPagination, opts) {
		var currPage = jqPagination.data('current');
		var totalPage = jqPagination.data('total');
		var pageShowArray = new Array();

		//first page
		pageShowArray.push({
			type: 'page first' + ((1 == currPage) ? ' disabled' : '')
			, page: 1
			, show: opts.firstLabel
		});

		//previous page
		pageShowArray.push({
			type: 'page prev' + ((1 == currPage) ? ' disabled' : '')
			, page: (currPage <= 1) ? 1 : (currPage - 1)
			, show: opts.prevLabel
		});

		//page number
		var pageNumArray = new Array();
		var leftPageNum = (opts.maxPageNum - 1) / 2;
		var rightPageNum = opts.maxPageNum - 1 - leftPageNum;
		if(currPage - leftPageNum < 1) {
			for(var i = leftPageNum; i > 0; i --) {
				var page = currPage - i;
				if(page < 1) {
					rightPageNum ++;
				} else {
					pageNumArray.push(page);
				}
			}
			pageNumArray.push(currPage);
			for(var i = 1; i <= rightPageNum; i ++) {
				var page = currPage + i;
				if(page > totalPage) break;
				pageNumArray.push(page);
			}
		} else {
			for(var i = rightPageNum; i > 0; i --) {
				var page = currPage + i;
				if(page > totalPage) {
					leftPageNum ++;
				} else {
					pageNumArray.unshift(page);
				}
			}
			pageNumArray.unshift(currPage);
			for(var i = 1; i <= leftPageNum; i ++) {
				var page = currPage - i;
				if(page < 1) break;
				pageNumArray.unshift(page);
			}
		}
		if(pageNumArray[0] > 1) {
			pageShowArray.push({
				type: 'more'
				, page: -1
				, show: opts.moreLabel
			});
		}
		for(var i = 0; i < pageNumArray.length; i ++) {
			var pageNum = pageNumArray[i];
			pageShowArray.push({
				type: 'page' + ((pageNum == currPage) ? ' active' : '')
				, page: pageNum
				, show: pageNum
			});
		}
		if(pageNumArray[pageNumArray.length - 1] < totalPage) {
			pageShowArray.push({
				type: 'more'
				, page: -1
				, show: opts.moreLabel
			});
		}

		//next page
		pageShowArray.push({
			type: 'page next' + ((totalPage == currPage) ? ' disabled' : '')
			, page: (currPage >= totalPage) ? totalPage : (currPage + 1)
			, show: opts.nextLabel
		});

		//last page
		pageShowArray.push({
			type: 'page last' + ((totalPage == currPage) ? ' disabled' : '')
			, page: totalPage
			, show: opts.lastLabel
		});

		//end page
		// pageShowArray.push({
		// 	type: 'end'
		// 	, page: -1
		// 	, show: ''
		// });

		//create page
		jqPagination.empty();
		for(var i = 0; i < pageShowArray.length; i ++) {
			var pageShow = pageShowArray[i];
			var html = '<li class="' + pageShow.type + '" data-page="' + pageShow.page + '">' + pageShow.show + '</li>';
			jqPagination.append(html);
		}
	}
})(jQuery);
