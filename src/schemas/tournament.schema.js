import z from 'zod'

const tournamentSchema = z.object( {
  name: z.string( {
    invalid_type_error: 'El título del torneo debe ser una cadena',
    required_error: 'El título del torneo es obligatorio.'
  } ),
  phone: z.string()
    .length( 10, { message: 'El número de teléfono debe tener exactamente 10 caracteres' } ),
  instagram: z.string()
    .optional(),
  photoUrl: z.string()
    .url( { message: ' La URL de la foto debe ser una URL válida' } ).optional()
} )

export function validateTournament ( input ) {
  return tournamentSchema.safeParse( input )
}

export function validatePartialTournament ( input ) {
  return tournamentSchema.partial().safeParse( input )
}
