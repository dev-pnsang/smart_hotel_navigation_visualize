import type { AmenityKind, AmenityRecord } from "./types";

export const amenities: AmenityRecord[] = [
  {
    id: "amenity-reception",
    nodeId: "lobby-reception",
    name: "Lễ tân",
    kind: "lobby",
    floorId: "floor-1",
    summary: "Sảnh đón trên mặt tiền 141 Nguyễn Huệ, điểm xuất phát của hành trình.",
  },
  {
    id: "amenity-restaurant",
    nodeId: "restaurant",
    name: "Hoa Mai",
    kind: "dining",
    floorId: "floor-1",
    summary: "Nhà hàng Hoa Mai ở tầng trệt, phục vụ ẩm thực Việt và châu Á.",
  },
  {
    id: "amenity-paradise",
    nodeId: "paradise",
    name: "Paradise Coffee",
    kind: "dining",
    floorId: "floor-1",
    summary: "Paradise Coffee Lounge nhìn ra vườn, cà phê và trà chiều ở tầng trệt.",
  },
  {
    id: "amenity-elevator",
    nodeId: "elev-f1",
    name: "Thang máy",
    kind: "circulation",
    floorId: "floor-1",
    summary: "Thang máy mô phỏng nối sảnh với tầng phòng và sân thượng.",
  },
  {
    id: "amenity-room-408",
    nodeId: "room-408",
    name: "Phòng 408",
    kind: "stay",
    floorId: "floor-4",
    summary: "Phòng Deluxe King minh họa, hướng phố đi bộ Nguyễn Huệ. Cùng dải tầng 3–4 với Imperial Suite ở cánh đông.",
  },
  {
    id: "amenity-pool",
    nodeId: "pool",
    name: "Hồ bơi lầu 6",
    kind: "wellness",
    floorId: "floor-6",
    summary: "Hồ cổ điển trên lầu 6: dài 13,5 m, ngang 5 m, sâu hơn 2,5 m. Lầu 5 còn một hồ hiện đại và hồ trẻ em.",
  },
  {
    id: "amenity-rooftop",
    nodeId: "rooftop-bar",
    name: "Rooftop Garden Bar",
    kind: "dining",
    floorId: "floor-6",
    summary: "Quầy bar sân thượng nhìn xuống Nguyễn Huệ, nơi từng gắn với Five O'Clock Follies.",
  },
];

export const amenityFilters: { id: "all" | AmenityKind; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "lobby", label: "Sảnh" },
  { id: "dining", label: "Ẩm thực" },
  { id: "wellness", label: "Tiện ích" },
  { id: "circulation", label: "Di chuyển" },
  { id: "stay", label: "Phòng" },
];

export function getAmenity(id: string) {
  return amenities.find((amenity) => amenity.id === id);
}

export function getAmenityByNode(nodeId: string) {
  return amenities.find((amenity) => amenity.nodeId === nodeId);
}
