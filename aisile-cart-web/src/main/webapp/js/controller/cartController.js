//购物车控制层 
app.controller('cartController' ,function($scope,$controller,cartService){	
	$controller('baseController',{$scope:$scope});//继承
	
	
	$scope.order={paymentType:'1'};	
	//选择支付方式
		$scope.selectPayType=function(type){
			$scope.order.paymentType= type;
		}

	$scope.getUserName=function(){
		cartService.getLoginName().then(
		    function(a){
		    	console.log(a)

		    		$scope.userName=a;
		    	//设置默认地址
				for(var i=0;i< $scope.addressList.length;i++){
					if($scope.addressList[i].isDefault=='1'){
						$scope.address=$scope.addressList[i];
						break;
					}					
				}				

		    }		
		 )
	}
	//查询购物车列表
	$scope.findCartList=function(){
		cartService.findCartList().success(
			function(a){
				//console.log(a)
				$scope.cartList=a;
				$scope.totalValue=cartService.sum($scope.cartList);//求合计数
			}
		)};	
	
		$scope.deleteToCartList=function(itemId,num){
			  var r=confirm("确认要删除!");
			  if(r){
				  cartService.addGoodsToCartList(itemId,num).success(
							function(a){
								//console.log(a)
								if(a.flag){
									$scope.findCartList();//刷新列表
								}else{
									alert(a.message);//弹出错误提示
								}				
							}
						);
			  }
		}
		//添加商品到购物车
		/*$scope.addGoodsToCartList=function(itemId,num,id){
			var a=parseInt(num);
			var num1=$(".itxt").val();
			if(num=='-1'&&id==1){
				$scope.status=true;
				alert("商品至少留一个");
			}else{
				$scope.status=false;
				cartService.addGoodsToCartList(itemId,num).success(
						function(a){
							//console.log(a)
							if(a.flag){
								$scope.findCartList();//刷新列表
							}else{
								alert(a.message);//弹出错误提示
							}				
						}
					);
			}
			
		}*/
		
		//添加商品到购物车
		$scope.addGoodsToCartList=function(itemId,num,id){
			if(id==1){
				alert("至少给我留一个啊");
				return 1;
			}else{
				if(num<-1){
					if(confirm("确认删除吗？")){
						cartService.addGoodsToCartList(itemId,num).success(
							function(a){
								if(a.flag){
									$scope.findCartList();//刷新列表
								}else{
									alert(a.magess);//弹出错误提示
								}			
							}
						);
					}
				}else if(num==-1 && id==0){
					if(confirm("确认删除吗？")){
						cartService.addGoodsToCartList(itemId,num).success(
							function(a){
								if(a.flag){
									$scope.findCartList();//刷新列表
								}else{
									alert(a.magess);//弹出错误提示
								}			
							}
						);
					}
				}else{
					cartService.addGoodsToCartList(itemId,num).success(
						function(a){
							if(a.flag){
								$scope.findCartList();//刷新列表
							}else{
								alert(a.message);//弹出错误提示
							}			
						}
					);
				}
			}
		}

		
		//获取地址列表
		$scope.findAddressList=function(){
			cartService.findAddressList().success(
				function(a){
					console.log(a)
					$scope.addressList=a;
				}		
			);		
		}
		
		//选择地址
		$scope.selectAddress=function(address){
			$scope.address=address;		
		}
		
		//判断是否是当前选中的地址
		$scope.isSelectedAddress=function(address){
			if(address==$scope.address){
				return true;
			}else{
				return false;
			}		
		}
		
		//删除收货地址
		$scope.delId=function(id){
			if(confirm("是否删除地址？")){
				cartService.delId(id).then(
						   function(a){
							   if(a.data.flag){
								   alert("删除成功");
								   $scope.findCartList();
							   }
						   }		
						 )
			}
			
			
		}
       //根据id回现一个对象
		$scope.findOne=function(id){
			cartService.findOne(id).then(
			    function(a){
			    	console.log(a);
			    	$scope.entity=a.data;
			    }		
			)
		}
		$scope.entity={alias:''}
		//封装到entity中
		$scope.toAlias=function(alias){
			$scope.entity.alias=alias;
		}
		
		//添加或者修改
		$scope.save=function(){
			var and="";
			if($scope.entity.id==null){
				and=cartService.add($scope.entity);
			}else{
				and=cartService.update($scope.entity);
			}
			
			and.then(
				function(a){
					console.log(a);
					if(a.data.flag){
						alert(a.data.magess);
						$scope.findCartList();//刷新列表
					}else{
						alert("失败");
					}
				}	
			  )
		}
		
		
		//保存订单
		$scope.submitOrder=function(){
			$scope.order.receiverAreaName=$scope.address.address;//地址
			$scope.order.receiverMobile=$scope.address.mobile;//手机
			$scope.order.receiver=$scope.address.contact;//联系人
			cartService.submitOrder($scope.order).success(
				function(a){
					if(a.success){
						//页面跳转
						if($scope.order.paymentType=='1'){//如果是微信支付，跳转到支付页面
							location.href="pay.html";
						}else{//如果货到付款，跳转到提示页面
							location.href="paysuccess.html";
						}					
					}else{
						alert(a.message);	//也可以跳转到提示页面				
					}				
				}				
			);		
		}

		

});	
