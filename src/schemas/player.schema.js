import z from 'zod'

const playerSchema = z.object( {
  name: z.string( {
    invalid_type_error: 'El nombre del jugador debe ser una cadena',
    required_error: 'El nombre del jugador es obligatorio.'
  } ),
  idTeam: z.number().positive()

} )

export function validatePlayer ( input ) {
  return playerSchema.safeParse( input )
}

export function validatePartialPlayer ( input ) {
  return playerSchema.partial().safeParse( input )
}

const playerStaticsSchema = z.object( {
  goals: z.number().positive().optional(),
  yellowCards: z.number().positive().optional(),
  redCards: z.number().positive().optional()
} )

export function validatePlayerStatics ( input ) {
  return playerStaticsSchema.safeParse( input )
}
