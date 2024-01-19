const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resourcesController');
const { authenticateAdmin } = require('../middlewares/authenticateAdmin');
const { authenticateUser } = require('../middlewares/authenticateUser');

router.get('/', authenticateUser, resourcesController.getAllResources);
router.get(
  '/:resourceId',
  authenticateUser,
  resourcesController.getResourceById,
);

// Filter resources by topic
router.get(
  '/topic/:topic',
  authenticateUser,
  resourcesController.filterResourcesByTopic,
);

// Filter resources by type
router.get(
  '/type/:type',
  authenticateUser,
  resourcesController.filterResourcesByType,
);

// Add a new resource (requires authentication)
router.post('/', authenticateAdmin, resourcesController.createResource);

// Update resource information (requires authentication)
router.put(
  '/:resourceId',
  authenticateAdmin,
  resourcesController.updateResource,
);

// Delete a resource (requires authentication)
router.delete(
  '/:resourceId',
  authenticateAdmin,
  resourcesController.deleteResource,
);

module.exports = router;
