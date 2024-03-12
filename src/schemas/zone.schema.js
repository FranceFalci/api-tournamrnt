import z from 'zod'

const zoneSchema = z.object( {
  name: z.string( {
    invalid_type_error: 'El título del torneo debe ser una cadena',
    required_error: 'El título del torneo es obligatorio.'
  } ),
  idCategory: z.number().positive()

} )

export function validateZone ( input ) {
  return zoneSchema.safeParse( input )
}

export function validatePartialZone ( input ) {
  return zoneSchema.partial().safeParse( input )
}
