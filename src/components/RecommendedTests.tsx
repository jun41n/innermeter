import React from "react";
import { Link } from "react-router-dom";
import { getRecommendedTests, TestCategory } from "../lib/recommendTests";

interface RecommendedTestsProps {
  currentTestId: string;
  currentCategory?: TestCategory;
  title?: string;
}

export default function RecommendedTests({
  currentTestId,
  currentCategory,
  title = "You may also like",
}: RecommendedTestsProps) {
  const recommended = getRecommendedTests({
    currentTestId,
    currentCategory,
    limit: 4,
  });

  if (!recommended.length) return null;

  return (
    <section style={{ marginTop: "32px" }}>
      <h2
        style={{
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "16px",
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {recommended.map((test) => (
          <Link
            key={test.id}
            to={test.slug}
            style={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px",
              padding: "18px",
              background: "rgba(255,255,255,0.04)",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                opacity: 0.7,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {test.category}
            </div>

            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "8px",
                lineHeight: 1.3,
              }}
            >
              {test.title}
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: 1.5,
                opacity: 0.85,
              }}
            >
              {test.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
