<template>
  <v-container>
    <post-form v-if="me" />
    <div>
      <post-card v-for="p in mainPosts" :key="p.id" :post="p" />
    </div>
  </v-container>
</template>

<script>
  import PostForm from '~/components/PostForm';
  import PostCard from '~/components/PostCard';

  export default {
    components: {
      PostForm,
      PostCard,
    },
    data() {
      return {
        name: 'Nuxt.js',
      }
    },
    fetch({ store }) {
      store.dispatch('posts/loadPosts');
    },
    computed: {
      me() {
        return this.$store.state.users.me;
      },
      mainPosts() {
        return this.$store.state.posts.mainPosts;
      },
      hasMorePost() {
        return this.$store.state.posts.hasMorePost;
      }
    },
    mounted() {
      window.addEventListener('scroll', this.onScroll);
    },
    methods: {
      onScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
          if (this.hasMorePost) {
            this.$store.dispatch('posts/loadPosts');
          }
        }
      },
    },
    beforeDestory() {
      window.removeEventListener('scroll', this.onScroll);
    },
  }
</script>

<style>

</style>