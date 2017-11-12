<template>
  <div class="hello" v-bind:class="{ 'flash': is_flashing }">
    <h1 v-for="msg in msgs" :key="msg" >{{ msg }}</h1>
    <input v-model="usr_input" type="text" />
    <p>{{usr_input}}</p>
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
      msgs: ['Welcome to Bot Tester', 'We give you the blocks to build trading bots', 'And test them for you'],
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
