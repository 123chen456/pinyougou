package com.pinyougou.sellergoods.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.entity.PageResult;
import com.pinyougou.mapper.TbBrandMapper;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.pojo.TbBrandExample;
import com.pinyougou.sellergoods.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;

@Service
public class BrandServiceImpl implements BrandService {
    @Autowired
    private TbBrandMapper brandMapper;

    @Override
    public List<TbBrand> fidAll() {
        return brandMapper.selectByExample(null);
    }

    @Override
    public PageResult findPage(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum,pageSize);
        //sql拼接,无参数即为无条件查询
        Page<TbBrand> page =(Page<TbBrand>) brandMapper.selectByExample(null);
        return new PageResult(page.getTotal(),page.getResult());
    }

    @Override
    public void save(TbBrand tbBrand) {
        brandMapper.insert(tbBrand);
    }

    @Override
    public TbBrand findOneById(Long id) {
        return brandMapper.selectByPrimaryKey(id);
    }

    @Override
    public void update(TbBrand tbBrand) {
        brandMapper.updateByPrimaryKey(tbBrand);
    }

    @Override
    public void delte(Long[] ids) {
        for (Long id : ids) {
            brandMapper.deleteByPrimaryKey(id);
        }
    }

    @Override
    public PageResult searchPage(TbBrand tbBrand,int page, int rows) {
        PageHelper.startPage(page,rows);
        TbBrandExample tbBrandExample = new TbBrandExample();
        TbBrandExample.Criteria criteria = tbBrandExample.createCriteria();
        if (tbBrand!=null){
            if (tbBrand.getName()!=null && tbBrand.getName().length()>0){
                criteria.andNameLike("%"+tbBrand.getName()+"%");
            }
            if (tbBrand.getFirstChar()!=null && tbBrand.getFirstChar().length()>0){
                criteria.andFirstCharEqualTo(tbBrand.getFirstChar());
            }
        }
        //sql拼接,参数为null即为无条件查询
        Page<TbBrand> pages =(Page<TbBrand>) brandMapper.selectByExample(tbBrandExample);
        return new PageResult(pages.getTotal(),pages.getResult());
    }

    @Override
    public List<Map> selectOptionList() {
        return brandMapper.selectOptionList();
    }
}
