# Smart Mall 后端微服务

## 项目概述

Smart Mall 是一个基于 **Spring Cloud Alibaba** 的微服务电商项目，当前实现了用户注册和登录功能。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Java | 21 | JDK 版本 |
| Spring Boot | 3.2.5 | 基础框架 |
| Spring Cloud | 2023.0.1 | 微服务框架 |
| Spring Cloud Alibaba | 2023.0.1.0 | Nacos 服务发现 |
| Spring Cloud Gateway | - | API 网关 |
| OpenFeign | - | 服务间调用 |
| MyBatis-Plus | 3.5.5 | ORM 框架 |
| MySQL | 8.0 | 关系型数据库 |
| Caffeine | - | 本地缓存（临时替代 Redis） |
| JWT (jjwt) | 0.12.5 | Token 认证 |
| BCrypt | - | 密码加密 |
| Lombok | - | 简化代码 |
| Docker | - | 容器化部署 |

## 项目结构

```
smart-mall/
├── pom.xml                          # 父 POM（统一依赖管理）
├── sql/
│   └── init.sql                     # 数据库初始化脚本
├── mall-common/                     # 公共模块
│   ├── pom.xml
│   └── src/main/java/com/smartmall/common/
│       ├── dto/                     # 数据传输对象
│       │   ├── LoginRequest.java    # 登录请求
│       │   ├── RegisterRequest.java # 注册请求
│       │   └── UserDTO.java         # 用户信息传输
│       ├── entity/
│       │   └── User.java            # 用户实体（对应 t_user 表）
│       ├── exception/
│       │   ├── BusinessException.java     # 自定义业务异常
│       │   └── GlobalExceptionHandler.java # 全局异常处理
│       ├── result/
│       │   └── Result.java          # 统一返回结果
│       └── utils/
│           ├── JwtUtils.java        # JWT 工具类
│           └── PasswordUtils.java   # BCrypt 密码工具类
│
├── mall-gateway/                    # 网关服务（端口 9527）
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/
│       ├── java/.../GatewayApplication.java
│       └── resources/application.yml
│
├── mall-auth-service/               # 认证服务（端口 8080）
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/com/smartmall/auth/
│       ├── AuthServiceApplication.java
│       ├── controller/AuthController.java
│       ├── service/AuthService.java
│       ├── service/impl/AuthServiceImpl.java
│       ├── feign/UserFeignClient.java      # OpenFeign 调用用户服务
│       └── config/TokenCacheConfig.java
│
└── mall-user-service/               # 用户服务（端口 8081）
    ├── pom.xml
    ├── Dockerfile
    └── src/main/java/com/smartmall/user/
        ├── UserServiceApplication.java
        ├── controller/UserController.java
        ├── service/UserService.java
        ├── service/impl/UserServiceImpl.java
        ├── mapper/UserMapper.java
        └── config/
            ├── CacheConfig.java
            └── MyBatisPlusConfig.java
```

## 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| mall-gateway | 9527 | API 网关（所有请求入口） |
| mall-auth-service | 8080 | 认证服务（登录） |
| mall-user-service | 8081 | 用户服务（注册、用户查询） |
| Nacos | 8848 | 服务注册与发现 |
| MySQL | 3306 | 数据库 |

## API 接口

所有请求通过网关 `http://localhost:9527` 转发：

| 方法 | 路径 | 说明 | 请求体 |
|------|------|------|--------|
| POST | /api/auth/login | 用户登录 | `{ username, password }` |
| POST | /api/user/register | 用户注册 | `{ username, password, confirmPassword, email, phone }` |

## 本地启动步骤

### 前置条件
- JDK 21
- Maven 3.9+
- MySQL 8.0（本地已安装）
- Nacos 2.x（本地已安装）

### 步骤

**1. 初始化数据库**
```bash
mysql -u root -p < sql/init.sql
```

**2. 启动 Nacos**
```bash
# Windows（单机模式）
startup.cmd -m standalone
```

**3. 编译项目**
```bash
cd back-end/smart-mall
mvn clean install -DskipTests
```

**4. 依次启动服务**
```bash
# 1. 启动用户服务
cd mall-user-service
mvn spring-boot:run

# 2. 启动认证服务
cd mall-auth-service
mvn spring-boot:run

# 3. 启动网关
cd mall-gateway
mvn spring-boot:run
```

**5. 启动前端**
```bash
cd front-end/my-react-app
npm install
npm run dev
```

## Docker 部署

```bash
# 在项目根目录执行
docker-compose up -d
```

## 请求调用链路

```
前端 (localhost:5173)
  ↓ HTTP 请求
Gateway (localhost:9527)         ← CORS 跨域处理
  ↓ 路由转发（Nacos 负载均衡）
  ├── /api/auth/** → mall-auth-service (8080)
  │     ↓ OpenFeign
  │     mall-user-service (8081) ← 查询用户信息
  │     ↓
  │     MySQL (t_user 表)
  │
  └── /api/user/** → mall-user-service (8081)
        ↓
        MySQL (t_user 表)
```

## Redis 集成步骤

当前项目使用 **Caffeine 本地缓存** 临时替代 Redis。当 Redis 准备就绪后，按以下步骤切换：

### 1. 添加 Maven 依赖

在 `mall-auth-service/pom.xml` 和 `mall-user-service/pom.xml` 中添加：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

并移除 Caffeine 依赖（可选）。

### 2. 添加 Redis 配置

在对应的 `application.yml` 中添加：

```yaml
spring:
  data:
    redis:
      host: 127.0.0.1
      port: 6379
      password:           # Redis 密码（如有）
      database: 0
```

### 3. 修改缓存配置类

- `mall-user-service` → 修改 `CacheConfig.java`
- `mall-auth-service` → 修改 `TokenCacheConfig.java`

将 CaffeineCacheManager 替换为 RedisCacheManager（具体代码已在配置类注释中提供）。

### 4. 业务代码无需修改

因为 Service 层面向 `CacheManager` 接口编程，切换缓存实现后业务代码完全不变。

## 注意事项

- `application.yml` 中的数据库密码默认为 `root`，请根据本地环境修改
- JWT 密钥在 `JwtUtils.java` 中配置，生产环境请更换
- 当前 CORS 允许 `localhost:5173`（Vite 开发服务器），生产环境需要调整
