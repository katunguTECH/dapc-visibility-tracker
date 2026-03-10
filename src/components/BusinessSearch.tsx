"use client";

import { useState } from "react";
import VisibilityGauge from "./VisibilityGauge";
import MarketShareChart from "./MarketShareChart";
import TrendChart from "./TrendChart";

export default function BusinessSearch() {
  const [hasResults, setHasResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [searchData, setSearchData] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const nameLength = businessName.length;

      const score = Math.min(Math.max(nameLength * 3 + 45, 50), 95);
      const reviews = nameLength * 12 + 60;
      const rating = (4.0 + (nameLength % 10) / 10).toFixed(1);

      setSearchData({
        user: {
          name: businessName,
          score,
          reviews,
          rating,
        },
        leader: {
          name: "National Industry Leader",
          score: 94,
          reviews: 450,
          rating: 4.9,
        },
      });

      setIsLoading(false);
      setHasResults(true);
    }, 1200);
  };

  const reviewGap =
    searchData?.leader.reviews - searchData?.user.reviews || 0;

  return (
    <div className="space-y-10">

      {!hasResults ? (

        /* SEARCH FORM */

        <div className="max-w-xl mx-auto py-16">
          <form
            onSubmit={handleSearch}
            className="space-y-6 text-center"
          >

            <h1 className="text-4xl font-black text-slate-900">
              Kenya Market Visibility Audit
            </h1>

            <p className="text-slate-500">
              Analyze your business visibility across Kenya
            </p>

            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Hospital, Hotel, Restaurant..."
              className="w-full p-6 border rounded-2xl text-xl text-center"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl"
            >
              {isLoading ? "Analyzing Market..." : "Start Visibility Audit"}
            </button>

          </form>
        </div>

      ) : (

        /* RESULTS DASHBOARD */

        <div className="space-y-10">

          {/* KPI CARDS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-blue-600 text-white p-8 rounded-3xl">
              <p className="uppercase text-sm opacity-80">
                Visibility Score
              </p>

              <p className="text-5xl font-black mt-2">
                {searchData.user.score}%
              </p>

              <p className="opacity-80 mt-2">
                Strong national presence
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border">
              <p className="uppercase text-sm text-slate-400">
                Review Gap
              </p>

              <p className="text-5xl font-black text-rose-500 mt-2">
                -{reviewGap}
              </p>

              <p className="text-slate-500 text-sm">
                Reviews needed to match leader
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border">
              <p className="uppercase text-sm text-slate-400">
                Customer Rating
              </p>

              <p className="text-5xl font-black text-emerald-500 mt-2">
                {searchData.user.rating}
              </p>

              <p className="text-emerald-600 text-sm">
                ★ Based on customer reviews
              </p>
            </div>

          </div>

          {/* CHART DASHBOARD */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* VISIBILITY GAUGE */}

            <div className="bg-white p-8 rounded-3xl border">
              <h3 className="font-bold mb-4">
                Visibility Score
              </h3>

              <VisibilityGauge score={searchData.user.score} />
            </div>

            {/* MARKET SHARE PIE */}

            <div className="bg-white p-8 rounded-3xl border">
              <h3 className="font-bold mb-4">
                Market Share
              </h3>

              <MarketShareChart
                userScore={searchData.user.score}
                leaderScore={searchData.leader.score}
              />
            </div>

            {/* TREND CHART */}

            <div className="bg-white p-8 rounded-3xl border">
              <h3 className="font-bold mb-4">
                Visibility Growth
              </h3>

              <TrendChart />
            </div>

          </div>

          {/* VISIBILITY COMPARISON */}

          <div className="bg-white p-10 rounded-3xl border">

            <h3 className="text-xl font-black mb-8">
              National Visibility Comparison
            </h3>

            <div className="space-y-8">

              {/* USER BAR */}

              <div>

                <div className="flex justify-between mb-2">

                  <span className="font-bold">
                    {businessName} (You)
                  </span>

                  <span className="text-blue-600 font-bold">
                    {searchData.user.score}%
                  </span>

                </div>

                <div className="w-full h-6 bg-slate-100 rounded-full">

                  <div
                    className="h-6 bg-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: `${searchData.user.score}%` }}
                  />

                </div>

              </div>

              {/* LEADER BAR */}

              <div>

                <div className="flex justify-between mb-2">

                  <span className="text-slate-500">
                    Industry Leader
                  </span>

                  <span className="text-slate-500">
                    {searchData.leader.score}%
                  </span>

                </div>

                <div className="w-full h-4 bg-slate-100 rounded-full">

                  <div
                    className="h-4 bg-slate-300 rounded-full"
                    style={{ width: "94%" }}
                  />

                </div>

              </div>

            </div>

          </div>

          {/* AI INSIGHTS */}

          <div className="bg-slate-900 text-white p-10 rounded-3xl">

            <h3 className="text-2xl font-black mb-6">
              AI Growth Insights
            </h3>

            <ul className="space-y-4 text-slate-300">

              <li>
                Your visibility is{" "}
                <strong>
                  {searchData.leader.score - searchData.user.score}%
                </strong>{" "}
                lower than the national leader.
              </li>

              <li>
                Gaining{" "}
                <strong>{reviewGap} additional reviews</strong>{" "}
                would close the review gap.
              </li>

              <li>
                Increasing rating to <strong>4.8</strong> could
                push you into the top national ranking.
              </li>

            </ul>

          </div>

          {/* RESET BUTTON */}

          <div className="text-center">

            <button
              onClick={() => {
                setHasResults(false);
                setBusinessName("");
              }}
              className="text-slate-500 font-bold"
            >
              ← Run New Audit
            </button>

          </div>

        </div>

      )}

    </div>
  );
}