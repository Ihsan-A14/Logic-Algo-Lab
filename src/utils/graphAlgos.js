// src/utils/graphAlgos.js

// Helper: Calculate Euclidean distance between two nodes
const getDistance = (nodeA, nodeB) => {
    return Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2));
};

// Reconstruct path from "cameFrom" map
const reconstructPath = (cameFrom, startId, endId) => {
    const path = [];
    let current = endId;
    while (current && current !== startId) {
        path.unshift(current);
        current = cameFrom[current];
    }
    if (current === startId) path.unshift(startId);
    return path;
};

// --- 1. BFS (Breadth-First Search) ---
// Explores equally in all directions (Layer by Layer)
export const getBFSAnimations = (nodes, edges, startId, endId) => {
    const visitedOrder = [];
    const queue = [startId];
    const visited = new Set([startId]);
    const cameFrom = {};

    while (queue.length > 0) {
        const currId = queue.shift();
        visitedOrder.push(currId);

        if (currId === endId) break; // Found target

        // Find neighbors
        const neighbors = edges.filter(e => e.source === currId || e.target === currId);
        
        for (let edge of neighbors) {
            const nextId = edge.source === currId ? edge.target : edge.source;
            if (!visited.has(nextId)) {
                visited.add(nextId);
                cameFrom[nextId] = currId;
                queue.push(nextId);
            }
        }
    }
    const path = reconstructPath(cameFrom, startId, endId);
    return { visitedOrder, path };
};

// --- 2. DFS (Depth-First Search) ---
// Explores as deep as possible before backtracking
export const getDFSAnimations = (nodes, edges, startId, endId) => {
    const visitedOrder = [];
    const visited = new Set();
    const cameFrom = {};
    let found = false;

    const traverse = (currId) => {
        if (found || visited.has(currId)) return;
        visited.add(currId);
        visitedOrder.push(currId);

        if (currId === endId) {
            found = true;
            return;
        }

        const neighbors = edges.filter(e => e.source === currId || e.target === currId);
        for (let edge of neighbors) {
            const nextId = edge.source === currId ? edge.target : edge.source;
            if (!visited.has(nextId)) {
                cameFrom[nextId] = currId;
                traverse(nextId);
            }
        }
    };

    traverse(startId);
    const path = found ? reconstructPath(cameFrom, startId, endId) : [];
    return { visitedOrder, path };
};

// --- 3. DIJKSTRA (Shortest Path) ---
// Uses weights. Explores cheapest nodes first.
export const getDijkstraAnimations = (nodes, edges, startId, endId) => {
    const visitedOrder = [];
    const distances = {};
    const cameFrom = {};
    const unvisited = new Set(nodes.map(n => n.id));

    nodes.forEach(n => distances[n.id] = Infinity);
    distances[startId] = 0;

    while (unvisited.size > 0) {
        // Get node with smallest distance
        let currentId = null;
        let minDist = Infinity;
        
        for (let id of unvisited) {
            if (distances[id] < minDist) {
                minDist = distances[id];
                currentId = id;
            }
        }

        if (currentId === null || distances[currentId] === Infinity) break; // No reachable nodes left
        if (currentId === endId) {
            visitedOrder.push(currentId);
            break;
        }

        unvisited.delete(currentId);
        visitedOrder.push(currentId);

        // Process neighbors
        const neighbors = edges.filter(e => e.source === currentId || e.target === currentId);
        for (let edge of neighbors) {
            const neighborId = edge.source === currentId ? edge.target : edge.source;
            if (unvisited.has(neighborId)) {
                // Default weight is distance, or explicit weight if you added that feature
                const weight = edge.weight || getDistance(nodes.find(n=>n.id===currentId), nodes.find(n=>n.id===neighborId));
                const newDist = distances[currentId] + weight;
                
                if (newDist < distances[neighborId]) {
                    distances[neighborId] = newDist;
                    cameFrom[neighborId] = currentId;
                }
            }
        }
    }
    const path = distances[endId] !== Infinity ? reconstructPath(cameFrom, startId, endId) : [];
    return { visitedOrder, path };
};

// --- 4. A* (A-Star) ---
// Dijkstra + Heuristic (Distance to goal). Smartest pathfinding.
export const getAStarAnimations = (nodes, edges, startId, endId) => {
    const visitedOrder = [];
    
    // gScore: cost from start
    const gScore = {}; 
    nodes.forEach(n => gScore[n.id] = Infinity);
    gScore[startId] = 0;

    // fScore: gScore + heuristic (cost to end)
    const fScore = {};
    nodes.forEach(n => fScore[n.id] = Infinity);
    
    const startNode = nodes.find(n => n.id === startId);
    const endNode = nodes.find(n => n.id === endId);
    
    fScore[startId] = getDistance(startNode, endNode);

    const openSet = new Set([startId]);
    const cameFrom = {};

    while (openSet.size > 0) {
        // Get node with lowest fScore
        let currentId = null;
        let minF = Infinity;
        for (let id of openSet) {
            if (fScore[id] < minF) {
                minF = fScore[id];
                currentId = id;
            }
        }

        if (currentId === endId) {
            visitedOrder.push(currentId);
            break;
        }

        openSet.delete(currentId);
        visitedOrder.push(currentId);

        const neighbors = edges.filter(e => e.source === currentId || e.target === currentId);
        for (let edge of neighbors) {
            const neighborId = edge.source === currentId ? edge.target : edge.source;
            
            const weight = edge.weight || getDistance(nodes.find(n=>n.id===currentId), nodes.find(n=>n.id===neighborId));
            const tentativeG = gScore[currentId] + weight;

            if (tentativeG < gScore[neighborId]) {
                cameFrom[neighborId] = currentId;
                gScore[neighborId] = tentativeG;
                
                const neighborNode = nodes.find(n => n.id === neighborId);
                fScore[neighborId] = gScore[neighborId] + getDistance(neighborNode, endNode);
                
                if (!openSet.has(neighborId)) {
                    openSet.add(neighborId);
                }
            }
        }
    }
    
    const path = reconstructPath(cameFrom, startId, endId);
    // If we didn't reach end, path might be invalid
    const found = visitedOrder.includes(endId);
    return { visitedOrder, path: found ? path : [] };
};