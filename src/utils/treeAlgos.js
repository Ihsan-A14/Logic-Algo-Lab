// src/utils/treeAlgos.js

class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0; // Coordinates for visualizer
        this.y = 0;
    }
}

export class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new Node(value);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        let current = this.root;
        while (true) {
            if (value === current.value) return undefined; // No duplicates
            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    return;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    return;
                }
                current = current.right;
            }
        }
    }

    // Breadth First Search (Level Order)
    getBFSAnimations() {
        if (!this.root) return [];
        const queue = [this.root];
        const visited = [];
        while (queue.length) {
            const node = queue.shift();
            visited.push(node.value);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        return visited;
    }

    // Depth First Search (PreOrder)
    getDFSPreOrderAnimations() {
        const visited = [];
        function traverse(node) {
            if (!node) return;
            visited.push(node.value);
            traverse(node.left);
            traverse(node.right);
        }
        traverse(this.root);
        return visited;
    }

    // DFS (InOrder)
    getDFSInOrderAnimations() {
        const visited = [];
        function traverse(node) {
            if (!node) return;
            traverse(node.left);
            visited.push(node.value);
            traverse(node.right);
        }
        traverse(this.root);
        return visited;
    }

    // Helper to calculate coordinates for SVG drawing
    calculatePositions(width = 800, height = 400) {
        if (!this.root) return;
        
        const traverse = (node, x, y, level, spread) => {
            if (!node) return;
            node.x = x;
            node.y = y;
            
            // Decrease spread as we go down
            const nextSpread = spread / 1.8; 
            
            traverse(node.left, x - spread, y + 60, level + 1, nextSpread);
            traverse(node.right, x + spread, y + 60, level + 1, nextSpread);
        };
        
        traverse(this.root, width / 2, 40, 0, width / 4);
        return this.root;
    }
}