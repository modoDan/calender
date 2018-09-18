<template>
	<div class="date-picker__time-header" ref="datePicker">
		<div class="date-event active">
			<input type="text" v-if="!options.events" class="calender-input" v-model="dateText" @click="openDate">
			<button class="calender-see" v-else @click="openDate"></button>
		</div>
		<div class="date-pos" ref="datePos" v-clickoutside="() => showMenu = false">
			<template v-if="showMenu">
				<full-date :dateType="options.dateType" :events="options.events" :compareTime="options.compareTime"></full-date>
			</template>
		</div>
	</div>
</template>

<script>
	import Clickoutside from 'element-ui/src/utils/clickoutside';
	import fullDate from './fullDate'
	import moment from 'moment'
	export default {
		name: 'my-calender',
		data: function() {
			return {
				showMenu: false,
			}
		},
		props: {
			'options': {
				type: Object,
				default: {
					dateType: 'day',
					events: '',
					compareTime: []
				}
			},
		},
		directives: {
			Clickoutside
		},
		computed: {
			curNow() {
				return this.$store.state.curNow
			},
			dateText() {
				let valueMoment = this.curNow
				if(this.options.dateType == 'year') { //年
					return moment(valueMoment).format('YYYY年')
				} else if(this.options.dateType == 'month') { //月份
					return moment(valueMoment).format('YYYY年M月')
				} else if(this.options.dateType == 'day') { //天
					return moment(valueMoment).format('YYYY年M月D日')
				} else if(this.options.dateType == 'quarter') { //季度
					return moment(valueMoment).format('YYYY年第Q季度')
				} else if(this.options.dateType == 'week') { //周
					var s_week = moment(this.getRangeWeek[0]).format('M月D日')
					var e_week = moment(this.getRangeWeek[1]).format('M月D日')
					return s_week + '-' + e_week;
				}
			},
			getRangeWeek() {
				var startStop = []
				var currentDate = this.curNow;
				var week = moment(currentDate).format('E');
				var minusDay = week != 0 ? week - 1 : 6;
				var monday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - minusDay);
				var sunday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (6 - minusDay));
				startStop.push(monday); //本周起始时间
				startStop.push(sunday); //本周终止时间
				return startStop;
			},
		},
		components: {
			fullDate
		},
		mounted() {
		},
		methods: {
			openDate: function(e) {
				this.showMenu = true
				var tableWidth = this.$refs.datePicker.offsetWidth;
				var datePos = this.$refs.datePos;
				console.log(tableWidth - e.clientX)
//				datePos.style.right = (tableWidth - e.clientX) + 'px'; // 指定创建的DIV在文档中距离左侧的位置
				datePos.style.top = e.clientY + 'px'; // 指定创建的DIV在文档中距离顶部的位置
				datePos.style.position = 'absolute'; // 为新创建的DIV指定绝对定位
				//重置日历组件数据
				if(this.options.events) {
					this.$store.commit('newCurNow', new Date())
					this.$store.commit('newInitNow', new Date())
					this.$store.commit('newInittype', false)
				}
			}
		}
	}
</script>
<style>
	.calender-input {
		background: #ececec;
		text-indent: 30px;
		height: 20px;
		max-width: 150px;
		border-radius: 10px;
		outline: none;
		border: none;
	}
	
	.calender-see {
		display: inline-block;
		width: 30px;
		height: 28px;
		margin: 0 7px;
		cursor: pointer;
		border-radius: 2px;
		background: #ececec;
		outline: none;
		border: none;
	}
</style>