<template>
  <div class="drag-detector" v-on="{ mouseenter: emitMouseEnter, mouseleave: emitMouseLeave }">
  <div class="board">
    <algorithm-block
      v-for="algo in algos"
      v-bind="Object.assign(algo, floatingAlgorithms[algo.name])"
      :key="algo.name"
      :width="blockStyles.blockWidth"
      :height="blockStyles.blockHeight"
      @drag-move="handleAlgoDrag"
      @end-drag="combineCollidedElements"
    />
    <combinator-section
      v-for="comb in combs"
      v-bind="Object.assign(blockStyles, combInitialPositions[comb[0][0][0].name])"
      :combMatrix="comb"
      :key="comb[0][0][0].name"
      @drag-move="handleCombDrag"
      @end-drag="combineCollidedElements"
    />
 </div>
 </div>
</template>

<script>
import CombinatorSection from './CombinatorSection';
import AlgorithmBlock from './AlgorithmBlock';
import blockStyles from '../shared/blockSizing.json';

const hasOverlap = (box1, box2) => box1 && box2 &&
  (box1.left > box2.left && box1.left < box2.right
  || box1.right > box2.left && box1.right < box2.right)
  && (box1.bottom > box2.top && box1.bottom < box2.bottom
  || box1.top > box2.top && box1.top < box2.bottom)
  || false;

const directions = ['top', 'left', 'bottom', 'right'];
const emptyLocation = { top: 0, bottom: 0, left: 0, right: 0 };

export default {
  name: 'DraggableBoard',
  components: { CombinatorSection, AlgorithmBlock },
  data() {
    return {
      floatingAlgorithms: {},
      combinators: {},
      completedCombinators: {},
      combinatorLocInStructureArray: {},
      structures: [],
      collidedAlgo: null,
      collidedComb: { name: null },
      blockStyles,
    };
  },
  computed: {
    algos: function() {
      return Object.keys(this.floatingAlgorithms)
        .filter(key => this.floatingAlgorithms[key] && !this.completedCombinators[key])
        .map(algo => ({ name: algo, active: this.collidedAlgo === algo }))
    },
    combs: function() {
      return this.$store.getters.getCombinatorMatricies.map(matrix =>
        matrix.map(row => row.map(section =>
          section.map(({ name, tracked }) => ({
            name,
            tracked,
            active: this.collidedComb.name === name
              ? this.collidedComb.side : null,
            bottomActive: this.collidedAlgo && this.completedCombinators[this.collidedAlgo] === name,
            leftAlgo: this.combinators[name] && this.combinators[name].leftAlgo,
            rightAlgo: this.combinators[name] && this.combinators[name].rightAlgo,
            bottomAlgo: this.$store.getters.getComputedAlgorithmName(name)
          }))
        ))
      );
    },
    combInitialPositions: function() {
      return Object.keys(this.combinators).reduce((positions, combName) => {
        const comb = this.combinators[combName];
        positions[combName] = { top: comb.top, left: comb.left };
        return positions;
      }, {});
    }
  },
  methods: {
    emitMouseEnter() {
      this.$emit('mouse-enter-board');
    },
    emitMouseLeave() {
      this.$emit('mouse-leave-board');
    },
    addFloatingAlgorithm(name, domPostion) {
      let positionObject;
      if (domPostion) {
        const { top, bottom, left, right } = domPostion;
        positionObject = { top, bottom, left, right };
      }
      this.$set(
        this.floatingAlgorithms, name, positionObject || { ...emptyLocation }
      );
    },
    addCombinator(name, domPosition) {
      this.combinators = { 
        ...this.combinators,
        [name]: {
          top: domPosition.top,
          left: domPosition.left
        }
      };
      this.$set(
        this.combinators[name], 'leftBlock', { ...emptyLocation }
      );
      this.$set(
        this.combinators[name], 'rightBlock', { ...emptyLocation }
      );
      this.$store.commit('registerCombinator', { name });
    },
    handleAlgoDrag({ name, box }) {
      directions.forEach(direction => {
        this.$set(this.floatingAlgorithms[name], direction, box[direction])
      })
      this.checkCombsForCollisions(name);
    },
    handleCombDrag({ name, leftBlock, rightBlock, bottomBlock, combName }) {
      if (bottomBlock) {
        if (!this.floatingAlgorithms[name]) {
          this.completedCombinators[name] = combName;
          this.addFloatingAlgorithm(name, { ...bottomBlock })
        }
        this.handleAlgoDrag({ name, box: bottomBlock });
      } else {
        this.combinators[name] = {
          ...this.combinators[name],
          leftBlock,
          rightBlock
        };
        this.checkAlgosForCollisions(name);
      }
    },
    checkAlgosForCollisions(name) {
      const { leftBlock, rightBlock } = this.combinators[name];
      Object.keys(this.floatingAlgorithms).forEach(key => {
        const algoBox = this.floatingAlgorithms[key];
        if (this.collidedComb.name === name) {
          this.checkForContinuedCollision();
        } else if (hasOverlap(algoBox, leftBlock)) {
          this.collidedAlgo = key;
          this.collidedComb = { name, side: 'left' };
        } else if (hasOverlap(algoBox, rightBlock)) {
          this.collidedAlgo = key;
          this.collidedComb = { name, side: 'right' };
        }
      });
    },
    checkCombsForCollisions(name) {
      const box = this.floatingAlgorithms[name];
      Object.keys(this.combinators).forEach(key =>{
        const { leftBlock, rightBlock } = this.combinators[key];
        if (this.collidedAlgo === name) {
          this.checkForContinuedCollision();
        } else if (hasOverlap(box, leftBlock)) {
          this.collidedAlgo = name;
          this.collidedComb = { name: key, side: 'left' }
        } else if (hasOverlap(box, rightBlock)) {
          this.collidedAlgo = name;
          this.collidedComb = { name: key, side: 'right' }
        }
      });
    },
    checkForContinuedCollision() {
      const algoBox = this.floatingAlgorithms[this.collidedAlgo];
      const combBoxes = this.combinators[this.collidedComb.name];
      const combBox = this.collidedComb.side === 'left'
        ? combBoxes.leftBlock : combBoxes.rightBlock;
      if (!hasOverlap(algoBox, combBox)) {
        this.collidedAlgo = null;
        this.collidedComb = { name: null };
      }
    },
    combineCollidedElements() {
      if (this.collidedAlgo) {
        const { name, side } = this.collidedComb;
        this.$set(this.combinators[name], `${side}Algo`, this.collidedAlgo);
        this.combinators[name][`${side}Block`] = null;
        this.floatingAlgorithms[this.collidedAlgo] = null;
        const topComb = this.completedCombinators[this.collidedAlgo];
        const { leftAlgo, rightAlgo } = this.combinators[name];
        this.$store.commit('addToSubTree', { algo: this.collidedAlgo, side, combinator: name, complete: leftAlgo && rightAlgo })
        if (topComb) {
          // TODO: need to handle completing a combinator section here too!
          this.$store.commit('combineCombinatorSections', { topComb, bottomComb: name, side })
        }
        this.collidedAlgo = null;
        this.collidedComb = { name: null };
      }
    }
  },
};
</script>

<style scoped>
  .drag-detector {
    z-index: 100;
  }
  .board {
    position: relative;
    width: 900px;
    height: 650px;
    border: 2px solid grey;
  }
</style>
