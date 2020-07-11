<template>
  <div v-if="entry !== null" class="entry">
    <h3 class="entry__title">{{ entry.title }}</h3>
    <div class="entry__image-wrapper" v-if="entry.image">
      <a :href="entry.image" target="_blank">
        <img class="entry__image" :src="entry.image" alt="">
      </a>
    </div>
    <div v-if="entry.text"> {{ entry.text }} </div>
    <div class="entry__text-wrapper">
      <div class="entry__comments">
        <img src="../assets/comment.svg" alt="" class="entry__comments__icon">
        <span>{{ entry.numComments }} comments</span>
      </div>
      <small class="entry__author_date">
        Posted by {{ entry.author }} {{ entry.date | dateInDeltaTime }}
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

  .entry {
    background-color: white;
    padding: 20px;
    overflow: auto;
    box-shadow: $color-gray-box-shadow 0px 0px 10px;
    margin-right: 20px;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-bottom: 20px;
    flex: 1;

    margin-left: 20px;

    @include media-breakpoint-up(md) {
      margin-left: 0;
    }

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
