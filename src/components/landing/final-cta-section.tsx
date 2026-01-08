"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0D122B] py-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#E6007A]/20 to-[#00F2EA]/20 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-xl"
          >
            <Sparkles className="h-4 w-4 text-[#D4FF00]" />
            Commencez gratuitement
          </motion.div>

          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Prêt à transformer l&apos;apprentissage de{" "}
            <span className="bg-gradient-to-r from-[#E6007A] via-[#00F2EA] to-[#D4FF00] bg-clip-text text-transparent">
              votre enfant
            </span>{" "}
            ?
          </h2>

          <p className="mb-10 text-lg text-slate-400">
            Rejoignez des milliers de familles qui font confiance à Schoolaris
            pour accompagner la réussite scolaire de leurs enfants.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="group w-full bg-gradient-to-r from-[#E6007A] to-[#00F2EA] px-8 text-lg font-semibold text-white hover:shadow-lg hover:shadow-[#E6007A]/25 sm:w-auto"
              asChild
            >
              <Link href="/register">
                Créer mon compte gratuit
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-white/20 px-8 text-lg text-white hover:bg-white/10 sm:w-auto"
              asChild
            >
              <Link href="/courses">Explorer les cours</Link>
            </Button>
          </motion.div>

          <p className="mt-6 text-sm text-slate-500">
            Pas de carte bancaire requise. Accès instantané.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
