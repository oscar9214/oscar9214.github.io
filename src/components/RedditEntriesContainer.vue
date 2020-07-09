<template>
    <div class="entries__container">
      <div class="entries__sidebar">
        <RedditEntry
          v-for="(entry, index) in entries"
          :key="index"
          :index="index"
          :entry="entry"
          :isSelected="selectedEntry === entry"
          @set-selected-entry="setSelectedEntry"
          @dismiss-entry="dismissEntry"
        />
      </div>
      <div class="entries__selected-entry">
        <SelectedRedditEntry :entry="selectedEntry" />
      </div>
    </div>
</template>

<script>
  import RedditEntry from "./RedditEntry.vue";
  import axios from "axios";
  import qs from "qs";
  import SelectedRedditEntry from "./SelectedRedditEntry";


  export default {
    name: "RedditEntriesContainer",
    components: {
      SelectedRedditEntry,
      RedditEntry,
    },
    data() {
      return {
        entries: [],
        token: null,
        selectedEntry: null
      }
    },
    created() {
      const code = window.location.href.indexOf('&code=') > -1 ? window.location.href.split('&code=')[1] : null;
      const token = localStorage.redditAppData ? JSON.parse(localStorage.redditAppData).token : null;
      if (code || token) {
        this.$emit('toggle-authorize', false);

        if (token) {
          this.token = token;
        }
        if (!this.token) {
          this.getAccesToken(code);
        } else {
          this.fetchTopEntries();
        }
      }
    },
    methods: {
      getAccesToken(code) {
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
                "Authorization": "Basic Uk5ndC1QS3VQalEwR0E6QzNiZ0hHSk16aXRVblhNMnRqYlZjWmhiOVlB"
              }
            }
          ).then(response => {
          if (response.status == 200) {
            this.token = response.data.access_token;
            localStorage.redditAppData = JSON.stringify({"token": this.token });
            this.fetchTopEntries();
          }
        });
      },
      fetchTopEntries() {
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
            this.entries.forEach((el) => {
              el.show = true;
              el.dismissed = false;
            });
            this.selectedEntry = this.entries[0];
          }).catch(() => {
          this.$emit('toggle-authorize', true);
          localStorage.redditAppData = JSON.stringify({"token": null });
        })
      },
      setSelectedEntry(entry) {
        this.selectedEntry = entry;
      },
      dismissEntry(index) {
        const data = {
          state: this,
          index
        }
        setTimeout(this.deleteEntry(data), 1600)
      },
      deleteEntry(data) {
        data.state.entries.splice(data.index, 1);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .entries {
    &__container {
      background-color: #f3f3f3;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      padding: 30px 0;
      height: calc(100vh - 88px);
      box-sizing: border-box;
      overflow: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        width: 0px;  /* Remove scrollbar space */
        background: transparent;  /* Optional: just make scrollbar invisible */
      }
    }

    &__sidebar {
      width: 400px;
      height: 100%;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 10px;
      box-sizing: border-box;
      overflow: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        width: 0px;  /* Remove scrollbar space */
        background: transparent;  /* Optional: just make scrollbar invisible */
      }
    }

    &__selected-entry {
      flex: 1;
    }
  }
</style>