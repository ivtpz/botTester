<template>
    <div v-draggable="updateDragPostion" class="container">
      <!-- WILL there always be an item in position 0? -->
      <div v-for="combRow in combMatrix" :key="combRow[0][0].name || 'empty' + 'row'">
        <div v-for="combSection in combRow" :key="combSection[0].name || 'empty'+ 'section'">
          <svg v-for="c in combSection" :key="c.name + 'svg'" :width="combBlockWidth" :height="combBlockHeight" >
            <rect
              :width="blockWidth"
              :height="blockHeight"
              :x="strokeWidth"
              :y="strokeWidth"
              class="dashed-block"
              :fill="c.leftAlgo ? 'white' : 'none'"
              :stroke="c.active === 'left' ? 'green' : 'grey'"
              :ref="c.tracked ? 'leftRect' : 'test'"
            />
            <text
              fill="black"
              font-family="Verdana"
              font-size="16"
              :x="strokeWidth + 10"
              :y="strokeWidth + 20"
            >
              {{ c.leftAlgo }}
            </text>
            <rect
              :width="blockWidth"
              :height="blockHeight"
              :x="combBlockWidth - strokeWidth - blockWidth"
              :y="strokeWidth"
              class="dashed-block"
              :fill="c.rightAlgo ? 'white' : 'none'"
              :stroke="c.active === 'right' ? 'green' : 'grey'"
              :ref="c.tracked ? 'rightRect' : 'test'"
            />
            <text
              fill="black"
              font-family="Verdana"
              font-size="16"
              :x="combBlockWidth - strokeWidth - blockWidth + 10"
              :y="strokeWidth + 20"
            >
              {{ c.rightAlgo }}
            </text>
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
              {{ c.name }}
            </text>
            <rect
              :width="blockWidth"
              :height="blockHeight"
              :x="(combBlockWidth - blockWidth) / 2"
              :y="combBlockHeight - blockHeight - strokeWidth"
              class="dashed-block"
              :fill="c.bottomAlgo ? 'white' : 'none'"
              stroke="grey"
            />
            <text
              fill="black"
              font-family="Verdana"
              font-size="16"
              :x="(combBlockWidth - blockWidth) / 2 + 10"
              :y="combBlockHeight - blockHeight - strokeWidth + 20"
              :ref="c.tracked ? 'bottomRect' : 'test'"
            >
              {{ c.bottomAlgo }}
            </text>
          </svg>
        </div>
      </div>
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
    'combMatrix',
  ],
  methods: {
    findTrackedSection() {
      const { combMatrix } = this;
      for (let i = 0; i < combMatrix.length; i++) {
        for (let j = 0; j < combMatrix[i].length; j++) {
          for (let k = 0; k < combMatrix[i][j].length; k++) {
            if (combMatrix[i][j][k].tracked) return combMatrix[i][j][k];
          }
        }
      }
    },
    updateDragPostion(end) {
      if (end) {
        this.$emit('end-drag');
      } else {
        const { name, leftAlgo, rightAlgo, bottomAlgo } = this.findTrackedSection();
        // if this combinator is complete, track the bottomAlgo
          if (bottomAlgo) {
            const bottomBlock = this.$refs.bottomRect[0].getBoundingClientRect()
            this.$emit('drag-move', { name: bottomAlgo, bottomBlock, combName: name })
          } else {
          const leftBlock = !leftAlgo
            ? this.$refs.leftRect[0].getBoundingClientRect()
            : null;
          const rightBlock = !rightAlgo
            ? this.$refs.rightRect[0].getBoundingClientRect()
            : null;
          this.$emit('drag-move', { name, leftBlock, rightBlock })
        }
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
  }
  .container {
    display: flex;
    flex-direction: column-reverse;
  }
</style>
