import z from 'zod'

const cupSchema = z.object( {
  idCategory: z.number().int().gte( 0 ),
  order: z.number().int().gte( 0 ),
  type: z.string().toUpperCase()
} )

export function validateCup ( input ) {
  return cupSchema.safeParse( input )
}

export function validatePartialCup ( input ) {
  return cupSchema.partial().safeParse( input )
}
