<template>
  <div
    :class="{ block: !active, 'block-active': active }"
    v-bind:style="styles"
    v-draggable="handleDrag"
    ref="block"
  >
    {{ name }}
  </div>
</template>

<script>
  export default {
    name: 'AlgorithmBlock',
    props: ['name', 'active', 'width', 'height'],
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
          const box = this.$refs.block.getBoundingClientRect();
          this.$emit('drag-move', { name: this.name, box })
        }
      }
    },
    mounted() {
      // Register initial position
      this.handleDrag();
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
