package com.smartmall.user.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * 缓存配置类
 * <p>
 * 当前使用 Caffeine 本地缓存（JVM 内存级别）
 * 后续可无缝切换为 Redis 分布式缓存
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
 *            .entryTtl(Duration.ofHours(1))
 *            .serializeKeysWith(RedisSerializationContext.SerializationPair
 *                .fromSerializer(new StringRedisSerializer()))
 *            .serializeValuesWith(RedisSerializationContext.SerializationPair
 *                .fromSerializer(new GenericJackson2JsonRedisSerializer()));
 *
 *        return RedisCacheManager.builder(factory)
 *            .cacheDefaults(config)
 *            .build();
 *    }
 *
 * 4. 删除 Caffeine 相关依赖（可选，不影响运行）
 *
 * 注意：业务代码（Service 层）无需修改，因为使用的是 Spring Cache 的 CacheManager 接口
 * ==========================================================
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * 配置 Caffeine 缓存管理器
     * <p>
     * - 最大缓存条目数：1000
     * - 写入后过期时间：1 小时
     * - 访问后过期时间：30 分钟
     * </p>
     */
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(1000)                          // 最大缓存条目数
                .expireAfterWrite(1, TimeUnit.HOURS)        // 写入后 1 小时过期
                .expireAfterAccess(30, TimeUnit.MINUTES)    // 30 分钟未访问则过期
                .recordStats()                              // 启用统计信息
        );
        return cacheManager;
    }
}
