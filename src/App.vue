<template>
	<div id="app">
		<table class="table-common" ref="retTable">
			<thead>
				<th>标题一</th>
				<th>标题二</th>
				<th>标题三</th>
				<th>标题四</th>
			</thead>
			<tbody>
				<tr>
					<h3>1、列表形式引入多个日历</h3>
				</tr>
				<tr>
					<!-- 日历定位 -->
					<td><button @click="openDate($event)">点击定位1</button>
					</td>
					<td><button @click="openDate($event)">点击定位2</button>
					</td>
					<td><button @click="openDate($event)">点击定位3</button>
					</td>
					<td><button @click="openDate($event)">点击定位4</button>
					</td>
				</tr>
				<tr>
					<h3>2、单独引用一个日历</h3>
				</tr>
				<tr>
					<td>周历
					</td>
					<td>月历
					</td>
					<td>季历
					</td>
					<td>年历
					</td>
				</tr>
				<tr>
					<td>
						<my-calender :options="options1"></my-calender>
					</td>
					<td>
						<my-calender :options="options2"></my-calender>
					</td>
					<td>
						<my-calender :options="options3"></my-calender>
					</td>
					<td>
						<my-calender :options="options4"></my-calender>
					</td>
				</tr>
			</tbody>
		</table>
		<my-calender :options="options" ref="poscalender"></my-calender>
	</div>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {
				options: {
					dateType: 'day',//日历类型为day,week,month,quarter,year五种，
					//周以每周一开始（如2018-09-24表示为这一周），月以每月1号开始（如06-01表示6月份），季度以当前季度第一月1号（如04-01表示二季度），年以每年的一月一号开始（如2018-01-01表示2018年）
					compareTime: ['2018-10-01', '2018-09-01', '2018-08-21', '2018-07-09'],
					//比较时间要与日历类型定义的时间对应（如2018-07-01在月历中表示7月，季历中表示第三季度，年历中则不对应2018年，所以要先处理一下时间格式）
					events:this.pickDate,//可以自定义为函数(直接调用方法this.pickDate)
					text:'',//为空时表示只弹出日历框，不显示input框
					styles:'tipClass'//类名className，直接在外面定义即可
				},
				options1: {
					dateType: 'week',
					compareTime: ['2018-07-01', '2018-01-01', '2018-04-01', '2018-07-09'],
					events:this.pickDate,
					text:'input',
					styles:'tipClass'
				},
				options2: {
					dateType: 'month',
					compareTime: ['2018-07-08', '2018-10-01'],
					events:this.pickDate,
					text:'input',
					styles:'tipClass'
				},
				options3: {
					dateType: 'quarter',
					compareTime: ['2018-07-01','2018-04-01', '2018-07-09'],
					events:this.pickDate,
					text:'input',
					styles:'tipClass'
				},
				options4: {
					dateType: 'year',
					compareTime: ['2016-01-01', '2018-01-01', '2018-04-01'],
					events:this.pickDate,
					text:'input',
					styles:'tipClass'
				},
			}
		},
		mounted() {
		},
		methods: {
			pickDate: function(result) {
                //可以做任何事
				alert('您好呀!自定义事件'+'--'+result)
			},
			openDate: function(e) {
				//调用组件内方法
				this.$refs.poscalender.openDate(e)
			},
		}
	}
</script>
<style>
@import url("./common/mobile.css");
	.finished {
		text-decoration: underline;
	}
	html,body{
		height: 100%;
	}

	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
		height: 100%;
		text-align: center;
	}
	
	.table-common {
		width: 100%;
		height: 200px;
		position: relative;
	}
	
	.table-common tr {
		height: 25%;
	}
	.tipClass:after {
		content: '√';
		color: red;
		font-size: 14px;
		font-weight: bold;
	}
</style>