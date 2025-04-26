
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { BarChart, PieChart } from "@/components/ui/chart";
import { Loader2, ArrowUp, ArrowDown, CreditCard, PiggyBank, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface Account {
  id: string;
  account_name: string;
  account_number: string;
  account_type: string;
  balance: number;
  available_balance: number;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string;
  transaction_date: string;
  status: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", user!.id);

        if (accountsError) throw accountsError;
        setAccounts(accountsData || []);

        // Fetch recent transactions for all accounts
        if (accountsData && accountsData.length > 0) {
          const accountIds = accountsData.map(acc => acc.id);
          
          const { data: transactionsData, error: transactionsError } = await supabase
            .from("transactions")
            .select("*")
            .in("account_id", accountIds)
            .order("transaction_date", { ascending: false })
            .limit(5);

          if (transactionsError) throw transactionsError;
          setTransactions(transactionsData || []);
        }

        // Fetch notifications
        const { data: notificationsData, error: notificationsError } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user!.id)
          .eq("is_read", false)
          .order("created_at", { ascending: false })
          .limit(5);

        if (notificationsError) throw notificationsError;
        setNotifications(notificationsData || []);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Sample data for charts
  const spendingData = {
    labels: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities'],
    datasets: [
      {
        label: 'Monthly Spending',
        data: [1200, 450, 300, 200, 150],
        backgroundColor: [
          'rgba(53, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgb(53, 162, 235)',
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(255, 99, 132)',
          'rgb(153, 102, 255)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const incomeExpenseData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [4000, 3900, 4100, 4200, 4300, 4100],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: [2100, 2300, 2500, 2200, 2400, 2300],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
    ],
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.user_metadata?.first_name || 'User'}</h1>
        <Button asChild>
          <Link to="/accounts">Manage Accounts</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Accounts Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <Link to={`/accounts/${account.id}`} key={account.id}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {account.account_type === "checking" && <CreditCard className="h-4 w-4" />}
                        {account.account_type === "savings" && <PiggyBank className="h-4 w-4" />}
                        {account.account_name}
                      </CardTitle>
                      <CardDescription>
                        •••• {account.account_number.slice(-4)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(account.balance)}</div>
                      <div className="text-sm text-muted-foreground">
                        Available: {formatCurrency(account.available_balance)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>No Accounts Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>You don't have any bank accounts yet.</p>
                  <Button className="mt-4" asChild>
                    <Link to="/accounts/new">Open an Account</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Recent Transactions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center pb-3 border-b">
                        <div className="flex items-center">
                          <div className={`mr-4 p-2 rounded-full ${
                            ['deposit', 'interest', 'refund'].includes(transaction.transaction_type) 
                            ? 'bg-green-100' 
                            : 'bg-red-100'
                          }`}>
                            {['deposit', 'interest', 'refund'].includes(transaction.transaction_type) ? (
                              <ArrowDown className={`h-4 w-4 text-green-600`} />
                            ) : (
                              <ArrowUp className={`h-4 w-4 text-red-600`} />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(transaction.transaction_date)}
                            </div>
                          </div>
                        </div>
                        <div className={`font-semibold ${
                          ['deposit', 'interest', 'refund'].includes(transaction.transaction_type) 
                          ? 'text-green-600' 
                          : 'text-red-600'
                        }`}>
                          {['deposit', 'interest', 'refund'].includes(transaction.transaction_type) ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/transactions">View All Transactions</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent transactions found.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="pb-3 border-b last:border-0">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {notification.message}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDate(notification.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No new notifications.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Financial Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Income vs. Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart data={incomeExpenseData} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Spending Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart data={spendingData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
