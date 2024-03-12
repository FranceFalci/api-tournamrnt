import { Router } from 'express'
import { ZoneController } from '../controllers/zone.controller.js'
import { ZoneModel } from '../models/zone.model.js'

export const zoneRouter = Router()

const zoneController = new ZoneController( { zoneModel: ZoneModel } )

// seasonRouter.get( '/', tournamentController.getAll )
zoneRouter.get( '/:idCategory', zoneController.getAllByCategory )

zoneRouter.post( '/', zoneController.create )

zoneRouter.put( '/:idZone', zoneController.update )

zoneRouter.delete( '/:idZone', zoneController.delete )
