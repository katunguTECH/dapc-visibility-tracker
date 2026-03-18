"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

export default function SavedLeadsPage() {

  const { user } = useUser()
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function fetchLeads() {

      try {

        const res = await fetch(`/api/user-leads?userId=${user?.id}`)
        const data = await res.json()

        setLeads(data.leads || [])

      } catch (err) {

        console.error("Failed to fetch saved leads:", err)

      } finally {

        setLoading(false)

      }

    }

    if (user) fetchLeads()

  }, [user])

  return (

    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Saved Leads
        </h1>

        {loading && (
          <p className="text-gray-500">Loading saved leads...</p>
        )}

        {!loading && leads.length === 0 && (
          <p className="text-red-500">
            No saved leads yet.
          </p>
        )}

        <div className="space-y-4">

          {leads.map((lead, index) => (

            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow border"
            >

              <p className="font-semibold text-gray-800">
                {lead.email}
              </p>

              <p className="text-gray-600">
                📞 {lead.phone || "N/A"}
              </p>

              {lead.whatsapp && (
                <a
                  href={lead.whatsapp}
                  target="_blank"
                  className="text-green-600 underline"
                >
                  WhatsApp Contact
                </a>
              )}

              <p className="mt-2 text-sm font-bold">
                {lead.quality}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}