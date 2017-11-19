<template>
  <div class="hello">
    <div>
      <h2>Algorithms</h2>
      <div v-for="algo in algorithms" class="algo-container" :key="algo">
        <div v-draggable="{ func: updateDragStatus, name: algo }" :ref="algo">
          <div v-if="showAsBlock !== algo">
            {{algo}}
          </div>
          <algorithm-block v-else :name="algo" width="40" height="30"/>
        </div>
        <div :class="draggedName === algo ? 'placeholder' : 'placeholder--hidden'" :key="algo + '-placeholder'">{{algo}}</div>
      </div>
      <h2>Combinators</h2>
      <div v-for="comb in combinators" :key="comb">{{comb}}</div> 
    </div>
    <draggable-board
      @mouse-enter-board="showAlgoAsBlock"
      @mouse-leave-board="removeBlock"
      ref="board"
    />
  </div>
</template>

<script>
import DraggableBoard from './DraggableBoard';
import AlgorithmBlock from './AlgorithmBlock';
export default {
  name: 'HelloWorld',
  components: { DraggableBoard, AlgorithmBlock },
  data() {
    return {
      algorithms: ['Momentu', 'MV Regression', 'Neural Network'],
      combinators: ['Union', 'Average', 'Maximum'],
      draggedName: '',
      showAsBlock: '',
    }
  },
  methods: {
    updateDragStatus(name) {
      if (name === 'end') {
        const draggedElement = this.$refs[this.draggedName][0];
        if (this.showAsBlock !== '') {
          const position = draggedElement.getBoundingClientRect();
          this.$refs.board.addFloatingAlgorithm(this.showAsBlock, position);
          this.showAsBlock = '';
        }
        draggedElement.style.left = '0px'
        draggedElement.style.top = '0px'
        this.draggedName = '';
      } else {
        this.draggedName = name;
      }
    },
    showAlgoAsBlock() {
      this.showAsBlock = this.draggedName;
    },
    removeBlock() {
      this.showAsBlock = '';
    }
  },
};
</script>

<style scoped>
  .hello {
    display: flex;
  }
  .algo-container {
    position: relative;
  }
  .placeholder {
    text-align: left;
    color: grey;
    border: 1px dashed #6bf0fc;
  }
  .placeholder--hidden {
    text-align: left;
    color: white;
    border: 1px solid white;
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
