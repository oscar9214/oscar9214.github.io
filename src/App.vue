<template>
  <div id="app">
    <h1>A client for reddit</h1>
    <a v-if="showAuthorize" href="https://www.reddit.com/api/v1/authorize?client_id=RNgt-PKuPjQ0GA&response_type=code&state=random&redirect_uri=http://localhost:8080&duration=temporary&scope=read">Please authorize our app first</a>
    <div class="entries__container">
      <div class="entries__sidebar">
        <RedditEntry v-for="(entry, index) in entries" :key="index" :entry="entry" />
      </div>
      <div class="entries__selected-entry">

      </div>
    </div>
  </div>
</template>

<script>
import RedditEntry from "./components/RedditEntry.vue";
import axios from "axios";
import qs from "qs";

export default {
  name: "App",
  components: {
    RedditEntry
  },
  data() {
    return {
      entries: [],
      showAuthorize: true,
      token: null
    }
  },
  created() {
    const code = window.location.href.indexOf('&code=') > -1 ? window.location.href.split('&code=')[1] : null;
    const token = localStorage.redditAppData ? JSON.parse(localStorage.redditAppData).token : null;
    if (code || token) {
      this.showAuthorize = false;
      if (token) {
        this.token = token;
      }
      if (!this.token) {
        axios
          .post(
            'https://www.reddit.com/api/v1/access_token',
            qs.stringify({
              grant_type: "authorization_code",
              code: code,
              redirect_uri: "http://localhost:8080"
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic Uk5ndC1QS3VQalEwR0E6QzNiZ0hHSk16aXRVblhNMnRqYlZjWmhiOVlB",
                //"Access-Control-Allow-Origin": "*",
                //"Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization",
              }
            }
          ).then(response => {
          if (response.status == 200) {
            this.token = response.data.access_token;
            localStorage.redditAppData = JSON.stringify({"token": this.token });
            this.fetchTopPosts();
          }

        });
      } else {
        this.fetchTopPosts();
      }
    }
  },
  methods: {
    fetchTopPosts() {
      axios
        .get(
          'https://oauth.reddit.com/top',
          {
            headers: {
              Authorization: "bearer " + this.token
            }
          }
        )
        .then(response => {
          this.entries = response.data.data.children;
        }).catch(() => {
        this.showAuthorize = true;
        localStorage.redditAppData = JSON.stringify({"token": null });
      })
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
  margin-top: 60px;
}

body, h3 {
  margin: 0;
}



.entries {
  &__container {
    background-color: #f3f3f3;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 30px 20px;
  }

  &__sidebar {
    width: 400px;
  }
}
</style>
