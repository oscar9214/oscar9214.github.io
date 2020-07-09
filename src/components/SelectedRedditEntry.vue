<template>
  <div v-if="entry !== null" class="entry">
    <h3 class="entry__title">{{ entry.data.title }}</h3>
    <div class="entry__image-wrapper">
      <a :href="entry | getFullSizeImagelUrl" target="_blank">
        <img class="entry__image" :src="entry | getFullSizeImagelUrl" alt="">
      </a>
    </div>
    <div class="entry__text-wrapper">


      <div class="entry__comments">
        <img src="../assets/comment.svg" alt="" class="entry__comments__icon">
        {{ entry.data.num_comments }} comments
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
    box-shadow: #e8e8e8 2px 2px 10px 5px;

    margin-right: 20px;
    position: relative;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    &__title {
      font-size: 18px;
      text-align: left;
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
    }

    &__author_date {
      font-size: 12px;
      margin-left: auto;
    }

    &__comments {
      font-size: 12px;
      font-weight: 500;

      &__icon {
        width: 18px;
        height: 18px;
      }
    }
  }
</style>
