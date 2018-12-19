var vm = new Vue({
	el: "#cart",
	data: {
		title: "hello vue",
		productList: [],
		totalMoney: 0,
		parts: {
			"partsId": "10001",
			"partsName": "打火机",
			"imgSrc": "img/part-1.jpg"
		}
	},
	// 定义过滤方法
	filters: {
		changeNumber:function(value){
			return value.toFixed(2);
		}
	},
	computed:{
		changeNum:function(item){
			return item.productQuantity.toFixed(2);
		}
	},
	mounted: function() {
		this.$nextTick(function() {
				//保证this.$el已经插入文档
				vm.cartView();
			})
			//		this.cartView();
	}, //默认加载
	methods: {
		cartView: function() {
			//						this.title="Vue Hello";
			var _this = this;
			axios.get("./cart.json", {
				params: {
					author: "huangdan"
				}
			}).then(function(res) {
				_this.productList = res.data.result.list;
				_this.totalMoney = res.data.result.totalMoney;
			});
		},
		clickMe: function() {

		},
		select: function(item) {
				if(!item.checked) {
					Vue.set(item, "checked", true);
				} else {
					item.checked = !item.checked;
				}
				item.productQuantity++;
			}
			/*,
					selectAll: function(flag) {
						var _this = this;
						this.productList.forEach(function(item, index) {
							if(!item.checked) {
								Vue.set(item, "checked", _this.flag);
							} else {
								item.checked = _this.flag;
							}
						})
					}*/
	}
});