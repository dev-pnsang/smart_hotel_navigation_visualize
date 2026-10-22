import type { FloorId } from "./types";

export const bookingSources = ["Agoda", "Booking.com"] as const;
export type BookingSource = (typeof bookingSources)[number];

export const demoBooking = {
  reference: "BK-DEMO-001",
  source: "Agoda" as BookingSource,
  status: "confirmed" as const,
  guestName: "Alex Morgan",
  checkInDate: "2026-10-22",
  checkOutDate: "2026-10-24",
  guests: 2,
  roomType: "Deluxe King",
  stayId: "stay-demo-001",
  roomId: "room-408",
  roomNumber: "408",
  floorId: "floor-4" as FloorId,
};

export const START_NODE_ID = "lobby-reception";
export const DESTINATION_ROOM_ID = "room-408";
export const DESTINATION_NODE_ID = "room-408";
