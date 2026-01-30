import { Request, Response } from 'express';
import { PropertyService } from './property.service.js';
import { LifestyleFilters } from './property.types.js';
import { socketService } from '../../socket/socketService.js';

export class PropertyController {
  private propertyService = new PropertyService();

  async createProperty(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'owner') {
        return res.status(403).json({ error: 'Only owners can create properties' });
      }

      const { 
        location, 
        rent, 
        propertyType, 
        bedsAvailable, 
        totalBeds,
        nightlifeScore,
        transitScore,
        safetyScore,
        quietnessScore,
        foodScore,
        studentFriendlyScore
      } = req.body;
      
      if (!location || !rent || !propertyType) {
        return res.status(400).json({ error: 'Location, rent, and property type are required' });
      }

      const property = await this.propertyService.createProperty(user.id, {
        location,
        rent: Number(rent),
        propertyType,
        bedsAvailable: bedsAvailable ? Number(bedsAvailable) : undefined,
        totalBeds: totalBeds ? Number(totalBeds) : undefined,
        nightlifeScore: nightlifeScore ? Number(nightlifeScore) : undefined,
        transitScore: transitScore ? Number(transitScore) : undefined,
        safetyScore: safetyScore ? Number(safetyScore) : undefined,
        quietnessScore: quietnessScore ? Number(quietnessScore) : undefined,
        foodScore: foodScore ? Number(foodScore) : undefined,
        studentFriendlyScore: studentFriendlyScore ? Number(studentFriendlyScore) : undefined
      });

      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create property' });
    }
  }

  async getProperty(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      
      // Get real-time viewer count from socket service
      const viewingCount = socketService.getViewerCount(id);
      
      const property = await this.propertyService.getPropertyWithStats(id);
      
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      // Add real-time viewing count
      res.json({
        ...property,
        viewingCount
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProperties(req: Request, res: Response) {
    try {
      const { location, maxRent } = req.query;
      
      const properties = await this.propertyService.searchProperties(
        location as string,
        maxRent ? Number(maxRent) : undefined
      );
      
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchByLifestyle(req: Request, res: Response) {
    try {
      const filters: LifestyleFilters = {
        location: req.query.location as string,
        maxRent: req.query.maxRent ? Number(req.query.maxRent) : undefined,
        nightlife: req.query.nightlife as 'low' | 'medium' | 'high',
        transit: req.query.transit as 'low' | 'medium' | 'high',
        safety: req.query.safety as 'low' | 'medium' | 'high',
        quietness: req.query.quietness as 'low' | 'medium' | 'high',
        food: req.query.food as 'low' | 'medium' | 'high',
        studentFriendly: req.query.studentFriendly as 'low' | 'medium' | 'high'
      };

      // Remove undefined values
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof LifestyleFilters] === undefined) {
          delete filters[key as keyof LifestyleFilters];
        }
      });

      const properties = await this.propertyService.searchPropertiesByLifestyle(filters);
      res.json(properties);
    } catch (error) {
      console.error('Lifestyle search error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateAvailability(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { bedsAvailable } = req.body;

      if (typeof bedsAvailable !== 'number' || bedsAvailable < 0) {
        return res.status(400).json({ error: 'Invalid beds available value' });
      }

      // Check if user owns this property
      const property = await this.propertyService.getPropertyById(id);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }

      if (property.ownerId !== user.id) {
        return res.status(403).json({ error: 'Only property owner can update availability' });
      }

      if (bedsAvailable > property.totalBeds) {
        return res.status(400).json({ error: 'Available beds cannot exceed total beds' });
      }

      // Update availability
      const updatedProperty = await this.propertyService.updateAvailability(id, bedsAvailable);
      
      // Emit real-time update
      socketService.emitAvailabilityUpdate(id, bedsAvailable);
      
      // Log activity
      await this.propertyService.logActivity(id, 'availability_update', 
        `Availability updated to ${bedsAvailable}/${property.totalBeds} beds`);

      res.json(updatedProperty);
    } catch (error) {
      console.error('Update availability error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getActivity(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      
      const activities = await this.propertyService.getPropertyActivity(id);
      res.json(activities);
    } catch (error) {
      console.error('Get activity error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getMyProperties(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      
      if (user.role !== 'owner') {
        return res.status(403).json({ error: 'Only owners can view their properties' });
      }

      const properties = await this.propertyService.getPropertiesByOwner(user.id);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getViewingCount(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const count = socketService.getViewerCount(id);
      res.json({ viewingCount: count });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}