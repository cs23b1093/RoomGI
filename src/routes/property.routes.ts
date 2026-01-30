import { Router } from 'express';
import { PropertyController } from '../modules/property/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const propertyController = new PropertyController();

// Public routes
router.get('/', (req, res) => propertyController.getProperties(req, res));
router.get('/search/by-lifestyle', (req, res) => propertyController.searchByLifestyle(req, res));
router.get('/:id', (req, res) => propertyController.getProperty(req, res));
router.get('/:id/viewing-count', (req, res) => propertyController.getViewingCount(req, res));
router.get('/:id/activity', (req, res) => propertyController.getActivity(req, res));

// Protected routes
router.post('/', authMiddleware, (req, res) => propertyController.createProperty(req, res));
router.patch('/:id/availability', authMiddleware, (req, res) => propertyController.updateAvailability(req, res));
router.get('/my/properties', authMiddleware, (req, res) => propertyController.getMyProperties(req, res));

export default router;