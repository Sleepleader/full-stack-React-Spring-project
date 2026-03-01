package com.smartmall.user.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.smartmall.common.entity.*;
import com.smartmall.common.exception.BusinessException;
import com.smartmall.common.result.Result;
import com.smartmall.user.mapper.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 管理员控制器
 * 路径前缀：/api/admin
 *
 * 【设计说明 — 为什么 t_order 和 t_order_item 是两张表？】
 * t_order 与 t_order_item 是经典的 一对多（One-to-Many）关系：
 * 一个订单（t_order）包含多件商品明细（t_order_item）。
 * 将它们分开存储是标准的关系型数据库范式设计（第三范式 3NF），好处包括：
 * 1. 避免数据冗余 — 订单头信息（用户、总价、状态）不需要在每行商品中重复
 * 2. 灵活查询 — 可单独查询订单列表，也可按需懒加载明细
 * 3. 数据一致性 — 更新订单状态只需修改一行，而非多行商品记录
 * 删除订单时，通过 ON DELETE CASCADE 外键约束或后端逻辑同时删除关联的 order_item。
 */
@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminMapper adminMapper;
    private final ProductMapper productMapper;
    private final UserMapper userMapper;
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final CartItemMapper cartItemMapper;

    // ==================== Admin Login ====================

    @Data
    public static class AdminLoginRequest {
        private String username;
        private String password;
    }

    /**
     * 管理员登录
     * POST /api/admin/login
     */
    @PostMapping("/login")
    public Result<Map<String, String>> adminLogin(@RequestBody AdminLoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            throw new BusinessException(400, "用户名和密码不能为空");
        }
        LambdaQueryWrapper<Admin> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Admin::getUsername, request.getUsername());
        Admin admin = adminMapper.selectOne(wrapper);
        if (admin == null || !admin.getPassword().equals(request.getPassword())) {
            throw new BusinessException(401, "用户名或密码错误");
        }
        log.info("管理员登录成功: {}", request.getUsername());
        // Return a simple token-like marker (for demo; in production use JWT)
        return Result.success(Map.of("role", "admin", "username", admin.getUsername()));
    }

    // ==================== Product Management ====================

    /** 获取所有商品 GET /api/admin/products */
    @GetMapping("/products")
    public Result<List<Product>> getAllProducts() {
        return Result.success(productMapper.selectList(null));
    }

    /** 添加商品 POST /api/admin/products */
    @PostMapping("/products")
    public Result<Void> addProduct(@RequestBody Product product) {
        productMapper.insert(product);
        return Result.success("商品添加成功", null);
    }

    /** 更新商品 PUT /api/admin/products/{id} */
    @PutMapping("/products/{id}")
    public Result<Void> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Product existing = productMapper.selectById(id);
        if (existing == null) throw new BusinessException(404, "商品不存在");
        product.setId(id);
        productMapper.updateById(product);
        return Result.success("商品更新成功", null);
    }

    /**
     * 删除商品 DELETE /api/admin/products/{id}
     * 级联清理：先删除 t_order_item 中引用此商品的记录，再删除商品本身
     */
    @DeleteMapping("/products/{id}")
    public Result<Void> deleteProduct(@PathVariable Long id) {
        // 1. 删除引用此商品的订单明细
        LambdaQueryWrapper<OrderItem> itemWrapper = new LambdaQueryWrapper<>();
        itemWrapper.eq(OrderItem::getProductId, id);
        orderItemMapper.delete(itemWrapper);
        // 2. 删除商品
        productMapper.deleteById(id);
        log.info("商品及关联订单明细已删除: productId={}", id);
        return Result.success("商品删除成功", null);
    }

    // ==================== User Management ====================

    /** 获取所有用户 GET /api/admin/users */
    @GetMapping("/users")
    public Result<List<User>> getAllUsers() {
        List<User> users = userMapper.selectList(null);
        // 不返回密码
        users.forEach(u -> u.setPassword(null));
        return Result.success(users);
    }

    /** 添加用户 POST /api/admin/users */
    @PostMapping("/users")
    public Result<Void> addUser(@RequestBody User user) {
        // 检查用户名唯一性
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, user.getUsername());
        if (userMapper.selectCount(wrapper) > 0) {
            throw new BusinessException(400, "用户名已存在");
        }
        user.setStatus(1);
        userMapper.insert(user);
        return Result.success("用户添加成功", null);
    }

    /**
     * 删除用户 DELETE /api/admin/users/{id}
     * 级联清理：先删除用户的购物车、订单明细、订单，再删除用户
     */
    @DeleteMapping("/users/{id}")
    public Result<Void> deleteUser(@PathVariable Long id) {
        // 1. 删除用户的购物车记录
        LambdaQueryWrapper<CartItem> cartWrapper = new LambdaQueryWrapper<>();
        cartWrapper.eq(CartItem::getUserId, id);
        cartItemMapper.delete(cartWrapper);

        // 2. 查询该用户的所有订单
        LambdaQueryWrapper<Order> orderWrapper = new LambdaQueryWrapper<>();
        orderWrapper.eq(Order::getUserId, id);
        List<Order> userOrders = orderMapper.selectList(orderWrapper);

        // 3. 删除每个订单的明细，再删除订单
        for (Order order : userOrders) {
            LambdaQueryWrapper<OrderItem> itemWrapper = new LambdaQueryWrapper<>();
            itemWrapper.eq(OrderItem::getOrderId, order.getId());
            orderItemMapper.delete(itemWrapper);
            orderMapper.deleteById(order.getId());
        }

        // 4. 删除用户
        userMapper.deleteById(id);
        log.info("用户及关联数据已删除: userId={}", id);
        return Result.success("用户删除成功", null);
    }

    // ==================== Order Management ====================

    /** 获取所有订单（含商品明细） GET /api/admin/orders */
    @GetMapping("/orders")
    public Result<List<Map<String, Object>>> getAllOrders() {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(Order::getCreateTime);
        List<Order> orders = orderMapper.selectList(wrapper);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Order order : orders) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", order.getId());
            map.put("userId", order.getUserId());
            map.put("totalPrice", order.getTotalPrice());
            map.put("status", order.getStatus());
            map.put("createTime", order.getCreateTime());

            // Fetch items for this order
            LambdaQueryWrapper<OrderItem> itemWrapper = new LambdaQueryWrapper<>();
            itemWrapper.eq(OrderItem::getOrderId, order.getId());
            List<OrderItem> items = orderItemMapper.selectList(itemWrapper);
            map.put("items", items);
            result.add(map);
        }
        return Result.success(result);
    }

    /** 获取订单明细 GET /api/admin/orders/{orderId}/items */
    @GetMapping("/orders/{orderId}/items")
    public Result<List<OrderItem>> getOrderItems(@PathVariable Long orderId) {
        LambdaQueryWrapper<OrderItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(OrderItem::getOrderId, orderId);
        return Result.success(orderItemMapper.selectList(wrapper));
    }

    /**
     * 删除订单（级联删除订单明细）
     * DELETE /api/admin/orders/{orderId}
     *
     * 如果数据库配置了 ON DELETE CASCADE 外键，删除 t_order 会自动删除 t_order_item。
     * 这里同时在后端做双重保障，先删明细再删订单。
     */
    @DeleteMapping("/orders/{orderId}")
    public Result<Void> deleteOrder(@PathVariable Long orderId) {
        // 1. 先删除订单明细
        LambdaQueryWrapper<OrderItem> itemWrapper = new LambdaQueryWrapper<>();
        itemWrapper.eq(OrderItem::getOrderId, orderId);
        orderItemMapper.delete(itemWrapper);
        // 2. 再删除订单
        orderMapper.deleteById(orderId);
        log.info("订单及明细已删除: orderId={}", orderId);
        return Result.success("订单已删除", null);
    }
}
