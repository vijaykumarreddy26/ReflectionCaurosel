var slider = function() {
	return {
		max : 7,
		isMouseDown : false,
		swipeStartX : 0,
		swipeDistanceX : 0,
		imageTapStartX : 0,
		imageTapEndX : 0,
		imageTapDistanceX : 0,
		coverFlowContainerElement : null,
		thresholdDistanceSingleSlide : 0, //this measures the distance
		maxdistance : 300,
		maxwidth : 900,
		maxdifference : 100,
		middle : 4,
		calculateddiffrence : 100,
		swipeenable : true,
		touchdevice : "ontouchstart" in document,
		initialise : function() {
			this.coverFlowContainerElement = $("#coverflow");
			this.addImagesToCover();
			this.moveImagesFromRight();
			this.addEventToCoverflowHolder();
			this.thresholdDistanceSingleSlide = 70;
		},
		addImagesToCover : function() {
			this.max = 7;
			this.calculateddiffrence = Math.floor(this.maxwidth - (2 * this.maxdistance)) / (this.max - 3);
			this.calculateddiffrence = this.calculateddiffrence > this.maxdifference ? this.maxdifference : this.calculateddiffrence;
			this.middle = (Math.floor(this.max / 2) + 1);
			for (var i = 1; i <= this.max; i++) {
				if (i == this.middle) {
					this.coverFlowContainerElement.append("<div class='coverswipeimages' id='fig" + i + "' cp='0' a='0' pos=" + i + " style='z-index:99999'><img src='" + images[i - 1] + "' /></div>");
				} else if (i < this.middle) {
					this.coverFlowContainerElement.append("<div class='coverswipeimages' id='fig" + i + "' style='z-index:99999' cp='" + (-(300 + ((this.middle - 1) - i) * this.calculateddiffrence)) + "' a='60' pos=" + i + " ><img src='" + images[i - 1] + "' /></div>");
				} else {
					this.coverFlowContainerElement.append("<div  class='coverswipeimages' id='fig" + i + "' style='z-index:99999' cp='" + (300 + (i - (this.middle + 1)) * this.calculateddiffrence) + "' a='-60' pos=" + i + "><img src='" + images[i - 1] + "' /></div>");
				}
			}
		},

		moveImagesFromRight : function() {
			var _this = this;
			setTimeout(function() {
				_this.coverFlowContainerElement.find("div").each(function(index) {
					var element = $(this);
					var cp = element.attr("cp");
					var rotate = element.attr("a");
					var middle = element.attr("middle");
					if (_this.middle - 1 == index) {
						element.css("-webkit-transform", "translateX(0px) rotateY(0deg) translateZ(200px)");
					} else {
						element.css("-webkit-transform", "translateX(" + cp + "px) rotateY(" + rotate + "deg)");
					}
				});

				createTabs(_this.middle - 1);

			}, 100);
		},

		swipeimages : function(direction) {
			var _this = this;
			var elementnumber = 0;
			var middle = Math.floor(this.coverFlowContainerElement.find("div").size() / 2) + 1;
			this.coverFlowContainerElement.find("div").each(function(index) {
				var element = $(this)
				var pos = element.attr("pos");
				(direction == "left") ? ( pos = (pos > 1) ? --pos : _this.max) : ( pos = (pos < _this.max) ? ++pos : 1)
				//console.log(pos);

				if (pos == 3) {

					var cp = (-300);
					element.css("-webkit-transform", "translateX(-300px) rotateY(60deg)");
					element.attr("cp", "0");
					element.attr("a", "60");
					element.attr("pos", pos);

				} else if (pos == 4) {
					//$('.toctitle').text('Team Management');
					var cp = (0);
					element.css("-webkit-transform", "translateX(" + cp + "px) rotateY(0deg) translateZ(200px)");
					element.attr("cp", cp);
					element.attr("a", "0");
					element.attr("pos", pos);
					elementnumber = (index + 1);
				} else if (pos == 5) {

					var cp = (300);
					element.css("-webkit-transform", "translateX(" + cp + "px) rotateY(-60deg)");
					element.attr("cp", cp);
					element.attr("a", "-60");
					element.attr("pos", pos);

				} else if (pos == 2) {

					var cp = (-375);
					element.css("-webkit-transform", "translateX(" + cp + "px) rotateY(60deg)");
					element.attr("cp", cp);
					element.attr("a", "60");
					element.attr("pos", pos);

				} else if (pos == 1) {
					cp = (-450);
					element.css("-webkit-transform", "translateX(" + cp + "px) rotateY(60deg)");
					element.attr("cp", cp);
					element.attr("a", "60");
					element.attr("pos", pos);
				} else if (pos == 6) {
					cp = (375);
					element.css("-webkit-transform", "translateX(" + cp + "px) rotateY(-60deg)");
					element.attr("cp", cp);
					element.attr("a", "-60");
					element.attr("pos", pos);
				} else if (pos == 7) {
					cp = (450);
					element.css("-webkit-transform", "translateX(" + cp + "px) rotateY(-60deg)");
					element.attr("cp", cp);
					element.attr("a", "-60");
					element.attr("pos", pos);
				}

			});
			_this.swipeenable = false;
			setTimeout(function() {
				_this.swipeenable = true;
			}, 800);

			createTabs(elementnumber - 1);
		},
		/* Register touch event listener to the image holders i.e the <div> holding each images */
		addEventsToImageHolders : function() {
			var _this = this;
			this.coverFlowContainerElement.find("div").each(function() {
				var element = $(this);
				element.bind("touchstart mousedown", [_this], _this.handleImageTapStart);
				element.bind("touchend mouseup", [_this], _this.handleImageTapStart);
			});

		},

		/*
		 Add touch events to the <div id='coverflow' /> container. So the container registers the finger movements
		 and acts accordingly
		 */
		addEventToCoverflowHolder : function() {

			/* this.coverFlowContainerElement.click(function(){

			 navigateInPages();

			 });*/
			this.coverFlowContainerElement.bind("touchstart mousedown ", [this], this.handleFingerSwipeStart);
			this.coverFlowContainerElement.bind("touchmove mousemove", [this], this.handleFingerSwipeMove);
			$(document).bind("touchend mouseup", [this], this.handleFingerSwipeEnd);
		},

		/* The default behavior of the browser is to scroll when you swipe. This line is to prevent scrolling */
		disablePageScroll : function() {
			document.ontouchmove = function(event) {
				if (allowswipedocument) {
					event.preventDefault();
				}
			}
		},

		/* Events for the <div id='coverflow'></div> holder */
		handleFingerSwipeStart : function(event) {
			var _this = event.data[0];
			_this.isMouseDown = true;
			_this.swipeStartX = _this.touchdevice ? event.originalEvent.changedTouches[0].pageX : event.pageX;
			// event.preventDefault();
		},

		handleFingerSwipeMove : function(event) {
			var _this = event.data[0];
			if (_this.isMouseDown) {

				var touchelement = _this.touchdevice ? event.originalEvent.changedTouches[0].pageX : event.pageX;
				_this.swipeDistanceX = parseInt(touchelement - _this.swipeStartX);
				//

				var netDistance = Math.abs(_this.swipeDistanceX);

				//console.log("Move: " + swipeDistanceX + " Net distance: " + netDistance); //changedTouches[0].
				if (netDistance >= _this.thresholdDistanceSingleSlide) {
					//console.log(thresholdDistanceSingleSlide + " covered");
					if (_this.swipeDistanceX < 0) {
						_this.right();
						_this.swipeStartX = touchelement;
					} else {
						_this.left();
						_this.swipeStartX = touchelement;
					}
				}
			}
		},

		handleFingerSwipeEnd : function(event) {
			var _this = event.data[0];
			if (_this.isMouseDown) {
				_this.isMouseDown = false;
				_this.swipeStartX = 0;
			}
		},

		/* Functions - left() & right() for actually moving the images when user interacts*/
		/* Move an image from L -> R i.e you are swiping from L->R across the screen */
		left : function() {

			if (this.swipeenable)
				this.swipeimages("right")
		},
		/* Move an image from R -> L i.e you are swiping from R->L across the screen */
		right : function() {
			if (this.swipeenable)
				this.swipeimages("left")
		}
	}

}

$(document).ready(function() {

	var sliderelement = new slider();
	sliderelement.initialise();

	document.ontouchmove = function(event) {
		//if(!inputfocus){
		event.preventDefault();
		//  }
	}

	$(".coverflowfooter").click(function() {
		navigateInPages();
	});
	$(".coverswipeimages").click(function() {
		var angle = $(this).attr("a")
		if (angle == 0) {
			navigateInPages();
		}
	});

});

function navigateInPages() {

	if (currentnavpage == 0) {

	} else if (currentnavpage == 5) {
		videointroductionpage();

	} else if (currentnavpage == 6) {
		videointroductionpageprocess();

	} else if (currentnavpage == 3) {
		videointroductionpage1();

	} else if (currentnavpage == 4) {
		businessplaningIntroduction();
	}

}
