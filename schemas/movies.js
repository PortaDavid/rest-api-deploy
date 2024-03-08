const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().positive().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Crime', 'Sci-Fi']),
    {
      required_error: 'Genre required',
      invalid_type_error: 'Movie genre must be an array of enum Genre'
    }
  )
})

function validateMovie (input) {
  // Devuelve un objeto resolv de si hay un erroe o hay datos
  return movieSchema.safeParse(input)
}

function validatePartialMovie (input) {
  // partial: lo que hace es que cada una de las propiedades que hay en el esquema
  // las va a hacer opcionales, de forma que si no está, no pasa nada. 
  // Y si está la valida como se supone que la tiene que validar
  return movieSchema.partial().safeParse(input)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
