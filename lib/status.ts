export const demoStatuses = [
  "booking_confirmed",
  "checkin_pending",
  "checkin_completed",
  "room_assigned",
  "navigation_active",
  "arrived",
] as const;

export type DemoStatus = (typeof demoStatuses)[number];

export const statusLabel: Record<DemoStatus, string> = {
  booking_confirmed: "Đã xác nhận đặt phòng",
  checkin_pending: "Chờ check-in",
  checkin_completed: "Đã check-in",
  room_assigned: "Đã phân phòng",
  navigation_active: "Đang dẫn đường",
  arrived: "Đã đến nơi",
};

export function statusRank(status: DemoStatus) {
  return demoStatuses.indexOf(status);
}

export function hasAssignedRoom(status: DemoStatus) {
  return statusRank(status) >= statusRank("room_assigned");
}
