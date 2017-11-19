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
            <defs>
              <radialGradient id="comb-block">
                <stop offset="0%" stop-color="#a3f3af"/>
                <stop offset="100%" stop-color="#6bfc88"/>
              </radialGradient>
              <radialGradient id="algo-block">
                <stop offset="0%" stop-color="#adebf1"/>
                <stop offset="100%" stop-color="#6bf0fc"/>
              </radialGradient>
            </defs>
            <rect
              v-if="c.name"
              :class="{
                'block': true,
                'block--filled': c.leftAlgo,
                'dashed-block': !c.leftAlgo,
                'dashed-block--top': !c.leftAlgo,
                'dashed-block--active': c.active === 'left'
              }"
              :width="blockWidth"
              :height="blockHeight"
              :x="strokeWidth"
              :y="strokeWidth"
              rx="3"
              ry="3"
              :style="{
                'transform-origin': `${strokeWidth + blockWidth / 2}px ${strokeWidth + blockHeight / 2}px` 
              }"
              :fill="c.leftAlgo ? 'url(#algo-block)' : 'none'"
              :stroke="c.active === 'left' ? '#515151' : c.leftAlgo ? 'grey' : 'grey'"
              :ref="c.tracked ? 'leftRect' : 'test'"
            />
            <text
              v-if="c.name"
              fill="black"
              font-family="Verdana"
              font-size="16"
              :x="strokeWidth + blockWidth / 2"
              :y="strokeWidth + 20"
              text-anchor="middle"
            >
              <tspan
                v-for="(nameSection, j) in getAlgoName(c.leftAlgo)"
                :key="c.leftAlgo + j"
                :x="strokeWidth + blockWidth / 2"
                :y="strokeWidth + 20"
                :dy="20 * j"
              >{{ nameSection }} </tspan>
            </text>
            <rect
              v-if="c.name"
              :width="blockWidth"
              :height="blockHeight"
              :x="getSectionWidth(i) - strokeWidth - blockWidth"
              :y="strokeWidth"
              rx="3"
              ry="3"
              :class="{
                'block': true,
                'block--filled': c.rightAlgo,
                'dashed-block': !c.rightAlgo,
                'dashed-block--top': !c.rightAlgo,
                'dashed-block--active': c.active === 'right'
              }"
              :style="{
                'transform-origin': `${(getSectionWidth(i) - strokeWidth - blockWidth) + blockWidth / 2}px ${strokeWidth + blockHeight / 2}px` 
              }"
              :fill="c.rightAlgo ? 'url(#algo-block)' : 'none'"
              :stroke="c.active === 'right' ? '#515151' : c.rightAlgo ? 'grey' : 'grey'"
              :ref="c.tracked ? 'rightRect' : 'test'"
            />
            <text
              v-if="c.name"
              fill="black"
              font-family="Verdana"
              font-size="16"
              :x="getSectionWidth(i) - strokeWidth - blockWidth / 2"
              :y="strokeWidth + 20"
              text-anchor="middle"
            >
              <tspan
                v-for="(nameSection, j) in getAlgoName(c.rightAlgo)"
                :key="c.rightAlgo + j"
                :x="getSectionWidth(i) - strokeWidth - blockWidth / 2"
                :y="strokeWidth + 20"
                :dy="20 * j"
              >{{ nameSection }} </tspan>
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
              rx="3"
              ry="3"
              fill="url(#comb-block)"
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
              rx="3"
              ry="3"
              :class="{
                block: true,
                'dashed-block': true,
                'block--bottom': true,
                'block--bottom--filled': c.bottomAlgo
              }"
              :fill="c.bottomAlgo ? 'url(#algo-block)' : 'none'"
              :stroke="c.bottomActive ? '#515151' : 'grey'"
            />
            <text
              v-if="c.tracked"
              fill="white"
              font-family="Verdana"
              font-size="16"
              class="text--bottom"
              text-anchor="middle"
              :x="(getSectionWidth(i) - blockWidth) / 2 + blockWidth / 2"
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
    getAlgoName(nameWithId) {
      return nameWithId && typeof nameWithId === 'string' ? nameWithId.replace(/<->.*$/, '').split(' ') : [nameWithId];
    },
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
  .block {
    stroke-width: 2;
  }
  .block--bottom {
    transform: rotate(0deg);
  }
  .block--bottom--filled {
    fill-opacity: 0;
    animation: appear 0.3s ease forwards 0.5s;
  }
  .block--filled {
    transform: rotate(180deg);
    animation: draw 0.4s linear forwards;
  }
  .dashed-block {
    stroke-dasharray: 10 5;
  }
  .dashed-block--top {
    transition: transform 0.3s;
  }
  .dashed-block--active {
    transform: scale(0.9);
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
  @keyframes draw {
    from {
      stroke-dashoffset: -110;
      stroke-dasharray: 40 270;
    }
    to {
      stroke-dashoffset: 0;
      stroke-dasharray: 270;
    }
  }
  @keyframes appear {
    from {
      fill-opacity: 0;
    }
    to {
      fill-opacity: 1;
    }
  }
</style>
