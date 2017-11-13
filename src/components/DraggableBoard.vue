<template>
  <div class="board" v-on:click="handleClick" >
    <algorithm-block
      v-for="algo in algos"
      v-bind="algo"
      :key="algo.name"
      :width="blockStyles.blockWidth"
      :height="blockStyles.blockHeight"
      @drag-move="handleAlgoDrag"
      @end-drag="combineCollidedElements"
    />
    <combinator-section
      v-for="comb in combs"
      v-bind="Object.assign({}, blockStyles, comb)"
      :key="comb.name"
      @drag-move="handleCombDrag"
      @end-drag="combineCollidedElements"
    />
 </div>
</template>

<script>
import CombinatorSection from './CombinatorSection';
import AlgorithmBlock from './AlgorithmBlock';

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
      collidedAlgo: null,
      collidedComb: { name: null },
      blockStyles: {
        blockWidth: 50,
        blockHeight: 30,
        combBlockWidth: 150,
        combBlockHeight: 200,
        strokeWidth: 2,
      },
      num: 0,
    };
  },
  computed: {
    algos: function() {
      console.log(this.$store)
      return Object.keys(this.floatingAlgorithms)
        .filter(key => this.floatingAlgorithms[key])
        .map(algo => ({ name: algo, active: this.collidedAlgo === algo }))
    },
    combs: function() {
      return Object.keys(this.combinators)
        .map(comb => ({
          name: comb,
          active: this.collidedComb.name === comb
            ? this.collidedComb.side : null,
          leftAlgo: this.combinators[comb].leftAlgo,
          rightAlgo: this.combinators[comb].rightAlgo,
          bottomAlgo: this.$store.getters.getComputedAlgorithmName(comb)
        }));
    },
  },
  methods: {
    handleClick() {
      if (this.num % 3) {
        this.addFloatingAlgorithm();
      } else {
        this.addCombinator();
      }
      this.num++;
    },
    addFloatingAlgorithm() {
      this.$set(
        this.floatingAlgorithms, Math.floor(Math.random() * 100),
        { ...emptyLocation }
      );
    },
    addCombinator() {
      const name = Math.floor(Math.random() * 100);
      this.combinators = { ...this.combinators, [name]: {} };
      this.$set(
        this.combinators[name], 'leftBlock', { ...emptyLocation }
      );
      this.$set(
        this.combinators[name], 'rightBlock', { ...emptyLocation }
      );
    },
    handleAlgoDrag({ name, box }) {
      directions.forEach(direction => {
        this.$set(this.floatingAlgorithms[name], direction, box[direction])
      })
      this.checkCombsForCollisions(name);
    },
    handleCombDrag({ name, leftBlock, rightBlock }) {
      this.combinators[name] = {
        ...this.combinators[name],
        leftBlock,
        rightBlock
      };
      this.checkAlgosForCollisions(name);
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
        this.collidedAlgo = null;
        this.collidedComb = { name: null };
        const { leftAlgo, rightAlgo } = this.combinators[name];
        if (leftAlgo && rightAlgo) {
          this.$store.commit('createSubTree', { leftAlgo, rightAlgo, combinator: name });
        }
      }
    }
  },
};
</script>

<style scoped>
  .board {
    position: relative;
    background-color: lightgray;
    width: 650px;
    height: 450px;
  }
</style>
