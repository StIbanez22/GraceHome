export type Theme = 'light' | 'dark';
export type Language = 'en' | 'es' | 'sv' | 'fr';
export type Currency = 'USD' | 'EUR' | 'SEK' | 'CAD';

export type Screen = 'dashboard' | 'finances' | 'calendar' | 'shopping' | 'devotional' | 'settings';

export enum FinanceCategory {
    Tithe = 'Tithe',
    Offering = 'Offering',
    FirstFruits = 'First Fruits',
    Rent = 'Rent',
    Insurance = 'Insurance',
    Debt = 'Debt',
    Transport = 'Transport',
    Groceries = 'Groceries',
    Other = 'Other'
}

export interface Transaction {
    id: string;
    amount: number;
    date: string;
    category: FinanceCategory;
    notes: string;
}

export type Recurrence = 'none' | 'weekly' | 'monthly';

export interface CalendarEvent {
    id: string;
    name: string;
    date: string; // This is the start date
    description: string;
    recurring: Recurrence;
}

export interface ShoppingListItem {
    id: string;
    name: string;
    quantity: number;
    category: string;
    purchased: boolean;
}

export interface BudgetGoal {
    category: FinanceCategory;
    amount: number;
}
