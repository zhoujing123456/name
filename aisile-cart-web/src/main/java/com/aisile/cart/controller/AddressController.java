package com.aisile.cart.controller;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aisile.cart.service.AddressService;
import com.aisile.pojo.TbAddress;
import com.aisile.pojo.entity.Resoult;
import com.alibaba.dubbo.config.annotation.Reference;

@RestController
@RequestMapping("/address")
public class AddressController {

	@Reference
	AddressService addressService;
	
	@RequestMapping("/findListByLoginUser")
	public List<TbAddress> findListByLoginUser(){
		String userId = SecurityContextHolder.getContext().getAuthentication().getName();
		return addressService.findListByUserId(userId);
	}
	
	@RequestMapping("/delId")
	public Resoult delId(Long id){
		try {
			addressService.delId(id);
			return new Resoult(true,"删除成功");
		} catch (Exception e) {
			// TODO: handle exception
		}
		return new Resoult(false, "删除失败");
	}
	
	@RequestMapping("/add")
	public Resoult add(@RequestBody TbAddress address){
		String name = SecurityContextHolder.getContext().getAuthentication().getName();
		address.setUserId(name);
		try {
			addressService.add(address);
			return new Resoult(true,"添加成功");
		} catch (Exception e) {
			// TODO: handle exception
		}
		return new Resoult(false, "添加失败");
	}
	@RequestMapping("/update")
	public Resoult update(@RequestBody TbAddress address){
		String name = SecurityContextHolder.getContext().getAuthentication().getName();
		address.setUserId(name);
		try {
			addressService.update(address);
			return new Resoult(true,"修改成功");
		} catch (Exception e) {
			// TODO: handle exception
		}
		return new Resoult(false, "修改失败");
	}
	
	@RequestMapping("/findOne")
	public TbAddress findOne(Long id){
		return addressService.findOne(id);
	}
}