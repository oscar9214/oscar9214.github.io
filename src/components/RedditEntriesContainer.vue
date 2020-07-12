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
      <div class="entries__show-sidebar" @click="toggleSidebar">
        <img src="../assets/sidebar.svg" class="entries__show-sidebar__icon" alt="">
      </div>
      <div class="entries__sidebar" :class="showSidebarClassObject" v-on:scroll="handleScroll">
        <img src="../assets/scroll.svg" class="entries__sidebar__icon-scroll" :class="{ 'bounce-5': showBounce }" alt="" v-show="this.totalEntries.length > 0">
        <div class="entries__controls">
          <div class="entries__dismiss-all" @click="dismissAll()">
            <img src="../assets/layers.svg" alt="" class="entries__icon-layers">
            <img src="../assets/close.svg" alt="" class="entries__icon-close">
            Dismiss all
          </div>
          <div class="entries__pagination" v-show="totalEntries.length > 0">
            {{ totalEntries.length }} results <br>
            <a :class="{ 'disabled': currentPage === 1}" @click="prevPage" class="entries__pagination__prev">
              &lt;
            </a>
            {{ currentPage }}
            <a @click="nextPage" :class="{ 'disabled': currentPage === pages }" class="entries__pagination__next">
            &gt;
          </a>
          </div>
        </div>
        <RedditEntry
          v-for="(entry, index) in currentPageEntries"
          :key="entry.id"
          :index="index"
          :entry="entry"
          :isSelected="selectedEntry === entry"
          :dismissed="entry.dismissed"
          :read="entry.read"
          @set-selected-entry="setSelectedEntry"
          @dismiss-entry="dismissEntry"
        />
        <div class="entries__pagination" v-show="totalEntries.length > 0">
          {{ totalEntries.length }} results <br>
          <a :class="{ 'disabled': currentPage === 1}" @click="prevPage" class="entries__pagination__prev">
            &lt;
          </a>
          {{ currentPage }}
          <a @click="nextPage" :class="{ 'disabled': currentPage === pages }" class="entries__pagination__next">
            &gt;
          </a>
        </div>
        <div v-if="totalEntries.length === 0" class="entries__empty">
          All entries were dismissed
        </div>
      </div>
      <div class="entries__selected-entry">
        <SelectedRedditEntry :entry="selectedEntry" @save-entry="saveEntry" />
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
        totalEntries: [],
        token: null,
        selectedEntry: null,
        showBounce: true,
        loading: false,
        loaded: false,
        showSidebar: false,
        entriesPerPage: 25,
        currentPage: 1,
        entriesRead: [],
        entriesDismissed: []
      }
    },
    computed: {
      showSidebarClassObject: function(){
        return {
          show: (window.getComputedStyle(document.body, ':before').content === '"medium"' || (window.getComputedStyle(document.body, ':before').content === '"xsmall"' && this.showSidebar)),
        }
      },
      currentPageEntries: function () {
        const startIndex = (this.currentPage * this.entriesPerPage) - this.entriesPerPage;
        const endIndex = ((this.currentPage+1)*this.entriesPerPage) - this.entriesPerPage;
        return this.totalEntries.slice(startIndex, endIndex)
      },
      pages: function () {
        return Math.ceil(this.totalEntries.length / this.entriesPerPage);
      }
    },
    created() {
      const code = window.location.href.indexOf('&code=') > -1 ? window.location.href.split('&code=')[1] : null;
      const token = localStorage.redditAppData ? JSON.parse(localStorage.redditAppData).token : null;
      this.entriesRead = localStorage.redditEntriesRead ? JSON.parse(localStorage.redditEntriesRead) : [];
      this.entriesDismissed = localStorage.redditEntriesDismissed ? JSON.parse(localStorage.redditEntriesDismissed) : [];
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
            'https://oauth.reddit.com/top?limit=100',
            {
              headers: {
                Authorization: "bearer " + this.token
              }
            }
          )
          .then(response => {
            if (response.status === 200) {
              response.data.data.children.forEach((entry, index) => {
                if (this.entriesDismissed.indexOf(entry.data.id) === -1) {
                  const newEntry = {
                    id: entry.data.id,
                    title: entry.data.title,
                    thumbnailImage: entry.data.preview ? entry.data.preview.images[0].resolutions[0].url.replace(/amp;/g, "") : null,
                    image: entry.data.preview ? entry.data.preview.images[0].source.url.replace(/amp;/g, "") : null,
                    text: entry.data.selftext && entry.data.selftext.length < 2000 ? entry.data.selftext : entry.data.selftext.slice(0, 2000),
                    textLong: entry.data.selftext,
                    numComments: entry.data.num_comments,
                    author: entry.data.author,
                    date: entry.data.created_utc,
                    dismissed: false,
                    read: this.totalEntries.length === 0 || this.entriesRead.indexOf(entry.data.id) > -1,
                    originalIndex: index + 1,
                    name: entry.data.name,
                    saved: entry.data.saved
                  };
                  this.totalEntries.push(newEntry);
                }
              });
              this.selectedEntry = this.currentPageEntries.length > 0 ? this.currentPageEntries[0] : null;
              this.loading = false;
              this.loaded = true;
            } else {
              this.$emit('toggle-authorize', true);
              localStorage.redditAppData = JSON.stringify({"token": null });
            }


          }).catch(() => {
          this.$emit('toggle-authorize', true);
          localStorage.redditAppData = JSON.stringify({"token": null });
        })
      },
      setSelectedEntry(data) {
        const needsTimeout = window.getComputedStyle(document.body, ':before').content === '"xsmall"';

        const entry = data.entry;
        entry.read = true;
        this.selectedEntry = entry;

        this.entriesRead.push(entry.id);
        localStorage.redditEntriesRead = JSON.stringify(this.entriesRead);

        setTimeout(() => {
          this.toggleSidebar();
        }, (needsTimeout ? 500 : 0));

      },
      dismissEntry(data) {
        const dismissedIsSelected = this.selectedEntry && (this.selectedEntry.id === data.entry.id);
        this.totalEntries.splice(this.totalEntries.indexOf(data.entry), 1);
        if (dismissedIsSelected) {
          const entriesLenght = this.currentPageEntries.length;
          if (entriesLenght === 0) {
            this.selectedEntry = null;
          } else if (entriesLenght > 0) {
            this.selectedEntry = this.currentPageEntries[0];
            this.selectedEntry.read = true;
          }
        }

        this.entriesDismissed.push(data.entry.id);
        localStorage.redditEntriesDismissed = JSON.stringify(this.entriesDismissed);
      },
      handleScroll(event) {
        this.showBounce = event.target.scrollTop === 0;
      },
      dismissAll() {
        this.selectedEntry = null;
        this.totalEntries.forEach((el) => {
          el.dismissed = true;
          this.entriesDismissed.push(el.id);
        });
        this.totalEntries = [];
        localStorage.redditEntriesDismissed = JSON.stringify(this.entriesDismissed);
      },
      toggleSidebar() {
        this.showSidebar = !this.showSidebar;
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage --;
        }
      },
      nextPage() {
        if (this.currentPage < this.pages) {
          this.currentPage ++;
        }
      },
      saveEntry(entry) {
        axios
          .post(
            'https://oauth.reddit.com/api/save?id=' + entry.name,
            null,
            {
              headers: {
                Authorization: "bearer " + this.token
              }
            }
          )
          .then(response => {
            if (response.status === 200) {
              entry.saved = true;
            }
          })
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
      position: relative;

      @include media-breakpoint-up(md) {
        max-width: 1440px;
        margin: 0 auto;
      }

      &::-webkit-scrollbar {
        width: 0px;  /* Remove scrollbar space */
        background: transparent;  /* Optional: just make scrollbar invisible */
      }
    }

    &__show-sidebar {
      position: absolute;
      background-color: $color-middle-purple;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      box-shadow: rgba(0, 0, 0, 0.6) 2px 2px 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      top: 10px;
      right: 10px;
      -webkit-transition: all .3s;
      -moz-transition: all .3s;
      -ms-transition: all .3s;
      -o-transition: all .3s;
      transition: all .3s;
      z-index: 1;

      &:hover {
        transform: scale(1.2);
      }

      &__icon {
        height: 22px;
        width: 22px;
      }

      @include media-breakpoint-up(md) {
        display: none;
      }
    }

    &__sidebar {

      height: 100%;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 20px;
      box-sizing: border-box;
      //position: relative;
      overflow: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;
      -webkit-transform: translateX(-100%);
      -moz-transform: translateX(-100%);
      -ms-transform: translateX(-100%);
      -o-transform: translateX(-100%);
      transform: translateX(-100%);
      -webkit-transition: transform .3s ease-in;
      -moz-transition: transform .3s ease-in;
      -ms-transition: transform .3s ease-in;
      -o-transition: transform .3s ease-in;
      transition: transform .3s ease-in;
      position: absolute;
      background-color: white;
      z-index: 1;
      box-shadow: $color-gray-box-shadow-darker 0px 0px 10px;
      width: 85%;
      
      @include media-breakpoint-down(md) {
        &.show {
          -webkit-transform: translateX(0);
          -moz-transform: translateX(0);
          -ms-transform: translateX(0);
          -o-transform: translateX(0);
          transform: translateX(0);
        }
      }

      @include media-breakpoint-up(md) {
        position: relative;
        transform: none;
        width: 400px;
        margin-right: 20px;
        box-shadow: $color-gray-box-shadow 0px 0px 10px;
      }


      &::-webkit-scrollbar {
        width: 0px;  /* Remove scrollbar space */
        background: transparent;  /* Optional: just make scrollbar invisible */
      }
      
      &__icon-scroll {
        position: absolute;
        background-color: $color-pink;
        border-radius: 10px;
        bottom: 60px;
        left: 180px;
        width: 40px;
        z-index: 1;
        animation-duration: 2s;
        animation-iteration-count: 5;
        opacity: 0;
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
      max-width: 100%;
    }

    &__controls {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
    }

    &__dismiss-all {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }

    &__pagination {

      &__next,
      &__prev {
        font-weight: 900;
        letter-spacing: -2px;
        cursor: pointer;
        font-size: 20px;
        -webkit-transition: all .3s;
        -moz-transition: all .3s;
        -ms-transition: all .3s;
        -o-transition: all .3s;
        transition: all .3s;

        &:hover {
          color: $color-pink;
        }

        &.disabled {
          color: $color-gray;
          pointer-events: none;
        }
      }

      &__prev {
        margin-right: 10px;
      }

      &__next {
        margin-left: 10px;
      }
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