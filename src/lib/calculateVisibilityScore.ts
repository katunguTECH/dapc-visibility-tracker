// src/lib/calculateVisibilityScore.ts

export interface AuditData {
  businessName: string
  mapsFound?: boolean
  website?: string
  rating?: number
  reviewCount?: number
  facebook?: string
  instagram?: string
  twitter?: string
  linkedin?: string
  directories?: number
}

export interface VisibilityResult {
  score: number
  googleRank: string
  opportunities: string[]
}

export function calculateVisibilityScore(data: AuditData): VisibilityResult {

  let score = 0
  const opportunities: string[] = []

  // -------------------------
  // GOOGLE MAPS PRESENCE
  // -------------------------
  if (data.mapsFound) {
    score += 25

    if ((data.reviewCount || 0) > 100) {
      score += 10
    } else if ((data.reviewCount || 0) > 20) {
      score += 5
    } else {
      opportunities.push("Increase Google reviews")
    }

  } else {
    opportunities.push("Business missing on Google Maps")
  }

  // -------------------------
  // WEBSITE PRESENCE
  // -------------------------
  if (data.website) {

    score += 15

    const cleanName = data.businessName
      .toLowerCase()
      .replace(/\s/g, "")

    if (data.website.toLowerCase().includes(cleanName)) {
      score += 10
    }

  } else {
    opportunities.push("No official website detected")
  }

  // -------------------------
  // REVIEW QUALITY
  // -------------------------
  if (data.rating) {

    if (data.rating >= 4.5) {
      score += 20
    } else if (data.rating >= 4.0) {
      score += 15
    } else if (data.rating >= 3.5) {
      score += 10
      opportunities.push("Improve customer rating")
    } else {
      score += 5
      opportunities.push("Poor reputation score")
    }

  }

  // -------------------------
  // SOCIAL MEDIA PRESENCE
  // -------------------------
  let socialCount = 0

  if (data.facebook) {
    score += 3
    socialCount++
  }

  if (data.instagram) {
    score += 3
    socialCount++
  }

  if (data.twitter) {
    score += 2
    socialCount++
  }

  if (data.linkedin) {
    score += 2
    socialCount++
  }

  if (socialCount === 0) {
    opportunities.push("No social media presence detected")
  }

  // -------------------------
  // DIRECTORY PRESENCE
  // -------------------------
  if ((data.directories || 0) >= 3) {
    score += 10
  } else if ((data.directories || 0) >= 1) {
    score += 5
  } else {
    opportunities.push("Not listed in business directories")
  }

  // -------------------------
  // GOOGLE RANK ESTIMATION
  // -------------------------
  let googleRank = "10+"

  if (data.mapsFound && data.website) {
    googleRank = "#1-3"
  } else if (data.website) {
    googleRank = "#3-5"
  } else if (data.mapsFound) {
    googleRank = "#5-10"
  }

  score = Math.min(score, 100)

  return {
    score,
    googleRank,
    opportunities
  }
}