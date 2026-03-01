package com.smartmall.auth.feign;

import com.smartmall.common.dto.UserDTO;
import com.smartmall.common.result.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 用户服务 Feign 客户端
 * <p>
 * 通过 OpenFeign 调用 mall-user-service 的内部接口
 * name：Nacos 中注册的服务名
 * path：接口的基础路径
 * </p>
 */
@FeignClient(name = "mall-user-service", path = "/api/user")
public interface UserFeignClient {

    /**
     * 根据用户名查询用户信息
     * <p>
     * 调用 mall-user-service 的 GET /api/user/internal/findByUsername
     * </p>
     *
     * @param username 用户名
     * @return 包含用户信息的统一返回结果
     */
    @GetMapping("/internal/findByUsername")
    Result<UserDTO> findByUsername(@RequestParam("username") String username);
}
