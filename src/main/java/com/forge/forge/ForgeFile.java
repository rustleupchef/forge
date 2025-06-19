package com.forge.forge;

public class ForgeFile {
    private String name;
    private String path;
    private String type;
    private String content;

    public ForgeFile() {

    }

    public ForgeFile(String name, String path, String type, String content) {
        this.name = name;
        this.path = path;
        this.type = type;
        this.content = content;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
