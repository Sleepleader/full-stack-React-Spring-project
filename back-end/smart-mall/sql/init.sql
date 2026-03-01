-- ==================== Smart Mall 数据库初始化脚本 ====================
-- 数据库：smart_mall
-- 适配 MySQL 8.0+

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `smart_mall` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `smart_mall`;

-- ==================== 用户表 ====================
-- 对应实体类：com.smartmall.common.entity.User
-- 表名前缀 t_（与 MyBatis-Plus 配置一致）
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '用户ID（主键自增）',
    `username`    VARCHAR(50)  NOT NULL                COMMENT '用户名（唯一）',
    `password`    VARCHAR(255) NOT NULL                COMMENT '密码（BCrypt 加密存储）',
    `email`       VARCHAR(100) NOT NULL                COMMENT '邮箱（唯一）',
    `phone`       VARCHAR(20)  NOT NULL                COMMENT '手机号（唯一）',
    `status`      TINYINT      NOT NULL DEFAULT 1      COMMENT '账户状态：1-启用，0-禁用',
    `create_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    UNIQUE KEY `uk_email` (`email`),
    UNIQUE KEY `uk_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ==================== 购物车表 ====================
-- 对应实体类：com.smartmall.common.entity.CartItem
DROP TABLE IF EXISTS `t_cart_item`;
CREATE TABLE `t_cart_item` (
    `id`           BIGINT        NOT NULL AUTO_INCREMENT COMMENT '购物车记录ID（主键自增）',
    `user_id`      BIGINT        NOT NULL                COMMENT '用户ID',
    `product_name` VARCHAR(200)  NOT NULL                COMMENT '商品名称',
    `price`        DECIMAL(10,2) NOT NULL                COMMENT '商品单价',
    `quantity`     INT           NOT NULL DEFAULT 1       COMMENT '数量',
    `category`     VARCHAR(50)   DEFAULT NULL             COMMENT '商品分类',
    `image_url`    VARCHAR(500)  DEFAULT NULL             COMMENT '商品图片URL',
    `create_time`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车表';

-- ==================== 商品表 ====================
-- 对应实体类：com.smartmall.common.entity.Product
DROP TABLE IF EXISTS `t_product`;
CREATE TABLE `t_product` (
    `id`          BIGINT        NOT NULL AUTO_INCREMENT COMMENT '商品ID（主键自增）',
    `name`        VARCHAR(200)  NOT NULL                COMMENT '商品名称',
    `price`       DECIMAL(10,2) NOT NULL                COMMENT '商品价格',
    `image_url`   VARCHAR(500)  DEFAULT NULL             COMMENT '商品图片URL',
    `category`    VARCHAR(50)   NOT NULL                COMMENT '商品分类',
    `description` TEXT          DEFAULT NULL             COMMENT '商品描述',
    `create_time` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- ==================== 订单表 ====================
DROP TABLE IF EXISTS `t_order`;
CREATE TABLE `t_order` (
    `id`          BIGINT        NOT NULL AUTO_INCREMENT COMMENT '订单ID',
    `user_id`     BIGINT        NOT NULL                COMMENT '用户ID',
    `total_price` DECIMAL(10,2) NOT NULL                COMMENT '订单总价',
    `status`      VARCHAR(20)   NOT NULL DEFAULT 'COMPLETED' COMMENT '订单状态',
    `create_time` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- ==================== 订单明细表 ====================
-- 【设计说明】t_order 与 t_order_item 是 一对多 关系（One Order → Many Items）。
-- 这是标准的关系型数据库范式设计：订单头信息（用户、总价、状态）保存在 t_order，
-- 订单中的每件商品明细保存在 t_order_item。拆分的好处包括：
-- 1. 避免数据冗余（订单头信息不需要在每行商品中重复）
-- 2. 支持灵活查询（可单独查询订单列表，也可按需加载明细）
-- 3. 符合第三范式（3NF），便于后续扩展和维护
DROP TABLE IF EXISTS `t_order_item`;
CREATE TABLE `t_order_item` (
    `id`           BIGINT        NOT NULL AUTO_INCREMENT COMMENT '明细ID',
    `order_id`     BIGINT        NOT NULL                COMMENT '订单ID',
    `product_id`   BIGINT        NOT NULL                COMMENT '商品ID',
    `product_name` VARCHAR(200)  NOT NULL                COMMENT '商品名称',
    `price`        DECIMAL(10,2) NOT NULL                COMMENT '商品单价',
    `quantity`     INT           NOT NULL DEFAULT 1       COMMENT '数量',
    `image_url`    VARCHAR(500)  DEFAULT NULL             COMMENT '商品图片URL',
    PRIMARY KEY (`id`),
    KEY `idx_order_id` (`order_id`),
    CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `t_order`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单明细表';

-- ==================== 管理员表 ====================
DROP TABLE IF EXISTS `t_admin`;
CREATE TABLE `t_admin` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
    `username`    VARCHAR(50)  NOT NULL                COMMENT '管理员用户名（唯一）',
    `password`    VARCHAR(255) NOT NULL                COMMENT '密码（明文或加密）',
    `create_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_admin_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- 默认管理员账号（username=admin, password=admin）
INSERT INTO `t_admin` (`username`, `password`) VALUES ('admin', 'admin');

-- ==================== 种子商品数据 ====================
INSERT INTO `t_product` (`name`, `price`, `image_url`, `category`, `description`) VALUES
('Super Smash Bros', 49.99, 'https://m.media-amazon.com/images/I/715OVTqaTyL.AC_UY218.jpg', 'Gaming', 'nothing'),
('Minecraft', 29.99, 'https://m.media-amazon.com/images/I/71dIHv1zh7L.AC_UY218.jpg', 'Gaming', 'nothing');

-- ==================== 插入测试数据（可选） ====================
-- 密码明文：123456
-- 注意：此 BCrypt 哈希值每次生成都不同，以下为示例值
-- INSERT INTO `t_user` (`username`, `password`, `email`, `phone`, `status`)
-- VALUES ('admin', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36R0x5HFSyXDYkz8e8.2GpW', 'admin@smartmall.com', '13800000000', 1);
