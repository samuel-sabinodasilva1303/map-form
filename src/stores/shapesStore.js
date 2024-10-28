import { defineStore } from 'pinia';

export const useShapesStore = defineStore('shapes', {
  state: () => ({
    shapes: [],
    overlays: [], 
  }),
  actions: {
    loadShapes() {
      const shapes = JSON.parse(localStorage.getItem('shapes')) || [];
      this.shapes = shapes;
    },
    saveShapes() {
      localStorage.setItem('shapes', JSON.stringify(this.shapes));
    },
    addShape(shape, overlay) {
      this.shapes.push(shape);
      this.overlays.push(overlay); 
      this.saveShapes();
    },
    removeShape(index) {
      this.shapes.splice(index, 1);
      this.overlays.splice(index, 1);
      this.saveShapes();
    },
  },
});
