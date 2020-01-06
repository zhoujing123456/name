package com.aisile.cart.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aisile.pojo.TbOrder;
import com.aisile.pojo.entity.Resoult;
import com.aisile.order.service.OrderService;
import com.alibaba.dubbo.config.annotation.Reference;

@RestController
@RequestMapping("/order")
public class OrderController {

	@Reference
    OrderService orderService;
	/**
	 * 增加
	 * @param order
	 * @return
	 */
	@RequestMapping("/add")
	public Resoult add(@RequestBody TbOrder order){
		//获取当前登录人账号
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		order.setUserId(username);
		order.setSourceType("2");//订单来源  PC
		try {
			orderService.add(order);
			return new Resoult(true, "增加成功");
		} catch (Exception e) {
			e.printStackTrace();
			return new Resoult(false, "增加失败");
		}
	}

}
