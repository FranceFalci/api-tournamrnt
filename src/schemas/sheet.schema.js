import z from 'zod'

const matchSchema = z.object( {
  idMatch: z.number().int().gte( 0 ),
  idPlayer: z.number().int().gte( 0 ),
  time: z.number().int().gt( 0 ).lte( 2 ).optional(),
  minute: z.number().int().gte( 0 ).optional(),
  type: z.number().int().gte( 0 ).lte( 2 )
} )

export function validateSheet ( input ) {
  return matchSchema.safeParse( input )
}

export function validatePartialSheet ( input ) {
  return matchSchema.partial().safeParse( input )
}
