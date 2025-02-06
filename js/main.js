
//===============================================================
// debounce関数
//===============================================================
function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


//===============================================================
// メニュー関連
//===============================================================

// 変数でセレクタを管理
var $menubar = $('#menubar');
var $menubarHdr = $('#menubar_hdr');
var $headerNav = $('header nav');

// menu
$(window).on("load resize", debounce(function() {
    if(window.innerWidth < 9999) {	// ここがブレイクポイント指定箇所です
        // 小さな端末用の処理
        $('body').addClass('small-screen').removeClass('large-screen');
        $menubar.addClass('display-none').removeClass('display-block');
        $menubarHdr.removeClass('display-none ham').addClass('display-block');
    } else {
        // 大きな端末用の処理
        $('body').addClass('large-screen').removeClass('small-screen');
        $menubar.addClass('display-block').removeClass('display-none');
        $menubarHdr.removeClass('display-block').addClass('display-none');

        // ドロップダウンメニューが開いていれば、それを閉じる
        $('.ddmenu_parent > ul').hide();
    }
}, 10));

$(function() {

    // ハンバーガーメニューをクリックした際の処理
    $menubarHdr.click(function() {
        $(this).toggleClass('ham');
        if ($(this).hasClass('ham')) {
            $menubar.addClass('display-block');
        } else {
            $menubar.removeClass('display-block');
        }
    });

    // アンカーリンクの場合にメニューを閉じる処理
    $menubar.find('a[href*="#"]').click(function() {
        $menubar.removeClass('display-block');
        $menubarHdr.removeClass('ham');
    });

    // ドロップダウンの親liタグ（空のリンクを持つaタグのデフォルト動作を防止）
	$menubar.find('a[href=""]').click(function() {
		return false;
	});
	$headerNav.find('a[href=""]').click(function() {
		return false;
	});

	// ドロップダウンメニューの処理
    $menubar.find('li:has(ul)').addClass('ddmenu_parent');
    $('.ddmenu_parent > a').addClass('ddmenu');
    $headerNav.find('li:has(ul)').addClass('ddmenu_parent');
    $('.ddmenu_parent > a').addClass('ddmenu');

// タッチ開始位置を格納する変数
var touchStartY = 0;

// タッチデバイス用
$('.ddmenu').on('touchstart', function(e) {
    // タッチ開始位置を記録
    touchStartY = e.originalEvent.touches[0].clientY;
}).on('touchend', function(e) {
    // タッチ終了時の位置を取得
    var touchEndY = e.originalEvent.changedTouches[0].clientY;
    
    // タッチ開始位置とタッチ終了位置の差分を計算
    var touchDifference = touchStartY - touchEndY;
    
    // スクロール動作でない（差分が小さい）場合にのみドロップダウンを制御
    if (Math.abs(touchDifference) < 10) { // 10px以下の移動ならタップとみなす
        var $nextUl = $(this).next('ul');
        if ($nextUl.is(':visible')) {
            $nextUl.stop().hide();
        } else {
            $nextUl.stop().show();
        }
        $('.ddmenu').not(this).next('ul').hide();
        return false; // ドロップダウンのリンクがフォローされるのを防ぐ
    }
});

    //PC用
    $('.ddmenu_parent').hover(function() {
        $(this).children('ul').stop().show();
    }, function() {
        $(this).children('ul').stop().hide();
    });

    // ドロップダウンをページ内リンクで使った場合に、ドロップダウンを閉じる
    $('.ddmenu_parent ul a').click(function() {
        $('.ddmenu_parent > ul').hide();
    });

});


//===============================================================
// 小さなメニューが開いている際のみ、body要素のスクロールを禁止。
//===============================================================
$(function() {
  function toggleBodyScroll() {
    // 条件をチェック
    if ($('#menubar_hdr').hasClass('ham') && !$('#menubar_hdr').hasClass('display-none')) {
      // #menubar_hdr が 'ham' クラスを持ち、かつ 'display-none' クラスを持たない場合、スクロールを禁止
      $('body').css({
        overflow: 'hidden',
        height: '100%'
      });
    } else {
      // その他の場合、スクロールを再び可能に
      $('body').css({
        overflow: '',
        height: ''
      });
    }
  }

  // 初期ロード時にチェックを実行
  toggleBodyScroll();

  // クラスが動的に変更されることを想定して、MutationObserverを使用
  const observer = new MutationObserver(toggleBodyScroll);
  observer.observe(document.getElementById('menubar_hdr'), { attributes: true, attributeFilter: ['class'] });
});


//===============================================================
// スムーススクロール（※バージョン2024-1）※通常タイプ
//===============================================================
$(function() {
    // ページ上部へ戻るボタンのセレクター
    var topButton = $('.pagetop');
    // ページトップボタン表示用のクラス名
    var scrollShow = 'pagetop-show';

    // スムーススクロールを実行する関数
    // targetにはスクロール先の要素のセレクターまたは'#'（ページトップ）を指定
    function smoothScroll(target) {
        // スクロール先の位置を計算（ページトップの場合は0、それ以外は要素の位置）
        var scrollTo = target === '#' ? 0 : $(target).offset().top;
        // アニメーションでスムーススクロールを実行
        $('html, body').animate({scrollTop: scrollTo}, 500);
    }

    // ページ内リンクとページトップへ戻るボタンにクリックイベントを設定
    $('a[href^="#"], .pagetop').click(function(e) {
        e.preventDefault(); // デフォルトのアンカー動作をキャンセル
        var id = $(this).attr('href') || '#'; // クリックされた要素のhref属性を取得、なければ'#'
        smoothScroll(id); // スムーススクロールを実行
    });

    // スクロールに応じてページトップボタンの表示/非表示を切り替え
    $(topButton).hide(); // 初期状態ではボタンを隠す
    $(window).scroll(function() {
        if($(this).scrollTop() >= 300) { // スクロール位置が300pxを超えたら
            $(topButton).fadeIn().addClass(scrollShow); // ボタンを表示
        } else {
            $(topButton).fadeOut().removeClass(scrollShow); // それ以外では非表示
        }
    });

    // ページロード時にURLのハッシュが存在する場合の処理
    if(window.location.hash) {
        // ページの最上部に即時スクロールする
        $('html, body').scrollTop(0);
        // 少し遅延させてからスムーススクロールを実行
        setTimeout(function() {
            smoothScroll(window.location.hash);
        }, 10);
    }
});


