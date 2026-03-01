package com.smartmall.user.controller;

import com.smartmall.common.entity.Product;
import com.smartmall.common.result.Result;
import com.smartmall.user.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /** 按分类查询商品 */
    @GetMapping("/category/{category}")
    public Result<List<Product>> getByCategory(@PathVariable("category") String category) {
        List<Product> products = productService.getByCategory(category);
        return Result.success(products);
    }

    /** 根据ID查询商品 */
    @GetMapping("/{id}")
    public Result<Product> getById(@PathVariable("id") Long id) {
        Product product = productService.getById(id);
        if (product == null) {
            return Result.fail("商品不存在");
        }
        return Result.success(product);
    }

    /** 模糊搜索商品 */
    @GetMapping("/search")
    public Result<List<Product>> search(@RequestParam("keyword") String keyword) {
        List<Product> products = productService.search(keyword);
        return Result.success(products);
    }
}
