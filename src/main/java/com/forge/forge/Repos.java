package com.forge.forge;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table
public class Repos {
    @Id
    @SequenceGenerator(
            name = "repos_sequence",
            sequenceName = "repos_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "repos_sequence"
    )
    private Long id;
    private String name;
    private String description;
    private String owner;
    private boolean isPrivate;
    private byte type;

    public Repos() {
    }

    public Repos(Long id, String name, String description, String owner, boolean isPrivate, byte type) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.isPrivate = isPrivate;
        this.type = type;
    }

    public Repos(String name, String description, String owner, boolean isPrivate, byte type) {
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.isPrivate = isPrivate;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public void setPrivate(boolean isPrivate) {
        this.isPrivate = isPrivate;
    }

    public byte getType() {
        return type;
    }

    public void setType(byte type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Repos{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", owner='" + owner + '\'' +
                ", isPrivate=" + isPrivate +
                ", type=" + type +
                '}';
    }
}
