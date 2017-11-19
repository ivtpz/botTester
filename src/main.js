// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import storeConfig from './store';

Vue.use(Vuex);

const store = new Vuex.Store(storeConfig);

Vue.config.productionTip = false;

// TODO: separate out into directives directory
Vue.directive('draggable', {
  bind: function (el, binding, vNode) {
    let debounced = false;
    let maxX = 1000, maxY = 1000, minX = -1000, minY = -1000;
    vNode.context.$nextTick(() => {
      if (binding.modifiers.bound) {
        const { width, height } = el.getBoundingClientRect();
        const parentBox = el.parentElement.getBoundingClientRect();
        maxX = parentBox.width - width;
        maxY = parentBox.height - height;
        minX = 0;
        minY = 0;
      }
          
      el.addEventListener('click', function(e) {
        e.stopPropagation();
      })
      
      el.addEventListener('mousedown', function(e) {
        binding.value.func(binding.value.name);
        if (el.style.position !== 'absolute') {
          el.style.position = 'absolute';
        }
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
    el.style.cursor = 'move';
    el.style.position = 'absolute';
    var startX, startY, initialMouseX, initialMouseY;
    
    function mousemove(e) {
      if (!debounced) {
        if (binding.modifiers.tracked) binding.value.func();
        var dx = e.clientX - initialMouseX;
        var dy = e.clientY - initialMouseY;
        el.style.top = Math.max(Math.min(startY + dy, maxY), minY) + 'px';
        el.style.left = Math.max(Math.min(startX + dx, maxX), minX) + 'px';
        debounced = true;
        setTimeout(() => { debounced = false }, 100);
      }
      return false;
    }
    
    function mouseup() {
      binding.value.func('end');
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
