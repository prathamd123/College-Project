import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold text-gray-800 mb-8">Tree Visualizer</h1>
      <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl">
        Explore and visualize different tree data structures with interactive
        animations and operations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* BST Button */}
        <Link to="/bst" className="flex flex-col items-center">
          <button className="w-full py-4 px-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold">
            Binary Search Tree (BST)
          </button>
          <p className="mt-2 text-gray-700 text-center">
            A binary tree with ordered nodes for efficient searching.
          </p>
        </Link>

        {/* B+ Tree Button */}
        <Link to="/bplus" className="flex flex-col items-center">
          <button className="w-full py-4 px-6 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 text-lg font-semibold">
            B+ Tree
          </button>
          <p className="mt-2 text-gray-700 text-center">
            A balanced tree with all keys in leaves, optimized for range
            queries.
          </p>
        </Link>

        {/* B-Tree Button */}
        <Link to="/btree" className="flex flex-col items-center">
          <button className="w-full py-4 px-6 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300 text-lg font-semibold">
            B-Tree
          </button>
          <p className="mt-2 text-gray-700 text-center">
            A self-balancing tree for efficient disk-based storage.
          </p>
        </Link>
      </div>

      {/* Space for Additional Content */}
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          About Tree Visualizer
        </h2>
        <p className="text-gray-600">
          This tool allows you to interact with different tree structures,
          visualize their operations, and understand their properties through
          animations. Choose a tree type above to get started!
        </p>
        {/* Add more content here as needed */}
      </div>

      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          About BST Tree.
        </h2>
        <p className="text-gray-600">
          A Binary Search Tree (BST) is a data structure used in computer
          science for organizing and storing data in a sorted manner. Each node
          in a BST has at most two children, a left child and a right child,
          with the left child containing values less than the parent node and
          the right child containing values greater than the parent node.
        </p>

        <p className="text-gray-600">
          A Binary Search Tree (or BST) is a data structure used in computer
          science for organizing and storing data in a sorted manner. Each node
          in a Binary Search Tree has at most two children, a left child and a
          right child, with the left child containing values less than the
          parent node and the right child containing values greater than the
          parent node. This hierarchical structure allows for efficient
          searching, insertion, and deletion operations on the data stored in
          the tree.
        </p>
      </div>
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          About B+ Tree
        </h2>
        <p className="text-gray-600">
          A B-Tree is a specialized m-way tree designed to optimize data access,
          especially on disk-based storage systems. In a B-Tree of order m, each
          node can have up to m children and m-1 keys, allowing it to
          efficiently manage large datasets. The value of m is decided based on
          disk block and key sizes. One of the standout features of a B-Tree is
          its ability to store a significant number of keys within a single
          node, including large key values. It significantly reduces the tree’s
          height, hence reducing costly disk operations. B Trees allow faster
          data retrieval and updates, making them an ideal choice for systems
          requiring efficient and scalable data management. By maintaining a
          balanced structure at all times, B-Trees deliver consistent and
          efficient performance for critical operations such as search,
          insertion, and deletion.
        </p>
      </div>
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          About B Tree
        </h2>
        <p className="text-gray-600">
          A B-tree is a self-balancing tree where all the leaf nodes are at the
          same level which allows for efficient searching, insertion and
          deletion of records. Because of all the leaf nodes being on the same
          level, the access time of data is fixed regardless of the size of the
          data set.
        </p>
        <p className="text-gray-600">
          Characteristics of B-Tree? B-trees have several important
          characteristics that make them useful for storing and retrieving large
          amounts of data efficiently. Some of the key characteristics of
          B-trees are: Balanced: B-trees are balanced, meaning that all leaf
          nodes are at the same level. This ensures that the time required to
          access data in the tree remains constant, regardless of the size of
          the data set. Self-balancing: B-trees are self-balancing, which means
          that as new data is inserted or old data is deleted, the tree
          automatically adjusts to maintain its balance. Multiple keys per node:
          B-trees allow multiple keys to be stored in each node. This allows for
          efficient use of memory and reduces the height of the tree, which in
          turn reduces the number of disk accesses required to retrieve data.
          Ordered: B-trees maintain the order of the keys, which makes searching
          and range queries efficient. 
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
