import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const BSTVisualizer = () => {
  const [tree, setTree] = useState(null);
  const [inputValue, setInputValue] = useState("");

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
  }

  useEffect(() => {
    if (tree) drawTree();
  }, [tree]);

  const drawTree = () => {
    d3.select("#tree-container").selectAll("*").remove();
    if (!tree || !tree.root) return;
    
    const svg = d3.select("#tree-container")
      .append("svg")
      .attr("width", 1440)
      .attr("height", 1200);
    
    const drawNode = (node, x, y, depth) => {
      if (!node) return;
      svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 20)
        .style("fill", "lightblue");
      
      svg.append("text")
        .attr("x", x)
        .attr("y", y + 5)
        .attr("text-anchor", "middle")
        .text(node.value);
      
      const gap = 50 - depth * 5;
      if (node.left) {
        svg.append("line")
          .attr("x1", x)
          .attr("y1", y)
          .attr("x2", x - gap * 5)
          .attr("y2", y + 50)
          .style("stroke", "black");
        drawNode(node.left, x - gap * 5, y + 50, depth + 1);
      }
      if (node.right) {
        svg.append("line")
          .attr("x1", x)
          .attr("y1", y)
          .attr("x2", x + gap * 5)
          .attr("y2", y + 50)
          .style("stroke", "black");
        drawNode(node.right, x + gap * 5, y + 50, depth + 1);
      }
    };
    drawNode(tree.root, 300, 50, 1);
  };

  const handleInsert = () => {
    if (inputValue === "") return;
    const newTree = tree ? Object.assign(Object.create(Object.getPrototypeOf(tree)), tree) : new BST();
    newTree.insert(parseInt(inputValue));
    setTree(newTree);
    setInputValue("");
  };

  return (
    <div>
      <h2>BST Visualization</h2>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleInsert}>Insert</button>
      <div id="tree-container" style={{ border: "1px solid black", marginTop: "10px", width: "100%", height: "screen" }}></div>
    </div>
  );
};

export default BSTVisualizer;

// Required dependencies
// Run the following command to install required packages before running the project:
// npm install d3 react
