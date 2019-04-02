package com.pinyougou.entity;

import java.io.Serializable;
import java.util.List;

/**
 * 分页结果封装对象
 */
public class PageResult implements Serializable {
    private Long tatal;//总记录数
    private List rows;//当前页结果集

    public PageResult(Long tatal, List rows) {
        this.tatal = tatal;
        this.rows = rows;
    }

    public Long getTatal() {
        return tatal;
    }

    public void setTatal(Long tatal) {
        this.tatal = tatal;
    }

    public List getRows() {
        return rows;
    }

    public void setRows(List rows) {
        this.rows = rows;
    }
}
