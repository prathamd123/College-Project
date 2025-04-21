import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const BSTVisualizer = () => {
  const [tree, setTree] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [traversalResult, setTraversalResult] = useState("");

  class TreeNode {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }

  class BST {
    constructor() {
      this.root = null;
    }

    insert(value) {
      const newNode = new TreeNode(value);
      if (!this.root) {
        this.root = newNode;
        return;
      }
      let current = this.root;
      while (true) {
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

    delete(value) {
      this.root = this._deleteNode(this.root, value);
    }

    _deleteNode(root, value) {
      if (!root) return root;

      if (value < root.value) {
        root.left = this._deleteNode(root.left, value);
      } else if (value > root.value) {
        root.right = this._deleteNode(root.right, value);
      } else {
        if (!root.left) return root.right;
        if (!root.right) return root.left;

        root.value = this._findMin(root.right);
        root.right = this._deleteNode(root.right, root.value);
      }
      return root;
    }

    search(value) {
      let current = this.root;
      while (current) {
        if (current.value === value) return current;
        current = value < current.value ? current.left : current.right;
      }
      return null;
    }

    findMin() {
      return this._findMin(this.root);
    }

    _findMin(node) {
      if (!node) return null;
      while (node.left) node = node.left;
      return node.value;
    }

    findMax() {
      let node = this.root;
      if (!node) return null;
      while (node.right) node = node.right;
      return node.value;
    }

    inorder() {
      const result = [];
      this._inorder(this.root, result);
      return result.join(", ");
    }

    _inorder(node, result) {
      if (!node) return;
      this._inorder(node.left, result);
      result.push(node.value);
      this._inorder(node.right, result);
    }

    preorder() {
      const result = [];
      this._preorder(this.root, result);
      return result.join(", ");
    }

    _preorder(node, result) {
      if (!node) return;
      result.push(node.value);
      this._preorder(node.left, result);
      this._preorder(node.right, result);
    }

    postorder() {
      const result = [];
      this._postorder(this.root, result);
      return result.join(", ");
    }

    _postorder(node, result) {
      if (!node) return;
      this._postorder(node.left, result);
      this._postorder(node.right, result);
      result.push(node.value);
    }
  }

  useEffect(() => {
    drawTree();
  }, [tree, searchResult]);

  const getTreeDepth = (node) => {
    if (!node) return 0;
    return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
  };

  const getTreeWidth = (node) => {
    if (!node) return 0;
    return 1 + getTreeWidth(node.left) + getTreeWidth(node.right);
  };

  const drawTree = () => {
    d3.select("#tree-container").selectAll("*").remove();
    if (!tree || !tree.root) return;

    const svgWidth = 1200;
    const svgHeight = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const depth = getTreeDepth(tree.root);
    const width = getTreeWidth(tree.root);

    const horizontalSpacing = Math.min(100, Math.max(400 / width, 30));
    const verticalSpacing = Math.min(100, Math.max(400 / depth, 60));

    const svg = d3
      .select("#tree-container")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const drawNode = (node, x, y, parentX, parentY, isRoot = false) => {
      if (!node) return;

      // Draw line first (behind the node) if not root
      if (!isRoot) {
        svg
          .append("line")
          .attr("x1", parentX)
          .attr("y1", parentY)
          .attr("x2", x) // Set correct end position immediately
          .attr("y2", y)
          .style("stroke", "#666")
          .style("stroke-width", "2px");
      }

      // Draw node circle
      svg
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 20)
        .style("fill", searchResult === node.value ? "#FFD700" : "#87CEEB")
        .style("stroke", "#333")
        .style("stroke-width", "2px");

      // Draw node text
      svg
        .append("text")
        .attr("x", x)
        .attr("y", y + 5)
        .attr("text-anchor", "middle")
        .text(node.value)
        .style("font-size", "16px")
        .style("font-family", "Arial")
        .style("fill", "#333");

      // Recursively draw children
      if (node.left) {
        drawNode(node.left, x - horizontalSpacing, y + verticalSpacing, x, y);
      }
      if (node.right) {
        drawNode(node.right, x + horizontalSpacing, y + verticalSpacing, x, y);
      }
    };

    drawNode(tree.root, svgWidth / 2, 50, svgWidth / 2, 50, true);
  };

  const handleInsert = () => {
    if (inputValue === "") return;
    const newTree = tree ? Object.assign(new BST(), tree) : new BST();
    newTree.insert(parseInt(inputValue));
    setTree(newTree);
    setInputValue("");
  };

  const handleDelete = () => {
    if (inputValue === "") return;
    const newTree = Object.assign(new BST(), tree);
    newTree.delete(parseInt(inputValue));
    setTree(newTree);
    setInputValue("");
  };

  const handleSearch = () => {
    if (searchValue === "") return;
    const foundNode = tree?.search(parseInt(searchValue));
    setSearchResult(foundNode ? foundNode.value : null);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-200 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Binary Search Tree Visualization
      </h2>
      <a href="/" className="px-4 py-2 my-2  bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
        Back to Home
      </a>

      {/* Control Panel */}
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
        </div>
      </div>

      {/* Tree Container */}
      <div
        id="tree-container"
        className="w-full max-w-4xl h-[600px] bg-white rounded-lg shadow-md overflow-x-auto"
      ></div>

      {/* Traversal Result */}
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

export default BSTVisualizer;