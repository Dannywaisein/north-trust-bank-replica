
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  User,
  Building,
  CreditCard,
  ArrowRightLeft,
  Banknote,
  Loader2,
  Trash2,
  Plus,
  Check,
  MoreVertical,
  Calendar,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Account {
  id: string;
  account_name: string;
  account_number: string;
  account_type: string;
  balance: number;
  available_balance: number;
}

interface Beneficiary {
  id: string;
  beneficiary_name: string;
  account_number: string;
  bank_name: string;
  routing_number: string | null;
  is_favorite: boolean;
}

interface BillPayment {
  id: string;
  account_id: string;
  beneficiary_id: string;
  amount: number;
  payment_date: string;
  description: string | null;
  recurring: boolean;
  recurrence_pattern: string | null;
  status: string;
}

const Payments = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [scheduledPayments, setScheduledPayments] = useState<BillPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentsData = async () => {
      try {
        if (!user) return;

        // Fetch accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from("accounts")
          .select("id, account_name, account_number, account_type, balance, available_balance")
          .eq("user_id", user.id)
          .order("account_name", { ascending: true });

        if (accountsError) throw accountsError;
        setAccounts(accountsData || []);

        // Fetch beneficiaries
        const { data: beneficiariesData, error: beneficiariesError } = await supabase
          .from("beneficiaries")
          .select("*")
          .eq("user_id", user.id)
          .order("beneficiary_name", { ascending: true });

        if (beneficiariesError) throw beneficiariesError;
        setBeneficiaries(beneficiariesData || []);

        // Fetch scheduled bill payments
        if (accountsData && accountsData.length > 0) {
          const accountIds = accountsData.map((acc) => acc.id);
          
          const { data: paymentsData, error: paymentsError } = await supabase
            .from("bill_payments")
            .select("*")
            .in("account_id", accountIds)
            .order("payment_date", { ascending: true });

          if (paymentsError) throw paymentsError;
          setScheduledPayments(paymentsData || []);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching payments data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentsData();
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

  // Account selection form for transfers
  const transferSchema = z.object({
    fromAccount: z.string({ required_error: "Please select an account" }),
    toAccount: z.string({ required_error: "Please select a destination account" }),
    amount: z.number().min(0.01, "Amount must be greater than zero"),
    description: z.string().optional(),
    transferDate: z.date({ required_error: "Please select a date" }),
  });

  const transferForm = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromAccount: "",
      toAccount: "",
      amount: undefined,
      description: "",
      transferDate: new Date(),
    },
  });

  // Bill payment form
  const billPaymentSchema = z.object({
    account: z.string({ required_error: "Please select an account" }),
    beneficiary: z.string({ required_error: "Please select a beneficiary" }),
    amount: z.number().min(0.01, "Amount must be greater than zero"),
    description: z.string().optional(),
    paymentDate: z.date({ required_error: "Please select a date" }),
    recurring: z.boolean().default(false),
    recurrencePattern: z.string().optional(),
  });

  const billPaymentForm = useForm<z.infer<typeof billPaymentSchema>>({
    resolver: zodResolver(billPaymentSchema),
    defaultValues: {
      account: "",
      beneficiary: "",
      amount: undefined,
      description: "",
      paymentDate: new Date(),
      recurring: false,
      recurrencePattern: "",
    },
  });

  // Beneficiary form
  const beneficiarySchema = z.object({
    name: z.string().min(2, "Name is required"),
    accountNumber: z.string().min(6, "Valid account number is required"),
    bankName: z.string().min(2, "Bank name is required"),
    routingNumber: z.string().optional(),
    favorite: z.boolean().default(false),
  });

  const beneficiaryForm = useForm<z.infer<typeof beneficiarySchema>>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: {
      name: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      favorite: false,
    },
  });

  const onTransferSubmit = async (data: z.infer<typeof transferSchema>) => {
    try {
      if (!user) return;

      // Get account details
      const fromAccount = accounts.find(acc => acc.id === data.fromAccount);
      const toAccount = accounts.find(acc => acc.id === data.toAccount);

      if (!fromAccount || !toAccount) {
        toast({
          title: "Error",
          description: "Invalid account selection",
          variant: "destructive",
        });
        return;
      }

      if (fromAccount.available_balance < data.amount) {
        toast({
          title: "Insufficient funds",
          description: "You don't have enough available balance for this transfer",
          variant: "destructive",
        });
        return;
      }

      // First create the withdrawal transaction
      const { data: withdrawalData, error: withdrawalError } = await supabase
        .from("transactions")
        .insert({
          account_id: fromAccount.id,
          transaction_type: "transfer",
          amount: data.amount,
          description: `Transfer to ${toAccount.account_name} ${data.description ? '- ' + data.description : ''}`,
          status: "completed",
          recipient_account_id: toAccount.id,
          balance_after_transaction: fromAccount.balance - data.amount,
        })
        .select();

      if (withdrawalError) throw withdrawalError;

      // Then create the deposit transaction
      const { error: depositError } = await supabase
        .from("transactions")
        .insert({
          account_id: toAccount.id,
          transaction_type: "deposit",
          amount: data.amount,
          description: `Transfer from ${fromAccount.account_name} ${data.description ? '- ' + data.description : ''}`,
          status: "completed",
          balance_after_transaction: toAccount.balance + data.amount,
        });

      if (depositError) throw depositError;

      // Update account balances
      const { error: fromAccountError } = await supabase
        .from("accounts")
        .update({
          balance: fromAccount.balance - data.amount,
          available_balance: fromAccount.available_balance - data.amount,
        })
        .eq("id", fromAccount.id);

      if (fromAccountError) throw fromAccountError;

      const { error: toAccountError } = await supabase
        .from("accounts")
        .update({
          balance: toAccount.balance + data.amount,
          available_balance: toAccount.available_balance + data.amount,
        })
        .eq("id", toAccount.id);

      if (toAccountError) throw toAccountError;

      toast({
        title: "Transfer successful",
        description: `You've transferred ${formatCurrency(data.amount)} to ${toAccount.account_name}`,
      });

      // Reset form
      transferForm.reset();

      // Refresh account data
      const { data: updatedAccounts, error: accountsError } = await supabase
        .from("accounts")
        .select("id, account_name, account_number, account_type, balance, available_balance")
        .eq("user_id", user.id);

      if (accountsError) throw accountsError;
      setAccounts(updatedAccounts || []);

    } catch (error: any) {
      toast({
        title: "Error processing transfer",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onBillPaymentSubmit = async (data: z.infer<typeof billPaymentSchema>) => {
    try {
      if (!user) return;

      // Get account details
      const account = accounts.find(acc => acc.id === data.account);
      const beneficiary = beneficiaries.find(ben => ben.id === data.beneficiary);

      if (!account || !beneficiary) {
        toast({
          title: "Error",
          description: "Invalid account or beneficiary selection",
          variant: "destructive",
        });
        return;
      }

      if (account.available_balance < data.amount) {
        toast({
          title: "Insufficient funds",
          description: "You don't have enough available balance for this payment",
          variant: "destructive",
        });
        return;
      }

      // Create bill payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from("bill_payments")
        .insert({
          account_id: account.id,
          beneficiary_id: beneficiary.id,
          amount: data.amount,
          description: data.description || `Payment to ${beneficiary.beneficiary_name}`,
          payment_date: data.paymentDate.toISOString(),
          recurring: data.recurring,
          recurrence_pattern: data.recurring ? data.recurrencePattern : null,
          status: "scheduled",
        })
        .select();

      if (paymentError) throw paymentError;

      toast({
        title: "Payment scheduled",
        description: `Payment of ${formatCurrency(data.amount)} to ${beneficiary.beneficiary_name} has been scheduled`,
      });

      // Reset form
      billPaymentForm.reset();

      // Refresh scheduled payments
      setScheduledPayments([...(paymentData || []), ...scheduledPayments]);

    } catch (error: any) {
      toast({
        title: "Error scheduling payment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onBeneficiarySubmit = async (data: z.infer<typeof beneficiarySchema>) => {
    try {
      if (!user) return;

      const { data: newBeneficiary, error } = await supabase
        .from("beneficiaries")
        .insert({
          user_id: user.id,
          beneficiary_name: data.name,
          account_number: data.accountNumber,
          bank_name: data.bankName,
          routing_number: data.routingNumber || null,
          is_favorite: data.favorite,
        })
        .select();

      if (error) throw error;

      toast({
        title: "Beneficiary added",
        description: `${data.name} has been added to your beneficiaries`,
      });

      setBeneficiaries([...(newBeneficiary || []), ...beneficiaries]);
      setShowAddBeneficiary(false);
      beneficiaryForm.reset();

    } catch (error: any) {
      toast({
        title: "Error adding beneficiary",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const confirmDeletePayment = (paymentId: string) => {
    setPaymentToDelete(paymentId);
    setDeleteConfirmOpen(true);
  };

  const handleDeletePayment = async () => {
    try {
      if (!paymentToDelete) return;

      const { error } = await supabase
        .from("bill_payments")
        .delete()
        .eq("id", paymentToDelete);

      if (error) throw error;

      toast({
        title: "Payment cancelled",
        description: "The scheduled payment has been cancelled",
      });

      setScheduledPayments(scheduledPayments.filter(payment => payment.id !== paymentToDelete));
    } catch (error: any) {
      toast({
        title: "Error cancelling payment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setPaymentToDelete(null);
    }
  };

  const isRecurringPayment = billPaymentForm.watch("recurring");

  const getAccountById = (accountId: string) => {
    return accounts.find(account => account.id === accountId);
  };

  const getBeneficiaryById = (beneficiaryId: string) => {
    return beneficiaries.find(beneficiary => beneficiary.id === beneficiaryId);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Payments & Transfers</h1>
        <p className="text-muted-foreground">
          Manage your transfers, bill payments, and beneficiaries
        </p>
      </div>

      <Tabs defaultValue="transfer" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="transfer" className="flex-1">
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Transfers
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex-1">
            <Banknote className="h-4 w-4 mr-2" />
            Bill Payments
          </TabsTrigger>
          <TabsTrigger value="beneficiaries" className="flex-1">
            <User className="h-4 w-4 mr-2" />
            Beneficiaries
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Scheduled Payments
          </TabsTrigger>
        </TabsList>

        {/* Transfer between accounts tab */}
        <TabsContent value="transfer">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Transfer Between Accounts</CardTitle>
                <CardDescription>
                  Move money between your North Trust accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {accounts.length < 2 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-1">
                      You need at least two accounts to make a transfer
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Open another account to start making transfers
                    </p>
                    <Button>Open a New Account</Button>
                  </div>
                ) : (
                  <Form {...transferForm}>
                    <form
                      onSubmit={transferForm.handleSubmit(onTransferSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={transferForm.control}
                        name="fromAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>From Account</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {accounts.map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.account_name} (•••• {account.account_number.slice(-4)}) - {formatCurrency(account.available_balance)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={transferForm.control}
                        name="toAccount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>To Account</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select destination account" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {accounts
                                  .filter(account => account.id !== transferForm.getValues("fromAccount"))
                                  .map((account) => (
                                    <SelectItem key={account.id} value={account.id}>
                                      {account.account_name} (•••• {account.account_number.slice(-4)})
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={transferForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                  $
                                </span>
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  className="pl-8"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value ? parseFloat(value) : undefined);
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={transferForm.control}
                        name="transferDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Transfer Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={`w-full pl-3 text-left font-normal ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Select the date for this transfer
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={transferForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Add a note for this transfer"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button type="submit">
                          Complete Transfer
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Accounts</CardTitle>
                <CardDescription>
                  Available balances for transfers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex justify-between items-center p-3 border rounded-md"
                    >
                      <div>
                        <div className="font-medium">{account.account_name}</div>
                        <div className="text-sm text-muted-foreground">
                          •••• {account.account_number.slice(-4)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {formatCurrency(account.available_balance)}
                        </div>
                        <div className="text-xs text-muted-foreground">Available</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Bill Payments tab */}
        <TabsContent value="payments">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Pay Bills</CardTitle>
                <CardDescription>
                  Schedule payments to your beneficiaries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {beneficiaries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <User className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg mb-1">
                      No beneficiaries found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Add a beneficiary to start making payments
                    </p>
                    <Button onClick={() => setShowAddBeneficiary(true)}>
                      Add a Beneficiary
                    </Button>
                  </div>
                ) : (
                  <Form {...billPaymentForm}>
                    <form
                      onSubmit={billPaymentForm.handleSubmit(onBillPaymentSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={billPaymentForm.control}
                        name="account"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>From Account</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {accounts.map((account) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.account_name} (•••• {account.account_number.slice(-4)}) - {formatCurrency(account.available_balance)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={billPaymentForm.control}
                        name="beneficiary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pay To</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select beneficiary" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {beneficiaries.map((beneficiary) => (
                                  <SelectItem key={beneficiary.id} value={beneficiary.id}>
                                    {beneficiary.beneficiary_name} - {beneficiary.bank_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={billPaymentForm.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                  $
                                </span>
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  className="pl-8"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value ? parseFloat(value) : undefined);
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={billPaymentForm.control}
                        name="paymentDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Payment Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={`w-full pl-3 text-left font-normal ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Select when this payment should be processed
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={billPaymentForm.control}
                        name="recurring"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="h-4 w-4"
                                />
                                <div>
                                  <FormLabel>Recurring Payment</FormLabel>
                                  <FormDescription>
                                    Set up an automatic recurring payment
                                  </FormDescription>
                                </div>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {isRecurringPayment && (
                        <FormField
                          control={billPaymentForm.control}
                          name="recurrencePattern"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recurrence Pattern</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="biweekly">Every 2 Weeks</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                  <SelectItem value="quarterly">Quarterly</SelectItem>
                                  <SelectItem value="annually">Annually</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={billPaymentForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Add a note for this payment"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button type="submit">
                          Schedule Payment
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Beneficiaries</CardTitle>
                <CardDescription>
                  Your recently used payment recipients
                </CardDescription>
              </CardHeader>
              <CardContent>
                {beneficiaries.length > 0 ? (
                  <div className="space-y-4">
                    {beneficiaries
                      .filter((b) => b.is_favorite)
                      .slice(0, 5)
                      .map((beneficiary) => (
                        <div
                          key={beneficiary.id}
                          className="flex justify-between items-center p-3 border rounded-md"
                        >
                          <div>
                            <div className="font-medium">
                              {beneficiary.beneficiary_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {beneficiary.bank_name}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              billPaymentForm.setValue("beneficiary", beneficiary.id);
                              document
                                .getElementById("payments-tab")
                                ?.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            Pay
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>You haven't added any beneficiaries yet.</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setShowAddBeneficiary(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Beneficiary
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Beneficiaries tab */}
        <TabsContent value="beneficiaries">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Beneficiaries</CardTitle>
                <CardDescription>
                  Manage your payment recipients
                </CardDescription>
              </div>
              <Button onClick={() => setShowAddBeneficiary(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Beneficiary
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : beneficiaries.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Routing Number</TableHead>
                      <TableHead>Favorite</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beneficiaries.map((beneficiary) => (
                      <TableRow key={beneficiary.id}>
                        <TableCell>{beneficiary.beneficiary_name}</TableCell>
                        <TableCell>{beneficiary.bank_name}</TableCell>
                        <TableCell>
                          •••• {beneficiary.account_number.slice(-4)}
                        </TableCell>
                        <TableCell>
                          {beneficiary.routing_number
                            ? `•••• ${beneficiary.routing_number.slice(-4)}`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {beneficiary.is_favorite ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            ""
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  billPaymentForm.setValue("beneficiary", beneficiary.id);
                                  document.getElementById("payments-tab")?.click();
                                }}
                              >
                                Pay
                              </DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Beneficiaries</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't added any payment recipients yet
                  </p>
                  <Button onClick={() => setShowAddBeneficiary(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Beneficiary
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {showAddBeneficiary && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Add New Beneficiary</CardTitle>
                <CardDescription>
                  Enter the details of your payment recipient
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...beneficiaryForm}>
                  <form
                    onSubmit={beneficiaryForm.handleSubmit(onBeneficiarySubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={beneficiaryForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Beneficiary Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe or Company Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={beneficiaryForm.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Bank of America" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={beneficiaryForm.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Account Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={beneficiaryForm.control}
                        name="routingNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Routing Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Routing Number" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={beneficiaryForm.control}
                      name="favorite"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4"
                              />
                              <div>
                                <FormLabel>Mark as Favorite</FormLabel>
                                <FormDescription>
                                  Add this beneficiary to your favorites list
                                </FormDescription>
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddBeneficiary(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        Save Beneficiary
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Scheduled Payments tab */}
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming & Scheduled Payments</CardTitle>
              <CardDescription>
                View and manage your scheduled bill payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : scheduledPayments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>From Account</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recurring</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledPayments.map((payment) => {
                      const account = getAccountById(payment.account_id);
                      const beneficiary = getBeneficiaryById(payment.beneficiary_id);
                      
                      return (
                        <TableRow key={payment.id}>
                          <TableCell>{formatDate(payment.payment_date)}</TableCell>
                          <TableCell>{beneficiary?.beneficiary_name || "Unknown"}</TableCell>
                          <TableCell>{account?.account_name || "Unknown"}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>
                            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                              ${
                                payment.status === "scheduled"
                                  ? "bg-blue-100 text-blue-800"
                                  : payment.status === "processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : payment.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {payment.recurring ? (
                              <span className="inline-flex items-center">
                                <Check className="h-4 w-4 mr-1 text-green-500" />
                                {payment.recurrence_pattern}
                              </span>
                            ) : (
                              "No"
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {payment.status === "scheduled" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:text-red-500"
                                onClick={() => confirmDeletePayment(payment.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Scheduled Payments</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any upcoming payments
                  </p>
                  <Button onClick={() => document.getElementById("payments-tab")?.click()}>
                    Schedule a Payment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this scheduled payment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Payment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePayment}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Payments;
