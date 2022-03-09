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
  /* Avoid downscaling if it doesn't fit, in this case the integer scaling
  is more important. We dont really care about phones */
  max-width: none;
}
</style>
