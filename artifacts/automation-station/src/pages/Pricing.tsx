import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useGetSubscriptionPlans, useCreateCheckoutSession } from "@workspace/api-client-react";
import { useAuth } from "@workspace/replit-auth-web";

export default function Pricing() {
  const { data: plansData, isLoading: plansLoading } = useGetSubscriptionPlans();
  const { mutate: checkout, isPending: checkoutPending } = useCreateCheckoutSession();
  const { isAuthenticated, login } = useAuth();

  const handleSubscribe = (priceId: string) => {
    if (!isAuthenticated) {
      login();
      return;
    }
    checkout({ data: { priceId } }, {
      onSuccess: (res) => {
        window.location.href = res.url;
      }
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Choose your automation power</h1>
          <p className="text-xl text-muted-foreground">
            Unlock the full potential of your PC with our curated script library or AI-generated custom automation.
          </p>
        </div>

        {plansLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plansData?.plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`glass p-8 rounded-3xl relative overflow-hidden flex flex-col ${
                  plan.name.toLowerCase().includes('pro') 
                    ? 'border-secondary/30 shadow-[0_0_40px_-10px_rgba(139,92,246,0.2)]' 
                    : ''
                }`}
              >
                {plan.name.toLowerCase().includes('pro') && (
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary to-secondary"></div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold font-display mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground min-h-[48px]">{plan.description}</p>
                </div>
                
                <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tight">${plan.amount / 100}</span>
                  <span className="text-muted-foreground font-medium">/{plan.interval}</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {(plan.features || []).map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-sm">
                      <div className="mt-0.5 rounded-full p-1 bg-primary/10 text-primary">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={checkoutPending}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    plan.name.toLowerCase().includes('pro')
                      ? 'bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/25 hover:shadow-secondary/40'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground neon-shadow neon-shadow-hover'
                  }`}
                >
                  {checkoutPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Subscribe Now"}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
