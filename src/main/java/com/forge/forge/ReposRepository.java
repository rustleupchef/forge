package com.forge.forge;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReposRepository extends JpaRepository<Repos, Long> {
    @Query("SELECT r FROM Repos r WHERE r.name = :name AND r.owner = :owner")
    Repos findByNameAndOwner(
        String name,
        String owner);

    @Query("SELECT r FROM Repos r WHERE r.name = :name")
    List<Repos> findByName(
        String name);
}
