import { Router } from 'express'
import { PhaseController } from '../controllers/phase.controller.js'
import { PhaseModel } from '../models/phase.model.js'

export const phaseRouter = Router()

const phaseController = new PhaseController( { phaseModel: PhaseModel } )

phaseRouter.get( '/:idCup', phaseController.getAllByCup )

phaseRouter.post( '/', phaseController.create )

phaseRouter.put( '/:idPhase', phaseController.update )

phaseRouter.delete( '/:idPhase', phaseController.delete )
