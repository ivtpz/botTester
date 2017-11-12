<template>
  <div class="board" v-on:click="addFloatingAlgorithm">
    <div v-for="algo in floatingAlgorithms" :key="algo" class="block" v-draggable>
      {{ algo }}
    </div>
    <div v-draggable>
    <svg :width="combBlockWidth" :height="combBlockHeight">
      <rect
        :width="blockWidth"
        :height="blockHeight"
        :x="strokeWidth"
        :y="strokeWidth"
        class="dashed-block"
      />
      <rect
        :width="blockWidth"
        :height="blockHeight"
        :x="combBlockWidth - strokeWidth - blockWidth"
        y="strokeWidth"
        class="dashed-block"
      />
      <line
        :x1="blockWidth / 2"
        :x2="combBlockWidth / 2"
        :y1="blockHeight + strokeWidth"
        :y2="combBlockHeight / 2"
        stroke="black"
        :stroke-width="strokeWidth"
      />
      <line
        :x1="combBlockWidth - blockWidth / 2"
        :x2="combBlockWidth / 2"
        :y1="blockHeight + strokeWidth"
        :y2="combBlockHeight / 2"
        stroke="black"
        :stroke-width="strokeWidth"
      />
      <line
        :x1="combBlockWidth / 2"
        :x2="combBlockWidth / 2"
        :y1="combBlockHeight / 2"
        :y2="combBlockHeight - blockHeight - strokeWidth"
        stroke="black"
        :stroke-width="strokeWidth"
      />
      <rect
        :width="blockWidth"
        :height="blockHeight"
        :x="(combBlockWidth - blockWidth) / 2"
        :y="(combBlockHeight - blockHeight) / 2"
        class="comb-block"
      >
      </rect>
      <text
        fill="black"
        font-family="Verdana"
        font-size="16"
        :x="(combBlockWidth - blockWidth) / 2"
        :y="(combBlockHeight - blockHeight) / 2 + 20"
      >
        Comb
      </text>
      <rect
        :width="blockWidth"
        :height="blockHeight"
        :x="(combBlockWidth - blockWidth) / 2"
        :y="combBlockHeight - blockHeight - strokeWidth"
        class="dashed-block"
      />
    </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DraggableBoard',
  data() {
    return {
      floatingAlgorithms: [],
      blockWidth: 50,
      blockHeight: 30,
      combBlockWidth: 150,
      combBlockHeight: 200,
      strokeWidth: 2,
    };
  },
  methods: {
    addFloatingAlgorithm() {
      console.log(this.floatingAlgorithms)
      this.floatingAlgorithms.push(Math.floor(Math.random() * 100))
    }
  },
};
</script>

<style scoped>
  .block {
    width: 50px;
    height: 50px;
    background-color: yellow;
  }
  .comb-block {
    fill: papayawhip;
  }
  .dashed-block {
    stroke: gray;
    stroke-width: 2;
    stroke-dasharray: 10 5;
    fill: none;
  }
  .board {
    position: relative;
    background-color: lightgray;
    width: 500px;
    height: 300px;
  }
</style>
