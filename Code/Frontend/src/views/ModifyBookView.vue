<template>
  <div class="modifyBook">
    <form @submit.prevent="onSubmit">
      <!-- Pour le titre -->
      <label for="titre">Titre du livre :</label> <br />
      <input type="text" name="titre" id="titre" v-model="book.title" maxlength="60" /> <br />

      <!-- Pour les catégories -->
      <label for="categorie">La catégorie :</label> <br />
      <select name="categorie" id="categorie" v-model="book.category.name">
        <option value=""></option>
        <option value="Bande dessinée">Bande dessinée</option>
        <option value="Manga">Manga</option>
        <option value="Roman">Roman</option>
        <option value="Livre">Livre</option>
      </select>
      <br />

      <!-- Pour le nombre de pages -->
      <label for="nmbPage">Nombre de Page :</label> <br />
      <input
        type="number"
        name="nmbPage"
        id="nmbPage"
        v-model.number="book.nmbPage"
        oninput="
        if (this.value.length > 4) {
          this.value = this.value.slice(0, 4)
        }
        if (parseInt(this.value) <= 0) {
          this.value = 1
        }"
      />
      <br />

      <!-- Pour un extrait -->
      <label for="extrait">Extrait :</label> <br />
      <input type="url" name="extrait" id="extrait" v-model="book.extrait" /> <br />

      <!-- Un résumé de l'ouvrage -->
      <label for="resume">Résumé de l'ouvrage</label> <br />
      <textarea
        name="resume"
        id="resume"
        cols="40"
        rows="5"
        v-model="book.resume"
        maxlength="1024"
      ></textarea>
      <br />

      <!-- Le nom et le prénom de l'écrivain -->
      <label for="nomAuteur">Nom de l'auteur :</label> <br />
      <input type="text" name="nomAuteur" id="nomAuteur" v-model="book.author.lastname" /> <br />

      <label for="prenomAuteur">Prénom de l'auteur :</label> <br />
      <input type="text" name="prenomAuteur" id="prenomAuteur" v-model="book.author.firstname" />
      <br />

      <!-- Le nom de l'éditeur -->
      <label for="nomEditeur">Nom de l'éditeur :</label> <br />
      <input type="text" name="nomEditeur" id="nomEditeur" v-model="book.editor.ediName" /> <br />

      <!-- L'année de l'édition -->
      <label for="anneeEdition">Année de l'édition :</label> <br />
      <input
        type="number"
        name="anneeEdition"
        id="anneeEdition"
        v-model="book.year"
        oninput="
        if (this.value.length > 4) {
          this.value = this.value.slice(0, 4)
        }
        if (this.value <= 0) {
          this.value = 1
        }"
      />
      <br />

      <!-- Image de couverture -->
      <label for="image">Image de la couverture :</label> <br />
      <input type="file" name="image" id="image" accept=".jpg, .png" @change="handleImage" />
      <br />

      <!-- Bouton pour submit le form -->
      <input type="submit" value="Submit" />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  getBookById,
  getAuthorByName,
  getEditorByName,
  getCategoryByName,
  putBook
} from '../../service/Axios'

const props = defineProps({
  id: Number
})

let apiBook = await getBookById(props.id).then((response) => response.data.book)

let book = ref({ ...apiBook })

async function onSubmit() {
  book.value.nmbPage = book.value.nmbPage.toString()
  book.value.anneeEdition = book.value.anneeEdition.toString()

  if (book.value.titre.trim().length == 0) {
    alert(`The input titre du livre cannot be empty`)
    return
  } else if (book.value.categorie.trim().length == 0) {
    alert(`The input catégorie cannot be empty`)
    return
  } else if (book.value.nmbPage.trim().length == 0) {
    alert(`The input nombre de page cannot be empty`)
    return
  } else if (book.value.extrait.trim().length == 0) {
    alert(`The input extrait cannot be empty`)
    return
  } else if (book.value.resume.trim().length == 0) {
    alert(`The input resume cannot be empty`)
    return
  } else if (book.value.nomAuteur.trim().length == 0) {
    alert(`The input nom de l'auteur cannot be empty`)
    return
  } else if (book.value.nomEditeur.trim().length == 0) {
    alert(`The input nom de l'éditeur cannot be empty`)
    return
  } else if (book.value.prenomAuteur.trim().length == 0) {
    alert(`The input prénom de l'auteur cannot be empty`)
    return
  } else if (book.value.anneeEdition.trim().length == 0) {
    alert(`The input annee de l'édition cannot be empty`)
    return
  }

  let authorId = await getAuthorByName(book.value.prenomAuteur, book.value.nomAuteur)

  let editorId = await getEditorByName(book.value.nomEditeur)

  let categoryId = await getCategoryByName(book.value.categorie)

  book.value.extrait = book.value.extrait.toString()

  if (authorId == undefined) {
    alert(`L'auteur n'existe pas`)
    return
  }

  if (editorId == undefined) {
    alert(`L'éditeur n'existe pas`)
    return
  }

  let form = new FormData()

  form.set('title', book.value.titre.trimStart().trimEnd())
  form.set('category', parseInt(categoryId.trimStart().trimEnd()))
  form.set('nmbPage', parseInt(book.value.nmbPage.trimStart().trimEnd()))
  form.set('extrait', book.value.extrait.trimStart().trimEnd())
  form.set('resume', book.value.resume.trimStart().trimEnd())
  form.set('author', parseInt(authorId.trimStart().trimEnd()))
  form.set('editor', parseInt(editorId.trimStart().trimEnd()))
  form.set("annee de l'edition", parseInt(book.value.anneeEdition.trimStart().trimEnd()))
  form.set('year', book.value.year)
  form.set('image', book.value.image)

  putBook(form)

  book.value.titre = ''
  book.value.categorie = ''
  book.value.nmbPage = ''
  book.value.resume = ''
  book.value.nomAuteur = ''
  book.value.prenomAuteur = ''
  book.value.nomEditeur = ''
  book.value.anneeEdition = ''
  book.value.image = null
  book.value.extrait = ''
}
</script>

<style scoped>
form {
  max-width: 500px;
  margin: 0 auto;
}

label {
  font-weight: bold;
}

input[type='text'],
input[type='number'],
input[type='date'],
input[type='url'],
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
