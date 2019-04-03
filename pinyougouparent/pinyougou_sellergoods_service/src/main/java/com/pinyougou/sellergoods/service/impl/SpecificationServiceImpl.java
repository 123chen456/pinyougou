package com.pinyougou.sellergoods.service.impl;
import java.util.List;

import com.pinyougou.entity.PageResult;
import com.pinyougou.mapper.TbSpecificationOptionMapper;
import com.pinyougou.pojo.TbSpecificationOption;
import com.pinyougou.pojo.TbSpecificationOptionExample;
import com.pinyougou.pojogroup.Specification;
import com.pinyougou.sellergoods.service.SpecificationOptionService;
import org.springframework.beans.factory.annotation.Autowired;
import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.mapper.TbSpecificationMapper;
import com.pinyougou.pojo.TbSpecification;
import com.pinyougou.pojo.TbSpecificationExample;
import com.pinyougou.pojo.TbSpecificationExample.Criteria;
import com.pinyougou.sellergoods.service.SpecificationService;


/**
 * 服务实现层
 * @author Administrator
 *
 */
@Service
public class SpecificationServiceImpl implements SpecificationService {

	@Autowired
	private TbSpecificationMapper specificationMapper;
	@Autowired
	private TbSpecificationOptionMapper specificationOptionMapper;
	
	/**
	 * 查询全部
	 */
	@Override
	public List<TbSpecification> findAll() {
		return specificationMapper.selectByExample(null);
	}

	/**
	 * 按分页查询
	 */
	@Override
	public PageResult findPage(int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);		
		Page<TbSpecification> page=   (Page<TbSpecification>) specificationMapper.selectByExample(null);
		return new PageResult(page.getTotal(), page.getResult());
	}

	/**
	 * 增加
	 */
	@Override
	public void add(Specification specification) {
        TbSpecification tdspecification = specification.getSpecification();
        //插入规格
		specificationMapper.insert(tdspecification);
		//循环插入规格选项
		for (TbSpecificationOption tbSpecificationOption : specification.getSpecificationOptionList()) {
            Long id = tdspecification.getId();//获取规格ID （selectkey）
            System.out.println(id);
            tbSpecificationOption.setSpecId(id);//设置规格ID
            specificationOptionMapper.insert(tbSpecificationOption);	//	specificationOptionMapper.insert(specificationOption);
		}
	}

	
	/**
	 * 修改
	 */
	@Override
	public void update(Specification specification){
	    //保存修改的规格
		specificationMapper.updateByPrimaryKey(specification.getSpecification());
		//删除原有的规格（数据库不留没用的数据）
        TbSpecificationOptionExample example=new TbSpecificationOptionExample();
        com.pinyougou.pojo.TbSpecificationOptionExample.Criteria criteria = example.createCriteria();
        criteria.andSpecIdEqualTo(specification.getSpecification().getId());//指定规格ID为条件
        specificationOptionMapper.deleteByExample(example);//删除
        //循环插入规格选项
        for(TbSpecificationOption specificationOption:specification.getSpecificationOptionList()){
            specificationOption.setSpecId(specification.getSpecification().getId());
            specificationOptionMapper.insert(specificationOption);
        }
    }
	
	/**
	 * 根据ID获取实体
	 * @param id
	 * @return
	 */
	@Override
	public Specification findOne(Long id){
        //查询规格
        TbSpecification tbSpecification = specificationMapper.selectByPrimaryKey(id);
        //查询规格列表
        TbSpecificationOptionExample example=new TbSpecificationOptionExample();
        TbSpecificationOptionExample.Criteria criteria = example.createCriteria();
        criteria.andSpecIdEqualTo(id);//根据规格ID查询
        List<TbSpecificationOption> tbSpecificationOptions = specificationOptionMapper.selectByExample(example);
        for (TbSpecificationOption tbSpecificationOption : tbSpecificationOptions) {
            tbSpecification.getId();
        }
        //构建组合实体类返回结果
        Specification specification = new Specification();
        specification.setSpecification(tbSpecification);
        specification.setSpecificationOptionList(tbSpecificationOptions);
        return specification;
    }

	/**
	 * 批量删除
	 */
	@Override
	public void delete(Long[] ids) {
        for(Long id:ids){
            specificationMapper.deleteByPrimaryKey(id);
            //删除原有的规格选项
            TbSpecificationOptionExample example=new TbSpecificationOptionExample();
            com.pinyougou.pojo.TbSpecificationOptionExample.Criteria criteria = example.createCriteria();
            criteria.andSpecIdEqualTo(id);//指定规格ID为条件
            specificationOptionMapper.deleteByExample(example);//删除
        }

    }

    /**
     * 分页查询
     * @param specification
     * @param pageNum 当前页 码
     * @param pageSize 每页记录数
     * @return
     */
		@Override
	public PageResult findPage(TbSpecification specification, int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);
		
		TbSpecificationExample example=new TbSpecificationExample();
		Criteria criteria = example.createCriteria();
		
		if(specification!=null){			
						if(specification.getSpecName()!=null && specification.getSpecName().length()>0){
				criteria.andSpecNameLike("%"+specification.getSpecName()+"%");
			}
	
		}
		
		Page<TbSpecification> page= (Page<TbSpecification>)specificationMapper.selectByExample(example);		
		return new PageResult(page.getTotal(), page.getResult());
	}
	
}
