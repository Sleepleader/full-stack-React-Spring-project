package com.smartmall.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * 认证服务启动类
 * <p>
 * 端口：8080
 * 功能：
 * 1. 用户登录（验证用户名和密码）
 * 2. 生成 JWT Token（有效期 24 小时）
 * 3. 通过 OpenFeign 调用 mall-user-service 获取用户信息
 * </p>
 */
@SpringBootApplication(scanBasePackages = {"com.smartmall.auth", "com.smartmall.common"})
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.smartmall.auth.feign")
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}
