<template>
  <div class="container">
    <div
      class="toggle-popup-btn"
      @click="togglePopup"
      :class="{ open: isPopupOpen }"
    >
      {{ isPopupOpen ? "X" : "<<" }}
    </div>
    
    <div ref="mapContainer" class="map-container"></div>

    <SavedShapes
      v-if="isPopupOpen"
      :class="['saved-shapes-popup', { open: isPopupOpen }]"
      :shapes="shapesStore.shapes"
      @deleteShape="deleteShape"
      @removeShapeFromMap="removeShapeFromMap"
    />

    <Notification
      v-if="notification.visible"
      :message="notification.message"
      :isError="notification.isError"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useShapesStore } from '../stores/shapesStore';
import SavedShapes from './SavedShapes.vue';
import Notification from './Notification.vue';

export default {
  components: {
    SavedShapes,
    Notification,
  },
  setup() {
    const shapesStore = useShapesStore();
    return { shapesStore };
  },

  data() {
    return {
      map: null,
      drawingManager: null,
      notification: {
        message: "",
        visible: false,
        isError: false,
      },
      isPopupOpen: false,
    };
  },

  mounted() {
    this.loadGoogleMapsApi();
    this.shapesStore.loadShapes();
  },

  methods: {
    togglePopup() {
      this.isPopupOpen = !this.isPopupOpen;
    },

    loadGoogleMapsApi() {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=drawing`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = this.initMap;
      script.onerror = () => {
        this.showNotification("Erro ao carregar o Google Maps API. Verifique sua conexão ou chave de API.", true);
      };
    },

    initMap() {
      this.map = new google.maps.Map(this.$refs.mapContainer, {
        center: { lat: -22.10367, lng: -50.19013 },
        zoom: 13,
        gestureHandling: "cooperative",
      });

      this.drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: ["polygon", "rectangle", "circle"],
        },
      });

      this.drawingManager.setMap(this.map);

      google.maps.event.addListener(this.drawingManager, "overlaycomplete", (event) => {
        const shape = event.overlay;
        shape.type = event.type;

        let path = this.extractPath(shape);
        let radius = null;

        if (shape instanceof google.maps.Circle) {
          radius = shape.getRadius();
        }

        const imageUrl = this.generateStaticMapUrl(path, shape.type, radius);
        this.showNotification("Forma salva com sucesso!");

        this.isPopupOpen = true;
        this.shapesStore.addShape({ type: shape.type, path, imageUrl, overlay: shape, radius });
      });
    },

    extractPath(shape) {
      let path = [];
      if (shape.getPath) {
        path = shape.getPath().getArray().map(point => ({
          lat: point.lat(),
          lng: point.lng(),
        }));
      } else if (shape.getBounds) {
        const bounds = shape.getBounds();
        path.push(
          { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
          { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() }
        );
      } else if (shape instanceof google.maps.Circle) {
        const center = shape.getCenter();
        path.push({ lat: center.lat(), lng: center.lng() });
      }
      return path;
    },

    deleteShape(index) {
      this.removeShapeFromMap(index);
      this.shapesStore.removeShape(index);
      this.showNotification("Forma excluída com sucesso!");
    },

    removeShapeFromMap(index) {
      const overlay = this.shapesStore.shapes[index].overlay;
      if (overlay) {
        overlay.setMap(null);
      }
    },

    generateStaticMapUrl(path, shapeType, radius) {
      const baseUrl = `https://maps.googleapis.com/maps/api/staticmap?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
      let mapParams = `&size=400x400&path=color:0x000000|weight:3|`;

      if (shapeType === "polygon") {
        const polygonPath = path.map(point => `${point.lat},${point.lng}`).join("|");
        mapParams += `${polygonPath}&fillcolor:0x00000000`;
      } else if (shapeType === "rectangle") {
        const ne = path[0];
        const sw = path[1];
        mapParams += `${ne.lat},${ne.lng}|${sw.lat},${ne.lng}|${sw.lat},${sw.lng}|${ne.lat},${sw.lng}|${ne.lat},${ne.lng}&fillcolor:0x00000000`;
      } else if (shapeType === "circle") {
        const center = path[0];
        const circlePoints = [];
        const numPoints = 36;
        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * 2 * Math.PI;
          const lat = center.lat + (radius / 100900) * Math.cos(angle);
          const lng = center.lng + (radius / (100900 * Math.cos(center.lat * (Math.PI / 180)))) * Math.sin(angle);
          circlePoints.push(`${lat},${lng}`);
        }
        mapParams += circlePoints.join("|") + `|${circlePoints[0]}&fillcolor:0x00000000`;
      }

      return `${baseUrl}${mapParams}`;
    },

    showNotification(message, isError = false) {
      this.notification.message = message;
      this.notification.visible = true;
      this.notification.isError = isError;

      setTimeout(() => {
        this.notification.visible = false;
      }, 3000);
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  margin-top: 1em;
}

.map-container {
  width: 1200px;
  height: 400px;
}

.toggle-popup-btn {
  position: fixed;
  top: 20px;
  right: 0;
  padding: 10px;
  background-color: #26466c;
  color: white;
  border: none;
  border-radius: 5px 0 0 5px;
  cursor: pointer;
  z-index: 1001;
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
}

.toggle-popup-btn.open {
  right: 270px;
  transform: translateX(-100%);
}

.saved-shapes-popup {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: #fff;
  box-shadow: -4px 0 6px rgba(0, 0, 0, 0.2);
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  overflow-y: auto;
  z-index: 1000;
}

.saved-shapes-popup.open {
  transform: translateX(0);
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 2em;
  }
  .map-container {
    width: 400px;
    margin: 0 auto;
    height: 400px;
  }
}
</style>
