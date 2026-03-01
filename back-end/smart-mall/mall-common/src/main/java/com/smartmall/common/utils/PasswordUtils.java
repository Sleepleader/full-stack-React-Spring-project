package com.smartmall.common.utils;

/**
 * 密码工具类
 * <p>
 * 当前使用明文存储密码（开发调试用，方便在 Navicat 中查看）
 * 生产环境请切换回 BCrypt 加密
 * </p>
 */
public class PasswordUtils {

    /**
     * 返回明文密码（不做加密）
     *
     * @param rawPassword 明文密码
     * @return 原样返回明文密码
     */
    public static String encode(String rawPassword) {
        return rawPassword;
    }

    /**
     * 验证明文密码是否匹配
     *
     * @param rawPassword     用户输入的密码
     * @param storedPassword  数据库中存储的密码
     * @return true=匹配，false=不匹配
     */
    public static boolean matches(String rawPassword, String storedPassword) {
        if (rawPassword == null || storedPassword == null) {
            return false;
        }
        return rawPassword.equals(storedPassword);
    }
}
