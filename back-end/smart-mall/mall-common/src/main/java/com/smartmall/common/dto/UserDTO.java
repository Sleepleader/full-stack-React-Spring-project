package com.smartmall.common.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 用户信息 DTO（不包含密码等敏感字段）
 * <p>
 * 用于服务间传输用户信息（如 OpenFeign 调用）
 * </p>
 */
@Data
public class UserDTO implements Serializable {

    /** 用户 ID */
    private Long id;

    /** 用户名 */
    private String username;

    /** 密码（仅内部服务间传输使用，不对外暴露） */
    private String password;

    /** 邮箱 */
    private String email;

    /** 手机号 */
    private String phone;

    /** 账户状态：1-启用，0-禁用 */
    private Integer status;
}
