import { NextResponse } from 'next/server';
export async function middleware(request: Request) {
  let url = new URL(request.url)
  let path = url.pathname;

  // if(path.endsWith("/404"))
  // {
  //   return NextResponse.next();
  // }

  if (path == "/sitemap.xml") {
    let dest = `${url.origin}/api/sitemap`
    return NextResponse.rewrite(dest)
  }

  if (path == "/fa/sitemap.xml") {
    return NextResponse.rewrite(new URL(`/api/sitemap-lang`, request.url));
  }

  return NextResponse.next();
}