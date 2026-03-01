package com.smartmall.user.service;

import com.smartmall.common.dto.CartRequest;
import com.smartmall.common.entity.CartItem;

import java.util.List;

/**
 * 购物车服务接口
 */
public interface CartService {

    void addToCart(CartRequest request, Long userId);

    List<CartItem> getCartItems(Long userId);

    void updateQuantity(Long cartItemId, Integer quantity);

    void deleteCartItem(Long cartItemId);
}
