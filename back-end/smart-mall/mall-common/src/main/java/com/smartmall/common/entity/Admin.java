package com.smartmall.common.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 管理员实体类
 * 对应数据库表：t_admin
 */
@Data
@TableName("t_admin")
public class Admin {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 管理员用户名 */
    private String username;

    /** 密码 */
    private String password;

    /** 创建时间 */
    private LocalDateTime createTime;
}
