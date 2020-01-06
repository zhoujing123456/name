package com.aisile.cart.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aisile.cart.service.CartService;
import com.aisile.pojo.entity.Resoult;
import com.aisile.pojogroup.Cart;
import com.aisile04.common.utils.CookieUtil;
import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;

@RestController
@RequestMapping("/cart")
public class CartController {

	@Reference(timeout=60000)
	private CartService cartService;
	
	@Autowired
	private HttpServletRequest request;
	
	@Autowired
	private HttpServletResponse response;
	
	/**
	 * 购物车列表
	 * @param request
	 * @return
	 */
	@RequestMapping("/findCartList")
	public List<Cart> findCartList(){
		//得到登陆人账号,判断当前是否有人登陆      当用户未登陆时，username的值为anonymousUser 
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		
		//读取本地cookie中的数据
		//查询cookie中的购物车列表
		String cartListString = CookieUtil.getCookieValue(request, "cartList","UTF-8");
		if(cartListString==null || cartListString.equals("")){  //如果cookie中取出来的有购物车列表就是null的话说明没有购物车
			cartListString="[]";
		}
		//如果有购物车列表就直接取出来在页面进行操作
		List<Cart> cartList_cookie = JSON.parseArray(cartListString, Cart.class);
		if (username.equals("anonymousUser")) {  //如果未登录   直接给cookie中的数据
			
			return cartList_cookie;	
		}else{
			//如果有登录对象就根据对象名称到后台redis数据库中去取  
			List<Cart> cartList_redis = cartService.findCartListFromRedis(username); //如果里面有数据说明用户购物车中有商品
			if (cartList_redis.size()>0) { //如果本地存在购物车
				//合并购物车
				cartList_redis=cartService.mergeCartList(cartList_redis, cartList_cookie);	
				//清除本地cookie的数据
				CookieUtil.deleteCookie(request, response, "cartList");
				//将合并后的数据存入redis 
				cartService.saveCartListToRedis(username, cartList_redis); 

			}
			
			return cartList_redis;
		}
		
	}
	
	/**
	 * 添加商品到购物车
	 * @param request
	 * @param response
	 * @param itemId
	 * @param num
	 * @return
	 */
	@RequestMapping("/addGoodsToCartList")
	@CrossOrigin(origins="http://localhost:9105",allowCredentials="true")
	public Resoult addGoodsToCartList(Long itemId,Integer num){
		//response.setHeader("Access-Control-Allow-Origin", "http://localhost:9105");
		//response.setHeader("Access-Control-Allow-Credentials", "true");
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		System.out.println("当前登录用户："+username);
        try {
        	List<Cart> cartList  = findCartList();//首先获取购物车列表
    		cartList=cartService.addGoodsToCartList(cartList, itemId, num);
    		if (username.equals("anonymousUser")) { //如果未登录就把购物车数据放到我们的cookie中去
    			String jsonString = JSON.toJSONString(cartList);
        		CookieUtil.setCookie(request, response, "cartList", jsonString, 60*60*24*7,"UTF-8");
			}else{ //否则说明已经有用户登录了所以把我们的购物车列表放到我们的redis数据库中去
				cartService.saveCartListToRedis(username, cartList);
			}
    		
    		return new Resoult(true, "添加成功");
		} catch (Exception e) {
			// TODO: handle exception
		}
        return new Resoult(false, "添加失败");
	}
	@RequestMapping("/getLoginName")
	public String getLoginName(){
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		if (username.equals("anonymousUser")) {  //如果未登录   直接给cookie中的数据
			return null;	
		}
		return username;
	}

	
}
