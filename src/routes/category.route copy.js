import { Router } from 'express'
import { CategoryController } from '../controllers/category.controller.js'
import { CategoryModel } from '../models/category.model.js'

export const categoryRouter = Router()

const categoryController = new CategoryController( { categoryModel: CategoryModel } )

categoryRouter.get( '/:id', categoryController.getAllBySeason )

categoryRouter.post( '/', categoryController.create )

categoryRouter.put( '/:id', categoryController.update )

categoryRouter.delete( '/:id', categoryController.delete )
