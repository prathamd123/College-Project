import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const BPlusTreeVisualizer = () => {
  const [tree, setTree] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [traversalResult, setTraversalResult] = useState("");
  const [order, setOrder] = useState(4);

  class BPlusTreeNode {
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
      this.root = new BPlusTreeNode(true);
      this.minKeys = Math.ceil(order / 2) - 1;
      this.maxKeys = order - 1;
    }

    insert(key) {
      let root = this.root;
      if (root.keys.length >= this.maxKeys) {
        let newRoot = new BPlusTreeNode(false);
        newRoot.children.push(root);
        this.splitChild(newRoot, 0);
        this.root = newRoot;
        root = newRoot;
      }
      this.insertNonFull(root, key);
    }

    insertNonFull(node, key) {
      if (node.isLeaf) {
        node.keys.push(key);
        node.keys.sort((a, b) => a - b);
      } else {
        let i = 0;
        while (i < node.keys.length && key > node.keys[i]) {
          i++;
        }
        const child = node.children[i];
        if (child.keys.length >= this.maxKeys) {
          this.splitChild(node, i);
          if (key > node.keys[i]) i++;
        }
        this.insertNonFull(node.children[i], key);
      }
    }

    splitChild(parent, index) {
      const child = parent.children[index];
      const newNode = new BPlusTreeNode(child.isLeaf);
      const mid = Math.floor(this.order / 2);

      if (child.isLeaf) {
        newNode.keys = child.keys.splice(mid);
        newNode.next = child.next;
        child.next = newNode;
        parent.keys.splice(index, 0, newNode.keys[0]);
      } else {
        newNode.keys = child.keys.splice(mid);
        newNode.children = child.children.splice(mid);
        const midKey = child.keys.pop();
        parent.keys.splice(index, 0, midKey);
      }
      parent.children.splice(index + 1, 0, newNode);
    }

    search(key) {
      if (!this.root) return null;
      let current = this.root;
      while (current) {
        let i = 0;
        while (i < current.keys.length && key > current.keys[i]) {
          i++;
        }
        if (current.isLeaf) {
          return i < current.keys.length && current.keys[i] === key ? key : null;
        }
        current = current.children[i];
      }
      return null;
    }

    delete(key) {
      if (!this.root) return;
      this.deleteKey(this.root, key);
      if (!this.root.isLeaf && this.root.keys.length === 0 && this.root.children.length === 1) {
        this.root = this.root.children[0];
      }
    }

    deleteKey(node, key) {
      if (node.isLeaf) {
        const index = node.keys.indexOf(key);
        if (index !== -1) node.keys.splice(index, 1);
        return;
      }

      let i = 0;
      while (i < node.keys.length && key > node.keys[i]) {
        i++;
      }

      const child = node.children[i];
      if (child.keys.length <= this.minKeys) {
        this.fillChild(node, i);
        if (node.keys.length === 0 && !node.isLeaf && node.children.length === 1) {
          this.root = node.children[0];
          return this.deleteKey(this.root, key);
        }
      }
      this.deleteKey(node.children[i], key);

      // Update parent keys after deletion
      if (i < node.children.length && node.children[i].isLeaf) {
        node.keys[i - 1] = node.children[i].keys[0] || node.keys[i - 1];
      }
    }

    fillChild(node, index) {
      const child = node.children[index];
      const leftSibling = index > 0 ? node.children[index - 1] : null;
      const rightSibling = index < node.children.length - 1 ? node.children[index + 1] : null;

      if (leftSibling && leftSibling.keys.length > this.minKeys) {
        this.borrowFromLeft(node, index);
      } else if (rightSibling && rightSibling.keys.length > this.minKeys) {
        this.borrowFromRight(node, index);
      } else {
        if (rightSibling) {
          this.merge(node, index);
        } else if (leftSibling) {
          this.merge(node, index - 1);
        }
      }
    }

    borrowFromLeft(node, index) {
      const child = node.children[index];
      const sibling = node.children[index - 1];

      if (child.isLeaf) {
        child.keys.unshift(sibling.keys.pop());
        node.keys[index - 1] = child.keys[0];
      } else {
        child.keys.unshift(node.keys[index - 1]);
        node.keys[index - 1] = sibling.keys.pop();
        child.children.unshift(sibling.children.pop());
      }
    }

    borrowFromRight(node, index) {
      const child = node.children[index];
      const sibling = node.children[index + 1];

      if (child.isLeaf) {
        child.keys.push(sibling.keys.shift());
        node.keys[index] = sibling.keys[0] || child.keys[child.keys.length - 1];
      } else {
        child.keys.push(node.keys[index]);
        node.keys[index] = sibling.keys.shift();
        child.children.push(sibling.children.shift());
      }
    }

    merge(node, index) {
      const child = node.children[index];
      const sibling = node.children[index + 1];

      if (child.isLeaf) {
        child.keys.push(...sibling.keys);
        child.next = sibling.next;
      } else {
        child.keys.push(node.keys[index]);
        child.keys.push(...sibling.keys);
        child.children.push(...sibling.children);
      }

      node.keys.splice(index, 1);
      node.children.splice(index + 1, 1);
    }

    inorder() {
      const result = [];
      let current = this.root;
      while (current && !current.isLeaf) {
        current = current.children[0];
      }
      while (current) {
        result.push(...current.keys);
        current = current.next;
      }
      return result.join(", ");
    }

    copy() {
      const newTree = new BPlusTree(this.order);
      const copyNode = (node) => {
        if (!node) return null;
        const newNode = new BPlusTreeNode(node.isLeaf);
        newNode.keys = [...node.keys];
        newNode.children = node.children.map(copyNode);
        return newNode;
      };
      newTree.root = copyNode(this.root);
      let current = newTree.root;
      while (current && !current.isLeaf) {
        current = current.children[0];
      }
      let prev = null;
      while (current) {
        current.next = null;
        if (prev) prev.next = current;
        prev = current;
        current = current.next;
      }
      return newTree;
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
        .style("fill", node.keys.includes(searchResult) ? "#FFD700" : node.isLeaf ? "#90EE90" : "#DDA0DD")
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

    const leafNodes = [];
    const collectLeaves = (node, x, y) => {
      if (!node) return;
      if (node.isLeaf) {
        const nodeWidthActual = Math.max(nodeWidth, node.keys.length * keyWidth + 20);
        leafNodes.push({ node, x, y, width: nodeWidthActual });
      } else {
        const totalChildWidth = node.children.reduce(
          (sum, child) =>
            sum + Math.max(nodeWidth, child.keys.length * keyWidth + 20) + childSpacing,
          -childSpacing
        );
        let currentX = x - totalChildWidth / 2;
        node.children.forEach((child) => {
          const childWidth = Math.max(nodeWidth, child.keys.length * keyWidth + 20);
          const childX = currentX + childWidth / 2;
          collectLeaves(child, childX, y + verticalSpacing);
          currentX += childWidth + childSpacing;
        });
      }
    };

    collectLeaves(tree.root, svgWidth / 2, 50);
    leafNodes.forEach((leaf, i) => {
      if (leaf.node.next) {
        const nextLeaf = leafNodes[i + 1];
        if (nextLeaf && nextLeaf.node === leaf.node.next) {
          svg
            .append("line")
            .attr("x1", leaf.x + leaf.width / 2)
            .attr("y1", leaf.y + 20)
            .attr("x2", nextLeaf.x - nextLeaf.width / 2)
            .attr("y2", nextLeaf.y + 20)
            .style("stroke", "#FF4500")
            .style("stroke-width", "2px")
            .style("stroke-dasharray", "5,5");
        }
      }
    });

    drawNode(tree.root, svgWidth / 2, 50, 0);
  };

  const handleInsert = () => {
    if (!inputValue) return;
    const currentTree = tree || new BPlusTree(order);
    currentTree.insert(parseInt(inputValue));
    setTree(currentTree.copy());
    setInputValue("");
  };

  const handleDelete = () => {
    if (!inputValue || !tree) return;
    const newTree = tree.copy();
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