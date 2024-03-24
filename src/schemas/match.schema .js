import z from 'zod'

const matchSchema = z.object( {
  idCategory: z.number().int().gte( 0 ),
  idTeamOne: z.number().int().gte( 0 ),
  idTeamTwo: z.number().int().gte( 0 ),
  idPhase: z.number().int().gte( 0 ).optional(),
  resultOne: z.number().int().gte( 0 ).optional(),
  resultTwo: z.number().int().gte( 0 ).optional(),
  date: z.string().datetime().transform( ( val ) => val.substring( 0, 10 ) ).nullable(),
  hour: z.string().optional(),
  field: z.string().optional(),
  state: z.number().int().gte( 0 ).lte( 3 ).optional(),
  numDate: z.number().gte( 0 )

} )

export function validateMatch ( input ) {
  return matchSchema.safeParse( input )
}

export function validatePartialMatch ( input ) {
  return matchSchema.partial().safeParse( input )
}
