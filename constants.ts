import type { Language, Currency, Screen } from './types';

export const LANGUAGES: { code: Language; name: string }[] = [
    { code: 'sv', name: 'Svenska' },
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
];

export const CURRENCIES: { code: Currency; symbol: string }[] = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'SEK', symbol: 'kr' },
    { code: 'CAD', symbol: 'C$' },
];

export const NAV_ITEMS: { id: Screen; icon: string; }[] = [
    { id: 'dashboard', icon: 'home' },
    { id: 'calendar', icon: 'calendar' },
    { id: 'finances', icon: 'currency' },
    { id: 'shopping', icon: 'cart' },
    { id: 'devotional', icon: 'book' },
    { id: 'settings', icon: 'cog' },
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
    en: {
        // Login
        'gracehome_welcome': 'Welcome to GraceHome',
        'email': 'Email',
        'password': 'Password',
        'login': 'Log In',
        'forgot_password': 'Forgot your password?',
        
        // Navigation
        'dashboard': 'Dashboard',
        'calendar': 'Calendar',
        'finances': 'Finances',
        'shopping': 'Shopping List',
        'devotional': 'Devotional',
        'settings': 'Settings',

        // Dashboard
        'welcome_user': 'Welcome back,',
        'todays_verse': 'Today\'s Verse',
        'todays_verse_prompt': 'Give me an inspiring bible verse for today, just the verse and its reference.',
        'budget_overview': 'Budget Overview',
        'total_spent_vs_budgeted': 'Total Spent vs. Budgeted this month',
        'no_budget_set': 'No budget set for this month.',
        'upcoming_events': 'Upcoming Events',

        // Finances
        'add_transaction': 'Add Transaction',
        'edit_transaction': 'Edit Transaction',
        'amount': 'Amount',
        'date': 'Date',
        'category': 'Category',
        'notes': 'Notes',
        'save_record': 'Save Record',
        'update_record': 'Update Record',
        'recent_transactions': 'Recent Transactions',
        'actions': 'Actions',
        'tithe': 'Tithe',
        'offering': 'Offering',
        'first_fruits': 'First Fruits',
        'rent': 'Rent',
        'insurance': 'Insurance',
        'debt': 'Debt',
        'transport': 'Transport',
        'groceries': 'Groceries',
        'other': 'Other',
        'monthly_budgets': 'Monthly Budgets',
        'manage_budgets': 'Manage Budgets',
        'edit_budgets_for': 'Edit Budgets for',
        'budget_goal': 'Budget Goal',
        'set_goal': 'Set Goal',
        'update_goal': 'Update Goal',
        'spent_of': '{spent} of {total}',
        'no_budgets_set': 'No Budgets Set',
        'add_first_budget': 'Click "Manage Budgets" to add your first one.',

        // Calendar
        'add_event': 'Add Event',
        'event_name': 'Event Name',
        'description': 'Description',
        'recurring_event': 'Recurring Event',
        
        // Shopping List
        'add_item': 'Add Item',
        'item_name': 'Item Name',
        'quantity': 'Quantity',
        'add_to_list': 'Add to List',
        'purchased_items': 'Purchased Items',

        // Devotional
        'financial_study': 'Financial Study: God\'s Way',
        'study_mode': 'Study Mode',
        'review_mode': 'Review Mode',

        // Settings
        'language': 'Language',
        'currency': 'Currency',
        'theme': 'Theme',
        'light_mode': 'Light Mode',
        'dark_mode': 'Dark Mode',
    },
    es: {
        // Login
        'gracehome_welcome': 'Bienvenido a GraceHome',
        'email': 'Correo electrónico',
        'password': 'Contraseña',
        'login': 'Iniciar Sesión',
        'forgot_password': '¿Olvidaste tu contraseña?',

        // Navigation
        'dashboard': 'Dashboard',
        'calendar': 'Calendario',
        'finances': 'Finanzas',
        'shopping': 'Lista de Compras',
        'devotional': 'Devocional',
        'settings': 'Configuración',

        // Dashboard
        'welcome_user': 'Bienvenido de nuevo,',
        'todays_verse': 'Versículo del Día',
        'todays_verse_prompt': 'Dame un versículo bíblico inspirador para hoy, solo el versículo y su referencia.',
        'budget_overview': 'Resumen de Presupuesto',
        'total_spent_vs_budgeted': 'Gasto total vs. Presupuestado este mes',
        'no_budget_set': 'No hay presupuesto establecido para este mes.',
        'upcoming_events': 'Próximos Eventos',

        // Finances
        'add_transaction': 'Agregar Transacción',
        'edit_transaction': 'Editar Transacción',
        'amount': 'Monto',
        'date': 'Fecha',
        'category': 'Categoría',
        'notes': 'Notas',
        'save_record': 'Guardar Registro',
        'update_record': 'Actualizar Registro',
        'recent_transactions': 'Transacciones Recientes',
        'actions': 'Acciones',
        'tithe': 'Diezmo',
        'offering': 'Ofrenda',
        'first_fruits': 'Primicias',
        'rent': 'Arriendo',
        'insurance': 'Seguros',
        'debt': 'Deudas',
        'transport': 'Transporte',
        'groceries': 'Compras',
        'other': 'Otro',
        'monthly_budgets': 'Presupuestos Mensuales',
        'manage_budgets': 'Gestionar Presupuestos',
        'edit_budgets_for': 'Editar Presupuestos para',
        'budget_goal': 'Meta de Presupuesto',
        'set_goal': 'Establecer Meta',
        'update_goal': 'Actualizar Meta',
        'spent_of': '{spent} de {total}',
        'no_budgets_set': 'No hay Presupuestos Establecidos',
        'add_first_budget': 'Haz clic en "Gestionar Presupuestos" para añadir el primero.',

        // Calendar
        'add_event': 'Agregar Evento',
        'event_name': 'Nombre del Evento',
        'description': 'Descripción',
        'recurring_event': 'Evento Recurrente',

        // Shopping List
        'add_item': 'Agregar Artículo',
        'item_name': 'Nombre del Artículo',
        'quantity': 'Cantidad',
        'add_to_list': 'Añadir a la Lista',
        'purchased_items': 'Artículos Comprados',
        
        // Devotional
        'financial_study': 'Estudio Financiero: A la Manera de Dios',
        'study_mode': 'Modo Estudio',
        'review_mode': 'Modo Repaso',

        // Settings
        'language': 'Idioma',
        'currency': 'Moneda',
        'theme': 'Tema',
        'light_mode': 'Modo Claro',
        'dark_mode': 'Modo Oscuro',
    },
    sv: {
        // Login
        'gracehome_welcome': 'Välkommen till GraceHome',
        'email': 'E-post',
        'password': 'Lösenord',
        'login': 'Logga in',
        'forgot_password': 'Glömt ditt lösenord?',
        
        // Navigation
        'dashboard': 'Dashboard',
        'calendar': 'Kalender',
        'finances': 'Finanser',
        'shopping': 'Inköpslista',
        'devotional': 'Andakt',
        'settings': 'Inställningar',

        // Dashboard
        'welcome_user': 'Välkommen tillbaka,',
        'todays_verse': 'Dagens bibelvers',
        'todays_verse_prompt': 'Ge mig en inspirerande bibelvers för idag, bara versen och dess referens.',
        'budget_overview': 'Budgetöversikt',
        'total_spent_vs_budgeted': 'Totala utgifter vs. Budgeterat denna månad',
        'no_budget_set': 'Ingen budget angiven för denna månad.',
        'upcoming_events': 'Kommande händelser',

        // Finances
        'add_transaction': 'Lägg till transaktion',
        'edit_transaction': 'Redigera transaktion',
        'amount': 'Belopp',
        'date': 'Datum',
        'category': 'Kategori',
        'notes': 'Anteckningar',
        'save_record': 'Spara post',
        'update_record': 'Uppdatera post',
        'recent_transactions': 'Senaste transaktioner',
        'actions': 'Åtgärder',
        'tithe': 'Tionde',
        'offering': 'Offer',
        'first_fruits': 'Förstlingsfrukt',
        'rent': 'Hyra',
        'insurance': 'Försäkring',
        'debt': 'Skuld',
        'transport': 'Transport',
        'groceries': 'Matvaror',
        'other': 'Övrigt',
        'monthly_budgets': 'Månadsbudgetar',
        'manage_budgets': 'Hantera budgetar',
        'edit_budgets_for': 'Redigera budgetar för',
        'budget_goal': 'Budgetmål',
        'set_goal': 'Ange mål',
        'update_goal': 'Uppdatera mål',
        'spent_of': '{spent} av {total}',
        'no_budgets_set': 'Inga budgetar angivna',
        'add_first_budget': 'Klicka på "Hantera budgetar" för att lägga till din första.',

        // Calendar
        'add_event': 'Lägg till händelse',
        'event_name': 'Händelsens namn',
        'description': 'Beskrivning',
        'recurring_event': 'Återkommande händelse',
        
        // Shopping List
        'add_item': 'Lägg till vara',
        'item_name': 'Varans namn',
        'quantity': 'Kvantitet',
        'add_to_list': 'Lägg till i listan',
        'purchased_items': 'Köpta varor',

        // Devotional
        'financial_study': 'Ekonomisk Studie: På Guds Sätt',
        'study_mode': 'Studiemodus',
        'review_mode': 'Granskningsläge',

        // Settings
        'language': 'Språk',
        'currency': 'Valuta',
        'theme': 'Tema',
        'light_mode': 'Ljust läge',
        'dark_mode': 'Mörkt läge',
    },
    fr: {
        // Login
        'gracehome_welcome': 'Bienvenue à GraceHome',
        'email': 'E-mail',
        'password': 'Mot de passe',
        'login': 'Se connecter',
        'forgot_password': 'Mot de passe oublié ?',

        // Navigation
        'dashboard': 'Tableau de bord',
        'calendar': 'Calendrier',
        'finances': 'Finances',
        'shopping': 'Liste de courses',
        'devotional': 'Dévotion',
        'settings': 'Paramètres',

        // Dashboard
        'welcome_user': 'Bon retour,',
        'todays_verse': 'Verset du jour',
        'todays_verse_prompt': 'Donnez-moi un verset biblique inspirant pour aujourd\'hui, juste le verset et sa référence.',
        'budget_overview': 'Aperçu du budget',
        'total_spent_vs_budgeted': 'Total dépensé par rapport au budget ce mois-ci',
        'no_budget_set': 'Aucun budget défini pour ce mois.',
        'upcoming_events': 'Événements à venir',

        // Finances
        'add_transaction': 'Ajouter une transaction',
        'edit_transaction': 'Modifier la transaction',
        'amount': 'Montant',
        'date': 'Date',
        'category': 'Catégorie',
        'notes': 'Remarques',
        'save_record': 'Enregistrer',
        'update_record': 'Mettre à jour',
        'recent_transactions': 'Transactions récentes',
        'actions': 'Actions',
        'tithe': 'Dîme',
        'offering': 'Offrande',
        'first_fruits': 'Prémices',
        'rent': 'Loyer',
        'insurance': 'Assurance',
        'debt': 'Dette',
        'transport': 'Transport',
        'groceries': 'Courses',
        'other': 'Autre',
        'monthly_budgets': 'Budgets mensuels',
        'manage_budgets': 'Gérer les budgets',
        'edit_budgets_for': 'Modifier les budgets pour',
        'budget_goal': 'Objectif budgétaire',
        'set_goal': 'Définir l\'objectif',
        'update_goal': 'Mettre à jour l\'objectif',
        'spent_of': '{spent} sur {total}',
        'no_budgets_set': 'Aucun budget défini',
        'add_first_budget': 'Cliquez sur "Gérer les budgets" pour ajouter votre premier.',


        // Calendar
        'add_event': 'Ajouter un événement',
        'event_name': 'Nom de l\'événement',
        'description': 'Description',
        'recurring_event': 'Événement récurrent',

        // Shopping List
        'add_item': 'Ajouter un article',
        'item_name': 'Nom de l\'article',
        'quantity': 'Quantité',
        'add_to_list': 'Ajouter à la liste',
        'purchased_items': 'Articles achetés',
        
        // Devotional
        'financial_study': 'Étude Financière : À la Manière de Dieu',
        'study_mode': 'Mode Étude',
        'review_mode': 'Mode Révision',

        // Settings
        'language': 'Langue',
        'currency': 'Devise',
        'theme': 'Thème',
        'light_mode': 'Mode clair',
        'dark_mode': 'Mode sombre',
    }
};