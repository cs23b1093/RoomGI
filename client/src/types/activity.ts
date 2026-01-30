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

export interface BookingActivity {
  propertyId: string;
  message: string;
  timestamp: string;
  type: 'recent_booking' | 'high_interest' | 'availability_change';
}