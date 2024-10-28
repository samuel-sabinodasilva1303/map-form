<template>
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
</template>

<script>
export default {
  props: {
    shapes: {
      type: Array,
      required: true,
    },
  },
  methods: {
    deleteShape(index) {
      this.$emit('deleteShape', index);
    },
    removeShapeFromMap(index) {
      this.$emit('removeShapeFromMap', index);
    },
  },
};
</script>

<style scoped>
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
  .saved-shapes--images {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 10px;
  }
  @media (max-width: 768px) {
  .saved-shapes{
    width: 100%;
    margin: 0 auto;
  }
  .saved-shapes--images{
    width: 100%;
    padding-top: 4em
  }
}
</style>
