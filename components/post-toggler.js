/* global AFRAME */

AFRAME.registerComponent('post-toggler', {
  init: function () {
    this.boundClickHandler = this.clickHandler.bind(this);
    window.addEventListener('contextmenu', this.boundClickHandler);
  },

  remove: function () {
    window.removeEventListener('contextmenu', this.boundClickHandler);
  },

  clickHandler: function () {
    var scene = this.el.sceneEl;
    if (scene.components['post-process']) {
      scene.removeAttribute('post-process');
    } else {
      scene.setAttribute('post-process', true);
    }
  }
});
