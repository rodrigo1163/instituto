import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePersonStep } from "@/app/providers/person-step-provider";
import { PERSON_STEPS } from "./person-step";

export function PersonStepFooter() {
  const { prevStep, currentStep, isSubmitting } = usePersonStep();
  
  return (
    <CardFooter className="flex justify-between pt-6 pb-4">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-1 transition-all duration-300 rounded-2xl"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "flex items-center gap-1 transition-all duration-300 rounded-2xl",
            currentStep === PERSON_STEPS.length - 1 ? "" : "",
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              {isSubmitting ? "Salvando..." : "Salvar"}
              {currentStep === PERSON_STEPS.length - 1 ? (
                <Check className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </>
          )}
        </Button>
      </motion.div>
    </CardFooter>
  );
}
