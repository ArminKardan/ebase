export type LDJSONWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": string,
    "url": string,
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://exirnex.ir/fa/s/{search_term_string}" | string,
        "query-input": "required name=search_term_string"
    }
}

export type LDJSONBreadcrumb = {
    "@type": "ListItem",
    "position": number,
    "name": string,
    "item": string
}


export type LDJSONWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": string,
    "url": string,
    "description": string,
    "image": string,
    "inLanguage": "fa" | string,
    "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": Array<LDJSONBreadcrumb>
    },
    "isPartOf": {
        "@type": "WebSite",
        "name": "کیو ای",
        "url": "https://qepal.com/"
    },
    "mainEntity": LDJSONArticle | LDJSONBlogPosting | LDJSONNewsArticle | LDJSONProduct | LDJSONEvent,
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": string
    }
}

export type LDJSONArticle = {
    "@context"?: "https://schema.org",
    "@type": "Article",
    "headline": string,
    "author": {
        "@type": "Person",
        "url":string,
        "name": string
    },
    "publisher": {
        "@type": "Organization",
        "name": string,
        "logo": {
            "@type": "ImageObject",
            "url": string
        }
    },
    "datePublished": string, //ISO
    "dateModified": string // ISO,
    "image": Array<string>,
    "description": string
}


export type LDJSONBlogPosting = {
    "@context"?: "https://schema.org",
    "@type": "BlogPosting",
    "headline": string,
    "author": {
        "@type": "Person",
        "name": string
    },
    "datePublished": string,
    "image": string,
    "description": string,
    "mainEntityOfPage": string //URL
}


export type LDJSONNewsArticle = {
    "@context"?: "https://schema.org",
    "@type": "NewsArticle",
    "headline": string,
    "datePublished": "2025-10-05",
    "dateModified": "2025-10-05",
    "author": {
        "@type": "Organization",
        "name": string
    },
    "publisher": {
        "@type": "Organization",
        "name": string,
        "logo": {
            "@type": "ImageObject",
            "url": string
        }
    },
    "image": Array<string>,
    "description": string
}

export type LDJSONProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": string,
    "image": string,
    "description": string,
    "sku": string, //productID
    "brand": {
        "@type": "Brand",
        "name": string
    },
    "offers": {
        "@type": "Offer",
        "url": string,
        "priceCurrency": "CNY" | "CHF" | "AUD" | "IRR" | "GBP" | "EUR" | "USD",
        "price": number,
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "125"
    }
}

export type LDJSONEvent = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": string,
    "startDate": string,
    "endDate": string,
    "location": {
        "@type": "Place",
        "name": string,
        "address": string
    },
    "image": string,
    "description": string,
    "performer": {
        "@type": "Person",
        "url":"https://qepal.com",
        "name": string
    }
}

export type LDJSONOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "کیو ای",
    "url": "https://qepal.com/",
    "logo": "https://cdn.qepal.com/qepal/qecircabs.webp",
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+98-21-74391640",
        "areaServed": { "@type": "Country", "name": "US" | "IR" | "CA" }
    },
    "sameAs": [
        "https://www.instagram.com/qenews",
        "https://x.com/armincdn",
        "https://www.linkedin.com/in/armin-kardan"
    ]
}



export type LDJSONPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": string,
    "image": string,
    "jobTitle": string,
    "worksFor": {
        "@type": "Organization",
        "url":"https://qepal.com",
        "name": "کیو ای"
    },
    "sameAs": Array<string> //social media pages
}

export type LDJSONFAQItem = {
    "@type": "Question",
    "name": string,
    "acceptedAnswer": {
        "@type": "Answer",
        "text": string
    }
}


export type LDJSONFAQPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": Array<LDJSONFAQItem>
}

export type LDJSON = LDJSONFAQPage | LDJSONPerson | LDJSONOrganization |
    LDJSONEvent | LDJSONProduct | LDJSONNewsArticle | LDJSONBlogPosting | LDJSONArticle | LDJSONWebPage | LDJSONWebSite


export type Meta = {
    title: string,
    canonical: string,
    hrefLangs: Array<{code:string, url:string}>,
    description: string,
    index: boolean,
    follow: boolean,
    ldjsons: Array<LDJSON>
    og: {
        type: string,
        title: string,
        description: string,
        image: string,
        url: string,
        alt: string,
        locale: string,
    },
    twitter: {
        card: string,
        title: string,
        description: string,
        image: string,
        site: string, //twitterid
    }
}



export function toLocalISO(date = new Date()) {
    const tzo = -date.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';
    const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
}
