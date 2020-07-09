<template>
  <div v-if="entry.show" class="entry" :class="{ 'entry__selected': isSelected, 'entry__vanishing': isVanishing }" @click="setEntryAsSelected">
    <div class="entry__image-wrapper">
      <img class="entry__image" :src="entry | getThumbnailUrl" alt="">
    </div>
    <div class="entry__text-wrapper">
      <h3 class="entry__title">{{ entry.data.title }}</h3>

      <div class="entry__comments">
        <img src="../assets/comment.svg" alt="" class="entry__comments__icon">
        {{ entry.data.num_comments }} comments
      </div>
      <small class="entry__author_date">
        Posted by {{ entry.data.author }} {{ entry.data.created_utc | dateInDeltaTime }}
      </small>
    </div>
    <img src="../assets/close.svg" alt="" class="entry__close-icon" @click.stop="dismissEntry">
  </div>
</template>

<script>
export default {
  name: "RedditEntry",
  props: {
    entry: Object,
    isSelected: Boolean,
    index: Number
  },
  data() {
    return {
      isVanishing: false
    }
  },
  methods: {
    setEntryAsSelected() {
      this.$emit('set-selected-entry', this.entry);
    },
    dismissEntry() {
      this.isVanishing = true;
      this.setTimeout(() => {
        this.entry.show = false;
      }, 600, this);
    }
  },
  destroyed() {
    this.isVanishing = false;
  }
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
    border-radius: 5px;
    padding: 20px 35px 20px 15px;
    margin-bottom: 20px;
    overflow: auto;
    box-shadow: #e8e8e8 2px 2px 10px 5px;
    width: 100%;
    box-sizing: border-box;
    margin-right: 10px;
    position: relative;
    cursor: pointer;
    -webkit-transition: all .3s ease-in;
    -moz-transition: all .3s ease-in;
    -ms-transition: all .3s ease-in;
    -o-transition: all .3s ease-in;
    transition: all .3s ease-in;
    opacity: 1;
    -webkit-transform: translateX(0);
    -moz-transform: translateX(0);
    -ms-transform: translateX(0);
    -o-transform: translateX(0);
    transform: translateX(0);

    &.entry__vanishing {
      opacity: 0;
      -webkit-transform: translateX(-1000px);
      -moz-transform: translateX(-1000px);
      -ms-transform: translateX(-1000px);
      -o-transform: translateX(-1000px);
      transform: translateX(-1000px);
    }

    &:hover,
    &.entry__selected {
      box-shadow: #c9c9c9 2px 2px 10px 5px;
    }

    &.entry__selected {
      border: 1px solid #ccccfb;
    }

    @media screen and (min-width: 650px) {
      margin-right: 20px;
      //width: 250px;
    }

    &__title {
      font-size: 14px;
      flex: 1 50%;
      align-self: flex-start;

    }

    &__image {
      width: 100%;
    }

    &__image-wrapper {
      width: 90px;
      height: 90px;
      overflow: hidden;
      display: block;
      float: left;
    }

    &__text-wrapper {

    }

    &__author_date {
      margin-top: auto;
      font-size: 12px;
    }

    &__comments {
      font-size: 12px;
      font-weight: 500;

      &__icon {
        width: 18px;
        height: 18px;
      }
    }

    &__close-icon {
      position: absolute;
      width: 14px;
      height: 14px;
      top: 11px;
      right: 11px;
    }
  }
</style>
