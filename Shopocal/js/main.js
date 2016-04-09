$(document).ready(function(e) {
	
	var scroll = {
		secContainer: $('.wrap'),
		secs: $('.section'),
		numSecs: $('.section').length,
		currentSec: 0,
		secNav: $('.navbar'),
		mobile: $('.mobile'),
		screen: $('.screen'),
		screenHeight: $('.screen').height(),
		screenWidth: $('.screen').width(),
		subSecContainer: $('.viewport'),
		subSecs: $('.viewport img'),
		numSubSecs: $('.viewport img').length,
		currentSubSec: 0,
		subSecNav: $('.mobile-navigation'),
		subSecDesc: $('.desc'),
		secScrollTop: 0,
		subSecScrollTop: 0,
		touchStartX: 0,
		touchStartY: 0,
		delay: 500,
		deviceWidth: $(window).innerWidth(),
		deviceHeight: $(window).innerHeight(),
		slider: null,
		numSlides: $('.slide').length,
		arrows: $('.arrow'),
		arrowTop: $('.arrow-t'),
		arrowMiddle: $('.arrow-m'),
		arrowBottom: $('.arrow-b'),
		logoGrey: $('.logo-grey'),
		logoWhite: $('.logo-white')
	};
	
	var init = function() {
		if(navigator.userAgent.indexOf('Mac OS X') != -1)
			scroll.delay = 1000;
			
		scroll.deviceHeight = $(window).height();
		scroll.deviceWidth = $(window).width();
		scroll.screenHeight = scroll.screen.height();
		scroll.screenWidth = scroll.screen.width();
		scroll.subSecs.css('height', scroll.screenHeight);
		
		unbindEvents();
		bindEvents();
		updateSecNav();
		updateDirSecNav();
		updateSubSecNav();
		updateSecNavStyles();
		
		var numSlides = "1";
		if(scroll.deviceWidth > 991)
			numSlides = "2";
		if(scroll.deviceWidth > 1199)
			numSlides = "3";
		
		var numPages = Math.ceil(scroll.numSlides / parseInt(numSlides));
		var slideWidth = $('.slider').width() / parseInt(numSlides);

		if(scroll.slider == null) {
			scroll.slider = $('.slider').bxSlider({
  			minSlides: numSlides,
				maxSlides: numSlides,
				responsive: true,
				infiniteLoop: false,
  			slideWidth: slideWidth,
  			slideMargin: 0,
				onSliderLoad: function() {
					var activeItem = parseInt($('.bx-pager').find('.active').attr('data-slide-index'));
					updateSliderNav(activeItem, numPages);
				},
				onSlideAfter: function() {
					var activeItem = parseInt($('.bx-pager').find('.active').attr('data-slide-index'));
					updateSliderNav(activeItem, numPages);
				}
			});
		}
		else {
			scroll.slider.reloadSlider({
  			minSlides: numSlides,
				maxSlides: numSlides,
				responsive: true,
				infiniteLoop: false,
  			slideWidth: slideWidth,
  			slideMargin: 0,
				onSliderLoad: function() {
					var activeItem = parseInt($('.bx-pager').find('.active').attr('data-slide-index'));
					updateSliderNav(activeItem, numPages);
				},
				onSlideAfter: function() {
					var activeItem = parseInt($('.bx-pager').find('.active').attr('data-slide-index'));
					updateSliderNav(activeItem, numPages);
				}
			});
		}
		
		scroll.currentSubSec = 0;
		scroll.subSecDesc.hide();
		scroll.subSecDesc.eq(scroll.currentSubSec).show();
		scroll.subSecDesc.eq(scroll.currentSubSec).removeClass('animated');
		scroll.subSecDesc.eq(scroll.currentSubSec).removeClass('fadeInRight');
		scroll.subSecDesc.eq(scroll.currentSubSec).addClass('animated');
		scroll.subSecDesc.eq(scroll.currentSubSec).addClass('fadeInRight');
	}
	
	var updateSliderNav = function(activeItem, numPages) {
		if(activeItem == 0) {
			$('.bx-prev').hide();
			$('.bx-next').show();
		}
		else if(activeItem == numPages - 1) {
			$('.bx-prev').show();
			$('.bx-next').hide();
		}
		else {
			$('.bx-prev').show();
			$('.bx-next').show;
		}
	}
	
	var bindKeyDown = function() {
		$(window).bind('keydown', function(e) {
			e.preventDefault();
			
			switch(e.keyCode) {
				case 38: scrollUp();
								 break;
				case 40: scrollDown();
				         break;
			}
		});
	}
	
	var bindMouseWheel = function() {
		$(window).bind('mousewheel DOMMouseScroll', function(event) {
			event.preventDefault();
			
			var delta = 0;
			
			if(! event) event = window.event;
			else event = event.originalEvent;
			
			if(event.wheelDelta)
				delta = event.wheelDelta / 12;
			else if(event.detail)
				delta = -event.detail;
				
			if(delta < 0)
				scrollDown();
			if(delta > 0)
				scrollUp();
		});
	}
	
	var bindTouch = function() {
		$(document).bind('touchstart', function(e) {
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			scroll.touchStartX = touch.pageX;
			scroll.touchStartY = touch.pageY;
		});
		
		$(document).bind('touchmove', function(e) {
			e.preventDefault();
		});
		
		$(document).bind('touchend', function(e) {
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			var touchEndX = touch.pageX;
			var touchEndY = touch.pageY;
			var touchAmount = touchEndY - scroll.touchStartY;
			
			if(Math.abs(touchAmount) >= 90) {
				if(touchAmount > 0)
					scrollUp();
				else
					scrollDown();
			}
		});
	}
	
	var bindClick = function() {
		scroll.secNav.find('a[data-index]').bind('click', function(e) {
			e.preventDefault();
			
			scroll.secNav.find('.navbar-collapse').removeClass('in');
			
			if($(this).parent().hasClass('active'))
				return;
				
			var secIndex = parseInt($(this).attr('data-index'));
			scrollToSec(secIndex);
		});
		
		scroll.subSecNav.find('a[data-index]').bind('click', function(e) {
			e.preventDefault();
			
			if($(this).parent().hasClass('active'))
				return;
			
			var subSecIndex = parseInt($(this).attr('data-index'));
			scrollToSubSec(subSecIndex);
		});
		
		scroll.arrows.bind('click', function(e) {
			e.preventDefault();
			
			if(! $(this).hasClass('arrow-m')) {
				var secIndex = parseInt($(this).attr('data-index'));
				
				if(secIndex == 0) {
					scroll.currentSubSec = 0;
					scroll.subSecScrollTop = 0;
					scroll.subSecContainer.transition({ y: scroll.subSecScrollTop }, 500, 'linear');
					scroll.subSecDesc.hide();
					scroll.subSecDesc.eq(scroll.currentSubSec).show();
					scroll.subSecDesc.eq(scroll.currentSubSec).removeClass('animated');
					scroll.subSecDesc.eq(scroll.currentSubSec).removeClass('fadeInRight');
					scroll.subSecDesc.eq(scroll.currentSubSec).addClass('animated');
					scroll.subSecDesc.eq(scroll.currentSubSec).addClass('fadeInRight');
				}
				
				scrollToSec(secIndex);
			}
			else
				scrollDown();
		});
	}
	
	var bindEvents = function() {
		bindKeyDown();
		bindMouseWheel();
		bindTouch();
		bindClick();
	}
	
	var unbindEvents = function() {
		$(window).unbind('keydown mousewheel DOMMouseScroll');
		$(document).unbind('touchstart touchmove touchend');
		scroll.secNav.find('a[data-index]').unbind('click');
		scroll.subSecNav.find('a[data-index]').unbind('click');
		scroll.arrows.unbind('click');
	}
	
	var scrollDown = function() {
		if(scroll.currentSec + 1 < scroll.numSecs) {
			unbindEvents();
			
			if(scroll.currentSec == 1) {
				if(scroll.currentSubSec + 1 < scroll.numSubSecs) {
					scroll.subSecScrollTop -= scroll.subSecs.eq(scroll.currentSubSec + 1).outerHeight();
					scroll.subSecContainer.transition({ y: scroll.subSecScrollTop }, 500, 'linear');
					
					scroll.subSecDesc.hide();
					scroll.subSecDesc.eq(scroll.currentSubSec + 1).show();
					scroll.subSecDesc.eq(scroll.currentSubSec + 1).removeClass('animated');
					scroll.subSecDesc.eq(scroll.currentSubSec + 1).removeClass('fadeInRight');
					scroll.subSecDesc.eq(scroll.currentSubSec + 1).addClass('animated');
					scroll.subSecDesc.eq(scroll.currentSubSec + 1).addClass('fadeInRight');
		
					scroll.currentSubSec++;
					updateSubSecNav();
					
					setTimeout(function() {
						bindEvents();
					}, scroll.delay);
				
					return;
				}
			}
			
			scroll.secScrollTop -= scroll.secs.eq(scroll.currentSec + 1).outerHeight();
			scroll.secContainer.transition({ y: scroll.secScrollTop }, 500, 'linear');
			scroll.currentSec++;
			updateSecNav();
			updateDirSecNav();
			updateSecNavStyles();
			
			setTimeout(function() {
				bindEvents();
			}, scroll.delay);
		}
	}
	
	var scrollUp = function() {
		if(scroll.currentSec - 1 >= 0) {
			unbindEvents();
			
			if(scroll.currentSec == 1) {
				if(scroll.currentSubSec - 1 >= 0) {
					scroll.subSecScrollTop += scroll.subSecs.eq(scroll.currentSubSec - 1).outerHeight();
					scroll.subSecContainer.transition({ y: scroll.subSecScrollTop }, 500, 'linear');
					
					scroll.subSecDesc.hide();
					scroll.subSecDesc.eq(scroll.currentSubSec - 1).show();
					scroll.subSecDesc.eq(scroll.currentSubSec - 1).removeClass('animated');
					scroll.subSecDesc.eq(scroll.currentSubSec - 1).removeClass('fadeInRight');
					scroll.subSecDesc.eq(scroll.currentSubSec - 1).addClass('animated');
					scroll.subSecDesc.eq(scroll.currentSubSec - 1).addClass('fadeInRight');
					
					scroll.currentSubSec--;
					updateSubSecNav();
					
					setTimeout(function() {
						bindEvents();
					}, scroll.delay);
				
					return;
				}
			}
			
			scroll.secScrollTop += scroll.secs.eq(scroll.currentSec - 1).outerHeight();
			scroll.secContainer.transition({ y: scroll.secScrollTop }, 500, 'linear');
			scroll.currentSec--;
			updateSecNav();
			updateDirSecNav();
			updateSecNavStyles();
			
			setTimeout(function() {
				bindEvents();
			}, scroll.delay);
		}
	}
	
	var scrollToSec = function(secIndex) {
		unbindEvents();
		
		var scrollTop = 0;
		scroll.secs.each(function(index, element) {
			if(index < secIndex)
				scrollTop += scroll.secs.eq(index).outerHeight();
    });
			
		scrollTop = 0 - scrollTop;
		scroll.secContainer.transition({ y: scrollTop }, 500, 'linear');
		scroll.secScrollTop = scrollTop;
		scroll.currentSec = secIndex;
		updateSecNav();
		updateDirSecNav();
		updateSecNavStyles();
		
		setTimeout(function() {
			bindEvents();
		}, scroll.delay);
	}
	
	var scrollToSubSec = function(subSecIndex) {
		unbindEvents();
		
		var scrollTop = 0;
		scroll.subSecs.each(function(index, element) {
			if(index < subSecIndex)
				scrollTop += scroll.subSecs.eq(index).outerHeight();
    });
		
		scrollTop = 0 - scrollTop;	
		scroll.subSecContainer.transition({ y: scrollTop }, 500, 'linear');
		scroll.subSecScrollTop = scrollTop;
		scroll.currentSubSec = subSecIndex;
		updateSubSecNav();
		
		scroll.subSecDesc.hide();
		scroll.subSecDesc.eq(scroll.currentSubSec).show();
		scroll.subSecDesc.eq(scroll.currentSubSec).removeClass('animated');
		scroll.subSecDesc.eq(scroll.currentSubSec).removeClass('fadeInRight');
		scroll.subSecDesc.eq(scroll.currentSubSec).addClass('animated');
		scroll.subSecDesc.eq(scroll.currentSubSec).addClass('fadeInRight');
		
		setTimeout(function() {
			bindEvents();
		}, scroll.delay);
	}
	
	var updateSecNav = function() {
		scroll.secNav.find('li').removeClass('active');
		scroll.secNav.find('a').each(function(index, element) {
			var secIndex = parseInt($(element).attr('data-index'));
			
			if(scroll.currentSec == secIndex) {
				if(! $(element).parent().hasClass('active')) {
					$(element).parent().addClass('active');
					return false;
				}
			}
    });
	}
	
	var updateSubSecNav = function() {
		scroll.subSecNav.find('li').removeClass('active');
		scroll.subSecNav.find('a').each(function(index, element) {
			var subSecIndex = parseInt($(element).attr('data-index'));
			
			if(scroll.currentSubSec == subSecIndex) {
				if(! $(element).parent().hasClass('active')) {
					$(element).parent().addClass('active');
					return false;
				}
			}
    });
	}
	
	var updateDirSecNav = function() {
		scroll.arrowBottom.removeClass('animation-rotate');
			
		if(scroll.currentSec == 0) {
			scroll.arrowTop.show();
			scroll.arrowMiddle.hide();
			scroll.arrowBottom.hide();
			return;
		}
		
		if(scroll.currentSec == scroll.numSecs - 1) {
			scroll.arrowTop.hide();
			scroll.arrowMiddle.hide();
			scroll.arrowBottom.show();
			scroll.arrowBottom.addClass('animation-rotate');
			return;
		}
		
		if(scroll.currentSec > 0) {	
			scroll.arrowTop.hide();
			scroll.arrowMiddle.show();
			scroll.arrowBottom.hide();
			return;
		}
	}
	
	var updateSecNavStyles = function() {
		if(scroll.deviceWidth < 768) {
			scroll.secNav.removeClass('navbar-transparent')
			
			scroll.logoGrey.removeClass('hide');
			if(! scroll.logoWhite.hasClass('hide'))
				scroll.logoWhite.addClass('hide');
		}
				
		if(scroll.deviceWidth > 767) {
			if(scroll.currentSec == 0) {
				if(! scroll.secNav.hasClass('navbar-transparent'))
					scroll.secNav.addClass('navbar-transparent');
				
				if(! scroll.logoGrey.hasClass('hide'))
					scroll.logoGrey.addClass('hide');
				scroll.logoWhite.removeClass('hide');
			}
			else {
				scroll.secNav.removeClass('navbar-transparent')
				
				if(! scroll.logoWhite.hasClass('hide'))
					scroll.logoWhite.addClass('hide');
				scroll.logoGrey.removeClass('hide');
			}
		}
	}
	
	$('.bouncing-arrow').addClass('animated');
	$('.bouncing-arrow').addClass('bounce');
	setInterval(function() {
		$('.bouncing-arrow').removeClass('animated');
		$('.bouncing-arrow').removeClass('bounce');
		setTimeout(function() {
			$('.bouncing-arrow').addClass('animated');
			$('.bouncing-arrow').addClass('bounce');
		}, 50);
	}, 50);
	
	$('.bouncing-arrow').bind('click', function(e) {
		e.preventDefault();
		
		var index = parseInt($(this).attr('data-index'));
		scrollToSec(index);
	});
	
	$('.play').bind('click', function(e) {
		e.preventDefault();
		
		unbindEvents();
		$('.overlay').removeClass('hide');
		$('.video').removeClass('hide');
		$('.video').addClass('show');
		
		if($('.video').width() > scroll.deviceWidth)
			$('.video').css('width', '100%').css('left', 0).css('margin-left', 0).css('width', '100%');
		
		var marginTop = $('.video').height() / 2;
		$('.video').css('margin-top', '-' + marginTop + 'px');
		
		setTimeout(function() {
			if($('.video').hasClass('show'))
				$('.video video').trigger('play');
		}, 3000);
	});
	
	$('.close').bind('click', function(e) {
		e.preventDefault();
		
		bindEvents();
		$('.video > video').trigger('pause');
		$('.overlay').addClass('hide');
		$('.video').addClass('hide');
		$('.video').removeClass('show');
	});
	
	init();
	$(window).bind('resize load', function(e) {
		init();
		
		if($('.orientation').css('display') != 'none') {
			$('.video > video').trigger('pause');
			$('.overlay').addClass('hide');
			$('.video').addClass('hide');
			$('.video').removeClass('show')
		}
	});

});