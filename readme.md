### jQuery.retract

![效果图](result.jpg)

效果还是不赖吧 >_>

> 下面是一些配置参数能简单改变排版

* `x`: 对于每个排版的margin-right，`默认5px`;
* `y`: 对于每个排版的margin-bottom，`默认5px`;
* `target`: 相对于选择器的目标元素，`默认>*`;
* `widthOffset`: 随机宽度偏移量，值越大每个项目的最大最小宽度差值越大，`默认50`（PS：过大或负数可能会造成crush）;
* `horizontalSize`: 每行的列数，`默认4`;
* `autoFullColumns`: 最后一行如果个数不满`horizontalSize`配置的个数，是否自动填充宽度，`默认false`;
* `substractPx`: 在某些视网膜屏上，因为宽度的计算丢失精度导致每行项目的最后一个掉到下一行，造成crush，所以这个参数是在原来的基础上修复这个问题，一般情况不会用到这个配置项，`默认1px`;

***
`horizontalSize`为5的预览效果
![效果图](result2.jpg)
***
`autoFullColumns`为true的预览效果
![效果图](result3.jpg)
`x、y`为1的预览效果
![效果图](result4.jpg)