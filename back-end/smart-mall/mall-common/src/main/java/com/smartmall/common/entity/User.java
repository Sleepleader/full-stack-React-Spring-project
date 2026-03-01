package com.smartmall.common.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户实体类
 * <p>
 * 对应数据库表：t_user
 * </p>
 */
@Data
@TableName("t_user")
public class User implements Serializable {

    /** 用户 ID（主键，自增） */
    @TableId(type = IdType.AUTO)
    private Long id;

    /** 用户名（唯一） */
    private String username;

    /** 密码（BCrypt 加密存储） */
    private String password;

    /** 邮箱 */
    private String email;

    /** 手机号 */
    private String phone;

    /** 账户状态：1-启用，0-禁用 */
    private Integer status;

    /** 创建时间（自动填充） */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /** 更新时间（自动填充） */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
