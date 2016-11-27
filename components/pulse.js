/* global AFRAME */

AFRAME.registerComponent('pulse', {
  dependencies: ['geometry', 'material'],

  schema: {
    phase: { default: 0, min: 0, max: 1 },
    exponent: { default: 1 }
  },

  remove: function () {
    var mesh = this.el.getObject3D('mesh');
    delete mesh.material.postOpacity;
  },

  tick: function (time) {
    var mesh = this.el.getObject3D('mesh');

    // Don't set opacity immediately, let the post effect handle that in it's tock()
    var calc = Math.abs(Math.sin(time / 1000 + this.data.phase));
    mesh.material.postOpacity = Math.pow(calc, this.data.exponent);
    var scale = 1 + 0.2 * (1 - calc);
    mesh.scale.set(scale, scale, scale);
  }
});
