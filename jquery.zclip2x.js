/*!
 * jQuery ZeroClipboard - v0.0.1rc1
 * http://f2ex.com/zclip
 *
 * Date: 2014/7/7
 *
 * 轻巧，简单，集成依赖
 * 依赖于ZeroClipboard 1.3.5
 *
 * 功能计划
 * - 后续添加forceHandCursor {bool} key
 * - hoverClass|activeClass {string}
 *
 * - beforeCopy 能做什么？可以判断拦截后面的东西吗
 * - show| hide | remove指令
 *
 * 优化计划
 * - 不用为$(selector) 中所有elements都实例化一个clip对象，可以实例化一个，其余的DOM通过clip()方法添加进去
 *
 * 压缩版地址：http://s4.qhimg.com/!f1e4f763/jquery-zclip/zeroclipboard,jquery.zclip.js
 * 
 * 
 */

(function($) {

var counter = 0,
    clipCache;

/**
 * zclip 核心方法
 * 
 * @param  {Object|String} params 支持Object传入Options和String传入指令
 *
 *  Options
 *      - 
 *
 * 
 *  directive
 *     "remove" 删除
 *     "hide" 隐藏 clip.unclip(this)
 *     "show" 显示 clip.clip(this)
 *     
 * 
 * @return {[type]}        [description]
 */
$.fn.zclip = function (params) {

    if (typeof params == "object" && !params.length) {

        var config = $.extend({
            path: 'TODO 使用2.x的swf',
            copy: null,
            beforeCopy: null,
            afterCopy: null,
            clickAfter: true,
            setHandCursor: true,
            setCSSEffects: true

        }, params);

        return this.each(function () {
            var $this = $(this);

            if ( $this.is(':visible') && (typeof config.copy === 'string' || $.isFunction(config.copy)) ) {

                ZeroClipboard.config({'swfPath': config.path});

                var cacheIndex = counter++,
                    clip = new ZeroClipboard(this);

                // cache clip obj
                $this.data('zclipId', cacheIndex);
                clipCache[cacheIndex] = clip;

                if ($.isFunction(config.copy)) {
                    $this.on('zclip.copy', function () {
                        if ($.isFunction(config.copy)) {
                            clip.setText(config.copy.call(this));
                            $this.trigger('zclip.afterCopy');
                        } else {
                            clip.setText(config.copy);
                        }
                    });
                }

                if($.isFunction(config.afterCopy)) {
                    $this.on('zclip.afterCopy', config.afterCopy);
                }

                if ($.isFunction(config.beforeCopy)) {
                    $this.on('zclip.beforeCopy', config.beforeCopy);
                }

                clip.on('mousedown', function () {
                    $this.trigger('zclip.copy')
                })

                // set handCursor|cssEffects
                // Main logic
                clip.on('load', function (client) {
                    // for 2.x
                    // clip.on('beforeCopy', function (event) {
                    //     $this.trigger('zclip.beforeCopy');
                    // })

                    client.on('complete', function (client, args) {
                        $this.trigger('zclip.afterCopy');
                    });
                    // for 2.x
                    // clip.on('aftercopy', function (event) {
                    //    $this.trigger('zclip.afterCopy');
                    // });
                });
            }
        })

    } else if (typeof params == "string") {
        // zclip('remove|hide|show')
        // 如何删除绑定的zclip
        return this.each(function () {

            var $this = $(this),
                zclipId = $this.data('zclipId'),
                clip = clipCache[zclipId];

            if(!clip) return;

            if(params === 'remove') {
                clip.destroy();
                clipCache[zclipId] = null;
                // 是否$this.data('zclipId', "");
            } 

        });

    }

}

clipCache = $.fn.zclip.cache = {};

$.fn.zclip.version = '0.0.1rc1';

})(jQuery);



// Usage
// ---------------------------------------

// $('#copy_input').zclip({
//     path: 'js/Zeroclipboard.swf',
//     copy: function () { // 复制内容
//         return $('#mytext').val()
//     },
//     beforeCopy: function () { // 复制之前
        
//     },
//     afterCopy: function () { // copy成功
//         $("<span id='msg'/>").insertAfter($('#copy_input')).text('复制成功');
//     }
// })