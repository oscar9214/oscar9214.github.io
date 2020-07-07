<template>
  <div class="entry">
    <h3>{{ entry.data.title }}</h3>
    <img class="entry__image" :src="entry.data.url" alt="">
  </div>
</template>

<script>
export default {
  name: "RedditEntry",
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

  .entries {
    &__container {
      padding: 0 20%;
    }
  }

  .entry {
    background-color: #e6e6e6;
    border-radius: 5px;
    padding: 30px;
    margin-bottom: 10px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &__image {
      max-width: 100%;
      max-height: 300px;
    }
  }
</style>
