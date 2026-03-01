package com.smartmall.auth.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Token 缓存配置类
 * <p>
 * 当前使用 Caffeine 本地缓存存储 JWT Token
 * 后续可无缝切换为 Redis
 * </p>
 *
 * ==================== Redis 替换步骤 ====================
 *
 * 1. 在 pom.xml 中添加 Redis 依赖：
 *    <dependency>
 *        <groupId>org.springframework.boot</groupId>
 *        <artifactId>spring-boot-starter-data-redis</artifactId>
 *    </dependency>
 *
 * 2. 在 application.yml 中添加 Redis 配置：
 *    spring:
 *      data:
 *        redis:
 *          host: 127.0.0.1
 *          port: 6379
 *          password: your_password
 *          database: 0
 *
 * 3. 将本类的 cacheManager() 方法替换为：
 *
 *    @Bean
 *    public CacheManager cacheManager(RedisConnectionFactory factory) {
 *        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
 *            .entryTtl(Duration.ofHours(24))  // Token 有效期 24 小时
 *            .serializeKeysWith(RedisSerializationContext.SerializationPair
 *                .fromSerializer(new StringRedisSerializer()))
 *            .serializeValuesWith(RedisSerializationContext.SerializationPair
 *                .fromSerializer(new StringRedisSerializer()));
 *
 *        return RedisCacheManager.builder(factory)
 *            .cacheDefaults(config)
 *            .build();
 *    }
 *
 * 4. 删除 Caffeine 相关依赖（可选）
 *
 * ==========================================================
 */
@Configuration
@EnableCaching
public class TokenCacheConfig {

    /**
     * 配置 Caffeine 缓存管理器（Token 存储）
     * <p>
     * - 最大缓存条目数：10000（同时在线用户数）
     * - 写入后过期时间：24 小时（与 JWT Token 有效期一致）
     * </p>
     */
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(10000)                         // 最大缓存 10000 个 Token
                .expireAfterWrite(24, TimeUnit.HOURS)       // 24 小时后过期（与 JWT 一致）
                .recordStats()                              // 启用统计
        );
        return cacheManager;
    }
}
