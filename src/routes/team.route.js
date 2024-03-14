import { Router } from 'express'
import { TeamController } from '../controllers/team.controller.js'
import { TeamModel } from '../models/team.model.js'

export const teamRouter = Router()

const teamController = new TeamController( { teamModel: TeamModel } )

teamRouter.get( '/all/:idZone', teamController.getAllByZone )
teamRouter.get( '/:idTeam', teamController.getById )
teamRouter.get( '/category/:idCategory', teamController.getAllByCategory )

teamRouter.post( '/', teamController.create )

teamRouter.put( '/info/:idTeam', teamController.updateInfo )
teamRouter.put( '/:idTeam', teamController.updateStatics )

teamRouter.delete( '/:idTeam', teamController.delete )
