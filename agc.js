/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50, asi:true, eqeqeq:false */
// agc
// http://github.com/Trolleymusic/agc
(function ($) {
	"use strict";
	$.fn.agc = (function (options) {
		var agc = (function (element, options) {
			var _carousel,
				_slides,
				_container,
				_options,
				_controls,
				_auto;

			this.Make = function (element, o) {
				var c;
				
				o = o || {};

				_carousel = (element || o.carousel);
				if (!_carousel.length) { return; }
				
				c = this;
				
				_options = o;
				
				this.Build();
				
				_controls = (o.controls || _carousel);

				//Prev
				c.Prev = o.prev || c.Prev;
				_controls.on('click', 'a[href="#prev"]', function (e) {
					e.preventDefault();
					c.Prev.apply(c, [e, _carousel, this]);
				});
				
				//Next
				c.Next = o.next || c.Next;
				_controls.on('click', 'a[href="#next"]', function (e) {
					e.preventDefault();
					c.Next.apply(c, [e, _carousel, this]);
				});

				//Close
				c.Close = o.close || c.Close;
				_controls.on('click', 'a[href="#close"]', function (e) {
					e.preventDefault();
					c.Close.apply(c, [e, _carousel, this]);
				});
				
				//Go to specific slides from the controls
				_controls.find("a[href]").filter(function () {
					return (!isNaN(c.FindASlide($(this).attr("href"))));
				}).on("click", function (e) {
					e.preventDefault();
					c.GoToLink($(this).attr("href"));
				});
				
				// These are inter-slide links:
				c.GoTo = o.goTo || c.GoTo;
				_carousel.find('a').filter(function () { if (!$(this).attr('href')) { return false; } return $(this).attr('href').match(/\#\d+/); }).bind('click', function (e) {
					e.preventDefault();
					e.stopPropagation();
					c.GoTo(parseInt($(this).attr('href').replace('#',''), 10) - 1);
				});

				
				this.element = _carousel;
				
				this.Enhance();
				
				this.Autoplay();

			}
			
			this.Build = function () {
				var hasContainer;
				
				hasContainer = false;
				
				// The slides could be divs, or there could be a
				//	list inside the carousel with slides inside that
				_slides = _carousel.children(':not(a)');

				// Zepto has a fit if the filter selector is too complex
				//	so these is split on two lines
				_slides = _slides.filter(':not([data-no-touch="true"])');

				// If _slides is only a single element which is a ul with li children,
				//	make those li children the _slides
				if (_slides.length == 1 && _slides[0].tagName == "UL" && _slides.children('li').length) {
					_slides = _slides.children('li');
					hasContainer = true;
				}

				_slides.each(function(i) {
	
					$(this).attr('data-slide', i);
					
					// Do not arrange the slides next to each other
					if (!_options.doNotArrange) {
						$(this).css({'left' : (i * 100) + '%'});
					}
	
					// Set the z-order
					if (_options.setZOrder) {
						$(this).css({ 'z-index' : (_slides.length - i) });
					}
				});
				
				_container = hasContainer ? _slides.parent() : $(document.createElement('div'));
				_container.addClass('carousel-container');
				
				_container.css({
					'position' : 'absolute',
					'left' : 0,
					'top' : 0,
					'width' : '100%',
					'height' : '100%',
				});

				_container.appendTo(_carousel);
				_container.append(_slides);
				
				this.SetCurrent(0);
				
			}
			
			this.Enhance = function () {
				var c,
					el;
				
				c = this;
				el = this.element;
			
				if (Modernizr.touch) {
					// Element not touched yet, if there's an intro animation or something
					//	showing that swiping is available, it will be shown...
					this.element.addClass('untouched');
					this.element.one('touchstart', function () {
						if (el.hasClass('untouched')) { el.removeClass('untouched'); }
					});
			
					el.on('swipeRight', function (e) {
						c.Prev.apply(c, [e, _carousel, this]);
					});
				
					el.on('swipeLeft', function (e) {
						c.Next.apply(c, [e, _carousel, this]);
					});
				
					// Escape // ?
					el.on('swipeUp', function (e) {
						c.Close.apply(c, [e, _carousel, this])
					});
						
				} else {
					// Keyboard / arrow control
					$(document).on('keyup', function (e) {
						if (el.height()) {
							if (e.which == 37) { // Left
								c.Prev.apply(c, [e, _carousel, this]);
							} else if (e.which == 39) { // Right
								c.Next.apply(c, [e, _carousel, this]);
							} else if (e.keyCode == 27) { // Escape
								c.Close.apply(c, [e, _carousel, this]);
							}
						}
					});
				}
			
				this.Transform(0);
			}
			
			this.Transform = function (offset) {
				if (_options.doNotMove) { return; }
				if (Modernizr.csstransforms3d) {
					_container.get(0).style[Modernizr.prefixed('transform')] = "translate3d(" + offset +",0,0)";
				} else if (Modernizr.csstransforms) {
					_container.get(0).style[Modernizr.prefixed('transform')] = "translate(" + offset +",0)";
				} else {
					_container.css('left', offset);
				}		
			}
			
			this.Move = function (i) {
				var offset;
				if (_options.doNotScroll) { return; }
				offset = (i * -100) + '%';
				this.Transform(offset);
			}
			
			this.GetCurrent = function () {
				return parseInt(_container.attr('data-current') || 0, 10);
			}
			
			this.GetCurrentAsObject = function () {
				return _slides.filter('[data-slide="' + this.GetCurrent() + '"]');
			}
			
			this.SetCurrent = function (i) {
				_container.attr('data-current', i);
				this.MarkSlides(i);
				this.ResetAutonext();
			}
			
			this.MarkSlides = function (i) {
				var current;
				if (!_options.mark) { return; }
				current = _slides.filter('[data-slide="' + i + '"]');
				
				if (_options.mark.current) {
					_slides.removeClass(_options.mark.current);
					current.addClass(_options.mark.current);
				}
				
				if (_options.mark.next) {
					_slides.removeClass(_options.mark.next);
					current.next().addClass(_options.mark.next);
				}
				
				if (_options.mark.prev) {
					_slides.removeClass(_options.mark.prev);
					current.prev().addClass(_options.mark.prev);
				}
			}
			
			this.FindASlide = function (selector) {
				return parseInt(_slides.filter(selector).attr('data-slide') || -1, 10);
			}
			
			this.FindASlideAsObject = function (selector) {
				return _slides.filter(selector);
			}
			
			this.Next = function () {
				this.FnNext();
			}

			this.FnNext = function () {
				var i = this.GetCurrent();
				i = this.CalcNext(i);
				this.SetCurrent(i);
				this.Move(i);
			}
			
			this.CalcNext = function (i) {
				return (i >= _slides.length - 1) ? 0 : i + 1;
			}

			this.Prev = function () {
				this.FnPrev();
			}
			
			this.FnPrev = function () {
				var i = this.GetCurrent();
				i = this.CalcPrev(i);
				this.SetCurrent(i);
				this.Move(i);
			}
			
			this.CalcPrev = function (i) {
				return (i <= 0) ? _slides.length - 1 : i - 1;
			}
			
			this.GoToLink = function (selector) {
				var i;
				selector = selector.replace('#', '');
				i = this.FindASlide('.' + selector);
				if (i == -1) { return; }
				this.SetCurrent(i);
				this.Move(i);
			}
			
			this.GoTo = function (i) {
				this.GoToNumber(i);
			}
			
			this.GoToNumber = function (i) {
				if (i < 0 || i > _slides.length) { return; }
				this.SetCurrent(i);
				this.Move(i)
			}
			
			this.Slides = function () {
				return _slides;
			}
			
			this.Autoplay = function () {
				_options.autoplay = _options.autoplay || parseInt(_carousel.data('autoplay'), 10);
				if (!_options.autoplay) { return; }
				this.Autonext();
			}
			
			this.ResetAutonext = function () {
				var c;
				if (_options.autoplay) {
					c = this;
					// This is in requestAnimationFrame so that
					//	it doesn't continue to run in the background
					requestAnimationFrame(function () { c.Autonext(); });
				}
			}
			
			this.StopAutonext = function () {
				if (_auto) {
					clearTimeout(_auto);
					_auto = null;
				}
			}
			
			this.Autonext = function () {
				var c = this;

				this.StopAutonext();
				
				_auto = setTimeout(function () {
					c.Next.apply(c, [null, _carousel, this]);
				}, _options.autoplay * 1000)
				
			}
			
			this.Make(element, options);
			
			return this;
			
		});
		return new agc(this, options);
	});
})( jQuery );
	