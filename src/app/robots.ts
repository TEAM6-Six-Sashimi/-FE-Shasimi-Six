import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/mycourses-student',
        '/mycourses-instructor',
        '/mypage',
        '/instructor/application',
        '/admin',
        '/payments',
        '/cart',
        '/alarm',
      ],
    },
    sitemap: 'https://sixsashimi.com.market-app.org/sitemap.xml',
  };
}