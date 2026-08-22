"use client";

import Link from "next/link";
import { AlertCircle, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PricingSection from "./PricingSection";
import { Button } from "./ui/button";
import { CREDIT_PACKS } from "@/lib/credit-packs";

export default function UpgradeModal({ open, onOpenChange, reason }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-amber-200/10 min-w-[70vw] max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="text-amber-400 ml-2 mt-1" />
            <div>
              <DialogTitle className="font-serif text-2xl">
                Upgrade your plan
              </DialogTitle>
              {reason && (
                <DialogDescription className="text-amber-400 mt-1">
                  {reason}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* PricingSection or any children slot in here */}
        <div className="px-2 pb-6">
          <PricingSection />

          {/* Local payment (ETB) alternative via Chapa inline checkout */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase text-center mb-4">
              Prefer local payment?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CREDIT_PACKS.map((pack) => (
                <Link
                  key={pack.id}
                  href={`/checkout?pack=${pack.id}`}
                  onClick={() => onOpenChange(false)}
                >
                  <Button
                    variant={pack.featured ? "gold" : "outline"}
                    className={`w-full ${
                      pack.featured
                        ? ""
                        : "border-amber-400/20 hover:border-amber-400/40"
                    }`}
                  >
                    <Smartphone size={14} />
                    {pack.name} · {pack.credits} cr ·{" "}
                    {pack.price.toLocaleString()} ETB
                  </Button>
                </Link>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground/60 text-center mt-3">
              Pay with telebirr, CBE Birr, eBirr or M-Pesa via Chapa.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
