<template>

  <iframe :src="homeUrl" v-loading.fullscreen.lock="fullscreenLoading" id="foo" scrolling="yes" frameborder="0" width="100%" :height="height">


    </iframe>
</template>

<script>
import { config } from "../../config/index";
export default {
  name: "home",
  data() {
    return {
      homeUrl: "https://sugar.aipage.com/dashboard/d3f68df5dacbdfe6c9531bd5af74e79d?orgId="+this.$store.state.user.orgId,
      fullscreenLoading: false,
      //width: document.documentElement.clientWidth -18,
      height: document.documentElement.clientHeight -100
    };
  },
  created(){
  },
  methods: {
    initHomeIndex() {
      let homeUrl = window.localStorage["homeUrl"];
      if (homeUrl) {
        this.homeUrl = window.localStorage["homeUrl"];
      }
    }
  }
};
</script>
