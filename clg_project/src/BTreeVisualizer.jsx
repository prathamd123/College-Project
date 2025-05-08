import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const BTreeVisualizer = () => {
  const [tree, setTree] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [traversalResult, setTraversalResult] = useState("");
  const [order, setOrder] = useState(4);

  class BTreeNode {
    constructor(isLeaf = true) {
      this.isLeaf = isLeaf;
      this.keys = [];
      this.children = [];
    }
  }

  class BTree {
    constructor(order) {
      this.order = order;
      this.root = new BTreeNode(true);
      this.minKeys = Math.ceil(order / 2) - 1;
    }

    insert(key) {
      const root = this.root;
      if (root.keys.length === this.order - 1) {
        const newRoot = new BTreeNode(false);
        newRoot.children.push(root);
        this.splitChild(newRoot, 0);
        this.root = newRoot;
      }
      this.insertNonFull(this.root, key);
    }

    insertNonFull(node, key) {
      let i = node.keys.length - 1;
      if (node.isLeaf) {
        while (i >= 0 && key < node.keys[i]) {
          i--;
        }
        node.keys.splice(i + 1, 0, key);
      } else {
        while (i >= 0 && key < node.keys[i]) {
          i--;
        }
        i++;
        const child = node.children[i];
        if (child.keys.length === this.order - 1) {
          this.splitChild(node, i);
          if (key > node.keys[i]) i++;
        }
        this.insertNonFull(node.children[i], key);
      }
    }

    splitChild(parent, index) {
      const child = parent.children[index];
      const newNode = new BTreeNode(child.isLeaf);
      const mid = Math.floor((this.order - 1) / 2);

      newNode.keys = child.keys.splice(mid + 1);
      if (!child.isLeaf) {
        newNode.children = child.children.splice(mid + 1);
      }
      parent.keys.splice(index, 0, child.keys[mid]);
      child.keys.splice(mid, 1);
      parent.children.splice(index + 1, 0, newNode);
    }

    search(key) {
      return this.searchNode(this.root, key);
    }

    searchNode(node, key) {
      let i = 0;
      while (i < node.keys.length && key > node.keys[i]) {
        i++;
      }
      if (i < node.keys.length && key === node.keys[i]) return key;
      if (node.isLeaf) return null;
      return this.searchNode(node.children[i], key);
    }

    delete(key) {
      this.deleteKey(this.root, key);
      if (this.root.keys.length === 0 && !this.root.isLeaf) {
        this.root = this.root.children[0];
      }
    }

    deleteKey(node, key) {
      let i = 0;
      while (i < node.keys.length && key > node.keys[i]) {
        i++;
      }
      if (i < node.keys.length && key === node.keys[i]) {
        if (node.isLeaf) {
          node.keys.splice(i, 1);
        } else {
          this.deleteFromInternal(node, i);
        }
      } else if (!node.isLeaf) {
        const child = node.children[i];
        if (child.keys.length <= this.minKeys) {
          this.fillChild(node, i);
          if (node.keys.length === 0 && !this.root.isLeaf) {
            this.root = node.children[0];
            node = this.root;
          }
        }
        this.deleteKey(node.children[i], key);
      }
    }

    deleteFromInternal(node, index) {
      const key = node.keys[index];
      const leftChild = node.children[index];
      const rightChild = node.children[index + 1];

      if (leftChild.keys.length > this.minKeys) {
        const pred = this.getPredecessor(leftChild);
        node.keys[index] = pred;
        this.deleteKey(leftChild, pred);
      } else if (rightChild.keys.length > this.minKeys) {
        const succ = this.getSuccessor(rightChild);
        node.keys[index] = succ;
        this.deleteKey(rightChild, succ);
      } else {
        this.merge(node, index);
        this.deleteKey(node.children[index], key);
      }
    }

    getPredecessor(node) {
      let current = node;
      while (!current.isLeaf) {
        current = current.children[current.children.length - 1];
      }
      return current.keys[current.keys.length - 1];
    }

    getSuccessor(node) {
      let current = node;
      while (!current.isLeaf) {
        current = current.children[0];
      }
      return current.keys[0];
    }

    fillChild(node, index) {
      const child = node.children[index];
      if (index > 0 && node.children[index - 1].keys.length > this.minKeys) {
        this.borrowFromLeft(node, index);
      } else if (
        index < node.children.length - 1 &&
        node.children[index + 1].keys.length > this.minKeys
      ) {
        this.borrowFromRight(node, index);
      } else {
        if (index < node.children.length - 1) {
          this.merge(node, index);
        } else {
          this.merge(node, index - 1);
        }
      }
    }

    borrowFromLeft(node, index) {
      const child = node.children[index];
      const sibling = node.children[index - 1];
      child.keys.unshift(node.keys[index - 1]);
      if (!child.isLeaf) {
        child.children.unshift(sibling.children.pop());
      }
      node.keys[index - 1] = sibling.keys.pop();
    }

    borrowFromRight(node, index) {
      const child = node.children[index];
      const sibling = node.children[index + 1];
      child.keys.push(node.keys[index]);
      if (!child.isLeaf) {
        child.children.push(sibling.children.shift());
      }
      node.keys[index] = sibling.keys.shift();
    }

    merge(node, index) {
      const child = node.children[index];
      const sibling = node.children[index + 1];
      child.keys.push(node.keys[index]);
      child.keys.push(...sibling.keys);
      if (!child.isLeaf) {
        child.children.push(...sibling.children);
      }
      node.keys.splice(index, 1);
      node.children.splice(index + 1, 1);
    }

    inorder() {
      const result = [];
      this.inorderTraversal(this.root, result);
      return result.join(", ");
    }

    inorderTraversal(node, result) {
      if (!node) return;
      for (let i = 0; i < node.keys.length; i++) {
        if (!node.isLeaf) this.inorderTraversal(node.children[i], result);
        result.push(node.keys[i]);
      }
      if (!node.isLeaf)
        this.inorderTraversal(node.children[node.children.length - 1], result);
    }

    preorder() {
      const result = [];
      this.preorderTraversal(this.root, result);
      return result.join(", ");
    }

    preorderTraversal(node, result) {
      if (!node) return;
      result.push(...node.keys);
      if (!node.isLeaf)
        node.children.forEach((child) => this.preorderTraversal(child, result));
    }

    postorder() {
      const result = [];
      this.postorderTraversal(this.root, result);
      return result.join(", ");
    }

    postorderTraversal(node, result) {
      if (!node) return;
      if (!node.isLeaf)
        node.children.forEach((child) => this.postorderTraversal(child, result));
      result.push(...node.keys);
    }
  }

  useEffect(() => {
    drawTree();
  }, [tree, searchResult]);

  const getTreeDepth = (node) => {
    if (!node || node.isLeaf) return 1;
    return 1 + Math.max(...node.children.map((child) => getTreeDepth(child)));
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
    const childSpacing = 20;

    const svg = d3
      .select("#tree-container")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const drawNode = (node, x, y, level) => {
      if (!node) return;

      const nodeWidthActual = Math.max(
        nodeWidth,
        node.keys.length * keyWidth + 20
      );
      const nodeHeight = 40;

      svg
        .append("rect")
        .attr("x", x - nodeWidthActual / 2)
        .attr("y", y)
        .attr("width", 0)
        .attr("height", nodeHeight)
        .style("fill", node.keys.includes(searchResult) ? "#FFD700" : "#DDA0DD")
        .style("stroke", "#333")
        .style("stroke-width", "2px")
        .transition()
        .duration(500)
        .attr("width", nodeWidthActual);

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
        const totalChildWidth = node.children.reduce(
          (sum, child) =>
            sum + Math.max(nodeWidth, child.keys.length * keyWidth + 20) + childSpacing,
          -childSpacing
        );

        let currentX = x - totalChildWidth / 2;
        node.children.forEach((child, i) => {
          const childWidth = Math.max(
            nodeWidth,
            child.keys.length * keyWidth + 20
          );
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
          currentX += childWidth + childSpacing;
        });
      }
    };

    drawNode(tree.root, svgWidth / 2, 50, 0);
  };

  const handleInsert = () => {
    if (!inputValue) return;
    const currentTree = tree || new BTree(order);
    currentTree.insert(parseInt(inputValue));
    const newTree = new BTree(order);
    newTree.root = JSON.parse(JSON.stringify(currentTree.root));
    setTree(newTree);
    setInputValue("");
  };

  const handleDelete = () => {
    if (!inputValue || !tree) return;
    const newTree = new BTree(tree.order);
    newTree.root = JSON.parse(JSON.stringify(tree.root));
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
        B-Tree Visualization (Order: {order})
      </h2>
      <a
        href="/"
        className="mt-4 px-4 py-2 my-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
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

export default BTreeVisualizer;