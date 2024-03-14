import { Router } from 'express'
import { PlayerController } from '../controllers/player.controller.js'
import { PlayerModel } from '../models/player.model.js'

export const playerRouter = Router()

const playerController = new PlayerController( { playerModel: PlayerModel } )

playerRouter.get( '/team/:idTeam', playerController.getAllByTeam )
playerRouter.get( '/:idPlayer', playerController.getById )

playerRouter.post( '/', playerController.create )

playerRouter.put( '/info/:idPlayer', playerController.updateInfo )
playerRouter.put( '/:idPlayer', playerController.updateStatics )

playerRouter.delete( '/:idPlayer', playerController.delete )
