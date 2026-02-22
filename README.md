# 🧪 AlgoVista

> **HackED 2026 Submission**
>
> **Tracks:** Social Good (Education) & General HackED (Main Prize)

## 💡 The Problem
Computer Science students often struggle to connect the dots between **low-level hardware logic** (Boolean algebra, logic gates) and **high-level software algorithms** (sorting, searching). These concepts are usually taught in separate classes with static textbooks, making it hard to visualize how a computer actually processes information from the ground up.

## 🚀 The Solution
**AlgoVista** is an interactive, all-in-one educational suite that bridges this gap. It provides a visual "workbench" where students can:
1.  **Build & Simplify Logic:** Input raw boolean expressions to instantly generate Truth Tables and visualize circuits.
2.  **Visualize Algorithms:** Watch sorting and searching algorithms manipulate data in real-time to understand *how* they work, not just *that* they work.

By combining these domains, AlgoVista serves as a comprehensive "CS Tutor" that is free, accessible, and interactive.

## ✨ Key Features

### 🛠️ Module 1: The Logic Lab (Hardware)
* **Truth Table Generator:** Instantly parses complex boolean expressions (e.g., `(A + B) * C`) and generates a formatted Truth Table.
* **Logic Simplifier:** Uses the **Quine-McCluskey algorithm** to minimize boolean expressions, showing students the most efficient hardware implementation.
* **Circuit Renderer:** Dynamically draws the logic gates corresponding to the user's input, helping students visualize the physical hardware.

### 📊 Module 2: The Algorithm Arena (Software)
* **Sorting Visualizer:** Implements **Bubble Sort**, **Selection Sort**, and **Quick Sort**.
    * *Visuals:* Bars change color to distinguish between **comparison** (evaluating) and **swapping** (memory operation), making the internal logic visible.
* **Searching Visualizer:**
    * **Linear Search:** Scans elements sequentially to find a target.
    * **Binary Search:** Visually "cuts" the array in half, graying out discarded sections to demonstrate $O(\log n)$ efficiency.
    * *Educational Constraint:* The UI enforces that **Binary Search only works on sorted data**, reinforcing a critical CS concept.

## 🛠️ Tech Stack
* **Frontend:** React.js (Vite)
* **State Management:** React Hooks (`useState`, `useEffect`) for managing algorithm animation frames.
* **Styling:** Tailwind CSS for a modern, responsive design.
* **Visualization:** Custom CSS animations & Mermaid.js / SimcirJS (for logic circuits).

## ⚙️ Installation & Setup

To run this project locally:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/Logic-Algo-Lab.git]
    cd Logic-Algo-Lab
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```
    Open your browser to the local host link provided (usually `http://localhost:5173`).

## 📂 Project Structure
```text
Logic-Algo-Lab/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation between modules
│   │   ├── Logic/
│   │   │   ├── TruthTable.jsx   # Logic parsing & table generation
│   │   │   └── CircuitDrawer.jsx # Logic gate visualization
│   │   ├── Algorithms/
│   │   │   ├── SortingVisualizer.jsx # Bubble/Quick sort logic
│   │   │   └── SearchingVisualizer.jsx # Binary/Linear search logic
│   │   └── UI/
│   │       └── Button.jsx       # Reusable UI components
│   ├── utils/
│   │   ├── logicParser.js       # Core boolean logic & Quine-McCluskey
│   │   └── sortingAlgos.js      # Sorting algorithms implementation
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.mdV