<template>
  <div id="app">
    <h1>A client for reddit</h1>
    <a v-if="showAuthorize" href="https://www.reddit.com/api/v1/authorize?client_id=RNgt-PKuPjQ0GA&response_type=code&state=random&redirect_uri=http://localhost:8080&duration=temporary&scope=read">Please authorize our app first</a>
    <RedditEntriesContainer
      @toggle-authorize="toggleAuthorize"
    />
  </div>
</template>

<script>
  import RedditEntriesContainer from "./components/RedditEntriesContainer";

  export default {
    name: "App",
    components: {
      RedditEntriesContainer
    },
    data() {
      return {
        showAuthorize: true
      }
    },
    methods: {
      toggleAuthorize(value) {
        this.showAuthorize = value;
      }
    }
  };
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body, h3 {
  margin: 0;
}
</style>
