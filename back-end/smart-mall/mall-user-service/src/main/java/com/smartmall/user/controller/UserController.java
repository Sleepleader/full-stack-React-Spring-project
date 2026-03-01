package com.smartmall.user.controller;

import com.smartmall.common.dto.RegisterRequest;
import com.smartmall.common.dto.UserDTO;
import com.smartmall.common.result.Result;
import com.smartmall.common.utils.JwtUtils;
import com.smartmall.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 * <p>
 * 提供用户注册和用户信息查询接口
 * 基础路径：/api/user
 * </p>
 */
@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 用户注册接口
     * <p>
     * POST /api/user/register
     * 对应前端 RegisterRequest 类型
     * </p>
     *
     * @param request 注册请求体
     * @return 统一返回结果
     */
    @PostMapping("/register")
    public Result<Void> register(@RequestBody RegisterRequest request) {
        log.info("收到注册请求: username={}", request.getUsername());
        userService.register(request);
        return Result.success("注册成功", null);
    }

    /**
     * 根据用户名查询用户信息（内部服务调用接口）
     * <p>
     * GET /api/user/internal/findByUsername?username=xxx
     * 供 mall-auth-service 通过 OpenFeign 调用
     * </p>
     *
     * @param username 用户名
     * @return 用户信息（包含密码哈希）
     */
    @GetMapping("/internal/findByUsername")
    public Result<UserDTO> findByUsername(@RequestParam("username") String username) {
        log.debug("内部调用: 查询用户信息, username={}", username);
        UserDTO userDTO = userService.findByUsername(username);
        if (userDTO == null) {
            return Result.fail(404, "用户不存在");
        }
        return Result.success(userDTO);
    }

    /**
     * 获取当前登录用户信息
     * GET /api/user/info
     */
    @GetMapping("/info")
    public Result<UserDTO> getUserInfo(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long userId = extractUserId(authorization);
        UserDTO userDTO = userService.findById(userId);
        if (userDTO == null) {
            return Result.fail(404, "用户不存在");
        }
        // 不返回密码
        userDTO.setPassword(null);
        return Result.success(userDTO);
    }

    /**
     * 更新当前登录用户信息
     * PUT /api/user/update
     */
    @PutMapping("/update")
    public Result<Void> updateUser(
            @RequestBody UserDTO userDTO,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        Long userId = extractUserId(authorization);
        log.info("更新用户信息: userId={}", userId);
        userService.updateUser(userId, userDTO);
        return Result.success("更新成功", null);
    }

    /**
     * 从 Authorization 头中提取用户 ID
     */
    private Long extractUserId(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            log.warn("请求未携带 Token，使用默认用户 ID=1");
            return 1L;
        }
        try {
            String token = authorization.substring(7);
            return JwtUtils.getUserId(token);
        } catch (Exception e) {
            log.warn("Token 解析失败，使用默认用户 ID=1: {}", e.getMessage());
            return 1L;
        }
    }
}
