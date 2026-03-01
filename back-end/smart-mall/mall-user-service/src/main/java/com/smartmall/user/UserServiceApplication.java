package com.smartmall.user;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * 用户服务启动类
 * <p>
 * 端口：8081
 * 功能：用户注册、用户信息查询
 * 扫描 Mapper 接口路径：com.smartmall.user.mapper
 * </p>
 */
@SpringBootApplication(scanBasePackages = {"com.smartmall.user", "com.smartmall.common"})
@EnableDiscoveryClient
@MapperScan("com.smartmall.user.mapper")
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
