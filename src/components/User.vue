<template>
	<div id="user">
		<h1 v-text="username"></h1>S
	</div>
</template>

<script>
	export default {
		name:'user',
		data:function(){
			return {
				username:'modo'
			}
		},
	}
</script>
<style scoped>
	#user {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: red;
		margin-top: 60px;
	}
</style>