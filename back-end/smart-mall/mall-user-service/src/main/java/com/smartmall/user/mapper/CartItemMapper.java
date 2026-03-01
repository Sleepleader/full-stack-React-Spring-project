package com.smartmall.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.smartmall.common.entity.CartItem;
import org.apache.ibatis.annotations.Mapper;

/**
 * 购物车 Mapper 接口
 */
@Mapper
public interface CartItemMapper extends BaseMapper<CartItem> {
}
