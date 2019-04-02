package com.pinyougou.entity;

public class Result {
    private Boolean flag;
    private String message;

    public Result(Boolean flag, String message) {
        super();
        this.flag = flag;
        this.message = message;
    }

    public Boolean getFlag() {
        return flag;
    }

    public void setFlag(Boolean flag) {
        this.flag = flag;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
