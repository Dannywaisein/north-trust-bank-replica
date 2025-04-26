
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUp,
  ArrowDown,
  Loader2,
  Download,
  CreditCard,
  PiggyBank,
  TrendingUp,
  BadgeDollarSign,
  Landmark,
  ArrowRightLeft,
  FileText,
  ShieldCheck,
} from "lucide-react";
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
  last_activity_date: string;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string;
  transaction_date: string;
  status: string;
  balance_after_transaction: number;
}

interface Statement {
  id: string;
  statement_date: string;
  start_date: string;
  end_date: string;
  opening_balance: number;
  closing_balance: number;
  pdf_url: string | null;
}

interface Card {
  id: string;
  card_number: string;
  card_holder_name: string;
  card_type: string;
  expiry_date: string;
  status: string;
  daily_limit: number | null;
}

const accountTypeIcons = {
  checking: <CreditCard className="h-5 w-5" />,
  savings: <PiggyBank className="h-5 w-5" />,
  credit: <BadgeDollarSign className="h-5 w-5" />,
  investment: <TrendingUp className="h-5 w-5" />,
  loan: <Landmark className="h-5 w-5" />
};

const AccountDetails = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { user } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!accountId || !user) return;

      try {
        // Fetch account details
        const { data: accountData, error: accountError } = await supabase
          .from("accounts")
          .select("*")
          .eq("id", accountId)
          .eq("user_id", user.id)
          .single();

        if (accountError) {
          throw accountError;
        }

        if (!accountData) {
          toast({
            title: "Account not found",
            description: "The requested account does not exist or you don't have access to it.",
            variant: "destructive",
          });
          return;
        }

        setAccount(accountData);

        // Fetch recent transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from("transactions")
          .select("*")
          .eq("account_id", accountId)
          .order("transaction_date", { ascending: false })
          .limit(10);

        if (transactionsError) throw transactionsError;
        setTransactions(transactionsData || []);

        // Fetch statements
        const { data: statementsData, error: statementsError } = await supabase
          .from("statements")
          .select("*")
          .eq("account_id", accountId)
          .order("statement_date", { ascending: false });

        if (statementsError) throw statementsError;
        setStatements(statementsData || []);

        // Fetch associated cards
        const { data: cardsData, error: cardsError } = await supabase
          .from("cards")
          .select("*")
          .eq("account_id", accountId);

        if (cardsError) throw cardsError;
        setCards(cardsData || []);
      } catch (error: any) {
        toast({
          title: "Error fetching account details",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [accountId, user]);

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!account) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Account Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The account you are looking for does not exist or you don't have access to it.
          </p>
          <Button asChild>
            <Link to="/accounts">Back to Accounts</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const accountTypeIcon = accountTypeIcons[account.account_type as keyof typeof accountTypeIcons] || 
    <CreditCard className="h-5 w-5" />;

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <Link to="/accounts" className="text-sm text-primary hover:underline flex items-center mb-2">
            <ArrowDown className="h-4 w-4 mr-1 rotate-90" />
            Back to Accounts
          </Link>
          <h1 className="text-3xl font-bold">{account.account_name}</h1>
          <p className="text-muted-foreground">
            Account Number: •••• {account.account_number.slice(-4)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Statement
          </Button>
          <Button>
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Make a Transfer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(account.balance)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(account.available_balance)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Account Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-md mr-3">
                {accountTypeIcon}
              </div>
              <div className="text-lg font-medium capitalize">{account.account_type}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full ${
                account.status === "active" ? "bg-green-500" : 
                account.status === "inactive" ? "bg-amber-500" : 
                "bg-red-500"
              } mr-2`}></div>
              <div className="text-lg font-medium capitalize">{account.status}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="transactions" className="flex-1">Transactions</TabsTrigger>
          <TabsTrigger value="cards" className="flex-1">Cards</TabsTrigger>
          <TabsTrigger value="statements" className="flex-1">Statements</TabsTrigger>
          <TabsTrigger value="details" className="flex-1">Account Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="outline" asChild size="sm">
                <Link to={`/transactions?account=${accountId}`}>
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {transactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(transaction.transaction_date)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {transaction.description}
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No recent transactions for this account.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          <Card>
            <CardHeader>
              <CardTitle>Card Information</CardTitle>
              <CardDescription>Cards linked to this account</CardDescription>
            </CardHeader>
            <CardContent>
              {cards.length > 0 ? (
                <div className="space-y-6">
                  {cards.map((card) => (
                    <div key={card.id} className="bg-white border rounded-lg p-6 shadow-sm">
                      <div className="bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg p-6 mb-6">
                        <div className="flex justify-between">
                          <div>
                            <div className="text-sm opacity-80">North Trust Bank</div>
                            <div className="text-xl mt-6 font-mono">
                              •••• •••• •••• {card.card_number.slice(-4)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="uppercase text-sm opacity-80">{card.card_type}</div>
                            <div className="mt-6">
                              <ShieldCheck className="h-8 w-8 inline-block" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 flex justify-between items-end">
                          <div>
                            <div className="text-xs opacity-80">Card Holder</div>
                            <div className="font-medium">{card.card_holder_name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs opacity-80">Expires</div>
                            <div>
                              {new Date(card.expiry_date).toLocaleDateString("en-US", {
                                month: "2-digit",
                                year: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Status</div>
                          <div className="flex items-center mt-1">
                            <div className={`h-2 w-2 rounded-full ${
                              card.status === "active" ? "bg-green-500" : 
                              card.status === "inactive" ? "bg-amber-500" :
                              "bg-red-500"
                            } mr-2`}></div>
                            <div className="capitalize">{card.status}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Card Type</div>
                          <div className="mt-1 capitalize">{card.card_type}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Daily Limit</div>
                          <div className="mt-1">{card.daily_limit ? formatCurrency(card.daily_limit) : "N/A"}</div>
                        </div>
                      </div>
                      <div className="flex space-x-3 mt-6">
                        <Button variant="outline" size="sm">Manage Card</Button>
                        <Button variant="destructive" size="sm">Block Card</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No cards linked to this account.</p>
                  <Button>Request a Card</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements">
          <Card>
            <CardHeader>
              <CardTitle>Account Statements</CardTitle>
              <CardDescription>Download or view your previous statements</CardDescription>
            </CardHeader>
            <CardContent>
              {statements.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Date Issued</TableHead>
                      <TableHead className="text-right">Opening Balance</TableHead>
                      <TableHead className="text-right">Closing Balance</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statements.map((statement) => (
                      <TableRow key={statement.id}>
                        <TableCell>
                          {formatDate(statement.start_date)} - {formatDate(statement.end_date)}
                        </TableCell>
                        <TableCell>{formatDate(statement.statement_date)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(statement.opening_balance)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(statement.closing_balance)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            View PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No statements available for this account yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Complete information about your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Account Name</dt>
                      <dd className="mt-1">{account.account_name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Account Number</dt>
                      <dd className="mt-1">{account.account_number}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Account Type</dt>
                      <dd className="mt-1 capitalize">{account.account_type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                      <dd className="mt-1 capitalize">{account.status}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Date Opened</dt>
                      <dd className="mt-1">{formatDate(account.opened_date)}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Financial Information</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Current Balance</dt>
                      <dd className="mt-1 text-lg font-semibold">{formatCurrency(account.balance)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Available Balance</dt>
                      <dd className="mt-1 text-lg">{formatCurrency(account.available_balance)}</dd>
                    </div>
                    {account.interest_rate && (
                      <div>
                        <dt className="text-sm font-medium text-muted-foreground">Interest Rate</dt>
                        <dd className="mt-1">{account.interest_rate}% APY</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Last Activity</dt>
                      <dd className="mt-1">{formatDate(account.last_activity_date)}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Make a Transfer
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Statement
                  </Button>
                  <Button variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Request a Card
                  </Button>
                  <Button variant="destructive">
                    Close Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AccountDetails;
