package com.smartmall.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.smartmall.common.dto.CartRequest;
import com.smartmall.common.entity.CartItem;
import com.smartmall.common.exception.BusinessException;
import com.smartmall.user.mapper.CartItemMapper;
import com.smartmall.user.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 购物车服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartItemMapper cartItemMapper;

    @Override
    public void addToCart(CartRequest request, Long userId) {
        // 参数校验
        if (request.getProductName() == null || request.getProductName().trim().isEmpty()) {
            throw new BusinessException(400, "商品名称不能为空");
        }
        if (request.getPrice() == null) {
            throw new BusinessException(400, "商品价格不能为空");
        }
        if (request.getQuantity() == null || request.getQuantity() < 1) {
            throw new BusinessException(400, "商品数量不合法");
        }

        // 查找是否已存在相同商品
        LambdaQueryWrapper<CartItem> existWrapper = new LambdaQueryWrapper<>();
        existWrapper.eq(CartItem::getUserId, userId)
                    .eq(CartItem::getProductName, request.getProductName().trim());
        CartItem existing = cartItemMapper.selectOne(existWrapper);

        if (existing != null) {
            // 合并数量
            existing.setQuantity(existing.getQuantity() + request.getQuantity());
            cartItemMapper.updateById(existing);
            log.info("购物车商品数量已更新: userId={}, productName={}, newQty={}", userId, request.getProductName(), existing.getQuantity());
        } else {
            // 新增购物车记录
            CartItem cartItem = new CartItem();
            cartItem.setUserId(userId);
            cartItem.setProductName(request.getProductName().trim());
            cartItem.setPrice(request.getPrice());
            cartItem.setQuantity(request.getQuantity());
            cartItem.setCategory(request.getCategory());
            cartItem.setImageUrl(request.getImageUrl());
            cartItemMapper.insert(cartItem);
            log.info("商品已加入购物车: userId={}, productName={}", userId, request.getProductName());
        }
    }

    @Override
    public List<CartItem> getCartItems(Long userId) {
        LambdaQueryWrapper<CartItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CartItem::getUserId, userId)
               .orderByDesc(CartItem::getCreateTime);
        return cartItemMapper.selectList(wrapper);
    }

    @Override
    public void updateQuantity(Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemMapper.selectById(cartItemId);
        if (cartItem == null) {
            throw new BusinessException(404, "购物车记录不存在");
        }
        cartItem.setQuantity(quantity);
        cartItemMapper.updateById(cartItem);
    }

    @Override
    public void deleteCartItem(Long cartItemId) {
        cartItemMapper.deleteById(cartItemId);
    }
}
