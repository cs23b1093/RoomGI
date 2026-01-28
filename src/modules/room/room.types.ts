export interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoomDto {
  name: string;
  description: string;
  capacity: number;
}