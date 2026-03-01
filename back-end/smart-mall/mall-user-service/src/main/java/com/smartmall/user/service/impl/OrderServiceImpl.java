package com.smartmall.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.smartmall.common.entity.CartItem;
import com.smartmall.common.entity.Order;
import com.smartmall.common.entity.OrderItem;
import com.smartmall.common.exception.BusinessException;
import com.smartmall.user.mapper.CartItemMapper;
import com.smartmall.user.mapper.OrderItemMapper;
import com.smartmall.user.mapper.OrderMapper;
import com.smartmall.user.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final CartItemMapper cartItemMapper;

    @Override
    @Transactional
    public Order checkout(Long userId, List<Long> cartItemIds) {
        // 1. 查询购物车中选中的商品
        List<CartItem> cartItems = cartItemMapper.selectBatchIds(cartItemIds);
        if (cartItems.isEmpty()) {
            throw new BusinessException("购物车中没有选中的商品");
        }

        // 2. 计算总价
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            totalPrice = totalPrice.add(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // 3. 创建订单
        Order order = new Order();
        order.setUserId(userId);
        order.setTotalPrice(totalPrice);
        order.setStatus("COMPLETED");
        order.setCreateTime(LocalDateTime.now());
        orderMapper.insert(order);

        // 4. 创建订单明细
        for (CartItem item : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(order.getId());
            orderItem.setProductId(0L); // cart doesn't store productId
            orderItem.setProductName(item.getProductName());
            orderItem.setPrice(item.getPrice());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setImageUrl(item.getImageUrl());
            orderItemMapper.insert(orderItem);
        }

        // 5. 删除已结算的购物车商品
        cartItemMapper.deleteBatchIds(cartItemIds);

        return order;
    }

    @Override
    public List<Order> getUserOrders(Long userId) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Order::getUserId, userId)
               .orderByDesc(Order::getCreateTime);
        return orderMapper.selectList(wrapper);
    }

    @Override
    public List<OrderItem> getOrderItems(Long orderId) {
        LambdaQueryWrapper<OrderItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(OrderItem::getOrderId, orderId);
        return orderItemMapper.selectList(wrapper);
    }
}
