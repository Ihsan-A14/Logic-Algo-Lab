// src/utils/treeAlgos.js

export class Node {
    constructor(value, id = null) {
        this.value = value;
        this.id = id || Math.random().toString(36).substr(2, 9);
        this.children = [];
        this.left = null;   
        this.right = null;  
        this.x = 0;
        this.y = 0;
    }
}

// --- 1. BINARY TREE (Search & Manual) ---
export class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    // Standard BST Insert (Auto)
    insert(value) {
        const newNode = new Node(value);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        let current = this.root;
        while (true) {
            if (value === current.value) return; 
            if (value < current.value) {
                if (!current.left) { current.left = newNode; return; }
                current = current.left;
            } else {
                if (!current.right) { current.right = newNode; return; }
                current = current.right;
            }
        }
    }

    // NEW: Manual Insert (Select Parent -> Add Left/Right)
    insertManual(parentId, value, side) {
        const newNode = new Node(value);
        if (!this.root) {
            this.root = newNode;
            return newNode;
        }
        // Helper to find node
        const find = (node) => {
            if (!node) return null;
            if (node.id === parentId) return node;
            return find(node.left) || find(node.right);
        }
        const parent = find(this.root);
        if (parent) {
            if (side === 'left' && !parent.left) parent.left = newNode;
            else if (side === 'right' && !parent.right) parent.right = newNode;
            else return null; // Spot taken
            return newNode;
        }
        return null;
    }

    // --- SEARCH STRATEGIES ---
    getSearchAnimations(target, strategy = 'logic') {
        const animations = [];
        
        // 1. BST Logic (Fast)
        if (strategy === 'logic') {
            let current = this.root;
            while (current) {
                animations.push({ value: current.value, found: false });
                if (target === current.value) {
                    animations.push({ value: current.value, found: true });
                    return { found: true, path: animations };
                }
                if (target < current.value) current = current.left;
                else current = current.right;
            }
            return { found: false, path: animations };
        }

        // 2. BFS (Layer by Layer)
        if (strategy === 'bfs') {
            const queue = [this.root];
            while(queue.length) {
                const node = queue.shift();
                if(!node) continue;
                animations.push({ value: node.value, found: false });
                if (node.value === target) {
                    animations.push({ value: node.value, found: true });
                    return { found: true, path: animations };
                }
                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }
            return { found: false, path: animations };
        }

        // 3. DFS (Deep Scan)
        if (strategy === 'dfs') {
            let found = false;
            const traverse = (node) => {
                if(!node || found) return;
                animations.push({ value: node.value, found: false });
                if(node.value === target) {
                    animations.push({ value: node.value, found: true });
                    found = true;
                    return;
                }
                traverse(node.left);
                traverse(node.right);
            }
            traverse(this.root);
            return { found, path: animations };
        }
    }

    // Traversals
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
    getDFSPreOrderAnimations() {
        const visited = [];
        const traverse = (n) => { if(n) { visited.push(n.value); traverse(n.left); traverse(n.right); }};
        traverse(this.root); return visited;
    }
    getDFSInOrderAnimations() {
        const visited = [];
        const traverse = (n) => { if(n) { traverse(n.left); visited.push(n.value); traverse(n.right); }};
        traverse(this.root); return visited;
    }
    getDFSPostOrderAnimations() {
        const visited = [];
        const traverse = (n) => { if(n) { traverse(n.left); traverse(n.right); visited.push(n.value); }};
        traverse(this.root); return visited;
    }

    // Layout Helper
    getRootForLayout() {
        if (!this.root) return null;
        const clone = (node) => {
            if (!node) return null;
            const newNode = new Node(node.value, node.id);
            if (node.left) newNode.children.push(clone(node.left));
            if (node.right) newNode.children.push(clone(node.right));
            return newNode;
        };
        return clone(this.root);
    }
    
    balance() {
        const values = this.getDFSInOrderAnimations();
        this.root = null;
        const build = (arr) => {
            if(arr.length === 0) return;
            const mid = Math.floor(arr.length / 2);
            this.insert(arr[mid]);
            build(arr.slice(0, mid));
            build(arr.slice(mid+1));
        }
        build(values);
    }
}

// --- 2. GENERAL TREE (N-ary) ---
export class GeneralTree {
    constructor() {
        this.root = null;
    }
    insert(parentId, value) {
        const newNode = new Node(value);
        if (!this.root) {
            this.root = newNode;
            return newNode;
        }
        const parent = this.findNode(this.root, parentId);
        if (parent) {
            parent.children.push(newNode);
            return newNode;
        }
        return null;
    }
    findNode(node, id) {
        if (!node) return null;
        if (node.id === id) return node;
        for (let child of node.children) {
            const found = this.findNode(child, id);
            if (found) return found;
        }
        return null;
    }
    getRootForLayout() { return this.root; }

    // NEW: Search with Strategy
    getSearchAnimations(target, strategy = 'bfs') {
        const animations = [];
        
        if (strategy === 'bfs' || strategy === 'logic') { // Logic falls back to BFS for General
            const queue = [this.root];
            while(queue.length) {
                const node = queue.shift();
                animations.push({ value: node.value, found: false });
                if(node.value === target) {
                    animations.push({ value: node.value, found: true });
                    return { found: true, path: animations };
                }
                queue.push(...node.children);
            }
        } 
        else if (strategy === 'dfs') {
            let found = false;
            const traverse = (node) => {
                if(!node || found) return;
                animations.push({ value: node.value, found: false });
                if(node.value === target) {
                    animations.push({ value: node.value, found: true });
                    found = true;
                    return;
                }
                node.children.forEach(traverse);
            }
            if(this.root) traverse(this.root);
        }
        return { found: false, path: animations };
    }

    // NEW: Traversals
    getBFSAnimations() {
        if(!this.root) return [];
        const res = [];
        const queue = [this.root];
        while(queue.length) {
            const n = queue.shift();
            res.push(n.value);
            queue.push(...n.children);
        }
        return res;
    }
    getDFSPreOrderAnimations() {
        const res = [];
        const traverse = (n) => {
            if(!n) return;
            res.push(n.value);
            n.children.forEach(traverse);
        }
        traverse(this.root);
        return res;
    }
}

// --- LAYOUT ENGINE ---
export const calculateLayout = (rootNode) => {
    if (!rootNode) return null;
    const assignDepth = (node, depth) => {
        node.y = depth * 80;
        node.children.forEach(child => assignDepth(child, depth + 1));
    };
    assignDepth(rootNode, 0);

    let currentX = 0;
    const nodeSize = 80; 
    const assignX = (node) => {
        if (node.children.length === 0) {
            node.x = currentX;
            currentX += nodeSize;
        } else {
            node.children.forEach(assignX);
            const first = node.children[0];
            const last = node.children[node.children.length - 1];
            node.x = (first.x + last.x) / 2;
        }
    };
    assignX(rootNode);
    return rootNode;
};