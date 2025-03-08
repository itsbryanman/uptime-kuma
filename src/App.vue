<template>
  <div>
    <nav>
      <router-link to="/">Dashboard</router-link> |
      <router-link to="/create">Create Monitor</router-link>
    </nav>
    <hr />
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
nav a {
  text-decoration: none;
  margin-right: 10px;
}
</style>
