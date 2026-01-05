import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Account {
  dateOpened: string;
  name: string;
  accountNumber: string;
  balance: string;
  creditLimit: string;
  type: string;
  status: string;
  isNegative?: boolean;
}

const mockAccounts: Account[] = [
  {
    dateOpened: "22 Jan, 2020",
    name: "CHASE BANK",
    accountNumber: "3028526033****",
    balance: "$0",
    creditLimit: "None",
    type: "Open",
    status: "Open",
    isNegative: true,
  },
  {
    dateOpened: "15 Mar, 2021",
    name: "CAPITAL ONE",
    accountNumber: "4521876032****",
    balance: "$1,245",
    creditLimit: "$5,000",
    type: "Open",
    status: "Open",
  },
  {
    dateOpened: "08 Sep, 2019",
    name: "DISCOVER",
    accountNumber: "6011452178****",
    balance: "$450",
    creditLimit: "$3,500",
    type: "Open",
    status: "Open",
  },
];

const AccountsTable = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 shadow-card border overflow-hidden"
      style={{
        backgroundColor: "white",
        borderColor: "hsl(120, 10%, 90%)"
      }}
    >
      <div className="flex items-center gap-4 mb-6">
        <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "hsl(0, 84%, 90%)", color: "hsl(0, 84%, 30%)" }}>
          <span className="font-bold">3</span> Negative Accounts
        </span>
        <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "hsl(160, 30%, 10%)", color: "white" }}>
          <span className="font-bold">13</span> Business Assistance
        </span>
        <span className="text-xs font-medium px-3 py-1 rounded-full border" style={{ borderColor: "hsl(84, 81%, 44%)", color: "hsl(84, 81%, 44%)" }}>
          <span className="font-bold">0</span> Inquiries
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottomColor: "hsl(120, 10%, 90%)", borderBottomWidth: "1px" }}>
              <th className="text-left text-xs font-medium pb-3" style={{ color: "hsl(160, 10%, 45%)" }}>Date Open</th>
              <th className="text-left text-xs font-medium pb-3" style={{ color: "hsl(160, 10%, 45%)" }}>Name</th>
              <th className="text-left text-xs font-medium pb-3" style={{ color: "hsl(160, 10%, 45%)" }}>Account Number</th>
              <th className="text-left text-xs font-medium pb-3" style={{ color: "hsl(160, 10%, 45%)" }}>Balance</th>
              <th className="text-left text-xs font-medium pb-3" style={{ color: "hsl(160, 10%, 45%)" }}>Credit Limit</th>
              <th className="text-left text-xs font-medium pb-3" style={{ color: "hsl(160, 10%, 45%)" }}>Type</th>
              <th className="text-left text-xs font-medium pb-3" style={{ color: "hsl(160, 10%, 45%)" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockAccounts.map((account, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  borderBottomColor: "hsl(120, 10%, 90%)",
                  borderBottomWidth: index === mockAccounts.length - 1 ? "0px" : "1px"
                }}
              >
                <td className="py-4 text-sm" style={{ color: "hsl(160, 30%, 10%)" }}>{account.dateOpened}</td>
                <td className="py-4 text-sm font-medium" style={{ color: "hsl(160, 30%, 10%)" }}>{account.name}</td>
                <td className="py-4 text-sm font-mono" style={{ color: "hsl(160, 10%, 45%)" }}>{account.accountNumber}</td>
                <td className="py-4 text-sm" style={{ color: "hsl(160, 30%, 10%)" }}>{account.balance}</td>
                <td className="py-4 text-sm" style={{ color: "hsl(160, 10%, 45%)" }}>{account.creditLimit}</td>
                <td className="py-4 text-sm" style={{ color: "hsl(160, 30%, 10%)" }}>{account.type}</td>
                <td className="py-4 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "hsl(84, 70%, 90%)", color: "hsl(84, 81%, 30%)" }}>
                    {account.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4" style={{ borderTopColor: "hsl(120, 10%, 90%)", borderTopWidth: "1px" }}>
        <Button className="w-full" size="lg" style={{ backgroundColor: "hsl(84, 81%, 44%)", color: "white" }}>
          Start Disputing with AI
        </Button>
      </div>
    </motion.div>
  );
};

export default AccountsTable;
