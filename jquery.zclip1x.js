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
 * 优化计划
 *
 * 压缩版地址：http://s4.qhimg.com/!f1e4f763/jquery-zclip/zeroclipboard,jquery.zclip.js
 *
 * TODO
 * -[] 缓存系统优化
 * -[] zero推荐使用zero.config 而不是每个实例都传入options。
 * -[] 新版本的一个ZeroClipboard可加入多个elements，那这样可以在一个zero实例中添加多个elements
 * -[] 不用为$(selector) 中所有elements都实例化一个clip对象，可以实例化一个，其余的DOM通过clip()方法添加进去
 * 
 */

(function($) {

// Helpers
// ========
function isType(val, type) {
    return Object.prototype.toString.call(val).toLowerCase() === '[object ' + type + ']'.toLowerCase();
}

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

    if (isType(params, 'object')) {
        var defaltConfig = {
            path: 'http://s2.qhimg.com/static/b88af58c0c9db638.swf',
            copy: null,
            beforeCopy: null,
            afterCopy: null,
            clickAfter: false,
            setHandCursor: true,
            setCSSEffects: true
        }

        var config = $.extend({}, defaltConfig, params);

        return this.each(function () {
            var $this = $(this);

            if ( $this.is(':visible') && (typeof config.copy === 'string' || $.isFunction(config.copy)) ) {

                var zeroOptions = {
                    'moviePath': config.path,
                    'forceHandCursor': config.setHandCursor
                }

                var clip = new ZeroClipboard(this, zeroOptions);

                // TODO cache这个，能否用对象封装起来
                var cacheIndex = counter++;
                // cache clip obj
                $this.data('zclipId', cacheIndex);
                clipCache[cacheIndex] = clip;

                if(config.copy != null) {
                    var copyText = function  () {
                        if ($.isFunction(config.copy)) {
                            return function() {
                                clip.setText(config.copy.call(this));
                            }
                        } else {
                            return function() {
                                clip.setText(config.copy);
                            }
                        }
                    }();

                    $this.on('zclip.copy', copyText);
                }

                if($.isFunction(config.afterCopy)) {
                    $this.on('zclip.afterCopy', config.afterCopy);
                }

                if ($.isFunction(config.beforeCopy)) {
                    $this.on('zclip.beforeCopy', config.beforeCopy);
                }

                // 兼容元素原来的mouse事件
                clip.on('mouseover', function () {
                    $this.trigger('mouseenter');
                })

                clip.on('mouseout', function () {
                    $this.trigger('mouseleave');
                })

                clip.on('mousedown', function () {
                    $this.trigger('mousedown');

                    $this.trigger('zclip.beforeCopy');

                    $this.trigger('zclip.copy')
                })

                clip.on('load', function (client) {

                    client.on('complete', function (client, args) {
                        $this.trigger('zclip.afterCopy');

                        if(config.clickAfter) {
                            $this.trigger('click');
                        }
                    });
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
                $this.off('zclip.copy');
                $this.off('zclip.beforeCopy');
                $this.off('zclip.afterCopy');

            } else if (params === 'hide') {
                clip.unclip(this);
            } else if (params === 'show') {
                clip.clip(this);
            }

        });

    }

}

clipCache = $.fn.zclip.cache = {};

$.fn.zclip.version = '0.0.1rc1';

})(jQuery);
