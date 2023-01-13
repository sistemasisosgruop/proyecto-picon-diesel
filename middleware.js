import { NextResponse } from "next/server";

export async function middleware(req) {
  const [, [, berarerToken]] = req.headers;
  const token = berarerToken.split(" ")[1];

  if (!token || token?.length === 0) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/hello/:path*"],
};
