import React, { useState } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";
import "../style/styles3.css";

const ShowMap = () => {
  const [mapId, setMapId] = useState("");
  const [graphData, setGraphData] = useState(null);
  const [startNode, setStartNode] = useState("");
  const [endNode, setEndNode] = useState("");
  const [allPaths, setAllPaths] = useState([]);
  const [shortestPath, setShortestPath] = useState(null);

  const navigate = useNavigate();

  // ✅ Fetch graph from backend
  const fetchGraph = async () => {
    if (!mapId) {
      alert("Please enter a valid Map ID!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/fetchgraphs?id=${mapId}`);
      const data = await response.json();

      if (!data || data.error) {
        alert("Map not found!");
      } else {
        setGraphData(data);
        setShortestPath(null);
        setAllPaths([]);
        drawGraph(data);
      }
    } catch (error) {
      console.error("Error fetching graph:", error);
    }
  };

  // ✅ Draw Graph
  const drawGraph = (data, highlightPath = []) => {
    const svg = d3.select("#graphCanvas");
    svg.selectAll("*").remove();

    const adjacencyList = data.adjacencyList;
    const nodeCoordinates = {};
    data.nodes.forEach(node => (nodeCoordinates[node.name] = { x: node.x, y: node.y }));

    Object.keys(adjacencyList).forEach(start => {
      adjacencyList[start].forEach(edge => {
        const x1 = nodeCoordinates[start].x;
        const y1 = nodeCoordinates[start].y;
        const x2 = nodeCoordinates[edge.node].x;
        const y2 = nodeCoordinates[edge.node].y;

        const isPathEdge = highlightPath.some(
          (n, i) =>
            (n === start && highlightPath[i + 1] === edge.node) ||
            (n === edge.node && highlightPath[i + 1] === start)
        );

        svg
          .append("line")
          .attr("x1", x1)
          .attr("y1", y1)
          .attr("x2", x2)
          .attr("y2", y2)
          .attr("stroke", isPathEdge ? "red" : "black")
          .attr("stroke-width", isPathEdge ? 4 : 2);

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        svg
          .append("text")
          .attr("x", midX)
          .attr("y", midY - 10)
          .text(edge.distance.toFixed(2))
          .attr("fill", "red")
          .attr("font-size", "14px");
      });
    });

    Object.keys(nodeCoordinates).forEach(node => {
      const { x, y } = nodeCoordinates[node];
      const isPathNode = highlightPath.includes(node);

      svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 12)
        .attr("fill", isPathNode ? "orange" : "steelblue")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

      svg
        .append("text")
        .attr("x", x + 15)
        .attr("y", y + 5)
        .text(node)
        .attr("font-size", "12px")
        .attr("fill", "black");
    });
  };

  // ✅ DFS for all paths
  const findAllPathsDFS = (start, end, adjacencyList) => {
    const allPathsList = [];
    const distances = [];

    const dfs = (current, target, visited, path, distance) => {
      visited.add(current);
      path.push(current);

      if (current === target) {
        allPathsList.push([...path]);
        distances.push(distance);
      } else {
        adjacencyList[current]?.forEach(neighbor => {
          if (!visited.has(neighbor.node)) {
            dfs(neighbor.node, target, new Set(visited), [...path], distance + neighbor.distance);
          }
        });
      }

      path.pop();
    };

    dfs(start, end, new Set(), [], 0);
    return { allPathsList, distances };
  };

  // ✅ Dijkstra’s Algorithm for shortest path
  const findShortestPathDijkstra = (start, end, adjacencyList) => {
    const distances = {};
    const previous = {};
    const pq = new Set(Object.keys(adjacencyList));

    Object.keys(adjacencyList).forEach(node => {
      distances[node] = Infinity;
      previous[node] = null;
    });
    distances[start] = 0;

    while (pq.size > 0) {
      const current = Array.from(pq).reduce((a, b) =>
        distances[a] < distances[b] ? a : b
      );
      pq.delete(current);

      if (current === end) break;

      adjacencyList[current]?.forEach(neighbor => {
        const alt = distances[current] + neighbor.distance;
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          previous[neighbor.node] = current;
        }
      });
    }

    // Reconstruct shortest path
    const path = [];
    let curr = end;
    while (curr) {
      path.unshift(curr);
      curr = previous[curr];
    }

    return { path, distance: distances[end] };
  };

  // ✅ Main handler: DFS (for all paths) + Dijkstra (for shortest)
  const handleFindPaths = () => {
    if (!graphData) {
      alert("Graph not loaded!");
      return;
    }
    if (!startNode || !endNode) {
      alert("Enter start and end nodes");
      return;
    }

    const { adjacencyList } = graphData;

    // 1️⃣ Find all paths using DFS
    const { allPathsList, distances } = findAllPathsDFS(startNode, endNode, adjacencyList);

    if (allPathsList.length === 0) {
      alert("No paths found!");
      return;
    }

    setAllPaths(allPathsList.map((p, i) => ({ path: p, distance: distances[i] })));

    // 2️⃣ Find shortest path using Dijkstra
    const shortest = findShortestPathDijkstra(startNode, endNode, adjacencyList);

    setShortestPath(shortest);
    drawGraph(graphData, shortest.path);
  };

  return (
    <div className="container">
      {graphData && <h2>Map Name: {graphData.mapName}</h2>}

      <h3>Enter Map ID</h3>
      <input type="number" placeholder= "Enter Map ID" value={mapId} onChange={e => setMapId(e.target.value)} />
      <button onClick={fetchGraph}>Go</button>

      <h3>Graph Visualization</h3>
      <svg id="graphCanvas" width="1500" height="600" style={{ border: "1px solid black", background: "#f8f9fa" }}></svg>

      <h3>Find Paths</h3>
      <input
        type="text"
        placeholder="Start Node"
        value={startNode}
        onChange={e => setStartNode(e.target.value)}
      />
      <input
        type="text"
        placeholder="End Node"
        value={endNode}
        onChange={e => setEndNode(e.target.value)}
      />
      <button onClick={handleFindPaths}>Find Paths</button>

      {shortestPath && (
        <div>
          <h4>✅ Shortest Path (Dijkstra):</h4>
          <p>
            {shortestPath.path.join(" ➝ ")} (Distance:{" "}
            {shortestPath.distance.toFixed(2)})
          </p>
        </div>
      )}

      {allPaths.length > 0 && (
        <div>
          <h4>All Paths (DFS):</h4>
          <ul>
            {allPaths.map((p, i) => (
              <li key={i}>
                {p.path.join(" ➝ ")} (Distance: {p.distance.toFixed(2)})
              </li>
            ))}
          </ul>
        </div>
      )}
      <br />
      <button style={{ marginBottom: "15px" }} onClick={() => navigate("/")}>
        ⬅ Back to Home
      </button>
    </div>
  );
};

export default ShowMap;
