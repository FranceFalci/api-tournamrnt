import { validatePartialSheet, validateSheet } from '../schemas/sheet.schema.js'

export class SheetController {
  constructor ( { sheetModel } ) {
    this.sheetModel = sheetModel
  }

  getAllByMatch = async ( req, res ) => {
    const { idMatch } = req.params
    try {
      const sheets = await this.sheetModel.getAllByMatch( { idMatch } )
      if ( sheets ) return res.json( sheets )
    } catch ( error ) {
      res.status( 404 ).json( { message: error.message } )
    }
  }

  create = async ( req, res ) => {
    const result = validateSheet( req.body )

    if ( !result.success ) {
      return res.status( 422 ).json( { error: JSON.parse( result.error.message ) } )
    }
    try {
      const newSheet = await this.sheetModel.create( { input: result.data } )
      res.status( 201 ).json( newSheet )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  update = async ( req, res ) => {
    const result = validatePartialSheet( req.body )

    if ( !result.success ) {
      return res.status( 400 ).json( { error: JSON.parse( result.error.message ) } )
    }

    const { idSheet } = req.params
    try {
      const updatedSheet = await this.sheetModel.update( { idSheet, input: result.data } )
      return res.json( updatedSheet )
    } catch ( error ) {
      return res.status( 400 ).json( { error: error.message } )
    }
  }

  delete = async ( req, res ) => {
    const { idSheet } = req.params
    try {
      const result = await this.sheetModel.delete( { idSheet } )

      if ( result === false ) {
        return res.status( 404 ).json( { message: 'Sheet not found' } )
      }
      return res.json( { message: 'Sheet deleted' } )
    } catch ( error ) {
      return res.status( 404 ).json( { message: 'Sheet not deleted' } )
    }
  }
}
