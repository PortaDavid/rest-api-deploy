const express = require('express') // require --> commonJS
// Para crear un id
const crypto = require('node:crypto')

const cors = require('cors')

const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()

// Hará que podamos recuperar del body
app.use(express.json())
// middleware que pone todo con un asterisco
// app.use(cors())
app.use(cors({
  origin: (origin, callback) => {
    // Esto también se puede sacra de una BBDD
    const ACCEPTED_ORIGINS = [
      'http://127.0.0.1:5500',
      'http://localhost:8080',
      'https://movies.com',
      'https://midu.dev',
    ]
    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
}
))
app.disable('x-powered-by')
//Lo normal es ver el origen y decidir que hacemos
// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE y en estos existe una cosa que 
// se llama CORS PRE-Flight que requiere una petición especial que
// se llama OPTIONS => que le va a preguntar a la API utilizando el verbo 
// OPTIONS => antes de hacer yo este put/patch/delete, cuéntame, es una petición
// previa


const ACCEPTED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://localhost:8080',
  'https://movies.com',
  'https://midu.dev',
]

// app.get('/', (req, res) => {
//   // leer el query param de format
//   const format = req.query.format
//   if (format === 'html') {
//     // vamos a devolver la lista como un html
//     res.send('')
//     res.json(req.body)
//   }
// })
// Todos los recursos que sean MOVIES se identifica con /movies
app.get('/movies', (req, res) => {
  // *: Todos los orígenes que no sean mi propi origen, están permitidos
  // Cuando el navegador es la misma dirección, no enviará origin
  // res.header('Access-Control-Allow-Origin', '*')

  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      // movie => movie.genre.includes(genre)
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  // Lo único que tenemos que hacer aquí, es recuperar todas las películas
  return res.json(movies)
})
// app.get('/movies/:id/:mas/:otro', (req, res) => { // path-to-regexp
// : se pude utilizar regexp
//   // le vamos a pasara un id y quiero recuperarla
//   const { id, mas, otro } = req.params
// })
app.get('/movies/:id', (req, res) => { // path-to-regexp
  // le vamos a pasara un id y quiero recuperarla
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(400).json({ message: 'Movie not found' })
})
// Cada recurso se identifica con una url y los verbos definen las operaciones
app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  // const {
  //   title,
  //   genre,
  //   year,
  //   director,
  //   duration,
  //   rate,
  //   poster
  // } = req.body //Aún no tenemos validados los datos

  const newMovie = {
    id: crypto.randomUUID(), // uuid v4, funciona en el navegador también
    ...result.data // Están validados los datos
    // title,
    // genre,
    // year,
    // director,
    // duration,
    // rate: rate ?? 0,
    // poster
  }
  // Esto no sería REST, porque estamos guardando
  // el estado de la aplicación en memoria
  movies.push(newMovie)
  // Interesante devolver el recurso que hemos creado, 
  // para actualizar la caché del cliente
  return res.status(201).json(newMovie)
  // Pero no hay ningún tipo de validación, pueden inyectarte código
})
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) return res.status(400).json({ message: 'Movie not found' })
  movies.slice(movieIndex, 1)
  return res.json({ message: 'Movie deletd' })
})
app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) return res.status(400).json({ message: 'Movie not found' })
  console.log(movies[movieIndex])
  console.log(result.data)
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }
  movies[movieIndex] = updateMovie
  // Devolvemos el json de la película actualizada
  return res.json(updateMovie)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
