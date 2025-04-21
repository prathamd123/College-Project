// import React, { useState, useEffect } from "react";
// import * as d3 from "d3";

// class BPlusTreeNode {
//   constructor(isLeaf = false) {
//     this.isLeaf = isLeaf;
//     this.keys = [];
//     this.children = [];
//   }
// }

// class BPlusTree {
//   constructor(order = 3) {
//     this.root = new BPlusTreeNode(true);
//     this.order = order;
//   }

//   insert(value) {
//     let root = this.root;
//     if (root.keys.length === this.order - 1) {
//       let newRoot = new BPlusTreeNode();
//       newRoot.children.push(root);
//       this.splitChild(newRoot, 0);
//       this.root = newRoot;
//     }
//     this.insertNonFull(this.root, value);
//   }

//   insertNonFull(node, value) {
//     if (node.isLeaf) {
//       node.keys.push(value);
//       node.keys.sort((a, b) => a - b);
//     } else {
//       let i = node.keys.length - 1;
//       while (i >= 0 && value < node.keys[i]) i--;
//       i++;
//       if (node.children[i].keys.length === this.order - 1) {
//         this.splitChild(node, i);
//         if (value > node.keys[i]) i++;
//       }
//       this.insertNonFull(node.children[i], value);
//     }
//   }

//   splitChild(parent, index) {
//     let child = parent.children[index];
//     let mid = Math.floor((this.order - 1) / 2);
//     let newNode = new BPlusTreeNode(child.isLeaf);

//     parent.keys.splice(index, 0, child.keys[mid]);
//     parent.children.splice(index + 1, 0, newNode);

//     newNode.keys = child.keys.splice(mid + 1);
//     if (!child.isLeaf) newNode.children = child.children.splice(mid + 1);

//     if (child.isLeaf) {
//       newNode.children = child.children;
//       child.children = [newNode];
//     }
//   }

//   search(value) {
//     return this._search(this.root, value);
//   }

//   _search(node, value) {
//     let i = 0;
//     while (i < node.keys.length && value > node.keys[i]) i++;
//     if (i < node.keys.length && value === node.keys[i]) return node;
//     if (node.isLeaf) return null;
//     return this._search(node.children[i], value);
//   }
// }

// const BPlusTreeVisualizer = () => {
//   const [tree, setTree] = useState(new BPlusTree(3));
//   const [inputValue, setInputValue] = useState("");
//   const [searchValue, setSearchValue] = useState("");
//   const [searchResult, setSearchResult] = useState(null);

//   useEffect(() => {
//     drawTree();
//   }, [tree, searchResult]);

//   const drawTree = () => {
//     d3.select("#bptree-container").selectAll("*").remove();
//     if (!tree.root) return;

//     const svgWidth = 800;
//     const svgHeight = 400;
//     const svg = d3
//       .select("#bptree-container")
//       .append("svg")
//       .attr("width", svgWidth)
//       .attr("height", svgHeight);

//     const drawNode = (node, x, y, depth) => {
//       if (!node) return;
//       const nodeWidth = 50 + node.keys.length * 30;
//       const gap = 150 / (depth + 1);

//       let rect = svg
//         .append("rect")
//         .attr("x", x - nodeWidth / 2)
//         .attr("y", y)
//         .attr("width", nodeWidth)
//         .attr("height", 40)
//         .attr("rx", 10)
//         .attr("ry", 10)
//         .style("fill", searchResult === node ? "yellow" : "lightblue")
//         .style("stroke", "black");

//       node.keys.forEach((key, i) => {
//         svg
//           .append("text")
//           .attr("x", x - nodeWidth / 2 + 15 + i * 30)
//           .attr("y", y + 25)
//           .text(key)
//           .style("font-size", "14px")
//           .style("font-weight", "bold");
//       });

