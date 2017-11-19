<template>
  <div
    :class="{ block: !active, 'block-active': active }"
    v-bind:style="styles"
    v-draggable.bound.tracked="{ func: handleDrag }"
  >
    {{ name }}
  </div>
</template>

<script>
  export default {
    name: 'AlgorithmBlock',
    props: ['name', 'active', 'width', 'height', 'top', 'left'],
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
    background-color: yellow;
  }
  .block-active {
    background-color: green;
  }
</style>
