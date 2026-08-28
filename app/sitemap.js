import { db } from '@/lib/prisma'

export default async function sitemap() {
  const baseUrl = 'https://prept-ai-interviw-marketplace.vercel.app'

  let interviewerUrls = []
  try {
    const interviewers = await db.user.findMany({
      where: { role: 'INTERVIEWER' },
      select: { id: true, updatedAt: true },
    })
    interviewerUrls = interviewers.map((iv) => ({
      url: `${baseUrl}/interviewers/${iv.id}`,
      lastModified: iv.updatedAt ?? new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  } catch (err) {
    console.error('sitemap: failed to fetch interviewers', err)
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...interviewerUrls,
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
