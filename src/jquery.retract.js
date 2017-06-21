/*!
 * 横向瀑布流居中排版插件
 *
 * Copyright (c) 2015-2016 eBeryl
 * @param  x margin-right,
 * @param  y margin-bottom,
 * @param  target 子元素目标,
 * @param  widthOffset 随机宽度偏移量越大越明显,
 * @param  horizontalSize 行列数,
 * @param  autoFullColumns 不满一行自动填充一行宽度 默认true
 * @param  substractPx 总宽度左偏移量(用于高分屏可能出现往下掉的问题，一般不用配置)
 * http://www.bigwe.com
 * Version:  1.1
 * 2016年12月16日 更新了刷新功能和，自动填充最后一行的开关
 *
 */
( function( factory ) {
  "use strict";
  if ( typeof define === 'function' && define.amd ) {
    // using AMD; register as anon module
    define( [ 'jquery' ], factory );
  } else {
    // no AMD; invoke directly
    factory( jQuery );
  }
}( function( $ ) {
  $.fn.extend( {
    retract: function( option ) {
      "use strict";

      var DEFAULTS = {
        // margin-right
        x: 5,
        // margin-bottom
        y: 5,
        // 子元素目标
        target: '>*',
        // 随机宽度偏移量越大越明显
        widthOffset: 50,
        // 列数
        horizontalSize: 4,
        // 不满列数是否自动填充
        autoFullColumns: false,
        // 总宽度左偏移量
        substractPx: 1,
        _markstr: 'bw-ui-retract'
      }

      if ( option && typeof option == 'object' ) {
        $.extend( DEFAULTS, option );
      } else if ( typeof option == 'number' ) {
        $.extend( DEFAULTS, {
          horizontalSize: option
        } );
      }

      // --------------------------------
      // -生成随机宽度数组
      // @param size 				宽度个数
      // @param containerWidth	容器本身宽度
      var randomArrayFactory = function( size, containerWidth ) {
        if ( !size ) return [];
        var OPTIONS = $( this ).data();
        var randomRowWidth = containerWidth - OPTIONS.x * ( size - 1 );
        // 单个对象宽度
        var sigleItemWidth = ( ( containerWidth - OPTIONS.x * ( size - 1 ) ) ) / size;
        var randomMax = sigleItemWidth + OPTIONS.widthOffset / 2;
        var randomMin = sigleItemWidth - OPTIONS.widthOffset / 2;
        var randomArr = [];
        var sum = 0;
        // 预算最大随机值的情况下出现前面0到size-1总宽度大于最大宽度，进行max重新赋值
        if ( ( size - 1 ) * OPTIONS.x + randomMax * ( size - 1 ) > containerWidth ) {
          randomMax = parseInt( ( containerWidth - randomMin ) / ( size - 1 ) - OPTIONS.x );
        }
        for ( var i = 0; i < size - 1; i++ ) {
          // max - min 随机他们的差值（+1代表大于） 再加一个最小值就是范围
          var random = parseInt( Math.random() * ( randomMax - randomMin + 1 ) + randomMin );
          randomArr.push( random );
          sum += random;
        }

        randomArr.push( randomRowWidth - sum - OPTIONS.substractPx )

        return randomArr;
      }

      return $( this ).each( function() {
        var $this = $( this );
        var options = $.extend( {}, DEFAULTS, $( this ).data() );
        var $childTarget = $( options.target, $this );
        // 需要设置随机宽度的对象
        var $eachTarget = option == 'refresh' ? $childTarget : $childTarget.not( '[' + options._markstr + ']' );
        var thisWidth = $this.width();
        var arrayCount = parseInt( $childTarget.length / options.horizontalSize );
        var widthArray = [];
        var thisHeight = 0;
        // 落单的项目indx
        var excludeArray = [];
        // 整数行的size
        var integerSize = parseInt( $childTarget.length / options.horizontalSize ) * options.horizontalSize;
        var excludeWidthArray = [];
        var styleDefualt = {
          'margin-right': options.x,
          'margin-bottom': options.y,
          'margin-top': 0,
          'margin-left': 0,
          'float': 'left'
        }
        $this.data( options );

        for ( var i = 0; i < $childTarget.length - integerSize; i++ ) {
          excludeArray.push( integerSize + i );
        }

        excludeWidthArray = randomArrayFactory.call( $this, ( options.autoFullColumns ? excludeArray.length : options.horizontalSize ), thisWidth );


        for ( var i = 0; i < arrayCount; i++ ) {
          widthArray = widthArray.concat( randomArrayFactory.call( $this, options.horizontalSize, thisWidth ) );
        }

        $eachTarget.each( function( index ) {
          var $itemThis = $( this );
          var styleObj = $.extend( {}, styleDefualt, {
            'width': widthArray[ index ],
          } );
          if ( ( !( ( index + 1 ) % ( options.horizontalSize ) ) && index ) ) {
            styleObj[ 'margin-right' ] = 0;
          }

          $itemThis.css( styleObj );
          // 是否是落单的项目 autoFullColumns为false不作标记
          if ( $.inArray( $itemThis.index(), excludeArray ) == -1 ) {
            $itemThis.attr( options._markstr, $itemThis.index() );
          }
        } );

        for ( var i in excludeWidthArray ) {
          var styleObj = $.extend( {}, styleDefualt, {
            'width': excludeWidthArray[ i ],
          } );
          if ( i == excludeWidthArray.length - 1 ) {
            styleObj[ 'margin-right' ] = 0;
          }
          $childTarget.eq( excludeArray[ i ] ).css( styleObj );
        }

        var itemHeight = $childTarget.eq( 0 ).outerHeight() + parseFloat( $eachTarget.eq( 0 ).css( 'margin-bottom' ) );

        if ( $childTarget.length % options.horizontalSize ) {
          thisHeight = ( $childTarget.length / options.horizontalSize + 1 ) * itemHeight;
        } else {
          thisHeight = $childTarget.length / options.horizontalSize * itemHeight;
        }

        // 解決容器存在padding-top時出現容器高度計算錯誤的問題 
        thisHeight += parseFloat( $this.css( 'padding-top' ) || 0 );

        $this.css( {
          'height': thisHeight
        } );
      } );
    }
  } );
} ) );