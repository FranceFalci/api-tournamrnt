import z from 'zod'

const seasonSchema = z.object( {
  name: z.string( {
    invalid_type_error: 'El título del torneo debe ser una cadena',
    required_error: 'El título del torneo es obligatorio.'
  } ),
  idTournament: z.number().positive()

} )

export function validateSeason ( input ) {
  return seasonSchema.safeParse( input )
}

export function validatePartialSeason ( input ) {
  return seasonSchema.partial().safeParse( input )
}
