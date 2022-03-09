<template>
  <div>
    <img @load="onImgLoad" class="integer-scaling" ref="theImage" :src="imgUrl" v-bind:style="{width: calcWidth()}" />
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: String,
    scale: Number
  },

  data () {
    return {
      nativeWidth: 0,
      pixelRatio: 1
    }
  },

  mounted () {
    const dprChange = () => {
      matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
        .addEventListener('change', dprChange, { once: true })
      this.$set(this, 'pixelRatio', window.devicePixelRatio)
    }
    dprChange()
  },

  updated () {},

  methods: {
    calcWidth () {
      // Set scale to allow for 2x2 pixel size when using high DPI display
      const finalScale = this.scale * Math.round(Math.max(this.pixelRatio, 1))
      if (this.scale !== 1) {
        console.log(
          finalScale * this.nativeWidth / this.pixelRatio + 'px',
          this.nativeWidth,
          this.pixelRatio)
      }
      return finalScale * this.nativeWidth / this.pixelRatio + 'px'
    },

    onImgLoad () {
      this.$set(this, 'nativeWidth', this.$refs.theImage.naturalWidth)
    }
  }
}
</script>

<style>
.integer-scaling {
  -ms-interpolation-mode: nearest-neighbor;
  image-rendering: pixelated;
}

/* TODO Make sure images are never downscaled! */
</style>