//       if (!node.isLeaf) {
//         node.children.forEach((child, i) => {
//           let childX = x - (node.children.length - 1) * gap + i * gap * 2;
//           let childY = y + 80;
//           svg
//             .append("line")
//             .attr("x1", x)
//             .attr("y1", y + 40)
//             .attr("x2", childX)
//             .attr("y2", childY)
//             .style("stroke", "black");
//           drawNode(child, childX, childY, depth + 1);
//         });
//       }
//     };

//     drawNode(tree.root, svgWidth / 2, 50, 1);
//   };

//   const handleInsert = () => {
//     if (inputValue === "") return;
//     const newTree = Object.assign(new BPlusTree(tree.order), tree);
//     newTree.insert(parseInt(inputValue));
//     setTree(newTree);
//     setInputValue("");
//   };

//   const handleSearch = () => {
//     if (searchValue === "") return;
//     const foundNode = tree.search(parseInt(searchValue));
//     setSearchResult(foundNode);
//   };

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h2>B+ Tree Visualization</h2>
//       <input
//         type="number"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         placeholder="Insert Value"
//       />
//       <button onClick={handleInsert}>Insert</button>
//       <input
//         type="number"
//         value={searchValue}
//         onChange={(e) => setSearchValue(e.target.value)}
//         placeholder="Search"
//       />
//       <button onClick={handleSearch}>Search</button>
//       <div
//         id="bptree-container"
//         style={{
//           border: "1px solid black",
//           marginTop: "10px",
//           width: "100%",
//           height: "400px",
//         }}
//       ></div>
//     </div>
//   );
// };

// export default BPlusTreeVisualizer;


