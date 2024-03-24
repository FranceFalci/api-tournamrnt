import { Router } from 'express'
import { MatchController } from '../controllers/match.controller.js'
import { MatchModel } from '../models/match.model.js'

export const matchRouter = Router()

const matchController = new MatchController( { matchModel: MatchModel } )

matchRouter.get( '/:idMatch', matchController.getById )

matchRouter.get( '/category/:idCategory', matchController.getAllByCategory )
matchRouter.get( '/phase/:idPhase', matchController.getAllByPhase )

matchRouter.post( '/', matchController.create )

matchRouter.put( '/:idMatch', matchController.updateInfo )

matchRouter.delete( '/:idMatch', matchController.delete )
