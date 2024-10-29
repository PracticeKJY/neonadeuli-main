import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json(); // Use request.json() to get the body in JSON format
  console.log(body); // Log the request body

  // const response = await fetch(`http://localhost:8000/api/v1/users/login/${body}`, {
  //   method: "GET",
  //   headers: {
  //     // 필요한 헤더 추가
  //     "Content-Type": "application/json",
  //   },
  //   credentials: "include",
  // });

  // const data = await response.json();
  // return NextResponse.json(data);
}
