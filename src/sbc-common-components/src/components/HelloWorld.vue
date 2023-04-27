<template>
  <div class="hello">
    <h1>Hey {{ msg }}.. Greetings!---{{VUE_APP_COPS_REDIRECT_URL}}---{{message}}-</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data () {
    return {
      message: 'hello mr. magoo',
      VUE_APP_COPS_REDIRECT_URL: 'HEYURL'
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h3{
  margin: 40px 0 0
}

ul{
  list-style-type: none;
  padding: 0
}

li{
  display: inline-block;
  margin: 0 10px
}

a{
  color: #42b983
}
</style>
