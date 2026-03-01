package com.smartmall.common.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 购物车实体类
 * 对应数据库表：t_cart_item
 */
@Data
@TableName("t_cart_item")
public class CartItem {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 用户ID */
    private Long userId;

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

    /** 创建时间 */
    private LocalDateTime createTime;

    /** 更新时间 */
    private LocalDateTime updateTime;
}
