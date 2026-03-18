"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"

export default function LeadsPage() {

  const searchParams = useSearchParams()
  const business = searchParams.get("business") || ""
  const location = searchParams.get("location") || "Kenya"

  const { user } = useUser()

  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch leads
  useEffect(() => {

    async function fetchLeads() {

      try {

        const res = await fetch(
          `/api/leads?business=${business}&location=${location}`
        )

        const data = await res.json()

        setLeads(data.leads || [])

      } catch (err) {

        console.error("Failed to fetch leads:", err)

      } finally {

        setLoading(false)

      }

    }

    if (business) fetchLeads()

  }, [business, location])

  // Export CSV
  function exportToCSV(leads: any[], business: string) {

    const headers = ["Email", "Phone", "WhatsApp", "Quality"]

    const rows = leads.map(l => [
      l.email || "",
      l.phone || "",
      l.whatsapp || "",
      l.quality || ""
    ])

    const csvContent =
      [headers, ...rows]
        .map(row => row.join(","))
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${business || "leads"}-leads.csv`
    a.click()
  }

  // Save Leads
  async function saveLeads() {

    if (!user) {
      alert("Please sign in first")
      return
    }

    setSaving(true)

    try {

      const res = await fetch("/api/save-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          leads,
          business,
          userId: user.id
        })
      })

      const data = await res.json()

      if (data.success) {
        alert("Leads saved successfully!")
      } else {
        alert("Failed to save leads")
      }

    } catch (err) {

      console.error("Save error:", err)
      alert("Error saving leads")

   