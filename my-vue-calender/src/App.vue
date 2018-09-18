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
					<td><button>按钮</button>
						<my-calender :options="options"></my-calender>
					</td>
					<td><button>按钮1</button>
						<my-calender :options="options"></my-calender></button>
					</td>
					<td><button>按钮2</button>
					</td>
					<td><button>按钮3
					</button>
					<my-calender :options="options"></my-calender>
					</td>
				</tr>

			</tbody>
		</table>
		<my-calender :options="options"></my-calender>
	</div>
</template>

<script>
	import myCalender from './components/calender/my-calender'
	export default {
		name: 'app',
		data: function() {
			return {
				options: {
					dateType: 'day',
					compareTime: ['2018-07-01', '2018-01-01', '2018-04-01', '2018-07-09'],
					events:this.pickDate//可以自定义为函数(直接调用方法this.pickDate)
				},
				
			}
		},
		computed: {
			
		},
		components: {
			myCalender
		},
		mounted() {
//			this.$store.commit('newCurNow', new Date('2018-04-01'))
//			this.$store.commit('newInitNow', new Date('2018-04-01'))
//			this.$store.commit('newInittype', false)
		},
		methods: {
			pickDate: function() {
				//调接口
				var params = {
					type: 2,
					timestart: new Date(),
					themeid: 12
				}
				console.log(params)
				alert(document.documentElement.clientWidth)
				alert(document.getElementsByClassName('vue-calendar-picker')[0].offsetWidth)
			},
		}
	}
</script>
<style>
@import url("./common/mobile.css");
	.finished {
		text-decoration: underline;
	}
	
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}
	
	.table-common {
		width: 100%;
		height: 200px;
	}
	
	.table-common tr {
		height: 25%;
	}
</style>