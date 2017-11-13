import Vue from 'vue';

class Node {
  constructor(value, name, combinator) {
    this.value = value;
    this.name = name;
    this.combinator = combinator || null;
    this.left = null;
    this.right = null;
  }
  add(value, name) {
    if (value > this.value) {
      if (this.right) {
        this.right.add(value, name);
      } else {
        this.right = new Node(value, name);
      }
    } else if (value < this.value) {
      if (this.left) {
        this.left.add(value, name);
      } else {
        this.left = new Node(value, name);
      }
    }
  }
  find(value) {
    if (this.value === value) {
      return this;
    } else if (value > this.value && this.right) {
      return this.right.find(value);
    } else if (value < this.value && this.left) {
      return this.left.find(value);
    }
    return false;
  }
}

export default {
  state: {
    algorithmTrees: {},
    computedAlgorithms: 0,
    // Local state --> floatingNodes: []
  },
  mutations: {
    createSubTree: (state, { rightAlgo, leftAlgo, combinator }) => {
      const computedAlgorithmName = ++state.computedAlgorithms;
      const tree = new Node(0, computedAlgorithmName, combinator);
      tree.add(-100, leftAlgo);
      tree.add(100, rightAlgo);
      Vue.set(state.algorithmTrees, combinator, tree); // may want to ID by computedAlgo # ?
    },
  },
  getters: {
    getComputedAlgorithmName: (state) => (combinatorName) =>
      state.algorithmTrees[combinatorName]
      && state.algorithmTrees[combinatorName].name,
  }
};
