"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I find the right tutor for me?",
    answer: "You can use our 'Find Tutors' page to filter tutors by subject, availability, and rating. Each tutor has a detailed profile with reviews from other students to help you make an informed decision."
  },
  {
    question: "How do online sessions work?",
    answer: "Our sessions take place on our integrated video platform. Once you book a session, you'll receive a link to join at the scheduled time. You'll have access to a virtual whiteboard, screen sharing, and collaborative document editing."
  },
  {
    question: "What is your cancellation policy?",
    answer: "We understand that plans change. You can cancel or reschedule a session for free up to 24 hours before the start time. Cancellations within 24 hours may be subject to a partial fee."
  },
  {
    question: "Are the tutors verified?",
    answer: "Yes, every tutor on our platform undergoes a rigorous verification process, including background checks, academic credential verification, and a trial teaching session."
  },
  {
    question: "Is there a free trial session?",
    answer: "Many of our tutors offer a free 15-minute introductory session to discuss your goals and see if you're a good match. Look for the 'Free Intro' badge on tutor profiles."
  }
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our platform and how to get started.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-border bg-card rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground">{faq.question}</span>
                </div>
                <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-300", openIndex === index && "rotate-180")} />
              </button>
              
              <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}>
                <div className="overflow-hidden">
                  <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
