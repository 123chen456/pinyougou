package com.pinyougou.sellergoods.service;

import com.pinyougou.entity.PageResult;
import com.pinyougou.pojo.TbBrand;

import java.util.List;
import java.util.Map;

public interface BrandService {
    /**
     * 返回全部列表
     * @return
     */
    public List<TbBrand> fidAll();

    /**
     * 返回分页列表
     * @param pageNum
     * @param pageSize
     * @return
     */
    public PageResult findPage(int pageNum,int pageSize);

    /**
     * 添加品牌
     * @param tbBrand
     */
    void save(TbBrand tbBrand);

    /**
     * 根据id查询一个品牌
     * @param id
     * @return
     */
    TbBrand findOneById(Long id);

    /**
     * 更新品牌
     * @param tbBrand
     */
    void update(TbBrand tbBrand);

    /**
     * 删除品牌
     * @param ids
     */
    void delte(Long[] ids);

    /**
     * 条件查询 and 分页
     * @param page
     * @param rows
     * @param tbBrand
     * @return
     */
    PageResult searchPage(TbBrand tbBrand,int page, int rows);
    /**
     * 品牌下拉框数据
     */
    List<Map> selectOptionList();

}
