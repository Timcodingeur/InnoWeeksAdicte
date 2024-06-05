<template>
  <div class="GetBook">
    <form @submit.prevent="onSubmit">
      <!-- Pour le titre -->
      <label for="titre">Titre du livre :</label> <br />
      <input type="text" name="titre" id="titre" v-model="titre" />
      <br />

      <!--v-for pour afficher les résultats avec v-on:???="onModification"-->
      <div v-for="sug in suggestion">{{ sug }}</div>

      <!-- Pour les catégories -->
      <label for="categorie">La catégorie :</label> <br />
      <select name="categorie" id="categorie">
        <option value="Bande dessinée">Bande dessinée</option>
        <option value="Manga">Manga</option>
        <option value="Roman">Roman</option>
        <option value="Livre">Livre</option>
      </select>
      <br />

      <!-- Pour le nombre de pages -->
      <label for="nmbPage">Nombre de Page :</label> <br />
      <input type="number" name="nmbPage" id="nmbPage" v-model.number="nmbPage" /> <br />

      <!-- Le nom et le prénom de l'écrivain -->
      <label for="nomAuteur">Nom de l'auteur :</label> <br />
      <input type="text" name="nomAuteur" id="nomAuteur" v-model="nomAuteur" /> <br />

      <label for="prenomAuteur">Prénom de l'auteur :</label> <br />
      <input type="text" name="prenomAuteur" id="prenomAuteur" v-model="prenomAuteur" /> <br />

      <!-- Le nom de l'éditeur -->
      <label for="nomEditeur">Nom de l'éditeur :</label> <br />
      <input type="text" name="nomEditeur" id="nomEditeur" v-model="nomEditeur" /> <br />

      <!-- L'année de l'édition -->
      <label for="anneeEdition">Année de l'édition :</label> <br />
      <input type="number" name="anneeEdition" id="anneeEdition" v-model.number="anneeEdition" />
      <br />

      <br />

      <!-- Bouton pour submit le form -->
      <input type="submit" value="Submit" />
    </form>

    <div v-for="book in books" :key="book.id">
      <h3>{{ book.title }}</h3>
      <button @click="selectBook(book.id)">Voir détails</button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'

let titre = ''
let categoryName = ''
let nmbPage = ''
let nomAuteur = ''
let prenomAuteur = ''
let nomEditeur = ''
let anneeEdition = ''
let selectedBookId = ''
let books = []
let bookDetails = null
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTcxNDEzOTA2MywiZXhwIjoxNzQ1Njk2NjYzfQ.Jij32qCOGqXA8YrWYe-De22vMJwo9f1eEfPu8JFu920'
let suggestion = ['test', 'test2']

async function fetchBooks() {
  const params = {
    title: titre,
    categoryName,
    nomAuteur,
    prenomAuteur,
    nomEditeur,
    anneeEdition: anneeEdition.toString(), // Assurez-vous que c'est une chaîne si nécessaire
    nmbPage: nmbPage.toString() // Assurez-vous que c'est une chaîne si nécessaire
  }

  Object.keys(params).forEach((key) => {
    if (params[key] === '') {
      delete params[key]
    }
  })

  try {
    const response = await axios.get('http://localhost:3000/api/books', {
      params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    books = response.data.books || []
    console.log('Livres trouvés:', books)
    return books
  } catch (error) {
    console.error('Erreur lors de la recherche des livres:', error)
    return []
  }
}

async function fetchBookById() {
  if (!selectedBookId) {
    console.error('Aucun ID de livre sélectionné')
    return
  }

  try {
    const response = await axios.get(`http://localhost:3000/api/books/${selectedBookId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    bookDetails = response.data
    console.log('Détails du livre:', bookDetails)
    return bookDetails
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du livre:', error)
    return null
  }
}

async function onSubmit() {
  try {
    await fetchBooks()
  } catch (error) {
    console.error("Erreur lors de l'obtention des livres:", error)
  }
}

function selectBook(id) {
  selectedBookId = id
  fetchBookById().then((details) => {
    // Afficher les détails ici ou les manipuler selon besoin
    console.log(details)
  })
}

function resetFields() {
  titre = ''
  nmbPage = ''
  nomAuteur = ''
  prenomAuteur = ''
  nomEditeur = ''
  anneeEdition = ''
  selectedBookId = ''
  bookDetails = null
}

async function onModification() {
  suggestion.push('ret')
}
</script>

<style>
form {
  max-width: 500px;
  margin: 0 auto;
}

label {
  font-weight: bold;
}

input[type='text'],
input[type='number'],
select,
textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

select {
  width: calc(100% - 2px);
}

textarea {
  resize: vertical;
}

input[type='submit'] {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

input[type='submit']:hover {
  background-color: #45a049;
}

input[type='file'] {
  margin-top: 5px;
  margin-bottom: 10px;
}

input:invalid,
select:invalid,
textarea:invalid {
  border-color: red;
}
</style>
