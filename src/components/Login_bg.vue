<template>
  <div class="wrapper">
    <div class="wrapper-overlay" :class="{ focus: store.Blur }" />
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from '../store/store'

const store = useMainStore()

const load = () => {
  store.$reset
  sessionStorage.clear
}
load()
</script>

<style scoped>
.wrapper {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
.wrapper-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background-image: linear-gradient(to bottom right, #fc466b, #3f5efb); */
  background-image: url(../assets/img/Cupoi吃咖喱的poi_Cupoi吃咖喱的poi_林中小屋_98928714_p0_zip.jpg);
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-size: cover;
  will-change: filter;
  filter: blur(0px);
  transition: filter 0.3s ease-in-out;
}
.wrapper-overlay.focus {
  filter: blur(20px);
}
</style>
