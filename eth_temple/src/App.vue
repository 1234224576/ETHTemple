<template>
  <div id="app">
    <div v-if="!isConnect">
      <b-button @click="connect">Connect</b-button>
    </div>

    <div v-if="isConnect">
      Conected
    </div>
  </div>
</template>

<script>
import { uport } from './uportSetup'
export default {
  
  name: 'app',

  methods: {
    connect(){
      uport.requestCredentials({
        requested: ['name', 'country', 'avatar'],
        notifications: true 
      }).then((credentials) => {
        console.log({credentials})
        this.$data.isConnect = true;
      })
    }
  },
  data () {
    return {
      isConnect: false
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
