<template>
  <div id="app">
    <h1 class="main__title">A client for reddit</h1>
    <a class="main__authorize" v-if="showAuthorize" href="https://www.reddit.com/api/v1/authorize?client_id=RNgt-PKuPjQ0GA&response_type=code&state=random&redirect_uri=https://oscar9214.github.io/reddit-top-entries/&duration=temporary&scope=read,save">Please authenticate with reddit</a>
    <RedditEntriesContainer v-show="!showAuthorize"
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
  color: $color-dark-purple-gray;
}

body, h3 {
  margin: 0;
}

body:before {
  content: "xsmall";
  display: none;
  visibility: hidden;

  @include media-breakpoint-up(md) {
    content: "medium";
  }
}

  .main{
    &__title {
      background-color: $color-middle-purple;
      margin: 0;
      padding: 22px 0;
      color: $color-light-gray;
    }

    &__authorize {
      margin-top: 20px;
      display: block;
      font-size: 16px;
      color: inherit;
    }
  }
</style>
