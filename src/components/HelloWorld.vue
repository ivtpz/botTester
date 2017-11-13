<template>
  <div class="hello" v-bind:class="{ 'flash': is_flashing }">
    <draggable-board></draggable-board>
  </div>
</template>

<script>
import DraggableBoard from './DraggableBoard';
export default {
  name: 'HelloWorld',
  components: { DraggableBoard },
  data() {
    return {
      usr_input: '',
      is_flashing: false,
    };
  },
  methods: {
    flash() {
      this.is_flashing = true;
      setTimeout(() => { this.is_flashing = false; }, 300);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flash {
  background-color: greenyellow
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
