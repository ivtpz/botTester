import Vue from 'vue';

// TODO: should I ditch values? probably.
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
  findByName(name) {
    if (this.name === name) {
      return this
    } else {
      return this.left && this.left.findByName(name) || this.right && this.right.findByName(name);
    }
    
  }
}

const flattenTreeToMatrix = (state, tree) => {
    const container = [[[tree]]];
    let children = true;
    const emptyNode = { name: undefined, tracked: false };
    while (children) {
      children = false;
      const level = [];
      container[container.length - 1].forEach(childSection => {
        childSection.forEach(node => {
          if (node && node.left || node.right) {
            children = true;
            const childrenArray = [];
            if (node.left) {
              childrenArray.push(node.left);
            } else if (node.right) {

              childrenArray.push(emptyNode);
            }
            if (node.right) {
              childrenArray.push(node.right);
            } else if (node.left) {
              childrenArray.push(emptyNode);
            }
            level.push(childrenArray);
          } else {
            level.push([ emptyNode, emptyNode ]);
          }
        });
      });
      if (children) {
        container.push(level);
      }
    }
    return container.map(
      level =>
        level.map(
          section =>
            section.length ?
            section.map(node => {
              return node.name !== undefined ?
              // TODO: figure out how to handle placeholder sections correctly
              { name: node.name, tracked: state.algorithmTrees[node.name].tracked }
              : node;
            })
            : section
        )
    );
}

export default {
  state: {
    algorithmTrees: {},
    connections: [],
    computedAlgorithms: 0,
  },
  mutations: {
    addToSubTree: (state, { algo, side, combinator, complete }) => {
      const tree = state.algorithmTrees[combinator];
      if (complete) tree.name = `Algo ${++state.computedAlgorithms}`;
      const multiplier = side === 'right' ? 1 : -1;      
      tree.add(multiplier * 100, algo);
      // Not sure if this is needed??
      Vue.set(state.algorithmTrees, combinator, tree); // may want to ID by computedAlgo # ?
    },
    registerCombinator: (state, { name }) => {
      // Not setting a computed algo name yet
      const tree = new Node(0, null, name);
      Vue.set(state.algorithmTrees, name, tree);
    },
    combineCombinatorSections: (state, { topComb, bottomComb, side }) => {
      let bottomIndex, topIndex;
      state.algorithmTrees[topComb].connected = true;
      state.algorithmTrees[topComb].tracked = false;
      state.algorithmTrees[bottomComb].connected = true;
      state.algorithmTrees[bottomComb].tracked = true;
      const connectedBottomComb = state.connections.find((tree, i) => {
        if (tree.findByName(bottomComb)) {
          bottomIndex = i
          return true;
        }
      });
      const connectedTopComb = state.connections.find((tree, i) => {
        if (tree.findByName(topComb)) {
          topIndex = i;
          return true;
        }
      });
      const multiplier = side === 'right' ? 1 : -1;
      if (connectedBottomComb && connectedTopComb) {
        // values won't work right...
        connectedBottomComb[side] = connectedTopComb;
        state.connections.splice(topIndex, 1);
      } else if (connectedBottomComb) {
        // This assumes that the connected bottom comb is always
        // the root. Not 100% sure if that is valid...
        connectedBottomComb.add(multiplier * 100, topComb);
        Vue.set(state.connections, bottomIndex, connectedBottomComb);
      } else if (connectedTopComb) {
        const tree = new Node(0, bottomComb);
        tree[side] = connectedTopComb;
        Vue.set(state.connections, topIndex, tree);
      } else {
        const tree = new Node(0, bottomComb);
        tree.add(multiplier * 100, topComb);
        state.connections.push(tree);
      }
    },
  },
  getters: {
    getComputedAlgorithmName: (state) => (combinatorName) =>
      state.algorithmTrees[combinatorName]
      && state.algorithmTrees[combinatorName].name,
    getCombinatorMatricies: (state) => {
      return state.connections.map(flattenTreeToMatrix.bind(null, state))
      .concat(Object.keys(state.algorithmTrees)
        .filter(name => !state.algorithmTrees[name].connected)
        .map(name => [[[{ name, tracked: true }]]])
      )
    },
    
  }
};
