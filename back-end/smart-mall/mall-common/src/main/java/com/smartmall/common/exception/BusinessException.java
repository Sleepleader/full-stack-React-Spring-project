package com.smartmall.common.exception;

import lombok.Getter;

/**
 * 自定义业务异常
 * <p>
 * 用于在业务逻辑中抛出可预见的异常，
 * 由 GlobalExceptionHandler 统一捕获处理
 * </p>
 */
@Getter
public class BusinessException extends RuntimeException {

    /** 错误状态码 */
    private final int code;

    /**
     * 构造方法（默认状态码 500）
     *
     * @param message 错误信息
     */
    public BusinessException(String message) {
        super(message);
        this.code = 500;
    }

    /**
     * 构造方法（自定义状态码）
     *
     * @param code    错误状态码
     * @param message 错误信息
     */
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }
}
