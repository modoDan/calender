<template>
	<div class="">
		<div class="ats-tree" ref="atsTree">
			<div class="ats-input" @mouseenter="hovering=true" @mouseleave="hovering=false">
				<div class="ats-input-multiple el-input__inner" v-if="this.multiple">
					<div class="ats-labels">
						<input ref="multipleInput" type="text" :placeholder="placetext" v-model="treeSelected" :treeinput="treeinput" @input="handleFilter" @blur="handleAutoComplete">
						<i class="el-icon-search"></i>
					</div>
				</div>
			</div>
			<el-scrollbar class="ats-tree-scrollbar" ref="treeScrollbar">
				<div class="ats-tree-wrapper">
					<ul class="ats-tree-nodes">
						<tree-node v-for="(child,index) in treeNodes[treeProps.children]" :node="child" :key="index" :multiple="multiple" :currentNodeId="currentNodeId" :treeProps="treeProps" :eventHub="eventHub" :query="query" :isQuering="isQuering">
						</tree-node>
					</ul>
				</div>
			</el-scrollbar>
		</div>

		<div class="ats-tag-scrollbar">
			<div class="el-select__nums">
				<p>已选择<span>&nbsp;{{checkedItems.length}}&nbsp;</span>位用户
					<b class="mark02">{{userNumsg}}</b>
				</p>

			</div>
			<div class="el-select__tags">
				<el-tag v-for="(item,index) in checkedItems" :key="index" :closable="true" type="primary" class="el-tag--primary" @close="handleDelItem(item,$event)" :title="handleTitleVisible(item[treeProps.label])">
					{{item[treeProps.label] | showEllips}}
					<!--
                    </li></ul>
               </div> -->
				</el-tag>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue';
	import {
		Tag,
		Scrollbar
	} from 'element-ui';
	import treeNode from "../tree-select/tree-node.vue";
	import debounce from "throttle-debounce/throttle"
	import {
		objArrDeepCopy
	} from "../utils/tools"
	import {
		parent
	} from '../utils/extend'
	Vue.component(Scrollbar.name, Scrollbar);
	Vue.component(Tag.name, Tag);

	export default {
		name: 'tree-select',
		components: {
			treeNode,
		},
		props: {
			treeData: {
				type: Array,
				default: []
			},
			treeProps: {
				type: Object,
				default: {
					label: 'label',
					children: 'children'
				}
			},
			placeholder: {
				type: String,
				default: '请选择'
			},
			userNumsg: {
				type: String,
				default: ''
			},
			treeinput: {
				type: Boolean,
				default: false
			},
			multiple: {
				type: Boolean
			}
		},
		created() {
			this.eventHub.$on('node-click', this.handleNodeClick);
		},
		updated() {
			this.isDefault = true;

		},
		computed: {
			checkedItems: function() {
				//   console.log('返回值',this.getcheckedUsers(this.treeNodes));
				return this.getcheckedUsers(this.treeNodes);
			},

		},
		watch: {
			//侦听父组件传treeinput值变化重新初始化搜索条件
			treeinput(val) {
				this.treeSelected = '';
				this.isQuering = false;
				console.log("观察变化", this.isQuering)
			},
			//侦听treeData值变化，当点击编辑时初始选中值变化设置treeData中对应id为checked状态，再次进入弹框后，需更新该treeData值，深拷贝成一个对象树
			treeData(val) {
				//    console.log('左侧的树this.treeData')
				if(val) {
					this.treeNodes = {
						[this.treeProps.children]: objArrDeepCopy(val, {
							visible: true
						}),
						visible: true
					};
				}
			},
			checkedKeys(val) {
				if(val.length) {
					this.placetext = '';
				} else {
					this.placetext = this.placeholder;
				}
				if(this.multiple) {
					setTimeout(function() {
						this.resetTreeTop();
					}.bind(this), 400)
					if(!this.isDefault) {
						this.setInputFocus();
					}
				}
			}
		},
		data() {
			return {
				treeNodes: {
					[this.treeProps.children]: objArrDeepCopy(this.treeData, {
						visible: true
					}),
					visible: true
				},
				placetext: this.placeholder,
				currentNodeId: '',
				currentSelected: '',
				treeSelected: '',
				eventHub: new Vue(),
				isQuering: false,
				query: '',
				checkedKeys: [],
				isDefault: true,
				error: {
					message: '',
					data: ''
				},
				hovering: false,
			}
		},
		methods: {
			//递归左侧树中是true的 push到数组绑定到右侧选中组
			getcheckedUsers(node) {
				let self = this;
				let childNodes = node[self.treeProps.children];
				var checkedUserList = [];
				if(Array.isArray(childNodes)) {
					childNodes.forEach(item => {
						if(item.nodetype == 2 && item.checked == true) {
							checkedUserList.push({
								id: item.id,
								name: item.name
							})
						}
						if(Array.isArray(item.childDepts)) {
							checkedUserList = checkedUserList.concat(this.getcheckedUsers(item))
							return checkedUserList
						}
					})
					return checkedUserList
				}
			},
			//点击左侧树的某一节点时，只触发改变改节点左侧的checked状态true和false
			handleNodeClick(node, event) {
				if(event) {
					this.isDefault = false;
				}
				if(node.checked) {
					this.$set(node, 'checked', false);
				} else {
					this.$set(node, 'checked', true);
				}
				if(node.nodetype == 1) {
					this.handleAllNode(node)
				}
				this.cancleAllNode(node, this.treeNodes)
				this.$emit('setSelectedId', this.checkedItems);
			},
			cancleAllNode(node, treeNodes) { //点击子节点，取消选中父节点
				let self = this;
				let parentNodes = false;
				let childNodes = treeNodes[self.treeProps.children];
				var find_parent = function(data) {
					if(Array.isArray(data)) {
						for(let i = 0; i < data.length; i++) {
							if(data[i].id == node.pid) {
								parentNodes = data[i]
								let ischecked = parentNodes.childDepts.every(item => item.checked)
								self.$set(parentNodes, 'checked', ischecked);
								return;
							} else if(data[i].childDepts) {
								find_parent(data[i].childDepts);
							}
						}
					}
				}
				find_parent(childNodes)
				if(node.deptLevel != 1) {//到根节点不执行
					this.cancleAllNode(parentNodes, treeNodes)
				}
			},
			/*cancleAllNode(pthis) { //点击子节点，取消选中父节点
				let self = this;
				let pnode = pthis.node
				let childNodes = pnode[self.treeProps.children];
				let ischecked = childNodes.every(item => item.checked)
				self.$set(childNodes, 'checked', ischecked);
				if(pnode.deptLevel == 1) {
					//根节点不执行
				}else{
					this.cancleAllNode(pthis.$parent)
				}
			},*/
			handleAllNode(node) { //点击父节点，选中所有子节点
				let self = this;
				let childNodes = node[self.treeProps.children];
				if(Array.isArray(childNodes)) {
					childNodes.forEach(item => {
						if(node.checked) {
							this.$set(item, 'checked', true);
						} else {
							this.$set(item, 'checked', false);
						}
						if(Array.isArray(item.childDepts)) {
							this.handleAllNode(item)
						}
					})
				}
			},
			handleFilter: debounce(1000, function() {
				this.isQuering = true;
				if(this.isQuering) {
					this.query = this.treeSelected;
					this.treeFilterMethod(this.treeNodes);
				}
			}),
			treeFilterMethod(node) {
				let self = this;
				let childNodes = node[self.treeProps.children];
				// 循环树中所有是否包含搜索的name，包含则把child改成可见，否则为false
				if(Array.isArray(childNodes)) {
					childNodes.forEach((child) => {
							child.visible = child[self.treeProps.label].toLowerCase().indexOf(self.query.toLowerCase()) > -1;
							self.treeFilterMethod(child);
						})
						//判断节点为false且包含子节点时，循环子节点中的child为true的，则将其他外部节点置为false
					if(!node.visible && childNodes.length) {
						let allHidden = true;
						childNodes.forEach((child) => {
							if(child.visible) allHidden = false;
						});
						node.visible = allHidden === false;
					}
					//node.visible根据当前为true则展开当前节点，来显示数据, 所有节点均为展开的，当为部门时，则不展示部门
					// if (node.visible){
					if(self.query !== '') {
						if(node.nodetype == 1) {
							this.$set(node, 'visible', false);
						}
						this.isQuering = true;
						this.$set(node, 'expanded', true);
					} else {
						this.isQuering = false;
						this.$set(node, 'expanded', false);
					}
					// }
				}
			},
			handleAutoComplete() {
				setTimeout(function() {
					this.query = '';
					if(this.currentNodeId) {
						this.treeSelected = this.currentSelected;
					}
				}.bind(this), 250)
			},
			handleDelItem(item, event) {
				if(event) {
					this.isDefault = false;
				}
				let self = this;
				let treeNodes = this.treeNodes;
				self.CancelTreeItem(item.id, treeNodes);
				this.$emit('setSelectedId', this.checkedItems);
			},
			//点击选中人员的关闭按钮时，遍历左侧树结构 模拟操作左侧树中该id值
			CancelTreeItem(id, treeNodes) {
				let self = this;
				let childNodes = treeNodes[self.treeProps.children];
				if(Array.isArray(childNodes)) {
					for(let i = 0; i < childNodes.length; i++) {
						if(childNodes[i].id == id) {
							self.handleNodeClick(childNodes[i]);
							break;
						} else {
							self.CancelTreeItem(id, childNodes[i]);
						}
					}
				}
			},
			resetTreeTop() {
				// console.log("111111");
				this.$nextTick(function() {
					let inputMultiple = this.$refs.atsTree.querySelector(".ats-input-multiple");
					let treeScrollbar = this.$refs.atsTree.querySelector(".ats-tree-scrollbar");
					let inputMultipleHeight = inputMultiple.offsetHeight;

					treeScrollbar.style.top = (inputMultipleHeight + 5) + "px";

				})
			},
			setInputFocus() {
				let multipleInput = this.$refs.multipleInput;

				multipleInput.focus();
			},
			handleTitleVisible(str) {
				if(!str) return '';
				let tempLen = 0;

				for(let i = 0; i < str.length; i++) {
					if(str.charCodeAt(i) > 255) {
						tempLen += 2;
					} else {
						tempLen += 1;
					}
				}
				if(tempLen >= 8) {
					return str;
				} else {
					return '';
				}
			}
		},
		filters: {
			// 截取前18个字节
			showEllips(str) {
				if(!str) return '';
				let tempLen = 0;

				for(let i = 0; i < str.length; i++) {
					if(str.charCodeAt(i) > 255) {
						tempLen += 2;
					} else {
						tempLen += 1;
					}
					if(tempLen >= 8) {
						str = str.substring(0, i) + "...";
						break;
					}
				}
				return str;
			}
		},
	}
