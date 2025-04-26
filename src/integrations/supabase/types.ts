export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          account_name: string
          account_number: string
          account_type: Database["public"]["Enums"]["account_type"]
          available_balance: number
          balance: number
          created_at: string | null
          id: string
          interest_rate: number | null
          last_activity_date: string | null
          opened_date: string | null
          status: Database["public"]["Enums"]["account_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          account_type: Database["public"]["Enums"]["account_type"]
          available_balance?: number
          balance?: number
          created_at?: string | null
          id?: string
          interest_rate?: number | null
          last_activity_date?: string | null
          opened_date?: string | null
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          account_type?: Database["public"]["Enums"]["account_type"]
          available_balance?: number
          balance?: number
          created_at?: string | null
          id?: string
          interest_rate?: number | null
          last_activity_date?: string | null
          opened_date?: string | null
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      beneficiaries: {
        Row: {
          account_number: string
          bank_name: string
          beneficiary_name: string
          created_at: string | null
          id: string
          is_favorite: boolean | null
          routing_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_number: string
          bank_name: string
          beneficiary_name: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          routing_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_number?: string
          bank_name?: string
          beneficiary_name?: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          routing_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bill_payments: {
        Row: {
          account_id: string
          amount: number
          beneficiary_id: string | null
          created_at: string | null
          description: string | null
          id: string
          payment_date: string
          recurrence_pattern: string | null
          recurring: boolean | null
          status: Database["public"]["Enums"]["bill_payment_status"] | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_id: string
          amount: number
          beneficiary_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          payment_date: string
          recurrence_pattern?: string | null
          recurring?: boolean | null
          status?: Database["public"]["Enums"]["bill_payment_status"] | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          amount?: number
          beneficiary_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          payment_date?: string
          recurrence_pattern?: string | null
          recurring?: boolean | null
          status?: Database["public"]["Enums"]["bill_payment_status"] | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_payments_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_payments_beneficiary_id_fkey"
            columns: ["beneficiary_id"]
            isOneToOne: false
            referencedRelation: "beneficiaries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          account_id: string
          card_holder_name: string
          card_number: string
          card_type: Database["public"]["Enums"]["card_type"]
          created_at: string | null
          cvv: string
          daily_limit: number | null
          expiry_date: string
          id: string
          status: Database["public"]["Enums"]["card_status"] | null
          updated_at: string | null
        }
        Insert: {
          account_id: string
          card_holder_name: string
          card_number: string
          card_type: Database["public"]["Enums"]["card_type"]
          created_at?: string | null
          cvv: string
          daily_limit?: number | null
          expiry_date: string
          id?: string
          status?: Database["public"]["Enums"]["card_status"] | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          card_holder_name?: string
          card_number?: string
          card_type?: Database["public"]["Enums"]["card_type"]
          created_at?: string | null
          cvv?: string
          daily_limit?: number | null
          expiry_date?: string
          id?: string
          status?: Database["public"]["Enums"]["card_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cards_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          related_entity_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          related_entity_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: Database["public"]["Enums"]["notification_type"]
          related_entity_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      statements: {
        Row: {
          account_id: string
          closing_balance: number
          created_at: string | null
          end_date: string
          id: string
          opening_balance: number
          pdf_url: string | null
          start_date: string
          statement_date: string
        }
        Insert: {
          account_id: string
          closing_balance: number
          created_at?: string | null
          end_date: string
          id?: string
          opening_balance: number
          pdf_url?: string | null
          start_date: string
          statement_date: string
        }
        Update: {
          account_id?: string
          closing_balance?: number
          created_at?: string | null
          end_date?: string
          id?: string
          opening_balance?: number
          pdf_url?: string | null
          start_date?: string
          statement_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "statements_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      support_ticket_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          ticket_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          balance_after_transaction: number
          created_at: string | null
          description: string | null
          id: string
          recipient_account_id: string | null
          recipient_external_account: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_date: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          account_id: string
          amount: number
          balance_after_transaction: number
          created_at?: string | null
          description?: string | null
          id?: string
          recipient_account_id?: string | null
          recipient_external_account?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_date?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          account_id?: string
          amount?: number
          balance_after_transaction?: number
          created_at?: string | null
          description?: string | null
          id?: string
          recipient_account_id?: string | null
          recipient_external_account?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_date?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_recipient_account_id_fkey"
            columns: ["recipient_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { role_name: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
    }
    Enums: {
      account_status: "active" | "inactive" | "frozen" | "closed"
      account_type: "checking" | "savings" | "credit" | "investment" | "loan"
      bill_payment_status: "scheduled" | "processing" | "completed" | "failed"
      card_status: "active" | "inactive" | "blocked" | "expired"
      card_type: "debit" | "credit"
      notification_type:
        | "transaction_alert"
        | "security_alert"
        | "account_update"
        | "promotion"
        | "bill_reminder"
        | "other"
      ticket_priority: "low" | "medium" | "high" | "critical"
      ticket_status: "open" | "in_progress" | "resolved" | "closed"
      transaction_status:
        | "pending"
        | "completed"
        | "failed"
        | "cancelled"
        | "rejected"
      transaction_type:
        | "deposit"
        | "withdrawal"
        | "transfer"
        | "payment"
        | "fee"
        | "interest"
        | "refund"
        | "adjustment"
      user_role: "customer" | "banker" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["active", "inactive", "frozen", "closed"],
      account_type: ["checking", "savings", "credit", "investment", "loan"],
      bill_payment_status: ["scheduled", "processing", "completed", "failed"],
      card_status: ["active", "inactive", "blocked", "expired"],
      card_type: ["debit", "credit"],
      notification_type: [
        "transaction_alert",
        "security_alert",
        "account_update",
        "promotion",
        "bill_reminder",
        "other",
      ],
      ticket_priority: ["low", "medium", "high", "critical"],
      ticket_status: ["open", "in_progress", "resolved", "closed"],
      transaction_status: [
        "pending",
        "completed",
        "failed",
        "cancelled",
        "rejected",
      ],
      transaction_type: [
        "deposit",
        "withdrawal",
        "transfer",
        "payment",
        "fee",
        "interest",
        "refund",
        "adjustment",
      ],
      user_role: ["customer", "banker", "admin"],
    },
  },
} as const
