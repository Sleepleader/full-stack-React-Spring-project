package com.smartmall.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.smartmall.common.dto.RegisterRequest;
import com.smartmall.common.dto.UserDTO;
import com.smartmall.common.entity.User;
import com.smartmall.common.exception.BusinessException;
import com.smartmall.common.utils.PasswordUtils;
import com.smartmall.user.mapper.UserMapper;
import com.smartmall.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 用户服务实现类
 * <p>
 * 使用 Caffeine 本地缓存用户信息（后续可无缝切换为 Redis）
 * </p>
 *
 * 【Redis 替换说明】
 * 当前使用 CacheManager（Caffeine 实现）进行缓存。
 * 切换到 Redis 后，只需：
 * 1. 在 pom.xml 中添加 spring-boot-starter-data-redis 依赖
 * 2. 修改 CacheConfig.java 使用 RedisCacheManager
 * 3. 在 application.yml 中配置 Redis 连接信息
 * 本类代码无需任何修改（面向 CacheManager 接口编程）
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final CacheManager cacheManager;

    /** 缓存名称 */
    private static final String USER_CACHE = "userCache";

    /**
     * 用户注册
     * <p>
     * 1. 参数校验
     * 2. 检查用户名是否已存在
     * 3. BCrypt 加密密码
     * 4. 保存到数据库
     * </p>
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void register(RegisterRequest request) {
        // 1. 参数校验
        validateRegisterRequest(request);

        // 2. 检查用户名是否已存在
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, request.getUsername());
        if (userMapper.selectCount(queryWrapper) > 0) {
            throw new BusinessException(400, "用户名已存在");
        }

        // 3. 检查邮箱是否已存在
        LambdaQueryWrapper<User> emailWrapper = new LambdaQueryWrapper<>();
        emailWrapper.eq(User::getEmail, request.getEmail());
        if (userMapper.selectCount(emailWrapper) > 0) {
            throw new BusinessException(400, "邮箱已被注册");
        }

        // 4. 检查手机号是否已存在
        LambdaQueryWrapper<User> phoneWrapper = new LambdaQueryWrapper<>();
        phoneWrapper.eq(User::getPhone, request.getPhone());
        if (userMapper.selectCount(phoneWrapper) > 0) {
            throw new BusinessException(400, "手机号已被注册");
        }

        // 5. 构建用户实体并保存
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(PasswordUtils.encode(request.getPassword())); // 明文存储
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setStatus(1); // 默认启用

        userMapper.insert(user);
        log.info("用户注册成功: username={}", request.getUsername());
    }

    /**
     * 根据用户名查询用户信息
     * <p>
     * 优先从缓存读取，缓存未命中则查数据库并放入缓存
     * </p>
     *
     * 【Redis 替换说明】
     * 当前：Caffeine 本地缓存（JVM 内存）
     * 替换后：Redis 分布式缓存（支持多实例共享）
     * 切换方式：修改 CacheConfig 即可，本方法代码不变
     */
    @Override
    public UserDTO findByUsername(String username) {
        // 1. 尝试从缓存获取
        Cache cache = cacheManager.getCache(USER_CACHE);
        if (cache != null) {
            Cache.ValueWrapper cached = cache.get(username);
            if (cached != null) {
                log.debug("缓存命中: username={}", username);
                return (UserDTO) cached.get();
            }
        }

        // 2. 缓存未命中，从数据库查询
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, username);
        User user = userMapper.selectOne(queryWrapper);

        if (user == null) {
            return null;
        }

        // 3. 转换为 DTO
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setPassword(user.getPassword()); // 包含密码哈希（仅内部服务使用）
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhone());
        userDTO.setStatus(user.getStatus());

        // 4. 放入缓存
        if (cache != null) {
            cache.put(username, userDTO);
            log.debug("用户信息已缓存: username={}", username);
        }

        return userDTO;
    }

    /**
     * 根据用户 ID 查询用户信息
     */
    @Override
    public UserDTO findById(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            return null;
        }
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setPassword(user.getPassword());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setStatus(user.getStatus());
        return dto;
    }

    /**
     * 更新用户信息（用户名、密码、邮箱、手机号）
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateUser(Long userId, UserDTO userDTO) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(404, "用户不存在");
        }
        if (userDTO.getUsername() != null && !userDTO.getUsername().trim().isEmpty()) {
            // 检查用户名是否被其他人使用
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUsername, userDTO.getUsername()).ne(User::getId, userId);
            if (userMapper.selectCount(wrapper) > 0) {
                throw new BusinessException(400, "用户名已存在");
            }
            user.setUsername(userDTO.getUsername().trim());
        }
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            if (userDTO.getPassword().length() < 6) {
                throw new BusinessException(400, "密码至少6个字符");
            }
            user.setPassword(PasswordUtils.encode(userDTO.getPassword()));
        }
        if (userDTO.getEmail() != null && !userDTO.getEmail().trim().isEmpty()) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getEmail, userDTO.getEmail()).ne(User::getId, userId);
            if (userMapper.selectCount(wrapper) > 0) {
                throw new BusinessException(400, "邮箱已被注册");
            }
            user.setEmail(userDTO.getEmail().trim());
        }
        if (userDTO.getPhone() != null && !userDTO.getPhone().trim().isEmpty()) {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getPhone, userDTO.getPhone()).ne(User::getId, userId);
            if (userMapper.selectCount(wrapper) > 0) {
                throw new BusinessException(400, "手机号已被注册");
            }
            user.setPhone(userDTO.getPhone().trim());
        }
        userMapper.updateById(user);

        // 清除缓存
        Cache cache = cacheManager.getCache(USER_CACHE);
        if (cache != null) {
            cache.evict(user.getUsername());
        }
        log.info("用户信息已更新: userId={}", userId);
    }

    /**
     * 注册参数校验
     */
    private void validateRegisterRequest(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new BusinessException(400, "用户名不能为空");
        }
        if (request.getUsername().trim().length() < 3) {
            throw new BusinessException(400, "用户名至少3个字符");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new BusinessException(400, "密码不能为空");
        }
        if (request.getPassword().length() < 6) {
            throw new BusinessException(400, "密码至少6个字符");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException(400, "两次输入的密码不一致");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new BusinessException(400, "邮箱不能为空");
        }
        if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
            throw new BusinessException(400, "手机号不能为空");
        }
    }
}
