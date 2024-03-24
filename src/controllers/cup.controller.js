import { validateCup, validatePartialCup } from '../schemas/cup.schema.js'

export class CupController {
  constructor ( { cupModel } ) {
    this.cupModel = cupModel
  }

  getAllByCategory = async ( req, res ) => {
    const { idCategory } = req.params
    try {
      const cups = await this.cupModel.getAllByCategory( { idCategory } )
      if ( cups ) return res.json( cups )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  create = async ( req, res ) => {
    const result = validateCup( req.body )

    if ( !result.success ) {
      return res.status( 422 ).json( { error: JSON.parse( result.error.message ) } )
    }
    try {
      const newCup = await this.cupModel.create( { input: result.data } )
      res.status( 201 ).json( newCup )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  update = async ( req, res ) => {
    const result = validatePartialCup( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { error: JSON.parse( result.error.message ) } )
    }

    const { idCup } = req.params
    try {
      const updatedCup = await this.cupModel.update( { idCup, input: result.data } )
      return res.json( updatedCup )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { idCup } = req.params
    try {
      const result = await this.cupModel.delete( { idCup } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Cup not found' } )
      }
      return res.json( { message: 'Cup deleted' } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Cup not deleted' } )
    }
  }
}
