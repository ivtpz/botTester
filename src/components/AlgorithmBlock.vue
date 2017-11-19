<template>
  <div
    :class="{ block: true, 'block--active': active, 'block--hovering': hovering }"
    :style="styles"
    v-draggable.bound.tracked="{ func: handleDrag }"
  >
    <div>{{ name.replace(/<->.*$/, '') }}</div>
  </div>
</template>

<script>
  export default {
    name: 'AlgorithmBlock',
    props: ['name', 'active', 'width', 'height', 'top', 'left', 'hovering'],
    data() {
      return {
        styles: {
          width: this.width + 'px',
          height: this.height + 'px',
        }
      };
    },
    methods: {
      handleDrag(end) {
        if (end) {
          this.$emit('end-drag');
        } else {
          const box = this.$el.getBoundingClientRect();
          this.$emit('drag-move', { name: this.name, box })
        }
      }
    },
    mounted() {
      // Register initial position
      const { left, top, $el } = this;
      const parentPostion = $el.parentElement.getBoundingClientRect();
      if (left && top) {
        $el.style.position = 'absolute'
        $el.style.left = left - parentPostion.left + 'px';
        $el.style.top = top - parentPostion.top + 'px';
      } else {
        this.handleDrag();
      }
    }
  };
</script>

<style scoped>
  .block {
    border-radius: 3px;
    background-image: radial-gradient(#adebf1 0%, #6bf0fc 100%);
    color: white;
    font-weight: 570;
    text-shadow: 0px 1px 1px grey;
    border: 2px solid grey;
    vertical-align: middle;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 49;
  }
  .block--active {
    border: 2px dashed #515151;
  }
  .block--hovering {
    box-shadow: 3px 3px 2px rgba(0,0,0,0.5);
    border: 0px;
    z-index: 99;
  }
</style>

