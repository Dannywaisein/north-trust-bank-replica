
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, LifeBuoy, MessageSquare, PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  created_at: string;
}

const Support = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from("support_tickets")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setTickets(data || []);

        if (data && data.length > 0 && !selectedTicket) {
          setSelectedTicket(data[0]);
          fetchTicketMessages(data[0].id);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching tickets",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, selectedTicket]);

  const fetchTicketMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from("support_ticket_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      setTicketMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching messages",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleTicketSelection = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    fetchTicketMessages(ticket.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedTicket || !user) return;

    try {
      setSendingMessage(true);

      const { data, error } = await supabase
        .from("support_ticket_messages")
        .insert({
          ticket_id: selectedTicket.id,
          user_id: user.id,
          message: newMessage,
        })
        .select();

      if (error) {
        throw error;
      }

      setTicketMessages([...ticketMessages, data[0]]);
      setNewMessage("");

      // Update the ticket's updated_at timestamp
      await supabase
        .from("support_tickets")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", selectedTicket.id);

    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ticketSchema = z.object({
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    priority: z.enum(["low", "medium", "high", "critical"]),
  });

  const form = useForm<z.infer<typeof ticketSchema>>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      description: "",
      priority: "medium",
    },
  });

  const onSubmitTicket = async (data: z.infer<typeof ticketSchema>) => {
    try {
      if (!user) return;

      const { data: newTicket, error } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user.id,
          subject: data.subject,
          description: data.description,
          priority: data.priority,
        })
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Ticket created",
        description: "Your support ticket has been successfully created.",
      });

      setTickets([newTicket[0], ...tickets]);
      setSelectedTicket(newTicket[0]);
      setShowNewTicketForm(false);
      form.reset();
      
    } catch (error: any) {
      toast({
        title: "Error creating ticket",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Customer Support</h1>
        <p className="text-muted-foreground">
          Get help with your account or services
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Support Tickets</CardTitle>
              <Button size="sm" onClick={() => setShowNewTicketForm(true)}>
                <PlusCircle className="h-4 w-4 mr-1" />
                New Ticket
              </Button>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto p-0">
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : tickets.length > 0 ? (
                <div className="divide-y">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedTicket?.id === ticket.id
                          ? "bg-primary/5 border-l-4 border-primary"
                          : ""
                      }`}
                      onClick={() => handleTicketSelection(ticket)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{ticket.subject}</h3>
                        <Badge
                          className={`${getStatusColor(ticket.status)} capitalize`}
                          variant="secondary"
                        >
                          {ticket.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {ticket.description}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </span>
                        <Badge
                          className={`${getPriorityColor(ticket.priority)} capitalize`}
                          variant="secondary"
                        >
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !showNewTicketForm ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <LifeBuoy className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-1">No Support Tickets</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't created any support tickets yet
                  </p>
                  <Button onClick={() => setShowNewTicketForm(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Your First Ticket
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Ticket Details or New Ticket Form */}
        <div className="lg:col-span-2">
          {showNewTicketForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Create New Support Ticket</CardTitle>
                <CardDescription>
                  Describe your issue and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmitTicket)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Brief description of your issue"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detailed Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide as much detail as possible about your issue"
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewTicketForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Submit Ticket</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : selectedTicket ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <CardTitle className="text-xl">{selectedTicket.subject}</CardTitle>
                    <CardDescription>
                      Created on {formatDate(selectedTicket.created_at)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      className={`${getStatusColor(selectedTicket.status)} capitalize`}
                      variant="secondary"
                    >
                      {selectedTicket.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      className={`${getPriorityColor(selectedTicket.priority)} capitalize`}
                      variant="secondary"
                    >
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-2 flex-grow overflow-auto">
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {user?.user_metadata?.first_name?.[0] || "U"}
                        {user?.user_metadata?.last_name?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <span className="font-medium">
                            {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                          </span>
                          <span className="text-muted-foreground text-sm ml-2">
                            (You)
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(selectedTicket.created_at)}
                        </span>
                      </div>
                      <p className="mt-2 text-muted-foreground">
                        {selectedTicket.description}
                      </p>
                    </div>
                  </div>
                </div>

                {ticketMessages.length > 0 ? (
                  <div className="space-y-6">
                    {ticketMessages.map((message) => (
                      <div key={message.id} className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {message.user_id === user?.id
                              ? `${user?.user_metadata?.first_name?.[0] || "U"}${
                                  user?.user_metadata?.last_name?.[0] || ""
                                }`
                              : "BK"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <span className="font-medium">
                                {message.user_id === user?.id
                                  ? `${user?.user_metadata?.first_name || ""} ${
                                      user?.user_metadata?.last_name || ""
                                    }`
                                  : "Bank Support"}
                              </span>
                              {message.user_id === user?.id && (
                                <span className="text-muted-foreground text-sm ml-2">
                                  (You)
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                          <p className="mt-2">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                    <p>No messages yet.</p>
                    <p className="text-sm">Our team will respond to your ticket soon.</p>
                  </div>
                )}
              </CardContent>

              {selectedTicket.status !== "closed" &&
                selectedTicket.status !== "resolved" && (
                  <CardFooter className="pt-4">
                    <form
                      onSubmit={handleSendMessage}
                      className="w-full flex gap-2"
                    >
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here..."
                        disabled={sendingMessage}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!newMessage.trim() || sendingMessage}>
                        {sendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Send"
                        )}
                      </Button>
                    </form>
                  </CardFooter>
                )}
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center p-8">
                <LifeBuoy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Select a ticket or create a new one
                </h3>
                <p className="text-muted-foreground mb-4">
                  View your existing support conversations or start a new one
                </p>
                <Button onClick={() => setShowNewTicketForm(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Ticket
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support;
