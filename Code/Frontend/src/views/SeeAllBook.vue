<template>
  <div class="SeeBooks">
    <button v-on:click="getallbook">See Books</button>
    <!--<img src="@/../../project/images/Berserk1.jpg" />-->
    <div v-for="(ABook, index) in bookdisplay" v-bind:key="index">
      <img v-bind:src="ABook.image" />
      <h1>{{ ABook.title }}</h1>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, watchEffect } from 'vue'
import {
  getBooks,
  DeleteBook,
  AddComment,
  getCategories,
  getEditorByName,
  getAuthorByName,
  postBook
} from '../../service/Axios'

let bookdisplay = ref([])

async function getallbook() {
  let responce = await getBooks()
  let responce2 = responce.data.books
  bookdisplay.value = responce2
  console.log(bookdisplay)

  /*bookdisplay.value.forEach((Booke) => {
    //console.log(Booke)
    //console.log(Booke.id)
    Booke.image = Booke.image.split('..')
    console.log(Booke.image)
    Booke.image = Booke.image[Booke.image.length - 1]
    console.log(Booke.image)
    Booke.image = '@/../../project' + Booke.image
    const logo = ref()
    watchEffect(async () => {
      // logo.value = (await import(/* @vite-ignore */ /* `./../assets/Berserk1.png`)).default
    })

    Booke.image = logo.value
  })*/
}
</script>

<style scoped>
button {
  width: 100px;
  height: 20px;
}
</style>
