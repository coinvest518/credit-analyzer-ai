import { motion } from "framer-motion";

const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const years = ["2024", "2023", "2022", "2021", "2020"];

// Generate random payment history
const generateHistory = () => {
  return years.map(() =>
    months.map(() => {
      const rand = Math.random();
      if (rand > 0.15) return "on-time";
      if (rand > 0.08) return "late";
      return "missed";
    })
  );
};

const statusStyles = {
  "on-time": "hsl(84, 81%, 44%)",
  late: "hsl(38, 92%, 50%)",
  missed: "hsl(0, 84%, 60%)",
  empty: "hsl(120, 10%, 93%)",
};

const PaymentHistoryGrid = () => {
  const history = generateHistory();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 shadow-card border"
      style={{ backgroundColor: "white", borderColor: "hsl(120, 10%, 90%)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "hsl(160, 30%, 10%)" }}>Payment History</h3>
        <span className="text-sm" style={{ color: "hsl(160, 10%, 45%)" }}>95% on-time payments</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-xs font-medium pb-3 text-left pr-4" style={{ color: "hsl(160, 10%, 45%)" }} />
              {months.map((month, i) => (
                <th key={i} className="text-xs font-medium pb-3 px-1 text-center" style={{ color: "hsl(160, 10%, 45%)" }}>
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map((year, yearIndex) => (
              <tr key={year}>
                <td className="text-xs font-medium pr-4 py-1.5" style={{ color: "hsl(160, 10%, 45%)" }}>{year}</td>
                {history[yearIndex].map((status, monthIndex) => (
                  <td key={monthIndex} className="px-1 py-1.5">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.2,
                        delay: yearIndex * 0.05 + monthIndex * 0.02,
                      }}
                      className="w-5 h-5 rounded-full mx-auto"
                      style={{ backgroundColor: statusStyles[status as keyof typeof statusStyles] }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t" style={{ borderColor: "hsl(120, 10%, 90%)" }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(84, 81%, 44%)" }} />
          <span className="text-xs" style={{ color: "hsl(160, 10%, 45%)" }}>On-time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(38, 92%, 50%)" }} />
          <span className="text-xs" style={{ color: "hsl(160, 10%, 45%)" }}>Late</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(0, 84%, 60%)" }} />
          <span className="text-xs" style={{ color: "hsl(160, 10%, 45%)" }}>Missed</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentHistoryGrid;
