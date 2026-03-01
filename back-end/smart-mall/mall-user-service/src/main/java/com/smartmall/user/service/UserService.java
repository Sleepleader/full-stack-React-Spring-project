package com.smartmall.user.service;

import com.smartmall.common.dto.RegisterRequest;
import com.smartmall.common.dto.UserDTO;

/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 用户注册
     *
     * @param request 注册请求（用户名、密码、确认密码、邮箱、手机号）
     */
    void register(RegisterRequest request);

    /**
     * 根据用户名查询用户信息
     * <p>
     * 供认证服务通过 OpenFeign 调用，用于登录验证
     * </p>
     *
     * @param username 用户名
     * @return UserDTO（包含密码哈希，仅供内部服务使用）
     */
    UserDTO findByUsername(String username);

    /**
     * 根据用户 ID 查询用户信息
     *
     * @param userId 用户 ID
     * @return UserDTO
     */
    UserDTO findById(Long userId);

    /**
     * 更新用户信息
     *
     * @param userId  用户 ID
     * @param userDTO 更新字段
     */
    void updateUser(Long userId, UserDTO userDTO);
}
