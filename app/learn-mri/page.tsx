// app/learn-mri/page.tsx
import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function LearnMRITextPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-1 p-4 max-w-4xl mx-auto">
        <article className={styles.tiles}>
          <h2 className={styles.title}>Learn MRI</h2>
          <div className={styles.tile}>
            <p>
              Welcome to the Learn MRI section! This page provides comprehensive information on Magnetic Resonance Imaging (MRI) 
              fundamentals, procedures, and safety.
            </p>
            <p>
              Learn MRI has been thoughtfully designed by MRI Simplified with the structure of the ARRT exams in mind. 
              Here you will find detailed explanations, illustrative examples, and carefully selected supplementary materials 
              from reputable sources - all aimed at enriching your MRI learning journey.
            </p>
            <p>
              Begin by selecting one of the three parts below. Each part is organized into chapters, sections, subsections, 
              and topics, allowing you to dive deeply into the fascinating world of MRI.
            </p>
            <div className="flex justify-between mt-10 pl-15 pr-15 w-full">
              <Link 
                href="/learn-mri/topic/mri-fundamentals" 
                className="text-blue-600 hover:underline text-2xl"
              >
                MRI Fundamentals
              </Link>
              <Link 
                href="/learn-mri/topic/mri-procedures" 
                className="text-blue-600 hover:underline text-2xl"
              >
                MRI Procedures
              </Link>
              <Link 
                href="/learn-mri/topic/mri-safety" 
                className="text-blue-600 hover:underline text-2xl"
              >
                MRI Safety
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