</script>

<style lang="scss">
	.ats-tree{
        display: inline-block;
        position:relative;
        .ats-input{
            position: relative;
            .el-icon-caret-bottom{
                cursor: pointer;
                &.is-reverse{
                    transform: rotateZ(180deg);
                }
            }
        }
        .el-input__inner{
            width: 360px;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-color: #fff;
            background-image: none;
            border-radius: 4px;
            border: 1px solid #cacaca;
            box-sizing: border-box;
            color: rgb(31, 46, 61);
            display: block;
            font-size: inherit;
            height: 36px;
            line-height: 1;
            outline: 0;
            padding: 3px 10px;
            transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        }
        .ats-input-multiple{
            height:auto;
        }
        .ats-input-multiple input{
            line-height:1;
            height:28px;
            box-sizing:border-box;
            outline: none;
            border: 0px;
            position: relative;
            right: 35px;
            left:0;
            width:320px;
        }
        .ats-input-multiple .ats-labels{
            position: relative;
           i.el-icon-search {
               position: absolute;
                right: 16px;
                top: -3px;
                border-left: 1px solid #cacaca;
                height: 70px;
            }
            .el-icon-search:before {
               content: "\E619";
                font-size: 21px;
                 right: -23px;
                color: #707070;
                top: 4px;
                position: absolute;
            }
        }

        .ats-input-multiple {
            position:relative;
            height:50px;
            top: 10px;
            transform: none;
            width: 300px;
            &:hover{
                cursor:pointer;
            }
        }
        .ats-input-multiple
        {
            max-width: 299px;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: top;
        }
        .ats-input-multiple input:focus{
            outline:none;
        }
        .ats-tree-scrollbar{
            top: 40px;
            width: 297px;
            min-height: 300px;
            position: absolute;
            z-index: 1001;
            background: #fff;
            border: 1px solid #cacaca;
            .el-scrollbar__view{
                height: 500px;
            }
            transition:all 0.1s linear;
        }
        .ats-tree-wrapper{
            background-color: #fff;
        }
    }
    .ats-tag-scrollbar{
          right: 25px;
          position: absolute;
            top:50px;
          color:#0a6cc0;
          width: 291px;
          height: 500px;
    }
    .el-select__tags{
          line-height: normal;
          white-space: normal;
          display: inline;
          align-items: left;
          z-index: 1;
          top: 48%;
          border: 1px solid #cacaca;
          color:#0a6cc0;
          width: 300px;
          height: 500px;
          overflow-y: auto;
          transform: translateY(-50%);
        span.el-tag.el-tag--primary.el-tag--primary{
            margin: 5px;
            font-weight: 550;
        }
        .el-tag {
          background-color: #f4faff;
          border: 1px solid #d6ecff;
          color: #0a6cc0;
          height: 35px;
          line-height: 30px;
          font-size: 14px;
        }
    }
    .el-select__nums{
          position: absolute;
          height: 50px;
          line-height: 28px;
          z-index: 1;
          top: -3%;
          border: 1px solid #cacaca;
          border-radius: 3px;
          border-bottom: none;
          color:#333;
          font-size: 13px;
          width: 300px;
          transform: translateY(-50%);
          p{
              span{
                   color:#0a6cc0;
                   font-weight: bold;
              }
          }
    }
</style>