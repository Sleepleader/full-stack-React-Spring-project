package com.smartmall.user.service;

import com.smartmall.common.entity.Product;

import java.util.List;

public interface ProductService {

    List<Product> getByCategory(String category);

    Product getById(Long id);

    List<Product> search(String keyword);
}
