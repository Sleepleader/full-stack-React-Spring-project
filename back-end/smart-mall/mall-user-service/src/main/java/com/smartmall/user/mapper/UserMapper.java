package com.smartmall.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.smartmall.common.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户 Mapper 接口
 * <p>
 * 继承 MyBatis-Plus 的 BaseMapper，自动提供基本 CRUD 操作
 * 无需编写 XML 映射文件
 * </p>
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
    // BaseMapper 已提供：
    // - insert(entity)        插入
    // - selectById(id)        按 ID 查询
    // - selectOne(wrapper)    条件查询单条
    // - selectList(wrapper)   条件查询列表
    // - updateById(entity)    按 ID 更新
    // - deleteById(id)        按 ID 删除
    // 如需自定义 SQL，可在此添加方法并配合 @Select 等注解
}
