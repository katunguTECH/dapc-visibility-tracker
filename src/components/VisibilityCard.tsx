"use client";

export default function VisibilityCard(props: any) {
  if (!props) return null;

  return (
    <div style={{ padding: 20, border: "1px solid #ccc" }}>
      <h2>{props.business || "No Business"}</h2>
      <p>Score: {props.score ?? 0}</p>
      <p>SEO: {props.seoScore ?? 0}</p>
    </div>
  );
}