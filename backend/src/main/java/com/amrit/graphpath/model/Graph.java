package com.amrit.graphpath.model;

import jakarta.persistence.*;

@Entity
@Table(name = "graphs")
public class Graph {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "map_name", nullable = false)
    private String mapName;

    @Column(name = "graph", columnDefinition = "json", nullable = false)
    private String graph; // store JSON as string

    public Graph() {}

    public Graph(String mapName, String graph) {
        this.mapName = mapName;
        this.graph = graph;
    }

    // Getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getMapName() { return mapName; }
    public void setMapName(String mapName) { this.mapName = mapName; }

    public String getGraph() { return graph; }
    public void setGraph(String graph) { this.graph = graph; }
}
