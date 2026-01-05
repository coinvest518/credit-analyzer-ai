import { motion } from "framer-motion";
import StatsCard from "./StatsCard";
import CreditUsageChart from "./CreditUsageChart";
import PaymentHistoryGrid from "./PaymentHistoryGrid";
import AccountsTable from "./AccountsTable";

const DashboardPreview = () => {
  return (
    <section id="how-it-works" className="py-24" style={{ backgroundColor: "hsl(120, 20%, 98%)" }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "hsl(160, 30%, 10%)" }}>
            Your Credit Dashboard,{" "}
            <span className="text-gradient">Reimagined</span>
          </h2>
          <p className="text-lg" style={{ color: "hsl(160, 10%, 45%)" }}>
            Get a complete overview of your credit health with our intuitive dashboard. Track everything that matters.
          </p>
        </motion.div>

        {/* Stats Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatsCard
            title="Payment history"
            value="100%"
            impact="high"
            description="Percentage of payments you've made on time"
            delay={0}
          />
          <StatsCard
            title="Credit card use"
            value="2%"
            impact="high"
            description="How much credit you're using compared to limits"
            delay={0.1}
          />
          <StatsCard
            title="Derogatory marks"
            value="0"
            impact="high"
            description="Tax liens, bankruptcies or civil judgments"
            delay={0.2}
          />
          <StatsCard
            title="Credit age"
            value="7yrs"
            impact="medium"
            description="Average age of your open accounts"
            delay={0.3}
          />
          <StatsCard
            title="Total accounts"
            value="28"
            impact="low"
            description="Total open and closed accounts"
            delay={0.4}
          />
          <StatsCard
            title="Hard inquiries"
            value="3"
            impact="low"
            description="Number of times you've applied for credit"
            delay={0.5}
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <CreditUsageChart percentage={2} amount={1508} total={84301} />
          <PaymentHistoryGrid />
        </div>

        {/* Accounts Table */}
        <AccountsTable />
      </div>
    </section>
  );
};

export default DashboardPreview;
