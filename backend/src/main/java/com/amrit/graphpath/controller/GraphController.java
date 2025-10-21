package com.amrit.graphpath.controller;

import com.amrit.graphpath.model.Graph;
import com.amrit.graphpath.repository.GraphRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class GraphController {

    @Autowired
    private GraphRepository graphRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    // POST API to save a graph
    @PostMapping("/SaveGraph")
    @Transactional
    public String saveGraph(@RequestBody Map<String, Object> payload) {
        try {
            String mapName = (String) payload.get("map_name");
            String graphJson = mapper.writeValueAsString(payload.get("graph"));

            Graph entity = new Graph(mapName, graphJson);
            Graph saved = graphRepository.save(entity);

            return "Graph saved successfully with ID " + saved.getId();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error saving graph: " + e.getMessage();
        }
    }

    // GET API using query parameter ?id=1
    @GetMapping("/fetchgraphs")
    public Map<String, Object> fetchGraph(@RequestParam Integer id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Graph> optionalGraph = graphRepository.findById(id);
            if (optionalGraph.isEmpty()) {
                response.put("error", "Graph not found!");
                return response;
            }

            Graph graph = optionalGraph.get();

            // Convert JSON string back to Map
            Map<String, Object> graphData = mapper.readValue(graph.getGraph(), Map.class);
            response.put("id", graph.getId());
            response.put("mapName", graph.getMapName());
            response.putAll(graphData); // nodes, edges, adjacencyList

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Error fetching graph: " + e.getMessage());
            return response;
        }
    }
}
