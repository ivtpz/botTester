// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';

Vue.use(Vuex);

Vue.config.productionTip = false;

// TODO: separate out into directives directory
Vue.directive('draggable', function (el, binding, vNode) {
    let maxX, maxY;
    vNode.context.$nextTick(() => {
      const { width, height } = el.getBoundingClientRect();
      const parentBox = el.parentElement.getBoundingClientRect();
      maxX = parentBox.width - width;
      maxY = parentBox.height - height;
    })
    el.style.position = 'absolute';
    var startX, startY, initialMouseX, initialMouseY;

    function mousemove(e) {
      var dx = e.clientX - initialMouseX;
      var dy = e.clientY - initialMouseY;
      el.style.top = Math.max(Math.min(startY + dy, maxY), 0) + 'px';
      el.style.left = Math.max(Math.min(startX + dx, maxX), 0) + 'px';
      return false;
    }

    function mouseup() {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    }

    el.addEventListener('click', function(e) {
      e.stopPropagation();
    })

    el.addEventListener('mousedown', function(e) {
      e.stopPropagation();
      e.preventDefault();
      startX = el.offsetLeft;
      startY = el.offsetTop;
      initialMouseX = e.clientX;
      initialMouseY = e.clientY;
      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);
      return false;
    });
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
