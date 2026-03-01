package com.smartmall.user.controller;

import com.smartmall.common.dto.CartRequest;
import com.smartmall.common.entity.CartItem;
import com.smartmall.common.exception.BusinessException;
import com.smartmall.common.result.Result;
import com.smartmall.common.utils.JwtUtils;
import com.smartmall.user.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 购物车控制器
 * 路径前缀：/api/cart
 */
@Slf4j
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * 添加商品到购物车
     * POST /api/cart/add
     */
    @PostMapping("/add")
    public Result<?> addToCart(
            @RequestBody CartRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorization) {

        // 从 JWT Token 中提取用户 ID
        Long userId = extractUserId(authorization);

        cartService.addToCart(request, userId);
        return Result.success("商品已加入购物车");
    }

    /** 获取购物车列表 GET /api/cart/list */
    @GetMapping("/list")
    public Result<List<CartItem>> getCartItems(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long userId = extractUserId(authorization);
        return Result.success(cartService.getCartItems(userId));
    }

    /** 更新购物车商品数量 PUT /api/cart/update/{id} */
    @PutMapping("/update/{id}")
    public Result<?> updateQuantity(@PathVariable("id") Long id, @RequestBody Map<String, Integer> body) {
        Integer quantity = body.get("quantity");
        cartService.updateQuantity(id, quantity);
        return Result.success("数量已更新");
    }

    /** 删除购物车商品 DELETE /api/cart/delete/{id} */
    @DeleteMapping("/delete/{id}")
    public Result<?> deleteCartItem(@PathVariable("id") Long id) {
        cartService.deleteCartItem(id);
        return Result.success("商品已删除");
    }

    /**
     * 从 Authorization 头中提取用户 ID
     * 格式：Bearer <token>
     */
    private Long extractUserId(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            // 如果没有 Token，使用默认用户 ID（方便测试）
            log.warn("请求未携带 Token，使用默认用户 ID=1");
            return 1L;
        }
        try {
            String token = authorization.substring(7);
            return JwtUtils.getUserId(token);
        } catch (Exception e) {
            log.warn("Token 解析失败，使用默认用户 ID=1: {}", e.getMessage());
            return 1L;
        }
    }
}
