
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Download,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  account_id: string;
  transaction_type: string;
  amount: number;
  balance_after_transaction: number;
  description: string;
  transaction_date: string;
  status: string;
  reference_number: string | null;
  recipient_account_id: string | null;
  recipient_external_account: string | null;
}

interface Account {
  id: string;
  account_name: string;
  account_number: string;
}

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [transactionType, setTransactionType] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        // Fetch accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from("accounts")
          .select("id, account_name, account_number")
          .eq("user_id", user.id);

        if (accountsError) throw accountsError;
        setAccounts(accountsData || []);

        // Fetch transactions for all accounts
        if (accountsData && accountsData.length > 0) {
          const accountIds = accountsData.map((acc) => acc.id);
          
          const { data: transactionsData, error: transactionsError } = await supabase
            .from("transactions")
            .select("*")
            .in("account_id", accountIds)
            .order("transaction_date", { ascending: false })
            .limit(100);

          if (transactionsError) throw transactionsError;
          setTransactions(transactionsData || []);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find((acc) => acc.id === accountId);
    return account ? account.account_name : "Unknown Account";
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
      case "refund":
      case "interest":
        return "text-green-600";
      case "withdrawal":
      case "payment":
      case "fee":
        return "text-red-600";
      case "transfer":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesAccount =
      selectedAccount === "all" || transaction.account_id === selectedAccount;
    const matchesType =
      transactionType === "all" || transaction.transaction_type === transactionType;
    const matchesSearch =
      searchTerm === "" ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const transactionDate = new Date(transaction.transaction_date);
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999); // Set to end of day
    
    const matchesDate = transactionDate >= fromDate && transactionDate <= toDate;

    return matchesAccount && matchesType && matchesSearch && matchesDate;
  });

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
        <p className="text-muted-foreground">
          View and search through your transaction history
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Account</label>
              <Select
                value={selectedAccount}
                onValueChange={setSelectedAccount}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.account_name} (•••• {account.account_number.slice(-4)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Type</label>
              <Select
                value={transactionType}
                onValueChange={setTransactionType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="transfer">Transfers</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="fee">Fees</SelectItem>
                  <SelectItem value="interest">Interest</SelectItem>
                  <SelectItem value="refund">Refunds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">From</label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">To</label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by description or reference number..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="sm:w-auto w-full">
                <Filter className="w-4 h-4 mr-2" /> Clear Filters
              </Button>
              <Button variant="outline" className="sm:w-auto w-full">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(transaction.transaction_date)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {getAccountName(transaction.account_id)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          {["deposit", "interest", "refund"].includes(transaction.transaction_type) ? (
                            <ArrowDown className="h-3 w-3 mr-1 text-green-600" />
                          ) : (
                            <ArrowUp className="h-3 w-3 mr-1 text-red-600" />
                          )}
                          <span className={getTransactionTypeColor(transaction.transaction_type)}>
                            {transaction.transaction_type.charAt(0).toUpperCase() +
                              transaction.transaction_type.slice(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-right whitespace-nowrap ${
                        ["deposit", "interest", "refund"].includes(transaction.transaction_type)
                          ? "text-green-600"
                          : "text-red-600"
                      }`}>
                        {["deposit", "interest", "refund"].includes(transaction.transaction_type)
                          ? "+"
                          : "-"}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {formatCurrency(transaction.balance_after_transaction)}
                      </TableCell>
                      <TableCell>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          getStatusBadgeColor(transaction.status)
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-2 inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">No transactions found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Transactions;
