<template>
  <div class="container">
    <div class="logo" />
    <div
      class="link-container"
      v-for="route in routes"
      :key="route.name"
    >
      <router-link
        :class="{ link: true, 'link--active': $route.path === route.path }"
        :to="route.path"
      >
        {{ route.displayName }}
      </router-link>
      <svg class="svg" viewBox="0 0 100 2" xmlns="http://www.w3.org/2000/svg">
        <line
          :class="{ line: true, 'line--active': $route.path === route.path }"
          x1="15"
          x2="85"
          y1="1"
          y2="1"
        />
      </svg>
    </div>
  </div>
</template>

<script>
  import routes from '@/router/routes';

  export default {
    name: 'NavBar',
    data() {
      return {
        routes
      }
    }
  }
</script>

<style scoped>
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid lightgrey;
    width: 100%;
    z-index: 100;
    margin-bottom: 30px;
    background-color: #424242;
    box-sizing: border-box;
    padding: 10px;
  }
  .logo {
    background: linear-gradient(0deg, rgba(173, 235, 241), rgba(163, 243, 175));
    width: 40px;
    height: 40px;
  }
  .link-container {
    position: relative;
    flex-basis: 100px;
    display: flex;
    flex-direction: column;
  }
  .svg {
    width: 100%;
    height: 100%;
  }
  .link {
    color: white;
    text-decoration: none;
  }
  .link--active {
    cursor: default;
  }
  .line {
    stroke-dasharray: 0 70;
    stroke-dashoffset: -35;
    stroke-width: 2px;
    stroke: #6bf0fc;
    transition: stroke-dashoffset 0.5s, stroke-dasharray 0.5s;
  }
  .line--active {
    stroke-dasharray: 70 70;
    stroke-dashoffset: 0;
    cursor: default;
  }
  .link-container:hover .line {
    stroke-dasharray: 70 70;
    stroke-dashoffset: 0;
  }
</style>
