import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold text-gray-800 mb-8">
        Tree Visualizer
      </h1>
      <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl">
        Explore and visualize different tree data structures with interactive animations and operations.
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
            A balanced tree with all keys in leaves, optimized for range queries.
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
          This tool allows you to interact with different tree structures, visualize their operations, and understand their properties through animations. Choose a tree type above to get started!
        </p>
        {/* Add more content here as needed */}
      </div>
    </div>
  );
};

export default LandingPage;