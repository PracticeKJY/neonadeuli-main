import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = await fetch("http://localhost:8000/api/v1/users/info", {
    method: "GET",
    headers: {
      // 필요한 헤더 추가
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  return NextResponse.json(data);
}
