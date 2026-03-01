package com.smartmall.user.service;

import com.smartmall.common.entity.Order;
import com.smartmall.common.entity.OrderItem;

import java.util.List;
import java.util.Map;

public interface OrderService {

    /** 创建订单（从购物车结算） */
    Order checkout(Long userId, List<Long> cartItemIds);

    /** 查询用户订单列表 */
    List<Order> getUserOrders(Long userId);

    /** 查询订单明细 */
    List<OrderItem> getOrderItems(Long orderId);
}
