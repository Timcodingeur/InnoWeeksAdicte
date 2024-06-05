<template>
  <div>
    <!-- Textarea pour saisir l'ID du livre -->
    <textarea v-model="inputBookId" placeholder="supprime ou je te supprime"></textarea>
    <button @click="deleteBook">Clique ou je te clique</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// Champ pour l'ID du livre saisi dans le `textarea`
const inputBookId = ref('')
const bearerToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTcxNDEzOTA2MywiZXhwIjoxNzQ1Njk2NjYzfQ.Jij32qCOGqXA8YrWYe-De22vMJwo9f1eEfPu8JFu920'

async function deleteBook() {
  const bookId = parseInt(inputBookId.value.trim(), 10)

  // Vérifiez que l'ID est un nombre valide
  if (isNaN(bookId) || bookId <= 0) {
    console.error('je vais te taper avec cette id')
    return
  }

  try {
    const response = await axios.delete(`http://localhost:3000/api/books/${bookId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`
      }
    })
    console.log('Livre supprimé:', response.data)
    // Réinitialisez le champ textarea après suppression
    inputBookId.value = ''
  } catch (error) {
    console.error('Erreur lors de la suppression du livre:', error)
  }
}
</script>
