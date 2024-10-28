<template>
    <div :class="['notification', { error: isError }]">
      {{ message }}
    </div>
  </template>
  
  <script>
    export default {
        props: {
        message: {
            type: String,
            required: true,
        },
        isError: {
            type: Boolean,
            default: false,
        },
        },
    };
  </script>
  
  <style scoped>
    .notification {
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: #4caf50;
        color: white;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transition: opacity 0.3s ease-in-out;
    }
    .notification.error {
        background-color: #f44336;
    }
  </style>
  