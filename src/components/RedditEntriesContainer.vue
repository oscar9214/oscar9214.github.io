<template>
  <div>
    <div v-show="loading">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;background:#fff;display:block;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" r="32" stroke-width="8" stroke="#3E3E89" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round" transform="rotate(299.238 50 50)">
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.6393442622950818s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
        </circle>
      </svg>
    </div>
    <div class="entries__container" v-show="loaded">
      <div class="entries__sidebar" v-on:scroll="handleScroll">
        <img src="../assets/scroll.svg" class="entries__sidebar__icon-scroll" :class="{ 'bounce-5': showBounce }" alt="" v-show="this.entries.length > 0">
        <div class="entries__dismiss-all" @click="dismissAll()">
          <img src="../assets/layers.svg" alt="" class="entries__icon-layers">
          <img src="../assets/close.svg" alt="" class="entries__icon-close">
          Dismiss all
        </div>
        <RedditEntry
          v-for="(entry, index) in entries"
          :key="entry.data.id"
          :index="index"
          :entry="entry"
          :isSelected="selectedEntry === entry"
          :dismissed="entry.dismissed"
          :read="entry.read"
          @set-selected-entry="setSelectedEntry"
          @dismiss-entry="dismissEntry"
        />
        <div v-if="entries.length === 0" class="entries__empty">
          All entries were dismissed
        </div>
      </div>
      <div class="entries__selected-entry">
        <SelectedRedditEntry :entry="selectedEntry" />
      </div>
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
        selectedEntry: null,
        showBounce: true,
        loading: false,
        loaded: false
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
        this.loading = true;
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
            this.entries.forEach((el, index) => {
              el.dismissed = false;
              el.read = index === 0;
            });
            this.selectedEntry = this.entries[0];
            this.loading = false;
            this.loaded = true;

          }).catch(() => {
          this.$emit('toggle-authorize', true);
          localStorage.redditAppData = JSON.stringify({"token": null });
        })
      },
      setSelectedEntry(data) {
        const entry = data.entry;
        entry.read = true;
        this.selectedEntry = entry;

        this.$set(this.entries, data.index, entry);
      },
      dismissEntry(data) {
        const dismissedIsSelected = this.selectedEntry && (this.selectedEntry.data.id === data.entry.data.id);
        this.entries.splice(data.index, 1);
        if (dismissedIsSelected) {
          const entriesLenght = this.entries.length;
          if (entriesLenght === 0) {
            this.selectedEntry = null;
          } else if (entriesLenght > 0) {
            this.selectedEntry = this.entries[0];
          }
        }
      },
      handleScroll(event) {
        this.showBounce = event.target.scrollTop === 0;
      },
      dismissAll() {
        this.selectedEntry = null;
        this.entries.forEach((el) => {
          el.dismissed = true;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .entries {
    &__container {
      background-color: white;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      padding: 0;
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
      padding-top: 20px;
      box-sizing: border-box;
      position: relative;
      overflow: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        width: 0px;  /* Remove scrollbar space */
        background: transparent;  /* Optional: just make scrollbar invisible */
      }
      
      &__icon-scroll {
        position: fixed;
        background-color: deeppink;
        border-radius: 10px;
        bottom: 60px;
        left: 180px;
        width: 40px;
        z-index: 1;
        animation-duration: 2s;
        animation-iteration-count: 5;
        opacity: .2;
        -webkit-transition: opacity .3s ease-in;
        -moz-transition: opacity .3s ease-in;
        -ms-transition: opacity .3s ease-in;
        -o-transition: opacity .3s ease-in;
        transition: opacity .3s ease-in;

        &.bounce-5 {
          animation-name: bounce-5;
          animation-timing-function: ease;
          opacity: 1;
        }
      }
    }

    &__selected-entry {
      flex: 1;
      display: flex;
      align-items: center;
    }

    &__dismiss-all {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      cursor: pointer;
    }

    &__icon-layers {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }

    &__icon-close {
      width: 12px;
      height: 12px;
      margin-left: -20px;
      margin-right: 5px;
    }
  }

  @keyframes bounce-5 {
    0%   { transform: scale(1,1)    translateY(0); }
    10%  { transform: scale(1.1,.9) translateY(0); }
    30%  { transform: scale(.9,1.1) translateY(50px); }
    50%  { transform: scale(1,1)    translateY(0); }
    57%  { transform: scale(1,1)    translateY(7px); }
    64%  { transform: scale(1,1)    translateY(0); }
    100% { transform: scale(1,1)    translateY(0); }
  }
</style>