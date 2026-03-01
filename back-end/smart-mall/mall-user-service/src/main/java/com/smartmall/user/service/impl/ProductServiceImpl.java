package com.smartmall.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.smartmall.common.entity.Product;
import com.smartmall.user.mapper.ProductMapper;
import com.smartmall.user.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;

    @Override
    public List<Product> getByCategory(String category) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getCategory, category);
        return productMapper.selectList(wrapper);
    }

    @Override
    public Product getById(Long id) {
        return productMapper.selectById(id);
    }

    @Override
    public List<Product> search(String keyword) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(Product::getName, keyword)
               .or()
               .like(Product::getCategory, keyword);
        return productMapper.selectList(wrapper);
    }
}
