<template>
  <div class="addReview">
    <form @submit.prevent="onSubmit">
      <!-- Un résumé de l'ouvrage -->
      <label for="comment">Commentaire :</label> <br />
      <textarea name="comment" id="comment" cols="40" rows="5" v-model="comment"></textarea>
      <br />

      <!-- Pour les catégories -->
      <label for="note">Note</label> <br />
      <select name="note" id="note" v-model="note">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <br />

      <!-- Bouton pour submit le form -->
      <input type="submit" value="Submit" />
    </form>
  </div>
</template>

<script setup>
import axios from 'axios'

let comment = ''
let note = '5'
let token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxNDEzNzYyOSwiZXhwIjoxNzQ1Njk1MjI5fQ.vRalmBymJvo8HAEe5JSgMdl_O-tRNuot2YjS-LXW4HI'

async function getComment() {
  return await axios
    .get('http://localhost:3000/api/comments', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => response)
}

async function AddComment() {
  return await axios
    .post(
      'http://localhost:3000/api/comments',
      {
        comment: comment,
        note: note,
        user: 1,
        book: 1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((response) => response)
}

async function onSubmit() {
  let comments = {
    comment: comment,
    note: note,
    user: 1,
    book: 1
  }

  const data = await (await getComment()).data.data
  console.log(data)

  if (comments.comment == '') {
    alert(`The input titre du livre cannot be empty`)
  } else if (comments.note == '') {
    alert(`The input catégorie cannot be empty`)
  }

  const datas = await AddComment()
  console.log('datas: ', datas)
}
</script>
