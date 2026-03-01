package com.smartmall.user.controller;

import com.smartmall.common.entity.Order;
import com.smartmall.common.entity.OrderItem;
import com.smartmall.common.result.Result;
import com.smartmall.common.utils.JwtUtils;
import com.smartmall.user.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /** 结算下单 */
    @PostMapping("/checkout")
    public Result<Order> checkout(@RequestHeader(value = "Authorization") String authHeader,
                                  @RequestBody Map<String, List<Long>> body) {
        Long userId = extractUserId(authHeader);
        List<Long> cartItemIds = body.get("cartItemIds");
        Order order = orderService.checkout(userId, cartItemIds);
        return Result.success(order);
    }

    /** 查询用户订单列表 */
    @GetMapping("/list")
    public Result<List<Order>> getUserOrders(@RequestHeader(value = "Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        List<Order> orders = orderService.getUserOrders(userId);
        return Result.success(orders);
    }

    /** 查询订单明细 */
    @GetMapping("/{orderId}/items")
    public Result<List<OrderItem>> getOrderItems(@PathVariable("orderId") Long orderId) {
        List<OrderItem> items = orderService.getOrderItems(orderId);
        return Result.success(items);
    }

    private Long extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return JwtUtils.getUserId(token);
    }
}
