import { Hono } from 'hono'
import { DocumentController } from '../controllers/document.controller'
import { DocumentCollaboratorController } from '../controllers/document-collaborator.controller'
import { authMiddleware } from "../middlewares/auth.middleware"

const documents = new Hono()

documents.use('*', authMiddleware)

// Documents routes
documents.post('/', DocumentController.create)
documents.get('/', DocumentController.getAll)
documents.get('/:id', DocumentController.getOne)
documents.put('/:id', DocumentController.update)
documents.delete('/:id', DocumentController.delete)

documents.post('/:id/collaborators', DocumentCollaboratorController.addCollaborator)
documents.get('/:id/collaborators', DocumentCollaboratorController.getCollaborators)
documents.delete('/:id/collaborators/:userId', DocumentCollaboratorController.removeCollaborator)

export default documents