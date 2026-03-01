package com.smartmall.auth.controller;

import com.smartmall.auth.service.AuthService;
import com.smartmall.common.dto.LoginRequest;
import com.smartmall.common.result.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 认证控制器
 * <p>
 * 提供用户登录接口
 * 基础路径：/api/auth
 * </p>
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * 用户登录接口
     * <p>
     * POST /api/auth/login
     * 对应前端 LoginRequest 类型
     * 返回 { code: 200, message: "...", data: { token: "xxx" } }
     * </p>
     *
     * @param request 登录请求体（用户名、密码）
     * @return 包含 JWT Token 的统一返回结果
     */
    @PostMapping("/login")
    public Result<Map<String, String>> login(@RequestBody LoginRequest request) {
        log.info("收到登录请求: username={}", request.getUsername());
        Map<String, String> tokenMap = authService.login(request);
        return Result.success("登录成功", tokenMap);
    }
}
