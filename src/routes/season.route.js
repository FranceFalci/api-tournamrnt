import { Router } from 'express'
import { SeasonModel } from '../models/season.model.js'
import { SeasonController } from '../controllers/season.controller.js'

export const seasonRouter = Router()

const seasonController = new SeasonController( { seasonModel: SeasonModel } )

// seasonRouter.get( '/', tournamentController.getAll )
seasonRouter.get( '/:id', seasonController.getAllByTorneo )

seasonRouter.post( '/', seasonController.create )

seasonRouter.put( '/:id', seasonController.update )

seasonRouter.delete( '/:id', seasonController.delete )