//===============================================================
// 画像がスクロールと少しずれて移動
//===============================================================
$(window).on('scroll', function() {
  var scrollTop = $(this).scrollTop();
  $('.speed1').css('transform', 'translateY(' + (-scrollTop * 0.1) + 'px)');
});
$(window).on('scroll', function() {
  var scrollTop = $(this).scrollTop();
  $('.speed2').css('transform', 'translateY(' + (-scrollTop * 0.05) + 'px)');
});


//===============================================================
// サムネイルスライドショー
//===============================================================
$(document).ready(function() {
    $('.slide-thumbnail1 .img').each(function() {
        var $imgParts = $(this);
        var $divs = $imgParts.children('div');
        var divCount = $divs.length;

        // 各 div の幅を計算
        var divWidth = 100 / (divCount * 2);

        // 基準値と速度係数を定義
        var baseAnimationTime = 30; // 「30がアニメーションの速度。小さいと早く、大きいとゆっくりになります。
        var baseSlideWidth = 200;
        var speedFactor = divCount / 4;	// 画面内に表示させる枚数。4枚。

        // アニメーション時間とスライド幅を計算
        var animationTime = (baseAnimationTime * speedFactor) + 's';
        var slideWidth = (baseSlideWidth * speedFactor) + '%';

        // 各 div に幅を設定
        $divs.css({
            'flex': '0 0 ' + divWidth + '%',
            'width': divWidth + '%'
        });

        // .img に animation と width を設定
        $imgParts.css({
            'animation-duration': animationTime,
            'width': slideWidth
        });

        // 子要素を複製して追加
        $divs.clone().appendTo($imgParts);

        // アニメーションの一時停止と再開
        $imgParts.on('mouseenter', function() {
            $(this).css('animation-play-state', 'paused');
        });
        $imgParts.on('mouseleave', function() {
            $(this).css('animation-play-state', 'running');
        });
    });
});


//===============================================================
// 背景画像が少しずつ上に移動する
//===============================================================
$(document).ready(function() {
    // 初期設定：背景画像の位置を設定
    updateParallax();

    // スクロール時にパララックス効果を更新
    $(window).on('scroll', function() {
        updateParallax();
    });

    function updateParallax() {
        var scrollTop = $(window).scrollTop();
        var windowHeight = $(window).height();

        $('.bg-slideup .image').each(function() {
            var $this = $(this);
            var offsetTop = $this.offset().top;
            var height = $this.outerHeight();

            // 要素がビューポート内にあるか確認
            if (offsetTop + height > scrollTop && offsetTop < scrollTop + windowHeight) {
                // 要素のビューポート内での位置を計算
                var percentScrolled = (scrollTop + windowHeight - offsetTop) / (windowHeight + height);
                percentScrolled = percentScrolled > 1 ? 1 : percentScrolled < 0 ? 0 : percentScrolled;

                // 背景位置を調整（0%から100%へ）
                var yPos = (percentScrolled * 100);
                $this.css('background-position', 'center ' + yPos + '%');
            }
        });
    }
});


//===============================================================
// 汎用開閉処理
//===============================================================
$(function() {
	$('.openclose').next().hide();
	$('.openclose').click(function() {
		$(this).next().slideToggle();
		$('.openclose').not(this).next().slideUp();
	});
});


//===============================================================
// テキストスライド
//===============================================================
$(function() {
    // 元のテキストを4回複製
    const originalText = $('.text-slide span').first();
    for (let i = 0; i < 3; i++) {
        originalText.clone().appendTo('.text-slide');
    }
    
    // スクロールアニメーション関数
    function scrollText() {
        const $textSlide = $('.text-slide');
        const firstSpan = $textSlide.children('span').first();
        const spanWidth = firstSpan.outerWidth(true);
        
        $textSlide.animate(
            { marginLeft: -spanWidth }, 
            30000, // アニメーション時間（ミリ秒）
            'linear',
            function() {
				// アニメーション完了後、最初の要素を最後に移動
                firstSpan.appendTo($textSlide);
                $textSlide.css('marginLeft', 0);
				// 次のアニメーションを開始
                scrollText();
            }
        );
    }

    // アニメーション開始
    scrollText();
});


//===============================================================
// manual用
//===============================================================
$(function() {
	$('#manual h3').wrapInner('<span>');
});


//===============================================================
// loadingをセッション中は一度だけ表示
//===============================================================
$(function() {
  // すでに訪問済み（同一セッション中）であれば、ローディングを表示しない
  if (sessionStorage.getItem('visited')) {
    $('#loading').hide(); // 直接非表示にする
  } else {
    // 初回訪問時は、ローディング表示後に"visited"フラグを立てる
    // CSSアニメーション時間を考慮し、3秒後にvisitedをセット
    setTimeout(function(){
      sessionStorage.setItem('visited', 'true');
    }, 3000);
  }
});
