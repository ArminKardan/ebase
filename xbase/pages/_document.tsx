import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document<{ lang: string, fontname: string, rtl: boolean }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    let lang = 'en';
    const queryLang = (ctx as any)?.query?.lang;
    if (typeof queryLang === 'string') {
      lang = queryLang;
    } else {
      const match = ctx.pathname.match(/^\/([a-z]{2})(\/|$)/);
      if (match) lang = match[1];
    }

    let fontname = "vr, vz, Segoe UI, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
    let rtl = true;
    if (["de", "en", "es", "fr", "id", "ja", "pt", "ru", "tr", "ur",].includes(fontname)) {
      fontname = "Segoe UI, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
      if (lang != "ur")
        rtl = false
    }
    else if (lang == "ko") {
      fontname = "ko, Segoe UI, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
      rtl = false
    }
    else if (lang == "zh") {
      fontname = "ko, Segoe UI, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
      rtl = false
    }

    return { ...initialProps, lang, fontname, rtl };
  }

  render() {
    return (
      <Html lang={this.props.lang}>
        <Head>
          <link
            rel="preload"
            href="https://cdn.qepal.com/qepal/fonts/vz.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="https://cdn.qepal.com/qepal/fonts/vr.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="https://cdn.qepal.com/qepal/fonts/vrb.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
        </Head>
        <body data-theme="light" dir={this.props.rtl ? "rtl" : "ltr"} style={{ fontFamily: this.props.fontname }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
