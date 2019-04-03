package com.pinyougou.manager.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.entity.PageResult;
import com.pinyougou.entity.Result;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.BrandService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("brand")
public class BrandController {
    @Reference
    private BrandService brandService;

    /**
     * 返回全部列表
     * @return
     */
    @RequestMapping("findAll")
    public List<TbBrand> fidAll(){
        return brandService.fidAll();
    }

    /**
     * 分页查询品牌
     * @param page
     * @param rows
     * @return
     */
    @RequestMapping("findPage")
    public PageResult findPage(@RequestParam(value = "page",required = true) int page,@RequestParam(value = "rows",required = true) int rows){
        return brandService.findPage(page,rows);
    }

    /**
     * 添加品牌
     * @param tbBrand
     * @return
     */
    @RequestMapping("add")
    public Result addBrand(@RequestBody TbBrand tbBrand){
        try{
            brandService.save(tbBrand);
            return new Result(true,"添加成功");
        }catch(Exception e){
            e.printStackTrace();
            return new Result(false,"添加失败");
        }

    }

    /**
     * 根据id查询品牌
     * @param id
     * @return
     */
    @RequestMapping("findOneById")
    public TbBrand findOneById(@RequestParam(value = "id",required = true) Long id){
        return brandService.findOneById(id);
    }

    /**
     * 更新品牌
     * @param tbBrand
     * @return
     */
    @RequestMapping("update")
    public Result update(@RequestBody TbBrand tbBrand){
        try{
            brandService.update(tbBrand);
            return new Result(true,"修改成功");
        }catch(Exception e){
            e.printStackTrace();
            return new Result(false,"修改失败");
        }
    }

    /**
     * 批量删除
     * @param ids
     * @return
     */
    @RequestMapping("delBrand")
    public Result delete(@RequestParam(value = "ids",required = true) Long[] ids){
        try{
            brandService.delte(ids);
            return new Result(true,"删除成功");
        }catch(Exception e){
            e.printStackTrace();
            return new Result(false,"删除失败");
        }
    }

    @RequestMapping("search")
    public PageResult search(@RequestBody TbBrand tbBrand,
                             int page,
                             int rows){
        return brandService.searchPage(tbBrand,page,rows);
    }

    @RequestMapping("/selectOptionList")
    public List<Map> selectOptionList(){
        return brandService.selectOptionList();
    }

}
