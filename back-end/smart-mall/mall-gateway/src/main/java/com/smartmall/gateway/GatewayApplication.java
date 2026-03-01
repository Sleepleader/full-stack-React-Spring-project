package com.smartmall.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * 网关服务启动类
 * <p>
 * 端口：9527
 * 功能：
 * 1. 路由转发：/api/auth/** → mall-auth-service
 *              /api/user/** → mall-user-service
 * 2. 跨域配置（CORS）：允许前端 http://localhost:5173 访问
 * 3. Nacos 服务发现
 * </p>
 */
@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
