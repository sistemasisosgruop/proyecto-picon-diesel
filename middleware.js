import { NextResponse } from 'next/server';
// import { AuthService } from 'backend/services/auth/auth.service';

export async function middleware(req, res) {
  const { pathname } = req.nextUrl;
  console.log(pathname, 'PATHNAME');
  // Excluir la ruta "/api/auth"
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const authorizationHeader = req.headers.get('authorization');
  if (!authorizationHeader) {
    return res.status(401).json({ message: 'unauthorized' });
    // return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
    //   status: 401,
    //   headers: { 'content-type': 'application/json' },
    // });
  }

  const token = authorizationHeader.split(' ')[1];
  console.log(token, 'TOKEN');
  // const payload = await AuthService.validarToken(token);
  // console.log(payload, 'PAYLOAD TOKEN');
  if (!token || token.length === 0) {
    return res.status(401).json({ message: 'unauthorized' });
    // return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), {
    //   status: 401,
    //   headers: { 'content-type': 'application/json' },
    // });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/hello/:path*'],
  // matcher: ['/api/:path*'],
};
