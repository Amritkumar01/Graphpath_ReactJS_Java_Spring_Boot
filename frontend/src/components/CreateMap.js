// src/components/CreateMap.js
import React, { useState } from "react";
import "../style/styles2.css";
import { useNavigate } from "react-router-dom"; // for navigation


function CreateMap() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mapName, setMapName] = useState("");

  const navigate = useNavigate();

  // Add node by clicking on plane
  const handlePlaneClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const nodeName = `Node ${nodes.length}`;
    const newNode = { id: nodes.length, name: nodeName, x, y };
    setNodes([...nodes, newNode]);
  };

  // Add edge manually
const handleAddEdge = () => {
  const startId = parseInt(prompt("Enter Start Node ID:"));
  const endId = parseInt(prompt("Enter End Node ID:"));

  if (isNaN(startId) || isNaN(endId)) {
    alert("Invalid node IDs");
    return;
  }

  const startNode = nodes.find((n) => n.id === startId);
  const endNode = nodes.find((n) => n.id === endId);

  if (!startNode || !endNode) {
    alert("Nodes not found");
    return;
  }

  let distance;

  const useAuto = window.confirm("Do you want to calculate distance automatically? (Ok = Manhattan distance, Cancel = Manual input)");

  if (useAuto) {
    // Manhattan distance
    distance = Math.abs(startNode.x - endNode.x) + Math.abs(startNode.y - endNode.y);
  } else {
    // Ask user for distance manually
    const input = prompt("Enter distance between nodes:");
    distance = parseFloat(input);
    if (isNaN(distance) || distance <= 0) {
      alert("Invalid distance entered");
      return;
    }
  }

  setEdges([...edges, { from: startNode, to: endNode, distance }]);
};


    const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

  const handleSaveGraph = async () => {
    const adjacencyList = {};
    nodes.forEach((n) => (adjacencyList[n.name] = []));
    
    edges.forEach((e) => {
      // Add both directions for undirected graph
      adjacencyList[e.from.name].push({ node: e.to.name, distance: e.distance });
      adjacencyList[e.to.name].push({ node: e.from.name, distance: e.distance });
    });

  // Wrap everything into "graph"
  const payload = {
    map_name: mapName,
    graph: {
      nodes,
      edges: edges.map((e) => ({
        from: e.from.name,
        to: e.to.name,
        distance: e.distance,
      })),
      adjacencyList,
    },
  };

    try {
      const response = await fetch(`${backendURL}/api/SaveGraph`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.text();
      alert(`Graph saved: ${result}`);
    } catch (err) {
      console.error("Error saving graph", err);
    }
  };

  return (
    <div className="map-container">
      <div
        id="plane"
        className="plane"
        onClick={handlePlaneClick}
        style={{
          position: "relative",
          width: "1470px",
          height: "600px",
          border: "1px solid black",
        }}
      >
        {/* SVG overlay for edges */}
        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            pointerEvents: "none",
          }}
        >
          {edges.map((e, i) => (
            <line
              key={i}
              x1={e.from.x}
              y1={e.from.y}
              x2={e.to.x}
              y2={e.to.y}
              stroke="blue"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Draw nodes */}
        {nodes.map((n) => (
          <div
            key={n.id}
            className="point"
            style={{
              left: n.x - 5,
              top: n.y - 5,
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "red",
              position: "absolute",
              color: "white",
              fontSize: "10px",
              textAlign: "center",
              lineHeight: "10px",
            }}
          >
            {n.id}
          </div>
        ))}
      </div>

      <h3>Nodes</h3>
      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((n) => (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td>{n.name}</td>
              <td>{n.x}</td>
              <td>{n.y}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Edges</h3>
      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Distance</th>
          </tr>
        </thead>
        <tbody>
          {edges.map((e, i) => (
            <tr key={i}>
              <td>{e.from.name}</td>
              <td>{e.to.name}</td>
              <td>{Math.round(e.distance)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="buttons-container">
        <button onClick={handleAddEdge}>Create Edge</button>
      </div>

      <input
        type="text"
        value={mapName}
        placeholder="Enter Map Name"
        onChange={(e) => setMapName(e.target.value)}
      />
      <button onClick={handleSaveGraph}>Submit</button>
      <br></br>
      <button
        style={{ marginBottom: "15px" }}
        onClick={() => navigate("/")}
      >
        ⬅ Back to Home
      </button>
    </div>
  );
}

export default CreateMap;
