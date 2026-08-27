/* *******************************************************
 * filename : sub.js
 * description : 서브컨텐츠에만 사용되는 JS
 * date : 2022-08-04
******************************************************** */


$(document).ready(function  () {
	/* ************************
	* Func : 서브 Visual Active 클래스 붙이기
	* addClassName () 필요
	************************ */
	setTimeout(function  () {
		addClassName($("#visual"), "active");
	},200);

	/* ************************
	* Func : 모달팝업 플러그인 사용
	* MagnificPopup.js 필요
	************************ */
	if ($.exists(".popup-gallery")) {
		magnificPopup($(".popup-gallery"));
	}

	/* ************************
	* Func : 일정 가로사이즈 아래부터 scroll 사용하기
	* mCustomScrollbar.js, customScrollX() 필요
	************************ */
	/* 서브 Scrollbar object  */
	$(".custom-scrollbar-wrapper").each(function  () {
		$(this).prepend("<div class='custom-scrollbar-cover'><div class='scroll-cover-txt'><i class='ri-hand'></i></div></div>");
		var $scrollObject = $(this).find(".scroll-object-box");
		if ($.exists($scrollObject)) {
			customScrollX($scrollObject);
		}
		$(this).on("touchmove click",function  () {
			$(this).find(".custom-scrollbar-cover").fadeOut(200);
		});
	});

	/* ************************
	* Func : 서브 상단 메뉴 FIXED
	* getWindowWidth(), checkOffset(), toFit() 필요
	************************ */
	if ($.exists(".fixed-sub-menu")) {
		var $fixedSubMenu = $(".fixed-sub-menu");
		var topMenuStart =  checkOffset($fixedSubMenu);
		$(window).resize(function  () {
			if ( getWindowWidth() > tabletWidth ) {
				topMenuStart =  checkOffset($fixedSubMenu);
			}else {
				$fixedSubMenu.removeClass("top-fixed");
			}
		});
		window.addEventListener('scroll', toFit(function  () {
			if ( getWindowWidth() > tabletWidth ) {
				objectFixed($fixedSubMenu, topMenuStart, "top-fixed");
			}else {
				$fixedSubMenu.removeClass("top-fixed");
			}
		}, {
		}),{ passive: true })
	}

	/* ************************
	* Func : 컨텐츠 메뉴 FIXED 및 클릭시 해당영역 이동
	* getScrollTop(), getWindowWidth(), checkOffset(), toFit(), checkFixedHeight(), moveScrollTop() 필요
	************************ */
	if ($.exists(".cm-fixed-tab-container-JS")) {
		var $fixedMoveTab = $(".cm-fixed-tab-list-JS");		// fixed되는 메뉴 클래스
		var $moveTabItem = $fixedMoveTab.find("li");
		var menuCount= $moveTabItem.length;
		var nav = [];
		
		$(window).on('load', function  () {
			checkStartOffset();
			nav = checkTopOffset();
		});
		$(window).on('resize', function  () {
			checkStartOffset();
			nav = checkTopOffset();
		}); 		
		
		// 탭이 붙기 시작하는 지점 체크
		function checkStartOffset () {
			var fixedStartPoint =  $(".cm-fixed-tab-container-JS").offset().top - checkFixedHeight();	
			return fixedStartPoint;
		}		

		// 해당되는 각각의 영역 상단값 측정
		function checkTopOffset () {
			var arr = [];
			for(var i=0;i < menuCount;i++){
				arr[i]=$($moveTabItem.eq(i).children("a").attr("href")).offset().top;
			}
			return arr;
		}
		
		// 스크롤 0일때 상단fixed되는 높이값 체크
		function checkFixedObjectHeight () {
			var fixedObjectTotalHeight = 0;
			for (var i=0; i<$(".top-fixed-object").length; i++) {
				var fixedObjectTotalHeight = fixedObjectTotalHeight + $(".top-fixed-object").eq(i).outerHeight();
			}
			return fixedObjectTotalHeight;
		}

		// 스크롤 event 
		window.addEventListener('scroll', toFit(function  () {
			// 메뉴fixed
			// objectFixed($fixedMoveTab, checkStartOffset(), "top-fixed");

			if ( getScrollTop() >  checkStartOffset() ) {
				$fixedMoveTab.addClass("top-fixed");
			}else if ( getScrollTop() <  (checkStartOffset() + $fixedMoveTab.height()) ) {
				$fixedMoveTab.removeClass("top-fixed");
			}

			$moveTabItem.each(function  (idx) {
				var eachOffset = nav[idx] -  checkFixedHeight();
				var minusOffset = $(window).height() / 6;	// 스크롤시 selected 붙는 지점을 조금 더 빠르게 하기위해 추가
				
				if( (getScrollTop() + minusOffset) >= eachOffset ){
					$moveTabItem.removeClass('selected');
					$moveTabItem.eq(idx).addClass('selected');
					// 모바일 드롭메뉴일때
					if ($.exists($moveTabItem.parents(".cm-drop-menu-box-JS"))) {
						$fixedMoveTab.find(".cm-drop-open-btn-JS > span").text($moveTabItem.eq(idx).find("em").text());
					}
				};
			});
			}, {
		}),{ passive: true })
		
		// 클릭 event 
		$moveTabItem.find("a").click(function  () {
			var goDivOffset = $($(this).attr("href")).offset().top - checkFixedHeight() +1;	// 이동해야할 지점
			if ( getScrollTop()  < checkStartOffset()) {
				if ( getScrollTop() == 0 ) {
					var goDiv = goDivOffset - checkFixedObjectHeight();
				}else {
					var goDiv = goDivOffset - $fixedMoveTab.height();
				}
			}else {
				var goDiv = goDivOffset;
			}
			setTimeout(function  () {
				moveScrollTop(goDiv);
			});

			// 모바일 드롭메뉴일때
			if ($.exists($(this).parents(".cm-drop-menu-box-JS")) ) {
				if ( getWindowWidth () < $fixedMoveTab.data("drop-width")+1 ) {
					$fixedMoveTab.find("ul").slideUp();
				}
			}
			 
			return false;
		});
	}

	/* ************************
	* Func : 에디터관련
	************************ */
	if ($.exists(".editor")) {
		/* 테이블 스크롤넣기 */ 
		$(".editor table").each(function  () {
			$(this).wrap("<div class='editor-table-box'></div>");
		});
		
		/* iframe 태그 감싸기 */ 
		$(".editor *:not('.editor-iframe-box') iframe").each(function  () {
			var iframeSrc = $(this).attr("src");
			var findStr = "https://www.youtube.com/embed"; 

			if (iframeSrc.indexOf(findStr) != -1) {
			  $(this).wrap("<div class='editor-iframe-box'></div>");
			}
		});
	}
	
	/* ************************
	* 연혁 이미지 슬라이드
	************************ */
	if ($.exists(".history-page")) {
		$(".history-year-group-box").each(function () {
			var $box = $(this);
			var $historySlide = $box.find(".history-img-list");

			$historySlide.slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false,
				fade: false,
				dots: true,
				autoplay: true,
				speed: 1200,
				autoplaySpeed: 3000,
				infinite: true,
				pauseOnHover: false,
			});
		});
	}
	
	/* ************************
	* Func : 연혁 스크롤
	************************ */
	if ($.exists(".history-percent-bar")) {
		var $docCon = $(".history-year-group-box");
		var docCount = $docCon.length;
		var docNav = [];
			
		$(window).on('load', function  () {
			checkDocStartOffset();
			docNav = checkDocTopOffset();
		});
		$(window).on('resize', function  () {
			checkDocStartOffset();
			docNav = checkDocTopOffset();
		}); 		
			
		var isVisible = false;
		$(window).on('scroll',function() {
			if (!isVisible) {
				checkDocStartOffset();
				docNav = checkDocTopOffset();
				isVisible=true;
			}
		});
		function checkDocStartOffset () {
			var docStartPoint =  $(".history-con-wrap").offset().top;	
			return docStartPoint;
		}		
		function checkDocTopOffset () {
			var arr = [];
			for(var i=0;i < docCount;i++){
				arr[i]= $docCon.eq(i).offset().top;
			}
			return arr;
		}
		$(window).scroll(function () {
			var scrollTop = $(window).scrollTop();
			var viewHeight = $(window).height();
			
			var startPoint = $(".history-con-wrap").offset().top;	
			var $scrollBar = $(".percent-bar-child");
			var scrollBarOffset = $scrollBar.find(".point").offset().top;
			var docHeight =	$('.history-con-wrap').height();

			if ((scrollTop + viewHeight) > startPoint){
				var scrollPercent = (scrollTop + viewHeight) - (startPoint + viewHeight/2) ;
				$scrollBar.css('height', scrollPercent );
				$scrollBar.css('max-height', '100%');
				$(".point").toggleClass("active", scrollTop > 0);
			}

			$docCon.each(function  (idx) {
				var eachOffset = docNav[idx];
				
				if ( scrollBarOffset  >= eachOffset ){
					$docCon.eq(idx).addClass('active');
				}else{
					$docCon.eq(idx).removeClass('active');
				}
			});
		});
	}
	
	/* ************************
	* Func : 탭 이동 스타일
	************************ */
	$moveMenuList = $(".move-line-list-JS");

	// 페이지 로드 후 위치 초기화
	function listMove() {
		$(".move-line-list-JS li.selected").each(function() {
			var onLeftPosition = $(this).position().left;
			var onLeftInnerPosition = $(this).find("a").position().left;
			var onLeftWidth = $(this).find("a").outerWidth();
			
			$(".move-line").children("span").css({
				left:onLeftPosition + onLeftInnerPosition , width:onLeftWidth
			});
		});
	}
	
	$moveMenuList.each(function() {
		if ( getWindowWidth() > 800 ) {
			$(this).children("li").on("mouseenter", function() {
				navPosition = $(this).position().left;
				navinnerPosition = $(this).find("a").position().left;
				navWidth = $(this).find("a").outerWidth();

				$(this).find("em").css('color', '#fff');
				$(this).siblings().find("em").css('color', '#1C2E58');

				if (!$(this).hasClass('selected')) {
					$(".move-line-list-JS li.selected a em").css('color','#1C2E58');
				}
				$(".move-line").children("span").show().stop().animate({left:navPosition + navinnerPosition , width:navWidth},300,"swing");
				
			}).on("mouseleave", function() {
				if ($(".move-line-list-JS li.selected").length > 0) {
					var $selectedItem = $(".move-line-list-JS li.selected");
					onnavPosition = $selectedItem.position().left;
					onnavinnerPosition = $selectedItem.find("a").position().left;
					onnavWidth = $selectedItem.find("a").outerWidth();
					
					// 현재 마우스를 올린 요소의 색상을 원래대로 되돌리기
					$(this).find("em").css('color', '#1C2E58');
					$(this).find("span").css('color', '#1C2E58');

					// selected 클래스가 있는 li의 em 색상을 흰색으로 설정
					$selectedItem.find("em").css('color', '#fff');
					$selectedItem.find("span").css('color', '#fff');

					$(".move-line").children("span").show().stop().animate({left:onnavPosition + onnavinnerPosition, width:onnavWidth},300,"swing");
				}
			});
		}
	});
	
	if ( getWindowWidth() > 800 ) {
		listMove();
	}
		
	$(window).on('resize', function  () {
		if ( getWindowWidth() > 800 ) {
			listMove();
		}
	});
	
	/* ************************
	* 제품 뷰 이미지 슬라이드
	************************ */
	const prdViewImgSwiper = new Swiper(".view-img-slide-wrap .area", {
		slidesPerView: 2,
		spaceBetween: 25,
		speed: 5000,
		loop: true,
		allowTouchMove: true,
		// 자동재생
		autoplay: {
			delay: 0,
			disableOnInteraction: false,
		},
		// 반응형
		breakpoints: {
			800: {
				slidesPerView: 3,
				spaceBetween: 49.5,
			},
		},
	});
	
	/* ************************
	* 제품 뷰 특장점 슬라이드
	************************ */
	const prdViewBenefitSwiper = new Swiper(".cm-img-slide .img-slide-wrap", {
		slidesPerView: 1,
		loopAdditionalSlides: 3,
		spaceBetween: 20,
		centeredSlides: true,
		speed: 1000,
		loop: true,
		allowTouchMove: true,
		// 자동재생
		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		// 반응형
		breakpoints: {
			801: {
				slidesPerView: 1,
				spaceBetween: 20,
			},
		},
	});
				
	/* ************************
	* 제품 뷰 overview 슬라이드
	************************ */
	const businessOverviewSwiperVer01 = new Swiper(".business-overview-wrap.ver01", {
		slidesPerView: 2,
		spaceBetween: 20,
		centeredSlides: false,
		speed: 1000,
		loop: false,
		allowTouchMove: true,
		pagination: {
			el: ".cm-slide-progress",
			type: "progressbar",
		},
		// 반응형
		breakpoints: {
			801: {
				slidesPerView: 4,
				spaceBetween: 20,
			},
		},
	});
				
	const businessOverviewSwiperVer2 = new Swiper(".business-overview-wrap.ver02", {
		slidesPerView: 1,
		spaceBetween: 20,
		centeredSlides: false,
		speed: 1000,
		loop: false,
		allowTouchMove: true,
		pagination: {
			el: ".cm-slide-progress",
			type: "progressbar",
		},
		// 반응형
		breakpoints: {
			801: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
		},
	});
				
	/* ************************
	* 사업소개 뷰 아코디언
	************************ */
	const $items = $(".accordion-list .list-item");

	// 처음 하나 활성화
	$items.eq(0).addClass("active");

	// hover 시 무조건 하나만 active
	$items.on("mouseenter", function () {
		const $item = $(this);
		if ($item.hasClass("active")) return;
		$items.removeClass("active");
		$item.addClass("active");
	});
	/* */
	
	/* ************************
	* 사업소개 체계종합사업
	************************ */
	if ($.exists(".business-vprocess-con")) {
		gsap.registerPlugin(ScrollTrigger);
		
		const md = gsap.matchMedia();

		const container = document.querySelector(".business-vprocess-con");
		const list = document.querySelector(".vprocess-list");
		const header = document.querySelector("#header");

		const headerHeight = header.clientHeight;
		const moveX = list.scrollWidth - container.clientWidth / 2;
		
		md.add("(min-width: 801px)", () => {
			gsap.to(list, {
				x: -moveX,
				ease: "none",
				scrollTrigger: {
					trigger: container,
					start: "top+=80 10%",
					end: "+=" + moveX,
					scrub: 1,
					pin: true,
					anticipatePin: 1,
					invalidateOnRefresh: true
				}
			});
		});
		
		md.add("(max-width: 800px)", () => {
			gsap.to(list, {
				x: -moveX,
				ease: "none",
				scrollTrigger: {
					trigger: list,
					start: "top-=60 10%",
					end: "+=" + moveX,
					scrub: 1,
					pin: true,
					anticipatePin: 1,
					invalidateOnRefresh: true
				}
			});
		});
	}
	
});
			
