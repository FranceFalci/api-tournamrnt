import z from 'zod'

const matchSchema = z.object( {
  idSeason: z.number().int().gte( 0 ),
  idTeamOne: z.number().int().gte( 0 ),
  idTeamTwo: z.number().int().gte( 0 ),
  resultOne: z.number().int().gte( 0 ).optional(),
  resultTwo: z.number().int().gte( 0 ).optional(),
  date: z.string().datetime().optional(),
  hour: z.string().optional(),
  field: z.string().optional(),
  state: z.number().int().gte( 0 ).lte( 3 ),
  numDate: z.number().gte( 0 )

} )
// const matchSchema = z.object( {
//   idSeason: z.number().int().gte( 0 ),
//   idTeamOne: z.number().int().gte( 0 ),
//   idTeamTwo: z.number().int().gte( 0 ),
//   resultOne: z.number().int().gte( 0 ).nullable().optional(),
//   resultTwo: z.number().int().gte( 0 ).nullable().optional(),
//   date: z.string().datetime().transform( ( val ) => val.substring( 0, 10 ) ).nullable(),
//   hour: z.string().nullable().optional(),
//   field: z.string().nullable().optional(),
//   state: z.number().int().gte( 0 ).lte( 3 ),
//   numDate: z.number().gte( 0 )
// } ).refine( ( data ) => {
//   if ( ( data.resultOne !== undefined && data.resultTwo === undefined ) ||
//     ( data.resultOne === undefined && data.resultTwo !== undefined ) ) {
//     throw new Error( 'Both resultOne and resultTwo must be provided if either is provided' )
//   }
//   return true
// } )

export function validateMatch ( input ) {
  return matchSchema.safeParse( input )
}

export function validatePartialMatch ( input ) {
  return matchSchema.partial().safeParse( input )
}
