
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CreditCard, PiggyBank, Landmark, TrendingUp, BadgeDollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Account {
  id: string;
  account_name: string;
  account_number: string;
  account_type: string;
  balance: number;
  available_balance: number;
  status: string;
  opened_date: string;
  interest_rate: number | null;
}

const accountTypeIcons = {
  checking: <CreditCard className="h-5 w-5" />,
  savings: <PiggyBank className="h-5 w-5" />,
  credit: <BadgeDollarSign className="h-5 w-5" />,
  investment: <TrendingUp className="h-5 w-5" />,
  loan: <Landmark className="h-5 w-5" />
};

const Accounts = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", user.id)
          .order("opened_date", { ascending: false });

        if (error) {
          throw error;
        }

        setAccounts(data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching accounts",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [user]);

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

  const filteredAccounts = activeTab === "all"
    ? accounts
    : accounts.filter(account => account.account_type === activeTab);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalAvailableBalance = accounts.reduce((sum, account) => sum + account.available_balance, 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Your Accounts</h1>
        <Button asChild>
          <Link to="/accounts/new">Open New Account</Link>
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Total Balance</CardTitle>
          <CardDescription>Summary of all your account balances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
              <h3 className="text-3xl font-bold">{formatCurrency(totalBalance)}</h3>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Available Balance</p>
              <h3 className="text-3xl font-bold">{formatCurrency(totalAvailableBalance)}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6 bg-white p-1 rounded-lg overflow-x-auto">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All Accounts</TabsTrigger>
              <TabsTrigger value="checking" className="flex-1">Checking</TabsTrigger>
              <TabsTrigger value="savings" className="flex-1">Savings</TabsTrigger>
              <TabsTrigger value="credit" className="flex-1">Credit</TabsTrigger>
              <TabsTrigger value="investment" className="flex-1">Investments</TabsTrigger>
              <TabsTrigger value="loan" className="flex-1">Loans</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {filteredAccounts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAccounts.map((account) => (
                  <Link to={`/accounts/${account.id}`} key={account.id}>
                    <Card className="hover:shadow-md transition-shadow h-full">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <div className="p-2 bg-primary/10 rounded-md mr-3">
                              {accountTypeIcons[account.account_type as keyof typeof accountTypeIcons] || <CreditCard className="h-5 w-5" />}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{account.account_name}</CardTitle>
                              <CardDescription>
                                •••• {account.account_number.slice(-4)}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {account.status}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(account.balance)}</div>
                        <div className="text-sm text-muted-foreground">
                          Available: {formatCurrency(account.available_balance)}
                        </div>
                        {account.interest_rate && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Interest Rate: {account.interest_rate}%
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="text-sm text-muted-foreground">
                        Opened: {formatDate(account.opened_date)}
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Accounts Found</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeTab === "all" ? (
                    <p>You don't have any bank accounts yet.</p>
                  ) : (
                    <p>You don't have any {activeTab} accounts yet.</p>
                  )}
                  <Button className="mt-4" asChild>
                    <Link to="/accounts/new">Open an Account</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  );
};

export default Accounts;
