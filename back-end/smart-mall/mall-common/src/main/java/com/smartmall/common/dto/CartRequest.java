package com.smartmall.common.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 添加购物车请求 DTO
 */
@Data
public class CartRequest {

    /** 商品名称 */
    private String productName;

    /** 商品单价 */
    private BigDecimal price;

    /** 数量 */
    private Integer quantity;

    /** 商品分类 */
    private String category;

    /** 商品图片URL */
    private String imageUrl;
}
