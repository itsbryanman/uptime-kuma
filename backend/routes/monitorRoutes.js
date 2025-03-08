/**
 * Express router for monitor endpoints, including validation.
 */
const router = require('express').Router();
const { body, param } = require('express-validator');
const monitorController = require('../controllers/monitorController');

// GET all monitors
router.get('/', monitorController.getAllMonitors);

// CREATE new monitor
router.post(
  '/',
  [
    body('name').isString().notEmpty().withMessage('Monitor name is required'),
    body('url').isURL().withMessage('A valid URL is required'),
    body('interval')
      .optional()
      .isInt({ min: 5, max: 3600 })
      .withMessage('Interval must be between 5 and 3600 seconds'),
    body('method').optional().isString(),
    body('expectedStatusCode').optional().isInt(),
  ],
  monitorController.createMonitor
);

// GET monitor by ID
router.get(
  '/:id',
  [param('id').isInt().withMessage('ID must be an integer')],
  monitorController.getMonitorById
);

// UPDATE monitor
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('ID must be an integer'),
    body('interval').optional().isInt({ min: 5, max: 3600 }),
    body('method').optional().isString(),
    body('expectedStatusCode').optional().isInt(),
  ],
  monitorController.updateMonitor
);

// DELETE monitor
router.delete(
  '/:id',
  [param('id').isInt().withMessage('ID must be an integer')],
  monitorController.deleteMonitor
);

// GET logs for a specific monitor
router.get(
  '/:id/logs',
  [param('id').isInt().withMessage('ID must be an integer')],
  monitorController.getMonitorLogs
);

module.exports = router;
