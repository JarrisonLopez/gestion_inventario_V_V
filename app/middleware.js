import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Rutas públicas (productos y detalles)
  if (pathname === '/product' || pathname.startsWith('/product/')) {
    return NextResponse.next();
  }

  // Proteger rutas del CRUD (crear, editar, eliminar)
  if (pathname.startsWith('/product/new-product') || pathname.startsWith('/edit-product/')) {
    const token = request.cookies.get('auth-token');

    if (!token) {
      // Redirigir al login si no está autenticado
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verificar rol
    const user = JSON.parse(atob(token.value));
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/product', request.url));
    }
  }

  return NextResponse.next();
}
