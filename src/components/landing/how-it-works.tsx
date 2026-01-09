"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, BookOpen, Trophy } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Trouve ton cours",
    description:
      "Parcours notre catalogue de 500+ cours créés par des profs certifiés. Filtre par matière, niveau ou objectif.",
    color: "#FF385C",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Apprends à ton rythme",
    description:
      "Accède aux vidéos, exercices et ressources 24h/24. Notre tuteur IA t'accompagne et répond à tes questions.",
    color: "#A435F0",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Réussis tes examens",
    description:
      "Suis ta progression, gagne des badges et atteins tes objectifs. 95% de nos étudiants améliorent leurs notes.",
    color: "#00A699",
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-[1760px] px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-3 text-[32px] font-bold text-[#222222]">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-[#717171]">
            En 3 étapes simples, commence à progresser
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+60px)] top-10 hidden h-0.5 w-[calc(100%-120px)] bg-[#DDDDDD] md:block" />
              )}

              {/* Number badge */}
              <div
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: `${step.color}15` }}
              >
                <step.icon
                  className="h-10 w-10"
                  style={{ color: step.color }}
                />
              </div>

              {/* Step number */}
              <div
                className="mb-4 inline-block rounded-full px-4 py-1 text-sm font-bold"
                style={{ backgroundColor: step.color, color: "white" }}
              >
                Étape {step.number}
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold text-[#222222]">
                {step.title}
              </h3>
              <p className="text-[#717171]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
