<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header id="header">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/addBook">Ajouer un livre</RouterLink>
      <RouterLink to="/modifyBook">Modifier un livre</RouterLink>
      <RouterLink to="/deleteBook">Supprimer un livre</RouterLink>
      <RouterLink to="/addComment">Ajouter un commentaire</RouterLink>
      <RouterLink to="/getBook">Rechercher des livres via des paramètres</RouterLink>
      <RouterLink to="/SeeBook">Voir tout les livres</RouterLink>
    </nav>
  </header>
  <div id="main">
    <div id="content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
#main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wrapper {
  display: flex;
  flex-direction: column;
}

#header {
  display: flex;
  align-items: center;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  border: 1px solid #a2a2a2;
  background-color: #f4f4f4;
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.75);
  border-radius: 5px;
}

#content {
  margin-top: 5em;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin: 0, 0, 0, 0;
  padding: 0, 0, 0, 0;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}
</style>
