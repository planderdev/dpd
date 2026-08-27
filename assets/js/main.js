/* *******************************************************
 * filename : main.js
 * description : 메인에만 사용되는 JS
 * date : 2022-08-08
******************************************************** */

$(document).ready(function  () {
	setTimeout(function  () {
		$(".ms-preloader").animate({"opacity":"0"},1000,"easeInOutCubic",function  () {
			$(".ms-preloader").css("visibility", "hidden");
		});
	},0);
	setTimeout(function  () {
		addClassName($(".main-wrap"), "active");
	},200);

	/* ************************
	* Func : 메인 비주얼 높이 설정 및 slick 슬라이드
	* slick.js , getWindowWidth(), getWindowHeight() 필요
	************************ */
	// 메인 비주얼 높이값 설정
	if ($.exists('#mainVisual.full-height')) {
		mainVisualHeight();
		$(window).on('resize', mainVisualHeight);

		function mainVisualHeight () {
			var visual_height = getWindowHeight();	// header가 fixed or absolute일경우 - $("#header").height() 삭제
			$("#mainVisual").height(visual_height);
		}
	}


	
	$('.main-con01-top').waypoint(function(direction) {
		if (direction === "down") {
			$('.main-con01-top').addClass('animated')
		}
	},{
		triggerOnce: true,
		offset: "70%"
	});

	/* ************************
	* Func : 메인 텍스트 효과
	************************ */
	gsap.registerPlugin(ScrollTrigger);
	//ScrollTrigger.addEventListener("refresh", () => {});
	ScrollTrigger.refresh();
	
	ScrollTrigger.matchMedia({
		"(min-width: 801px)": function() {
			const textElements = gsap.utils.toArray('.main-who-txt .text');
			const itemHeight = $(".main-who-txt").height();
			textElements.forEach((text, index) => {
			  gsap.to(text, {
				backgroundSize: '100%',
				ease: 'none',
				scrollTrigger: {
				  trigger: text,
				  start: () => `top+=${index * 100 - 350} center` , // index에 따라 시작 위치 다르게
				  end: `top+=${index * 100 + 150} center`,
				  scrub: true,
				},
			  });
			});
		},
		"(max-width: 800px)": function() {
			const textElements = gsap.utils.toArray('.main-who-txt .text');
			const itemHeight = $(".main-who-txt").height();
			textElements.forEach((text, index) => {
			  gsap.to(text, {
				backgroundSize: '100%',
				ease: 'none',
				scrollTrigger: {
				  trigger: text,
				  start: "top center" , // index에 따라 시작 위치 다르게
				  end: "bottom center",
				  scrub: true,
				},
			  });
			});
		}
	});
	
	/* ************************
		* Func : Product init (아코디언)
		* - PC : hover
		* - 반응형: click
	************************ */
	function mainPrdArcActive() {
		const $lists = $('.main-prd-list');
		const BP = 800; 

		if (!$lists.length) return;

		function unbindAll() {
			$lists.off('.prdAccHover .prdAccClick');
		}
		function setDefaultActive() {
			const $items = $lists.find('.main-prd-item');
			if (!$items.filter('.active').length) {
			  $items.eq(0).addClass('active');
			}
		}
  
		function bindHover() {
			unbindAll();
			setDefaultActive();
			$lists.on('mouseenter.prdAccHover', '.main-prd-item', function () {
			  const $item = $(this);
			  $item.addClass('active')
				  .siblings('.main-prd-item')
				  .removeClass('active');
			});
			
			// 리스트 영역 밖으로 나가면 active 제거
			//$lists.on('mouseleave.prdAccHover', function () {
			//	$(this).find('.main-prd-item').removeClass('active');
			//});
		}

		function bindClick() {
			unbindAll();
			setDefaultActive();
			$(".main-prd-item").eq(0).addClass('active');
			$lists.on('click.prdAccClick', '.main-prd-item', function (e) {
			  //e.preventDefault();

			  const $item = $(this);

			  if (!$item.hasClass('active')) {
				$item.addClass('active')
					.siblings('.main-prd-item')
					.removeClass('active');
			  }
			});
		}

		function refresh() {
			const wOk = getWindowWidth() > BP;

			// 풀페이지 켜진 PC면 hover, 그 외는 click
			if (wOk) bindHover();
			else bindClick();
		}

		// 최초 1회
		refresh();

		// 리사이즈 대응
		let t;
		$(window).off('resize.prdAccAuto').on('resize.prdAccAuto', function () {
			clearTimeout(t);
			t = setTimeout(refresh, 120);
		});

		// 외부(풀페이지 콜백)에서 다시 갱신할 수 있게 노출
		window.refreshPrdArcActive = refresh;
		
		if(getWindowWidth() > BP){
			function setInnerTab($item, idx) {
				const $tabCon = $item.find('.over-inner-tab-con');
				const $tabs = $item.find('.over-inner-tab a');
				const $visibleCon = $tabCon.eq(idx);
				
				$tabCon.stop().fadeOut(800);
				$visibleCon.stop().fadeIn(800);
			}

			$lists.find('.main-prd-item').each(function () {
				setInnerTab($(this), 0);
			});

			// hover 시 탭 전환
			$lists.on('mouseenter.innerTab focus.innerTab',
				'.main-prd-item .over-inner-tab a',
				function () {
				  const $a = $(this);
				  const idx = $a.index();
				  const $item = $a.closest('.main-prd-item');
				  setInnerTab($item, idx);
				}
			);
		}
	}

	// 실행
	mainPrdArcActive();
	

	/* ************************
		* Func : Bisiness 슬라이드
	************************ */
	var $mainBusinessList = $('.main-business-list');
	$mainBusinessList.slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: false,
		fade: false,
		dots:false,
		autoplay: false,
		speed:1000,
		infinite:false,
		autoplaySpeed: 4000,
		easing: 'easeInOutQuint',
		pauseOnFocus: false,
		pauseOnHover:false,
		responsive: [
					{
					  breakpoint: 1281,
					  settings: {
						slidesToShow: 3,
					  }
					},
					{
					  breakpoint: 801,
					  settings: {
						slidesToShow: 2,
					  }
					},
					{
					  breakpoint: 481,
					  settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					  }
					}
				  ]
	});
				  
	//$mainBusinessList.slick("slickPause");
	
	$('.main-business-con').waypoint(function(direction) {
		if (direction === "down") {
			setTimeout(function  () {
				$('.main-business-con').addClass('animated')
				//$('.main-business-list').slick("slickPlay");
			},100);
		}else if ( direction === "up") {
			$('.main-business-con').removeClass('animated')
		}
	},{
		triggerOnce: true,
		offset: "85%"
	});
	
	$mainBusinessList.each(function  () {
		var $mainBusinessItem = $(this).find("li");
		
		$mainBusinessItem.on("mouseenter",function  () {
			$mainBusinessItem.removeClass("off");
			$mainBusinessItem.removeClass("on");
			$mainBusinessItem.addClass('off');
			$(this).removeClass("off");
			$(this).addClass("on");
		});
		$mainBusinessItem.on("mouseleave",function  () {
			$mainBusinessItem.removeClass("off");
			$mainBusinessItem.removeClass("on");
		});	
	});
	
	/***** 드래그 시 링크이동 방지 *****/
	const mainBusinessList = document.querySelector(".main-business-list");

	let startX = 0;
	let isMouseDown = false;
	let isDragging = false;

	if (mainBusinessList) {
		document.addEventListener("mousedown", (e) => {
			if (!mainBusinessList.contains(e.target)) return;
			
			isMouseDown = true;
			startX = e.pageX;
			isDragging = false;
		});

		document.addEventListener("mousemove", (e) => {
			if (!isMouseDown) return;
				
			if (Math.abs(e.pageX - startX) > 8) {
				isDragging = true;
			}
		});

		document.addEventListener("mouseup", () => {
			isMouseDown = false;
		});

		document.addEventListener("click", function(e){
			if (isDragging && e.target.closest(".main-business-list a")) {
				e.preventDefault();
				e.stopPropagation();
			}
		}, true);
	}
	
	/* ************************
		* Func : PR Center
	************************ */
	$('.main-pr-txt-list').each(function  () {
		var $mainPrImgList = $('.main-pr-img-list');
		var $mainPrImgItem = $mainPrImgList.find("li");
		var $mainPrTxtItem = $(this).find("li");
		$mainPrImgItem.eq(0).addClass('on');
		
		$mainPrTxtItem.on("mouseenter",function  () {
			var idx = $(this).index();
			$mainPrImgItem.removeClass('on');
			$mainPrImgItem.eq(idx).addClass('on');
		});
	});

	$('.main-support-con').waypoint(function(direction) {
		if (direction === "down") {
			$('.main-support-con').addClass('animated')
		}else if ( direction === "up") {
			$('.main-support-con').removeClass('animated')
		}
	},{
		triggerOnce: true,
		offset: "85%"
	});
	
	followMousePointer();
});

/* ************************
* Func : mouse pointer 모션
************************ */
function followMousePointer () {
	if (window.__DPD_USE_SITE_CURSOR__ !== false) return;
	var $mouse_follow_btn = $(".mouse-pointer");
	$("body").on('mousemove', function (e){
		$mouse_follow_btn.addClass("active is-moving");
		var sxPos = e.pageX / $(this).width() * 100 - 50;
		var syPos = e.pageY / $(this).height() * 100 - 50;
		
		TweenMax.to($mouse_follow_btn, 2, {
			x: e.clientX,
			y: e.clientY,
			ease: Expo.easeOut,
			duration: 1
		});
	});

	$("[data-mouse-pointer='view']")
		.on('mouseenter', function (e){
			$mouse_follow_btn.addClass("view");
		})
		.on('mouseleave', function (e){
			$mouse_follow_btn.removeClass("view");
		})
			
	$("[data-mouse-pointer='more']")
		.on('mouseenter', function (e){
			$mouse_follow_btn.addClass("more");
		})
		.on('mouseleave', function (e){
			$mouse_follow_btn.removeClass("more");
		})
}
