package com.smartmall.auth.service;

import com.smartmall.common.dto.LoginRequest;

import java.util.Map;

/**
 * 认证服务接口
 */
public interface AuthService {

    /**
     * 用户登录
     * <p>
     * 1. 通过 OpenFeign 调用用户服务查询用户信息
     * 2. 验证密码（BCrypt）
     * 3. 生成 JWT Token（有效期 24 小时）
     * 4. 将 Token 存入本地缓存（后续可切换为 Redis）
     * </p>
     *
     * @param request 登录请求（用户名、密码）
     * @return 包含 token 的 Map
     */
    Map<String, String> login(LoginRequest request);
}
