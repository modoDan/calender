# my-first-vue-calender
> this is my very first vue calender

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8088
npm run dev

#usege
//main.js函数全局引用日历组件
import myCalender from './components/calender/index.js'
Vue.use(myCalender);

<my-calender :options="options"></my-calender>
#参数说明
options: {
		dateType: 'day',
		compareTime: ['2018-10-01', '2018-09-01', '2018-08-21', '2018-07-09'],
		events:this.pickDate,//可以自定义为函数(直接调用方法this.pickDate)
		text:'',//为空时表示只弹出日历框，不显示input框
		styles:'tipClass'//类名className，直接在外面定义即可
},
dateType：//日历类型为day,week,month,quarter,year五种，
					//周以每周一开始（如2018-09-24表示为这一周），月以每月1号开始（如06-01表示6月份），季度以当前季度第一月1号（如04-01表示二季度），年以每年的一月一号开始（如2018-01-01表示2018年）
 compareTime：//比较时间要与日历类型定义的时间对应（如2018-07-01在月历中表示7月，季历中表示第三季度，年历中则不对应2018年，所以要先处理一下时间格式）
        
# build for production with minification
npm run buildFor a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
=======
npm run build

```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
