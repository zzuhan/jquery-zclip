jquery.zclip1x.js 基于 zeroclipboard v1.x 支持到IE6和其他浏览器  
jquery.zclip2x.js 基于 zeroclipboard v2.x 支持IE9+和其他浏览器  

鉴于国内的浏览器环境，还是推荐选择 jquery.zclip1x.js.

# 安装

依赖于zeroclipboard 1.3.5版本(最稳定，无bug)

```
<script src="zeroclipboard.135.js"></script>
<script src="jquery.zclip1x.js"></script>
```

# 使用

```
$copy = $('#copy-btn').zclip({
    beforeCopy: function () {
        // beforeCopy
    },
    copy: function () {
        console.log(this); // #copy-btn
        return '要复制的内容';
    },
    afterCopy: function () {

        console.log('after Copy');
    }
});

```


# 注

- 鼠标显示的是跟flash的交互(作用是要跟flash进行交互的，不能被别人给挡了)，在zeroclipboard创建的html桥和object上加`cursor:pointer`不生效。zeroclipboard是通过js调用flash，flash来显示一个pointer。

# 参考

- [zeroclipboard1.x的文档](https://github.com/zeroclipboard/zeroclipboard/blob/1.x-master/docs/instructions.md)
- [jquery.zclip.js 原作](https://github.com/patricklodder/jquery-zclip/blob/master/jquery.zclip.js)



