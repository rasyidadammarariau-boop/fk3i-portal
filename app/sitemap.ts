import prisma from "@/lib/prisma"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://bem-pesantren.or.id"

    // Ambil semua berita yang published
    const allNews = await prisma.news.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
    }).catch(() => [])

    // Ambil semua album galeri yang published
    const allAlbums = await prisma.galleryAlbum.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
    }).catch(() => [])

    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${baseUrl}/documents`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
        { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
        { url: `${baseUrl}/terms-of-service`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    ]

    const newsPages: MetadataRoute.Sitemap = allNews.map((news: { slug: string; updatedAt: Date }) => ({
        url: `${baseUrl}/news/${news.slug}`,
        lastModified: news.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
    }))

    const galleryPages: MetadataRoute.Sitemap = allAlbums.map((album: { slug: string; updatedAt: Date }) => ({
        url: `${baseUrl}/gallery/${album.slug}`,
        lastModified: album.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
    }))

    return [...staticPages, ...newsPages, ...galleryPages]
}
