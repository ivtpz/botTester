<template>
    <div v-draggable.bound.tracked="{ func: updateDragPostion }" class="container">
      <!-- WILL there always be an item in position 0? -->
      <div
        class="row" :key="combRow[0][0].name || 'empty' + i + 'row'"
        v-for="(combRow, i) in combMatrix"
        :style="rowStyle"
      >
        <div
          v-for="(combSection, j) in combRow"
          class="section"
          :key="combSection[0].name || 'empty' + i + j + 'section'"
        >
          <svg
            v-for="(c, k) in combSection"
            :style="getSvgStyle(i)"
            :key="c.name + i + j + k + 'svg'"
            :width="getSectionWidth(i)"
            :height="combBlockHeight"
          >
            <rect
              v-if="c.name"
              class="dashed-block"
              :width="blockWidth"
              :height="blockHeight"
              :x="strokeWidth"
              :y="strokeWidth"
              :fill="c.leftAlgo ? 'white' : 'none'"
              :stroke="c.active === 'left' ? 'green' : c.leftAlgo ? 'none' : 'grey'"
              :ref="c.tracked ? 'leftRect' : 'test'"
            />
            <text
              v-if="c.name"
              fill="black"
              font-family="Verdana"
              font-size="16"
              :x="strokeWidth + 10"
              :y="strokeWidth + 20"
            >
              {{ c.leftAlgo }}
            </text>
            <rect
              v-if="c.name"
              :width="blockWidth"
              :height="blockHeight"
              :x="getSectionWidth(i) - strokeWidth - blockWidth"
              :y="strokeWidth"
              class="dashed-block"
              :fill="c.rightAlgo ? 'white' : 'none'"
              :stroke="c.active === 'right' ? 'green' : c.rightAlgo ? 'none' : 'grey'"
              :ref="c.tracked ? 'rightRect' : 'test'"
            />
            <text
              v-if="c.name"
              fill="black"
              font-family="Verdana"
              font-size="16"
              :x="getSectionWidth(i) - strokeWidth - blockWidth + 10"
              :y="strokeWidth + 20"
            >
              {{ c.rightAlgo }}
            </text>
            <line
              v-if="c.name"
              :x1="blockWidth / 2"
              :x2="getSectionWidth(i) / 2"
              :y1="blockHeight + strokeWidth"
              :y2="combBlockHeight / 2"
              stroke="black"
              :stroke-width="strokeWidth"
            />
            <line
              v-if="c.name"
              :x1="getSectionWidth(i) - blockWidth / 2"
              :x2="getSectionWidth(i) / 2"
              :y1="blockHeight + strokeWidth"
              :y2="combBlockHeight / 2"
              stroke="black"
              :stroke-width="strokeWidth"
            />
            <line
              v-if="c.name"
              :x1="getSectionWidth(i) / 2"
              :x2="getSectionWidth(i) / 2"
              :y1="combBlockHeight / 2"
              :y2="combBlockHeight - blockHeight - strokeWidth"
              stroke="black"
              :stroke-width="strokeWidth"
            />
            <rect
              v-if="c.name"
              :width="blockWidth"
              :height="blockHeight"
              :x="(getSectionWidth(i) - blockWidth) / 2"
              :y="(combBlockHeight - blockHeight) / 2"
              class="comb-block"
            >
            </rect>
            <text
              v-if="c.name"
              fill="black"
              font-family="Verdana"
              font-size="16"
              :x="(getSectionWidth(i) - blockWidth) / 2"
              :y="(combBlockHeight - blockHeight) / 2 + 20"
            >
              {{ c.name }}
            </text>
            <rect
              v-if="c.tracked"
              :width="blockWidth"
              :height="blockHeight"
              :x="(getSectionWidth(i) - blockWidth) / 2"
              :y="combBlockHeight - blockHeight - strokeWidth"
              class="dashed-block"
              :fill="c.bottomAlgo ? c.bottomActive ? 'green' : 'white' : 'none'"
              :stroke="c.bottomAlgo ? 'none' : 'grey'"
            />
            <text
              v-if="c.tracked"
              fill="black"
              font-family="Verdana"
              font-size="16"
              :x="(getSectionWidth(i) - blockWidth) / 2 + 10"
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
  computed: {
    rowStyle: function() {
      return {
        height: this.combBlockHeight - this.blockHeight - (this.strokeWidth * 2) + 'px'
        }
    },
  },
  methods: {
    getAdditionalWidthFactor: function(rowIndex) {
      return (Math.pow(2, this.combMatrix.length - 1 - rowIndex) - 1);
    },
    getFactorsAndGap(rowIndex) {
      const factor = this.getAdditionalWidthFactor(rowIndex);
      const zeroFactor = factor ? 1 : 0
      const gap = this.combBlockWidth - (2 * this.blockWidth);
      return { factor, zeroFactor, gap };
    },
    getPadding: function(rowIndex) {
      const { factor, zeroFactor, gap } = this.getFactorsAndGap(rowIndex);
      return factor * this.combBlockWidth / 2 + (zeroFactor * gap / 2)
    },
    getSvgStyle: function(rowIndex) {
      return {
        'margin-left': this.getPadding(rowIndex) / 2 + 'px',
        'margin-right': this.getPadding(rowIndex) / 2 + 'px'
      }
    },
    getSectionWidth(rowIndex) {
      const { factor, zeroFactor, gap } = this.getFactorsAndGap(rowIndex);
      return (factor + 2) * this.combBlockWidth / 2 - (zeroFactor * gap / 2);
    },
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
  .row {
    display: flex;
    justify-content: center;
  }
  .section {
    display: flex;
  }
</style>
