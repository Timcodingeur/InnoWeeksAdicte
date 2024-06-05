import axios from 'axios'

let token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcxNDEzNzYyOSwiZXhwIjoxNzQ1Njk1MjI5fQ.vRalmBymJvo8HAEe5JSgMdl_O-tRNuot2YjS-LXW4HI'

async function getBooks() {
  return await axios.get('http://localhost:3000/api/books', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}

async function getBookById(id) {
  console.log(id)
  return await axios.get('http://localhost:3000/api/books/' + id, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}

async function putBook(form) {
  return await axios
    .put('http://localhost:3000/api/books/' + props.id, formToJSON(form), {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => response.data.data)
}

async function DeleteBook(id) {
  return await axios.delete('http://localhost:3000/api/books' + id, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
}

async function postBook(data) {
  return await axios.post('http://localhost:3000/api/books', data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}

async function AddComment(comment, note, user, book) {
  return await axios.post(
    'http://localhost:3000/api/comments',
    {
      comment: comment,
      note: note,
      user: user,
      book: book
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  )
}

async function getCategories() {
  return await axios.get('http://localhost:3000/api/categorys', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}

async function getEditorByName(name) {
  return await axios.get('http://localhost:3000/api/editors', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const editors = response.data.data

  for (const edit of editors) {
    if (edit.name == name) {
      return edit.id.toString()
    }
  }
}

async function getAuthorByName(name) {
  return await axios.get('http://localhost:3000/api/authors', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const authors = response.data.data

  for (const auth of authors) {
    if (auth.name == name) {
      return auth.id.toString()
    }
  }
}

async function getCategoryByName(name) {
  const response = await axios.get('http://localhost:3000/api/categorys', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  const categories = response.data.data

  for (const categ of categories) {
    if (categ.name == name) {
      return categ.id.toString()
    }
  }
}

export {
  getBooks,
  getBookById,
  getCategories,
  getEditorByName,
  getAuthorByName,
  getCategoryByName,
  AddComment,
  postBook,
  putBook,
  DeleteBook
}
