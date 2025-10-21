package com.amrit.graphpath.repository;

import com.amrit.graphpath.model.Graph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GraphRepository extends JpaRepository<Graph, Integer> {
}
