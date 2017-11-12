<template>
    <div v-draggable="updateDragPostion" >
      <svg :width="combBlockWidth" :height="combBlockHeight" >
        <rect
          :width="blockWidth"
          :height="blockHeight"
          :x="strokeWidth"
          :y="strokeWidth"
          class="dashed-block"
          :stroke="active === 'left' ? 'green' : 'grey'"
          ref="leftRect"
        />
        <rect
          :width="blockWidth"
          :height="blockHeight"
          :x="combBlockWidth - strokeWidth - blockWidth"
          :y="strokeWidth"
          class="dashed-block"
          :stroke="active === 'right' ? 'green' : 'grey'"
          ref="rightRect"
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
          stroke="grey"
        />
      </svg>
    </div>
</template>

<script>
export default {
  name: 'CombinatorSection',
  props: [
    'blockWidth',
    'blockHeight',
    'combBlockWidth',
    'combBlockHeight',
    'strokeWidth',
    'active',
  ],
  methods: {
    updateDragPostion(end) {
      if (end) {
        this.$emit('end-drag');
      } else {
        const name = 'comb-test';
        const leftBlock = this.$refs.leftRect.getBoundingClientRect();
        const rightBlock = this.$refs.rightRect.getBoundingClientRect();
        this.$emit('drag-move', { name, leftBlock, rightBlock })
      }
    }
  },
};
</script>

<style scoped>
  .comb-block {
    fill: papayawhip;
  }
  .dashed-block {
    stroke-width: 2;
    stroke-dasharray: 10 5;
    fill: none;
  }
</style>
