<template>
    <div class="container">
      <div ref="mapContainer" class="map-container"></div>
  
      <div class="saved-shapes">
        <h2>Formas Salvas</h2>
        <ul>
          <li class="saved-shapes--images" v-for="(shape, index) in shapes" :key="index">
            <img :src="shape.imageUrl" alt="Forma Salva" />
            <button @click="deleteShape(index)">Excluir</button>
            <button @click="removeShapeFromMap(index)">Remover do Mapa</button>
          </li>
        </ul>
      </div>
      
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        map: null,
        drawingManager: null,
        shapes: [],
        overlays: [],
      };
    },
    mounted() {
      this.loadGoogleMapsApi();
    },
    methods: {
      loadGoogleMapsApi() {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=drawing`;
        script.async = true;
        document.head.appendChild(script);
        script.onload = this.initMap;
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
            drawingModes: ["polygon", "rectangle"],
          },
        });
        this.drawingManager.setMap(this.map);
  
        google.maps.event.addListener(this.drawingManager, "overlaycomplete", (event) => {
          const shape = event.overlay;
          shape.type = event.type;
  
          let path = [];
          if (shape.getPath) {
            path = shape.getPath().getArray().map((point) => ({
              lat: point.lat(),
              lng: point.lng(),
            }));
          } else if (shape.getBounds) {
            const bounds = shape.getBounds();
            path.push(
              { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
              { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() }
            );
          }
  
          const imageUrl = this.generateStaticMapUrl(path, shape.type);
          this.shapes.push({ type: shape.type, path, imageUrl });
          this.overlays.push(shape); 
        });
      },
      saveShapes() {
        localStorage.setItem("shapes", JSON.stringify(this.shapes));
      },
      loadShapes() {
        const savedShapes = JSON.parse(localStorage.getItem("shapes"));
        if (savedShapes) {
          this.shapes = savedShapes;
        }
      },
      deleteShape(index) {
        this.removeShapeFromMap(index);
        this.shapes.splice(index, 1);
        localStorage.setItem("shapes", JSON.stringify(this.shapes));
      },
      removeShapeFromMap(index) {
        if (this.overlays[index]) {
          this.overlays[index].setMap(null);
          this.overlays.splice(index, 1); 
        }
      },
      generateStaticMapUrl(path, shapeType) {
        const baseUrl = `https://maps.googleapis.com/maps/api/staticmap?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
        let mapParams = `&size=400x400&path=color:0x000000|weight:3|`;

        if (shapeType === "polygon") {
            const polygonPath = path.map(point => `${point.lat},${point.lng}`).join("|");
            mapParams += polygonPath + `&fillcolor:0x00000000`;
        } else if (shapeType === "rectangle") {
            const ne = path[0];
            const sw = path[1];
            mapParams += `${ne.lat},${ne.lng}|${sw.lat},${ne.lng}|${sw.lat},${sw.lng}|${ne.lat},${sw.lng}|${ne.lat},${ne.lng}`;
            mapParams += `&fillcolor:0x00000000`; 
        }

        return `${baseUrl}${mapParams}`;
    },


    },
    created() {
      this.loadShapes();
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
  .saved-shapes {
    width: 1200px;
    height: 400px;
    overflow: auto;
  }
  .saved-shapes button {
    margin-top: 5px;
    border: 1px solid #c6c6c6;
    cursor: pointer;
  }
  .saved-shapes--images{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 10px;
  }
    @media (max-width: 768px) {
        .container{
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2em;
        }
        .saved-shapes, .map-container{
            height: 600px;
            width: 400px;
        }
        .saved-shapes--images{
          width: 95%;
        }
    }
  </style>
  