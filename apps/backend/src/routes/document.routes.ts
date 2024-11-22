import { Hono } from 'hono'
import { DocumentController } from '../controllers/document.controller'
import { authMiddleware } from "../middlewares/auth.middleware";

const documents = new Hono()

documents.use('*', authMiddleware)

documents.post('/', DocumentController.create)
documents.get('/', DocumentController.getAll)
documents.get('/:id', DocumentController.getOne)
documents.put('/:id', DocumentController.update)
documents.delete('/:id', DocumentController.delete)

export default documents