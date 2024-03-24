import { validatePartialPhase, validatePhase } from '../schemas/phase.schema.js'

export class PhaseController {
  constructor ( { phaseModel } ) {
    this.phaseModel = phaseModel
  }

  getAllByCup = async ( req, res ) => {
    const { idCup } = req.params
    try {
      const phases = await this.phaseModel.getAllByCup( { idCup } )
      if ( phases ) return res.json( phases )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  create = async ( req, res ) => {
    const result = validatePhase( req.body )

    if ( !result.success ) {
      return res.status( 422 ).json( { error: JSON.parse( result.error.message ) } )
    }
    try {
      const newPhase = await this.phaseModel.create( { input: result.data } )
      res.status( 201 ).json( newPhase )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  update = async ( req, res ) => {
    const result = validatePartialPhase( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { error: JSON.parse( result.error.message ) } )
    }

    const { idPhase } = req.params
    try {
      const updatedPhase = await this.phaseModel.update( { idPhase, input: result.data } )
      return res.json( updatedPhase )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { idPhase } = req.params
    try {
      const result = await this.phaseModel.delete( { idPhase } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Phase not found' } )
      }
      return res.json( { message: 'Phase deleted' } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Phase not deleted' } )
    }
  }
}
