import { ResourceService } from '../services/resourceService.js';

export class ResourceController {
  static async getAll(req, res) {
    try {
      const resources = await ResourceService.getAll();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch resources' });
    }
  }

  static async create(req, res) {
    const { title, type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const resource = await ResourceService.create(title, type, file.path);
      res.json(resource);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      await ResourceService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete resource' });
    }
  }
}