package com.smartmall.common.result;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 通用 API 返回结果封装
 * <p>
 * 统一所有接口的返回格式：{ code, message, data }
 * 与前端 ApiResponse<T> 类型对应
 * </p>
 *
 * @param <T> 返回数据的类型
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> implements Serializable {

    /** 状态码：200 表示成功，其他表示失败 */
    private int code;

    /** 提示信息 */
    private String message;

    /** 返回数据 */
    private T data;

    // ==================== 成功响应 ====================

    /**
     * 成功（无数据）
     */
    public static <T> Result<T> success() {
        return new Result<>(200, "操作成功", null);
    }

    /**
     * 成功（带数据）
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "操作成功", data);
    }

    /**
     * 成功（自定义消息 + 数据）
     */
    public static <T> Result<T> success(String message, T data) {
        return new Result<>(200, message, data);
    }

    // ==================== 失败响应 ====================

    /**
     * 失败（自定义消息）
     */
    public static <T> Result<T> fail(String message) {
        return new Result<>(500, message, null);
    }

    /**
     * 失败（自定义状态码 + 消息）
     */
    public static <T> Result<T> fail(int code, String message) {
        return new Result<>(code, message, null);
    }

    /**
     * 参数校验失败
     */
    public static <T> Result<T> validateFail(String message) {
        return new Result<>(400, message, null);
    }

    /**
     * 未授权
     */
    public static <T> Result<T> unauthorized(String message) {
        return new Result<>(401, message, null);
    }

    /**
     * 禁止访问
     */
    public static <T> Result<T> forbidden(String message) {
        return new Result<>(403, message, null);
    }
}
