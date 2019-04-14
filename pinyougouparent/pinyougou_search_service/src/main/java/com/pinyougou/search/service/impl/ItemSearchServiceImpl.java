package com.pinyougou.search.service.impl;

import com.alibaba.druid.sql.ast.expr.SQLCaseExpr;
import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.*;
import org.springframework.data.solr.core.query.result.*;


import javax.sound.midi.Soundbank;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service(timeout = 3000)
public class ItemSearchServiceImpl implements ItemSearchService {
    @Autowired
    private SolrTemplate solrTemplate;

    @Override
    public Map<String, Object> search(Map searchMap) {

        HashMap<String, Object> map = new HashMap<>();
        Map searchList = searchList(searchMap);
        //
        map.putAll(searchList);
        //查询商品分类列表
        List<String> categoryList = searchCategoryList(searchMap);
        map.put("categoryList",categoryList);
        //查询第一个商品分类的品牌和规格列表
        if(categoryList.size()>0){
            map.putAll(searchBrandAndSpecList(categoryList.get(0)));
        }
        return map;
    }

    private Map searchList(Map searchMap) {
        HashMap<String, Object> map = new HashMap<>();
        HighlightQuery query = new SimpleHighlightQuery();
        HighlightOptions options = new HighlightOptions();
        //在哪一项上添加高亮(高亮域)
        options.addField("item_title");
        options.addField("item_category");
        options.addField("item_seller");
        options.addField("item_brand");
        //设置前缀
        options.setSimplePrefix("<em style='color:red'>");
        //设置后缀
        options.setSimplePostfix("</em>");
        //为查询对象设置高亮选项
        query.setHighlightOptions(options);

        //1.关键字查询
        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));
        query.addCriteria(criteria);

        //2.按照商品分类过滤
        if (!"".equals(searchMap.get("category"))){
            SimpleFilterQuery simpleFilterQuery = new SimpleFilterQuery();
            Criteria criteria1 = new Criteria("item_category").is(searchMap.get("category"));
            simpleFilterQuery.addCriteria(criteria1);
            query.addFilterQuery(simpleFilterQuery);
        }
        //3.按品牌筛选
        if(!"".equals(searchMap.get("brand"))){
            Criteria filterCriteria=new Criteria("item_brand").is(searchMap.get("brand"));
            FilterQuery filterQuery=new SimpleFilterQuery(filterCriteria);
            query.addFilterQuery(filterQuery);
        }
        //4.按规格过滤
        if(searchMap.get("spec")!=null){
            Map<String,String> specMap= (Map) searchMap.get("spec");
            for(String key:specMap.keySet() ){
                Criteria filterCriteria=new Criteria("item_spec_"+key).is( specMap.get(key) );
                FilterQuery filterQuery=new SimpleFilterQuery(filterCriteria);
                query.addFilterQuery(filterQuery);
            }
        }
        //高亮处理
        HighlightPage<TbItem> page = solrTemplate.queryForHighlightPage(query, TbItem.class);
        //高亮入口集合(页面每条记录的高亮入口)
        List<HighlightEntry<TbItem>> entryList = page.getHighlighted();

        for (HighlightEntry<TbItem> entry : entryList) {
            //获取高亮列表(高亮域的个数)
            List<HighlightEntry.Highlight> highlights = entry.getHighlights();
            System.out.println(highlights.size() + "highlight-------");
           /* //每个域可能存储多个值
            for (HighlightEntry.Highlight highlight : highlights) {
                List<String> list = highlight.getSnipplets();
            }*/
            //一个高亮域,域中多个值
            TbItem tbItem = entry.getEntity();
            for (HighlightEntry.Highlight highlight : highlights) {
                List<String> snipplets = highlight.getSnipplets();
                System.out.println(snipplets.size() + "---------------");
                for (String snipplet : snipplets) {
                    tbItem.setTitle(snipplet);
                    tbItem.setCategory(snipplet);
                    tbItem.setSeller(snipplet);
                    tbItem.setBrand(snipplet);
                }
            }
            //一个高亮域,域中一个值
           /* if (highlights.size()>0 && highlights.get(0).getSnipplets().size()>0){
                TbItem tbItem = entry.getEntity();//获取实体
                tbItem.setTitle(highlights.get(0).getSnipplets().get(0)); //我们只有一个高亮域,高亮域中只有一个值,可以直接通过索引取出放入实体类
            }*/
        }
        List<TbItem> content = page.getContent();
        for (TbItem item : content) {
            System.out.println(item.getTitle());
            /* System.out.println(item.getCategory());*/
        }
        map.put("rows", page.getContent());
        return map;
    }

    /**
     * 查询分类列表
     * @param searchMap
     * @return
     */
    public List<String> searchCategoryList(Map searchMap){
        List<String> list = new ArrayList<>();
        SimpleQuery query = new SimpleQuery();
        //根据关键字查询
        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));
        query.addCriteria(criteria);
        //设置分组选项
        GroupOptions options = new GroupOptions();
        options.addGroupByField("item_category"); //select item_category from item where item_category like keywords group by item_category
        query.setGroupOptions(options);
        //得到分组页
        GroupPage<TbItem> groupPage = solrTemplate.queryForGroupPage(query, TbItem.class);
        //得到分组结果对象(一个页面可能又有多个结果集)
        GroupResult<TbItem> groupResult = groupPage.getGroupResult("item_category");
        //得到分页结果入口
        Page<GroupEntry<TbItem>> groupEntries = groupResult.getGroupEntries();
        //得到分页结果集合
        List<GroupEntry<TbItem>> content = groupEntries.getContent();

        for (GroupEntry<TbItem> groupEntry : content) {
            list.add(groupEntry.getGroupValue());
        }
        return list;
    }
    @Autowired
    private RedisTemplate redisTemplate;
    private Map searchBrandAndSpecList(String category){
        Map map=new HashMap();
        Long typeId = (Long) redisTemplate.boundHashOps("tbItemCat").get(category);//获取模板ID
        if(typeId!=null){
            //根据模板ID查询品牌列表
            List brandList = (List) redisTemplate.boundHashOps("brandList").get(typeId);
            map.put("brandList", brandList);//返回值添加品牌列表
            //根据模板ID查询规格列表
            List specList = (List) redisTemplate.boundHashOps("specList").get(typeId);
            map.put("specList", specList);
        }
        return map;
    }

}
