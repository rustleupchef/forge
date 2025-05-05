package com.forge.forge;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReposService {
    private final ReposRepository reposRepository;

    @Autowired
    public ReposService(ReposRepository reposRepository) {
        this.reposRepository = reposRepository;
    }

    public void saveRepos(Repos repos) {
        reposRepository.save(repos);
    }

    public Repos findReposByNameAndOwner(String name, String owner) {
        return reposRepository.findByNameAndOwner(name, owner);
    }

    public void deleteRepos(Long id) {
        reposRepository.deleteById(id);
    }

    public void updateRepos(Repos repos) {
        saveRepos(repos);
    }

    public Repos findReposById(Long id) {
        return reposRepository.findById(id).orElse(null);
    }

    public List<Repos> findAllRepos() {
        return reposRepository.findAll();
    }

    public List<Repos> findReposByOwner(String name) {
        return reposRepository.findByOwner(name);
    }
}
