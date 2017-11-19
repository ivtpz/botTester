<template>
  <div class="hello">
    <div>
      <h2>Algorithms</h2>
      <div
        v-for="algo in algorithms"
        class="container"
        :key="algo"
      >
        <div
          v-draggable="{ func: updateDragStatus, name: algo }"
          class="draggable-text"
          :ref="algo"
        >
          <span v-if="showAsBlock !== algo">
            {{algo}}
          </span>
          <algorithm-block
            v-else
            :name="algo"
            :hovering="true"
            width="80"
            height="50"
          />
        </div>
        <div
          :class="draggedName === algo ? 'placeholder-text' : 'placeholder-text--hidden'"
          :key="algo + '-placeholder'"
        >
          {{algo}}
        </div>
      </div>
      <h2>Combinators</h2>
      <div
        v-for="comb in combinators"
        :key="comb"
        class="container"
      >
        <div
          v-draggable="{ func: updateDragStatus, name: comb }"
          class="draggable-text"
          :ref="comb"
        >
          <span v-if="showAsBlock !== comb">
            {{comb}}
          </span>
          <combinator-section
            v-else
            v-bind="blockStyles"
            :combMatrix="getCombMatrix(comb)"
            :name="comb"
            :hovering="true"
          />
        </div>
        <div
          :class="draggedName === comb ? 'placeholder-text placeholder-text-comb' : 'placeholder-text--hidden'"
          :key="comb + '-placeholder'"
        >{{ comb }}</div>
      </div> 
    </div>
    <draggable-board
      @mouse-enter-board="showAlgoOrCombAsBlock"
      @mouse-leave-board="removeBlock"
      ref="board"
    />
  </div>
</template>

<script>
import DraggableBoard from './DraggableBoard';
import AlgorithmBlock from './AlgorithmBlock';
import CombinatorSection from './CombinatorSection';
import blockStyles from '../shared/blockSizing.json';

export default {
  name: 'HelloWorld',
  components: { DraggableBoard, AlgorithmBlock, CombinatorSection },
  data() {
    return {
      algorithms: ['Momentum', 'MV Regression', 'Neural Network'],
      combinators: ['Union', 'Average', 'Maximum'],
      draggedName: '',
      showAsBlock: '',
      incrementingId: 0,
      blockStyles
    }
  },
  methods: {
    updateDragStatus(name) {
      if (name === 'end') {
        const draggedElement = this.$refs[this.draggedName][0];
        if (this.showAsBlock !== '') {
          const isAlgorithm = this.algorithms.indexOf(this.showAsBlock) > -1;
          const position = draggedElement.getBoundingClientRect();
          const name = this.showAsBlock + `<->${++this.incrementingId}`;
          if (isAlgorithm) {
            this.$refs.board.addFloatingAlgorithm(name, position);
          } else {
            this.$refs.board.addCombinator(name, position);
          }
          this.showAsBlock = '';
        }
        draggedElement.style.left = '0px'
        draggedElement.style.top = '0px'
        this.draggedName = '';
      } else {
        this.draggedName = name;
      }
    },
    showAlgoOrCombAsBlock() {
      this.showAsBlock = this.draggedName;
    },
    removeBlock() {
      this.showAsBlock = '';
    },
    getCombMatrix(name) {
      return [[[{ name, tracked: true }]]]
    }
  },
};
</script>

<style scoped>
  .hello {
    display: flex;
  }
  .container {
    position: relative;
  }
  .draggable-text {
    width: 100%;
    text-align: center;
  }
  .placeholder-text {
    text-align: center;
    color: grey;
    border: 1px dashed #6bf0fc;
  }
  .placeholder-text-comb {
    border: 1px dashed #6bfc88;
  }
  .placeholder-text--hidden {
    text-align: left;
    color: white;
    padding: 1px;
  }
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
