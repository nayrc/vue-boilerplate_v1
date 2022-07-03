<template>
  <div class="home">
    <h1>Boiler Plate by Nay</h1>
    <p v-if="isOnlyMobile()">Mobile</p>
  </div>
</template>

<script>
// @ is an alias to /src
import GlobalVue from "@/libs/Global.vue"

export default {
  extends: GlobalVue,
  name: "Home",
};
</script>
