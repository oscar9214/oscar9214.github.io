<template>
  <div v-if="entry !== null" class="entry">
    <h3 class="entry__title">{{ entry.data.title }}</h3>
    <div class="entry__image-wrapper" v-if="entry.data.preview">
      <a :href="entry | getFullSizeImagelUrl" target="_blank">
        <img class="entry__image" :src="entry | getFullSizeImagelUrl" alt="">
      </a>
    </div>
    <div v-if="entry.data.selftext"> {{ entry.data.selftext }} </div>
    <div class="entry__text-wrapper">
      <div class="entry__comments">
        <img src="../assets/comment.svg" alt="" class="entry__comments__icon">
        <span>{{ entry.data.num_comments }} comments</span>
      </div>
      <small class="entry__author_date">
        Posted by {{ entry.data.author }} {{ entry.data.created_utc | dateInDeltaTime }}
      </small>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectedRedditEntry",
  props: {
    entry: Object
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

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



  .entry {
    background-color: white;
    padding: 20px;

    overflow: auto;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px;

    margin-right: 20px;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 20px;
    flex: 1;

    &__title {
      font-size: 18px;
      text-align: left;
      margin-bottom: 18px;
    }

    &__image {
      max-width: 100%;
      max-height: 70vh;
    }

    &__image-wrapper {

    }

    &__text-wrapper {
      margin-top: auto;
      display: flex;
      margin-top: 20px;
    }

    &__author_date {
      font-size: 14px;
      margin-left: auto;
    }

    &__comments {
      font-size: 14px;
      font-weight: 500;
      display: flex;


      &__icon {
        width: 18px;
        height: 18px;
        margin-right: 5px;
      }
    }
  }
</style>
