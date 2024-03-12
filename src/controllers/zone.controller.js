import { validatePartialZone, validateZone } from '../schemas/zone.schema.js'

export class ZoneController {
  constructor ( { zoneModel } ) {
    this.zoneModel = zoneModel
  }

  getAllByCategory = async ( req, res ) => {
    const { idCategory } = req.params
    try {
      const zones = await this.zoneModel.getAllByCategory( { idCategory } )
      if ( zones ) return res.json( zones )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  create = async ( req, res ) => {
    const result = validateZone( req.body )

    if ( !result.success ) {
      return res.status( 422 ).json( { error: JSON.parse( result.error.message ) } )
    }
    try {
      const newZone = await this.zoneModel.create( { input: result.data } )
      res.status( 201 ).json( newZone )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  update = async ( req, res ) => {
    const result = validatePartialZone( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { error: JSON.parse( result.error.message ) } )
    }

    const { idZone } = req.params
    try {
      const updatedZone = await this.zoneModel.update( { idZone, input: result.data } )
      return res.json( updatedZone )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { idZone } = req.params
    try {
      const result = await this.zoneModel.delete( { idZone } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Zone not found' } )
      }
      return res.json( { message: 'Zone deleted' } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Zone not deleted' } )
    }
  }
}
