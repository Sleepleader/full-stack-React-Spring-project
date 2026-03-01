package com.smartmall.common.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 登录请求 DTO
 * <p>
 * 对应前端 LoginRequest 类型
 * </p>
 */
@Data
public class LoginRequest implements Serializable {

    /** 用户名 */
    private String username;

    /** 密码 */
    private String password;
}
