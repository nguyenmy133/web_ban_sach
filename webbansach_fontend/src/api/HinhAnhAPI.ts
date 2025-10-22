// src/api/HinhAnhAPI.ts
import type { HinhAnhModel } from "../models/HinhAnhModel";
import { request } from "./Request";

/** Helper chuẩn hoá src cho <img>: ưu tiên base64, sau đó đến duongDan, cuối cùng fallback */
export function buildImageSrc(
  hinh?: Partial<HinhAnhModel> | null,
  fallback: string = "/images/no-image.png"
): string {
  if (!hinh) return fallback;

  const duLieuAnh = hinh.duLieuAnh ?? undefined;
  const duongDan = hinh.duongDan ?? undefined;

  if (duLieuAnh && duLieuAnh.length > 0) {
    // nếu backend trả base64
    return `data:image/jpeg;base64,${duLieuAnh}`;
  }

  if (duongDan && duongDan.length > 0) {
    // nếu là path tương đối thì ghép host local (tuỳ backend của bạn)
    return duongDan.startsWith("http")
      ? duongDan
      : `http://localhost:8080${duongDan}`;
  }

  return fallback;
}

async function layAnhCua1Sach(duongDan: string): Promise<HinhAnhModel[]> {
  const ketQua: HinhAnhModel[] = [];
  const response = await request(duongDan.toString());
  const responseData = response._embedded.hinhAnhs;

  for (const key in responseData) {
    ketQua.push({
      maHinhAnh: responseData[key].maHinhAnh,
      tenHinhAnh: responseData[key].tenHinhAnh,
      laIcon: responseData[key].laIcon,
      duongDan: responseData[key].duongDan,
      duLieuAnh: responseData[key].duLieuAnh,
    });
  }
  return ketQua;
}

export async function layToanBoHinhAnhCuaMotSach(
  maSach: number
): Promise<HinhAnhModel[]> {
  const duongDan = `http://localhost:8080/sach/${maSach}/danhSachHinhAnh`;
  return layAnhCua1Sach(duongDan);
}

export async function lay1AnhCuaMotSach(
  maSach: number
): Promise<HinhAnhModel[]> {
  const duongDan = `http://localhost:8080/sach/${maSach}/danhSachHinhAnh?sort=maHinhAnh,asc&page=0&size=1`;
  return layAnhCua1Sach(duongDan);
}
