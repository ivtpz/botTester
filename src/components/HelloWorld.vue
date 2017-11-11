<template>
  <div class="hello">
    <h1 v-for="msg in msgs" :key="msg" >{{ msg }}</h1>
    <input v-model="usr_input" type="text" />
    <p>{{usr_input}}</p>
    <button v-on:click="flash" />
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      msgs: ['Welcome to Bot Tester', 'We give you the blocks to build trading bots', 'And test them for you'],
      usr_input: '',
    };
  },
  methods: {
    flash: (event) => console.log(event) 
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
