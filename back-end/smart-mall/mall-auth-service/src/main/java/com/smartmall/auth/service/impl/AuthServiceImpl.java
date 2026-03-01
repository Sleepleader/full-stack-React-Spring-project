package com.smartmall.auth.service.impl;

import com.smartmall.auth.feign.UserFeignClient;
import com.smartmall.auth.service.AuthService;
import com.smartmall.common.dto.LoginRequest;
import com.smartmall.common.dto.UserDTO;
import com.smartmall.common.exception.BusinessException;
import com.smartmall.common.result.Result;
import com.smartmall.common.utils.JwtUtils;
import com.smartmall.common.utils.PasswordUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证服务实现类
 * <p>
 * 通过 OpenFeign 调用用户服务验证用户名和密码，
 * 生成 JWT Token 并存入本地缓存（后续可切换为 Redis）
 * </p>
 *
 * 【Redis 替换说明】
 * 当前 Token 存储在 Caffeine 本地缓存中。
 * 切换到 Redis 后，只需：
 * 1. 在 pom.xml 中添加 spring-boot-starter-data-redis 依赖
 * 2. 修改 TokenCacheConfig.java 使用 RedisCacheManager
 * 3. 在 application.yml 中配置 Redis 连接信息
 * 本类代码无需任何修改（面向 CacheManager 接口编程）
 *
 * Redis 存储优势：
 * - 支持分布式部署（多实例共享 Token）
 * - Token 过期由 Redis TTL 管理
 * - 支持主动使 Token 失效（登出功能）
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserFeignClient userFeignClient;
    private final CacheManager cacheManager;

    /** Token 缓存名称 */
    private static final String TOKEN_CACHE = "tokenCache";

    /**
     * 用户登录
     * <p>
     * 流程：
     * 1. 参数校验
     * 2. 通过 OpenFeign 调用 mall-user-service 查询用户信息
     * 3. 验证密码（BCrypt 比对）
     * 4. 生成 JWT Token（有效期 24 小时）
     * 5. 将 Token 存入本地缓存
     * 6. 返回 Token
     * </p>
     */
    @Override
    public Map<String, String> login(LoginRequest request) {
        // 1. 参数校验
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new BusinessException(400, "用户名不能为空");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new BusinessException(400, "密码不能为空");
        }

        // 2. 通过 OpenFeign 调用用户服务查询用户信息
        Result<UserDTO> result;
        try {
            result = userFeignClient.findByUsername(request.getUsername().trim());
        } catch (Exception e) {
            log.error("调用用户服务失败: ", e);
            throw new BusinessException("用户服务暂不可用，请稍后重试");
        }

        // 3. 检查用户是否存在
        if (result == null || result.getCode() != 200 || result.getData() == null) {
            throw new BusinessException(401, "用户名或密码错误");
        }

        UserDTO userDTO = result.getData();

        // 4. 检查账户状态
        if (userDTO.getStatus() != null && userDTO.getStatus() == 0) {
            throw new BusinessException(403, "账户已被禁用，请联系管理员");
        }

        // 5. 验证密码（明文比对）
        if (!PasswordUtils.matches(request.getPassword(), userDTO.getPassword())) {
            throw new BusinessException(401, "用户名或密码错误");
        }

        // 6. 生成 JWT Token
        String token = JwtUtils.generateToken(userDTO.getId(), userDTO.getUsername());

        // 7. 将 Token 存入缓存
        // 【Redis 替换说明】切换 Redis 后，此处代码不变，
        // CacheManager 会自动使用 Redis 实现
        Cache cache = cacheManager.getCache(TOKEN_CACHE);
        if (cache != null) {
            cache.put(userDTO.getUsername(), token);
            log.debug("Token 已缓存: username={}", userDTO.getUsername());
        }

        log.info("用户登录成功: username={}", userDTO.getUsername());

        // 8. 返回 Token
        Map<String, String> tokenMap = new HashMap<>();
        tokenMap.put("token", token);
        return tokenMap;
    }
}