import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const BPlusTreeVisualizer = () => {
  const [tree, setTree] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [traversalResult, setTraversalResult] = useState("");
  const [order, setOrder] = useState(4);

  class BPlusNode {
    constructor(isLeaf = false) {
      this.isLeaf = isLeaf;
      this.keys = [];
      this.children = isLeaf ? [] : [];
      this.next = null;
    }
  }

  class BPlusTree {
    constructor(order) {
      this.order = order;
      this.root = new BPlusNode(true);
    }

    insert(key) {
      const root = this.root;
      if (root.keys.length >= this.order - 1) {
        const newRoot = new BPlusNode(false);
        newRoot.children.push(root);
        this.splitChild(newRoot, 0);
        this.root = newRoot;
      }
      this.insertNonFull(this.root, key);
    }

    insertNonFull(node, key) {
      if (node.isLeaf) {
        const pos = node.keys.findIndex(k => k > key);
        node.keys.splice(pos === -1 ? node.keys.length : pos, 0, key);
      } else {
        let i = node.keys.findIndex(k => k > key);
        if (i === -1) i = node.children.length - 1;
        const child = node.children[i];
        if (child.keys.length >= this.order - 1) {
          this.splitChild(node, i);
          if (key > node.keys[i]) i++;
        }
        this.insertNonFull(node.children[i], key);
      }
    }

    splitChild(parent, index) {
      const order = this.order;
      const child = parent.children[index];
      const newNode = new BPlusNode(child.isLeaf);
      const mid = Math.floor((order - 1) / 2);

      newNode.keys = child.keys.splice(mid + (child.isLeaf ? 0 : 1));
      if (!child.isLeaf) {
        newNode.children = child.children.splice(mid + 1);
      } else {
        newNode.next = child.next;
        child.next = newNode;
      }

      parent.keys.splice(index, 0, child.isLeaf ? newNode.keys[0] : child.keys.pop());
      parent.children.splice(index + 1, 0, newNode);
    }

    search(key) {
      let node = this.root;
      while (node) {
        if (node.isLeaf) {
          return node.keys.includes(key) ? key : null;
        }
        const i = node.keys.findIndex(k => k > key);
        node = node.children[i === -1 ? node.children.length - 1 : i];
      }
      return null;
    }

    delete(key) {
      this.deleteKey(this.root, key);
      if (!this.root.isLeaf && this.root.keys.length === 0 && this.root.children.length === 1) {
        this.root = this.root.children[0];
      }
    }

    deleteKey(node, key) {
      if (node.isLeaf) {
        const index = node.keys.indexOf(key);
        if (index !== -1) node.keys.splice(index, 1);
      } else {
        let i = node.keys.findIndex(k => k > key);
        if (i === -1) i = node.children.length - 1;
        const child = node.children[i];
        this.deleteKey(child, key);

        // Simplified deletion - no merging or borrowing for now
        if (child.keys.length < Math.ceil(this.order / 2) - 1 && !child.isLeaf) {
          this.balanceNodes(node, i);
        }
      }
    }

    balanceNodes(parent, index) {
      // Basic balancing - merge with sibling if possible (simplified)
      const child = parent.children[index];
      if (index > 0) {
        const left = parent.children[index - 1];
        if (left.keys.length > Math.ceil(this.order / 2) - 1) {
          child.keys.unshift(parent.keys[index - 1]);
          parent.keys[index - 1] = left.keys.pop();
          if (!child.isLeaf) child.children.unshift(left.children.pop());
          return;
        }
      }
      if (index < parent.children.length - 1) {
        const right = parent.children[index + 1];
        if (right.keys.length > Math.ceil(this.order / 2) - 1) {
          child.keys.push(parent.keys[index]);
          parent.keys[index] = right.keys.shift();
          if (!child.isLeaf) child.children.push(right.children.shift());
          return;
        }
      }
    }

    inorder() {
      const result = [];
      let node = this.root;
      while (node && !node.isLeaf) node = node.children[0];
      while (node) {
        result.push(...node.keys);
        node = node.next;
      }
      return result.join(", ");
    }

    preorder() {
      const result = [];
      this.preorderTraversal(this.root, result);
      return result.join(", ");
    }

    preorderTraversal(node, result) {
      if (!node) return;
      result.push(...node.keys);
      if (!node.isLeaf) node.children.forEach(child => this.preorderTraversal(child, result));
    }

    postorder() {
      const result = [];
      this.postorderTraversal(this.root, result);
      return result.join(", ");
    }

    postorderTraversal(node, result) {
      if (!node) return;
      if (!node.isLeaf) node.children.forEach(child => this.postorderTraversal(child, result));
      result.push(...node.keys);
    }

    clone() {
      const newTree = new BPlusTree(this.order);
      newTree.root = this.cloneNode(this.root);
      return newTree;
    }

    cloneNode(node) {
      const newNode = new BPlusNode(node.isLeaf);
      newNode.keys = [...node.keys];
      if (!node.isLeaf) newNode.children = node.children.map(child => this.cloneNode(child));
      if (node.next) newNode.next = this.cloneNode(node.next);
      return newNode;
    }
  }

  useEffect(() => {
    drawTree();
  }, [tree, searchResult]);

  const getTreeDepth = (node) => {
    if (!node || node.isLeaf) return 1;
    return 1 + Math.max(...node.children.map(child => getTreeDepth(child)));
  };

  const drawTree = () => {
    d3.select("#tree-container").selectAll("*").remove();
    if (!tree || !tree.root) return;

    const svgWidth = 1200;
    const svgHeight = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const depth = getTreeDepth(tree.root);

    const verticalSpacing = Math.min(150, Math.max(400 / depth, 80));
    const nodeWidth = 120;
    const keyWidth = 30;

    const svg = d3
      .select("#tree-container")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const drawNode = (node, x, y, level) => {
      if (!node) return;

      const nodeWidthActual = Math.max(nodeWidth, node.keys.length * keyWidth + 20);
      const nodeHeight = 40;

      // Draw node rectangle
      svg
        .append("rect")
        .attr("x", x - nodeWidthActual / 2)
        .attr("y", y)
        .attr("width", 0)
        .attr("height", nodeHeight)
        .style("fill", node.isLeaf ? (node.keys.includes(searchResult) ? "#FFD700" : "#98FB98") : "#87CEEB")
        .style("stroke", "#333")
        .style("stroke-width", "2px")
        .transition()
        .duration(500)
        .attr("width", nodeWidthActual);

      // Draw keys
      node.keys.forEach((key, i) => {
        svg
          .append("text")
          .attr("x", x - nodeWidthActual / 2 + 10 + i * keyWidth)
          .attr("y", y + 25)
          .text(key)
          .style("font-size", "16px")
          .style("font-family", "Arial")
          .style("opacity", 0)
          .transition()
          .duration(500)
          .style("opacity", 1);
      });

      if (!node.isLeaf) {
        const childY = y + verticalSpacing;
        const totalChildWidth = node.children.reduce((sum, child) => 
          sum + Math.max(nodeWidth, child.keys.length * keyWidth + 20), 0);
        
        let currentX = x - totalChildWidth / 2;
        node.children.forEach((child, i) => {
          const childWidth = Math.max(nodeWidth, child.keys.length * keyWidth + 20);
          const childX = currentX + childWidth / 2;

          svg
            .append("line")
            .attr("x1", x)
            .attr("y1", y + nodeHeight)
            .attr("x2", x)
            .attr("y2", y + nodeHeight)
            .style("stroke", "#666")
            .style("stroke-width", "2px")
            .transition()
            .duration(500)
            .ease(d3.easeCubic)
            .attr("x2", childX)
            .attr("y2", childY);

          setTimeout(() => drawNode(child, childX, childY, level + 1), 250);
          currentX += childWidth;
        });
      } else if (node.next) {
        const nextX = x + nodeWidthActual + 50;
        svg
          .append("line")
          .attr("x1", x + nodeWidthActual / 2)
          .attr("y1", y + nodeHeight / 2)
          .attr("x2", x + nodeWidthActual / 2)
          .attr("y2", y + nodeHeight / 2)
          .style("stroke", "#666")
          .style("stroke-width", "2px")
          .transition()
          .duration(500)
          .attr("x2", nextX - nodeWidthActual / 2)
          .attr("y2", y + nodeHeight / 2);

        setTimeout(() => drawNode(node.next, nextX, y, level), 250);
      }
    };

    drawNode(tree.root, svgWidth / 2, 50, 0);
  };

  const handleInsert = () => {
    if (!inputValue) return;
    const newTree = tree ? tree.clone() : new BPlusTree(order);
    newTree.insert(parseInt(inputValue));
    setTree(newTree);
    setInputValue("");
  };

  const handleDelete = () => {
    if (!inputValue || !tree) return;
    const newTree = tree.clone();
    newTree.delete(parseInt(inputValue));
    setTree(newTree);
    setInputValue("");
  };

  const handleSearch = () => {
    if (!searchValue || !tree) return;
    const result = tree.search(parseInt(searchValue));
    setSearchResult(result);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        B+ Tree Visualization (Order: {order})
      </h2>
      <a href="/" className="px-4 py-2 my-2  bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
        Back to Home
      </a>

      <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-3">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[120px]"
          />
          <button
            onClick={handleInsert}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Insert
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search value"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[120px]"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Search
          </button>
          <button
            onClick={() => setTraversalResult(tree?.inorder() || "")}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Inorder
          </button>
          <button
            onClick={() => setTraversalResult(tree?.preorder() || "")}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
          >
            Preorder
          </button>
          <button
            onClick={() => setTraversalResult(tree?.postorder() || "")}
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
          >
            Postorder
          </button>
          <input
            type="number"
            value={order}
            onChange={(e) => {
              const newOrder = Math.max(3, parseInt(e.target.value) || 4);
              setOrder(newOrder);
              setTree(null);
            }}
            placeholder="Order"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
          />
        </div>
      </div>

      <div
        id="tree-container"
        className="w-full max-w-4xl h-[600px] bg-white rounded-lg shadow-md overflow-x-auto"
      ></div>

      <div className="mt-6 w-full max-w-4xl">
        <p className="text-lg text-gray-800">
          <strong>Traversal Result:</strong>{" "}
          <span className="font-mono bg-gray-100 p-2 rounded">
            {traversalResult || "None"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default BPlusTreeVisualizer;