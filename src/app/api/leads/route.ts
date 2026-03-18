import { NextResponse } from "next/server"

function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}

async function findCompanyWebsite(business: string, location: string) {

  try {

    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: `${business} ${location} official website`,
        num: 5
      })
    })

    const data = await res.json()
    return data.organic?.[0]?.link || null

  } catch {
    return null
  }

}

function extractSocialLinks(html: string) {

  const links = html.match(/https?:\/\/[^\s"'<>]+/g) || []

  return {
    linkedin: links.find(l => l.includes("linkedin.com")) || null,
    facebook: links.find(l => l.includes("facebook.com")) || null,
    twitter: links.find(l => l.includes("twitter.com") || l.includes("x.com")) || null
  }

}

function scoreLead(email: string, phone: string, hasLinkedIn: boolean) {

  let score = 0

  if (email.includes("info")) score += 40
  else score += 70

  if (phone) score += 20
  if (hasLinkedIn) score += 10

  if (score >= 80) return "HOT 🔥"
  if (score >= 60) return "MEDIUM ⚡"
  return "COLD ❄️"

}

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)

  const business = searchParams.get("business") || ""
  const location = searchParams.get("location") || "Kenya"

  // 1. Find real website
  const website = await findCompanyWebsite(business, location)

  let html = ""
  let emails: string[] = []
  let phones: string[] = []
  let socials: any = {}

  try {

    if (website) {

      await sleep(1000)

      const res = await fetch(website, {
        headers: { "User-Agent": "Mozilla/5.0" }
      })

      html = await res.text()

      emails = html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || []
      phones = html.match(/(\+254\d{9}|07\d{8})/g) || []

      socials = extractSocialLinks(html)

    }

  } catch {
    console.log("Website fetch failed")
  }

  emails = [...new Set(emails)].slice(0, 5)
  phones = [...new Set(phones)].slice(0, 5)

  if (emails.length === 0) {
    emails = [`info@${business}.co.ke`]
  }

  const leads = emails.map((email, i) => ({

    email,
    phone: phones[i] || "N/A",
    whatsapp: phones[i]
      ? `https://wa.me/${phones[i].replace("+", "")}`
      : null,
    quality: scoreLead(email, phones[i], !!socials.linkedin)

  }))

  return NextResponse.json({
    business,
    website,
    socials,
    leads
  })

}