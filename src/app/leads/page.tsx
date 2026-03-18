"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function LeadsPage() {

  const searchParams = useSearchParams()

  const business = searchParams.get("business")
  const location = searchParams.get("location")

  const [leads, setLeads] = useState<any[]>([])

  useEffect(() => {

    async function fetchLeads() {

      const res = await fetch(
        `/api/leads?business=${business}&location=${location}`
      )

      const data = await res.json()

      setLeads(data.leads)

    }

    fetchLeads()

  }, [])

  return (

    <div className="max-w-4xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        Potential Leads for {business}
      </h1>

      <div className="grid gap-4">

        {leads.map((lead, i) => (

          <div
            key={i}
            className="border rounded-lg p-5 shadow-sm"
          >

            <h3 className="font-semibold text-lg">
              {lead.name}
            </h3>

            <p>Email: {lead.email}</p>

            <p>Phone: {lead.phone}</p>

            <a
              href={lead.whatsapp}
              target="_blank"
              className="text-green-600 font-semibold"
            >
              Message on WhatsApp
            </a>

          </div>

        ))}

      </div>

    </div>

  )

}