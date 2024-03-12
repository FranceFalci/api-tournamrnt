import z from 'zod'

const categorySchema = z.object( {
  name: z.string( {
    invalid_type_error: 'El título del torneo debe ser una cadena',
    required_error: 'El título del torneo es obligatorio.'
  } ),
  idSeason: z.number().positive()

} )

export function validateCategory ( input ) {
  return categorySchema.safeParse( input )
}

export function validatePartialCategory ( input ) {
  return categorySchema.partial().safeParse( input )
}
