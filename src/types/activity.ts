export interface ActivityItem {
  id: string;
  propertyId: string;
  type: 'booking' | 'view' | 'inquiry' | 'availability_update';
  message: string;
  timestamp: string;
  metadata?: {
    bedsBooked?: number;
    viewerCount?: number;
    previousAvailability?: number;
    newAvailability?: number;
  };
}