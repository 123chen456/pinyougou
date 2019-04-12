package com.pinyougou.pojogroup;

import com.pinyougou.pojo.TbGoods;
import com.pinyougou.pojo.TbGoodsDesc;
import com.pinyougou.pojo.TbItem;

import java.io.Serializable;
import java.util.List;

public class Goods implements Serializable{
    private TbGoods goods; //商品SPU
    private TbGoodsDesc goodsDesc; //商品扩展
    private List<TbItem> itemList; //商品SKU列表

    public TbGoods getGoods() {
        return goods;
    }

    public void setGoods(TbGoods goods) {
        this.goods = goods;
    }

    public TbGoodsDesc getGoodsDesc() {
        return goodsDesc;
    }

    public void setGoodsDesc(TbGoodsDesc goodsDesc) {
        this.goodsDesc = goodsDesc;
    }

    public void setItemList(List<TbItem> itemList) {
        this.itemList = itemList;
    }

    public List<TbItem> getItemList() {
        return itemList;
    }
}
