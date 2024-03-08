const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const todos = {
  "id": "dcdd0fad-a94c-4810-8acc-5f108d3b18c3",
  "title": "The Shawshank Redemption",
  "year": 1994,
  "director": "Frank Darabont",
  "duration": 142,
  "poster": "https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp",
  "genre": [
    "Drama"
  ],
  "rate": 9.3
}
// // const { id, genre } = movies
// // console.log(id, genre[0].toLowerCase())
// const genre = "Drama"
// // movies.genre.some(g => g.toLowerCase() === genre[0].toLowerCase())
// const filteredMovies = movies.filter(
//   // movie => movie.genre.includes(genre)
//   movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
// )
// console.log(filteredMovies)

const movie = {
  "id": crypto.randomUUID(),
  "title": "The Shawshank Redemption",
  "year": 1994,
  "director": "Frank Darabont",
  "duration": 142,
  "poster": "https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp",
  "genre": [
    "Drama",
    "Terror"
  ],
  "rate": 9.3
}
const newMovie = {
  "id": crypto.randomUUID(),
  "title": movie.title,
  "year": movie.year,
  "director": movie.director,
  "duration": movie.duration,
  "poster": movie.poster,
  "genre": movie.genre,
  "rate": movie.rate
}
const yearMovie = {
  "director": "Boca Chancla",
  "duration": "20",
  "year": "2024"
}
console.log(newMovie)
const result = validatePartialMovie(yearMovie)
const resultMovie = {
  ...movie,
  ...yearMovie
}
console.log(yearMovie)
console.log(resultMovie)

const ACCEPTED_ORIGINS = [
  'http://127.0.0.1:5501',
  'http://localhost:8080',
  'https://movies.com',
  'https://midu.dev',
]
const origin = 'http://127.0.0.1:5501'
if (ACCEPTED_ORIGINS.includes(origin)) {
  console.log('está incluido')
} else {
  console.log('NO está incluido')
}
