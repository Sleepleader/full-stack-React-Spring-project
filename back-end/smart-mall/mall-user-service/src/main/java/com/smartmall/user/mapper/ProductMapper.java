package com.smartmall.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.smartmall.common.entity.Product;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProductMapper extends BaseMapper<Product> {
}
