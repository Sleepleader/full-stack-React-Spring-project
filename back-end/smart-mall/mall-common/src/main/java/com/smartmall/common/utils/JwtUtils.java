package com.smartmall.common.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT 工具类
 * <p>
 * 负责 Token 的生成与解析验证
 * 使用 HMAC-SHA256 签名算法
 * </p>
 */
public class JwtUtils {

    /**
     * JWT 密钥（生产环境应从配置中心或环境变量读取）
     * 至少 32 字节（256 位）以满足 HS256 要求
     */
    private static final String SECRET = "SmartMall2024SecretKeyForJwtToken!@#$%^&*()";

    /** Token 有效期：24 小时（单位：毫秒） */
    private static final long EXPIRATION = 24 * 60 * 60 * 1000L;

    /** 签名密钥 */
    private static final SecretKey SIGNING_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    /**
     * 生成 JWT Token
     *
     * @param userId   用户 ID
     * @param username 用户名
     * @return JWT Token 字符串
     */
    public static String generateToken(Long userId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);

        Date now = new Date();
        Date expiration = new Date(now.getTime() + EXPIRATION);

        return Jwts.builder()
                .claims(claims)                   // 自定义声明
                .subject(username)                // 主题（用户名）
                .issuedAt(now)                    // 签发时间
                .expiration(expiration)           // 过期时间
                .signWith(SIGNING_KEY)            // 签名
                .compact();
    }

    /**
     * 解析 JWT Token，返回 Claims
     *
     * @param token JWT Token 字符串
     * @return Claims 声明对象
     * @throws io.jsonwebtoken.JwtException Token 无效或已过期时抛出异常
     */
    public static Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(SIGNING_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * 从 Token 中获取用户名
     *
     * @param token JWT Token 字符串
     * @return 用户名
     */
    public static String getUsername(String token) {
        return parseToken(token).getSubject();
    }

    /**
     * 从 Token 中获取用户 ID
     *
     * @param token JWT Token 字符串
     * @return 用户 ID
     */
    public static Long getUserId(String token) {
        return parseToken(token).get("userId", Long.class);
    }

    /**
     * 验证 Token 是否有效（未过期且签名正确）
     *
     * @param token JWT Token 字符串
     * @return true=有效，false=无效
     */
    public static boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
