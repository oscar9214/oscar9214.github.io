<template>
  <div class="entry" :class="{ 'entry__selected': isSelected, 'entry__vanishing': isVanishing }">
    <div class="entry__content-wrapper" :class="{ 'unread': !read }" @click="setEntryAsSelected">
      <div class="entry__image-wrapper" v-if="entry.thumbnailImage">
        <img class="entry__image" :src="entry.thumbnailImage" alt="">
      </div>
      <div class="entry__text-wrapper">
        <h3 class="entry__title"> {{ entry.title }}</h3>

        <div class="entry__comments">
          <img src="../assets/comment.svg" alt="" class="entry__comments__icon">
          <span>{{ entry.numComments }} comments</span>
        </div>
        <small class="entry__author_date">
          Posted by {{ entry.author }} {{ entry.date | dateInDeltaTime }}
        </small>
      </div>
    </div>

    <div class="entry__dismiss" @click="dismissEntry">
      <img src="../assets/close.svg" alt="" class="entry__close-icon">
      Dismiss
    </div>
  </div>
</template>

<script>
export default {
  name: "RedditEntry",
  props: {
    entry: Object,
    isSelected: Boolean,
    index: Number,
    dismissed: Boolean,
    read: Boolean
  },
  data() {
    return {
      isVanishing: false
    }
  },
  methods: {
    setEntryAsSelected() {
      this.$emit('set-selected-entry', { entry: this.entry, index: this.index });
    },
    dismissEntry() {
      this.isVanishing = true;
      setTimeout(() => {
        this.$emit('dismiss-entry', { entry: this.entry, index: this.index });
      }, 600);
    }
  },
  watch: {
    dismissed() {
      this.dismissEntry();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .entry {
    background-color: white;
    border-radius: 5px;

    margin-bottom: 20px;
    overflow: auto;
    box-shadow: $color-gray-box-shadow 0px 0px 10px;
    width: 100%;
    box-sizing: border-box;
    margin-right: 10px;
    position: relative;
    cursor: pointer;
    //border: 1px solid #fff;
    -webkit-transition: all .3s ease-in, max-height .6s, box-shadow .2s;
    -moz-transition: all .3s ease-in, max-height .6s, box-shadow .2s;
    -ms-transition: all .3s ease-in, max-height .6s, box-shadow .2s;
    -o-transition: all .3s ease-in, max-height .6s, box-shadow .2s;
    transition: all .3s ease-in, max-height .6s, box-shadow .2s;
    opacity: 1;
    -webkit-transform: translateX(0) scale(1);
    -moz-transform: translateX(0) scale(1);
    -ms-transform: translateX(0) scale(1);
    -o-transform: translateX(0) scale(1);
    transform: translateX(0) scale(1);
    max-height: 900px;

    &.entry__vanishing {
      opacity: 0;
      -webkit-transform: translateX(-1000px) scale(0);
      -moz-transform: translateX(-1000px) scale(0);
      -ms-transform: translateX(-1000px) scale(0);
      -o-transform: translateX(-1000px) scale(0);
      transform: translateX(-1000px) scale(0);
      max-height: 0;
      margin-bottom: 0;
    }

    &:hover {
      box-shadow: $color-gray-box-shadow-darker 0px 0px 10px;
    }

    &.entry__selected {
      box-shadow: $color-gray-box-shadow-purple 0px 0px 10px;

      .entry__content-wrapper {
        border-left-color: $color-dark-purple-transparent;
        border-top-color: $color-dark-purple-transparent;
        border-right-color: $color-dark-purple-transparent;
        border-radius: 5px 5px 0 0;
      }
    }

    &__content-wrapper {
      padding: 15px;
      display: flex;
      border-left: 1px solid transparent;
      border-top: 1px solid transparent;
      border-right: 1px solid transparent;
      border-radius: 5px 5px 0 0;

      &:before {
        transition: all .2s ease-in;
        transform: rotate(-45deg) translate(70px, -9px);
        content: 'New';
        background-color: $color-pink;
        color: white;
        position: absolute;
        text-transform: uppercase;
        font-weight: 900;
        font-size: 12px;
        padding: 0px 24px;
        top: 0;
        left: 0;
      }

      &.unread:before {
        transform: rotate(-45deg) translate(-21px, -9px);
      }
    }

    @media screen and (min-width: 650px) {
      margin-right: 20px;
    }

    &__title {
      font-size: 14px;
      flex: 1;
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
      margin-right: 10px;
    }

    &__text-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    &__author_date {
      margin-top: auto;
      font-size: 12px;
    }

    &__comments {
      font-size: 12px;
      font-weight: 500;
      display: flex;
      justify-content: center;

      &__icon {
        width: 18px;
        height: 18px;
        margin-right: 5px;
      }
    }

    &__close-icon {
      width: 12px;
      height: 12px;
      margin-right: 5px;
    }

    &__dismiss {
      background-color: $color-dark-purple;
      width: 100%;
      color: $color-light-gray;
      font-size: 12px;
      padding: 5px 0;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
