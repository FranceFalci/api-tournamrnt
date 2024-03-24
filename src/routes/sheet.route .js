import { Router } from 'express'
import { SheetController } from '../controllers/sheet.controller.js'
import { SheetModel } from '../models/sheet.model.js'

export const sheetRouter = Router()

const sheetController = new SheetController( { sheetModel: SheetModel } )

sheetRouter.get( '/:idMatch', sheetController.getAllByMatch )

sheetRouter.post( '/', sheetController.create )

sheetRouter.put( '/:idSheet', sheetController.update )

sheetRouter.delete( '/:idSheet', sheetController.delete )
