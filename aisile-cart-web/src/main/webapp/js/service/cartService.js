//购物车服务层
app.service('cartService',function($http){
	    	
	//购物车列表
	this.findCartList=function(){
		return $http.get('cart/findCartList.do');		
	}
	//添加商品到购物车
	this.addGoodsToCartList=function(itemId,num){
		return $http.get('cart/addGoodsToCartList.do?itemId='+itemId+'&num='+num);
	}
	//获取当前登录用户
	this.getLoginName=function(){
		return $http.get('cart/getLoginName.do');
	}
	//求合计
	this.sum=function(cartList){		
		var totalValue={totalNum:0, totalMoney:0.00 };//合计实体
		for(var i=0;i<cartList.length;i++){
			var cart=cartList[i];
			for(var j=0;j<cart.orderItemList.length;j++){
				var orderItem=cart.orderItemList[j];//购物车明细
				totalValue.totalNum+=orderItem.num;
				totalValue.totalMoney+= orderItem.totalFee;
			}				
		}
		return totalValue;
	}

	//获取地址列表
	this.findAddressList=function(){
		return $http.get('address/findListByLoginUser.do');	
	}
	//删除地址
	this.delId=function(id){
		return $http.get('address/delId.do?id='+id);	
	}
	//查询一个对象
	this.findOne=function(id){
		return $http.get('address/findOne.do?id='+id);	
	}
	//添加
	this.add=function(entity){
		return $http.post('address/add.do',entity);	
	}
	//修改
	this.update=function(entity){
		return $http.post('address/update.do',entity);	
	}
	
	//保存订单
	this.submitOrder=function(order){
		return $http.post('order/add.do',order);		
	}


	
});