/* **********
* 제품 뷰 영상
************ */
let tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

let players = [];

function onYouTubeIframeAPIReady() {
	$(".youtube-player").each(function (index) {
		const videoId = $(this).data("video");
		const thumb = `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;
		this.closest(".view-video-con").style.setProperty("--thumb", thumb);

		players[index] = new YT.Player(this, {
			videoId: videoId,
			playerVars: {
				autoplay: 0,
				controls: 0,
				mute: 1,
				rel: 0,
				modestbranding: 1,
				showinfo: 0,
				fs: 0,
				playsinline: 1,
				loop: 1,
				playlist: videoId
			}
		});
	});
}

const viewVideo = document.querySelector(".view-video-con");

if (viewVideo) {
	window.addEventListener("scroll", () => {
		const viewHeight = window.innerHeight;
		const videoTop = viewVideo.getBoundingClientRect().top;

		if (viewHeight >= videoTop * 1.2) {
			if (players.length > 0) {
				players[0].playVideo();
				viewVideo.classList.add("thumb-hide");
			}
		}
	});
}

$(window).on("load", function () {
	$(".location-tab-container-JS").each(function  () {
		var $locationTabList = $(this).find(".location-tab-list-JS");
		var $locationTabListli = $locationTabList.find("li");
		var $locationConWrapper = $(this).children(".location-tab-content-wrapper-JS");
		var $locationContent = $locationConWrapper.children();
		
		
		// 탭 영역 숨기고 selected 클래스가 있는 영역만 보이게
		var $selectLocaCon = $locationTabList.find("li.selected").find("a").attr("href");
		var selectLocaTxt = $locationTabList.find("li.selected").find("em").text();
		$locationContent.hide();
		$($selectLocaCon).show();

		$locationTabListli.children("a").click(function  () {
			if ( !$(this).parent().hasClass("selected")) {
				var visibleLocaCon = $(this).attr("href");
				$locationTabListli.removeClass("selected");
				$(this).parent("li").addClass("selected");
				$locationContent.hide();
				$(visibleLocaCon).fadeIn();
			}
			return false;
		});

		// 모바일 버튼이 있을때 추가
		var $locationTabMobileBtn = $(this).find(".location-tab-select-btn-JS");
		if ($.exists($locationTabMobileBtn)) {
			$locationTabMobileBtn.find("span").text(selectLocaTxt);
			// Mobile Btn Click
			$locationTabMobileBtn.click(function  () {
				$(this).toggleClass("open").siblings().slideToggle();
				return false;
			});

			// Mobile List Click
			$locationTabListli.children("a").click(function  () {
				$locationTabMobileBtn.find("span").text($(this).find("em").text());
				tabLocaListClose();
			});
			$("body").click(function  () {
				tabLocaListClose();
			});
			function tabLocaListClose () {
				if ( getWindowWidth () < 801 ) {
					$locationTabMobileBtn.removeClass("open").siblings().slideUp();
				}
			}
			$(window).resize(function  () {
				if ( getWindowWidth () > 800 ) {
					$locationTabMobileBtn.siblings().removeAttr("style");
				}else {
					$locationTabMobileBtn.siblings().hide()//.css("display","none");
				}
			});
		}
	});
});

/* *****************
* 사업소개 순차 액티브
******************* */
rollingActive(".si-process-list");
