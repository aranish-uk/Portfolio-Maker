import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreatePortfolio } from "@/lib/portfolio";
import { portfolioInclude } from "@/lib/portfolio-data";
import { OnboardingForm } from "@/components/onboarding-form";

export default async function OnboardingPage() {
  const session = await getAuthSession();
  const portfolio = await getOrCreatePortfolio(session!.user!.id);
  const full = await prisma.portfolio.findUniqueOrThrow({
    where: { id: portfolio.id },
    include: portfolioInclude,
  });

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Onboarding Wizard</h1>
      <OnboardingForm initial={full} />
    </div>
  );
}
