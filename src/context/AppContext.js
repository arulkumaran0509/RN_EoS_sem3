import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { INITIAL_TRANSACTIONS, DEMO_USERS, CATEGORIES } from '../data/mockData';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Current logged in user (null by default for login flow requirement)
  const [user, setUser] = useState(null);

  // All stored transactions across all accounts in memory
  const [allTransactions, setAllTransactions] = useState(INITIAL_TRANSACTIONS);

  // Admin view mode: 'personal' (Admin's corporate records) or 'all' (system-wide consolidated)
  const [adminScope, setAdminScope] = useState('personal');

  // Active reporting period on Home Screen: 'daily' | 'weekly' | 'monthly'
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Selected date reference for reporting (Default to current simulated exam date: 2026-10-28)
  const [currentDate] = useState('2026-10-28');

  // Selected Month filter for Month-wise Transactions screen
  const [selectedMonth, setSelectedMonth] = useState('2026-10');

  // Personalized In-App Alert Banner state
  const [alert, setAlert] = useState({
    visible: false,
    message: '',
    type: 'success', // 'success' | 'error' | 'info'
  });

  // Trigger alert with auto-dismiss after 4 seconds
  const showAlert = useCallback((message, type = 'success') => {
    setAlert({ visible: true, message, type });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, visible: false }));
  }, []);

  // Filtered transactions for the currently authenticated user
  const transactions = useMemo(() => {
    if (!user) return [];
    if (user.role === 'admin' && adminScope === 'all') {
      return allTransactions; // Admin can inspect consolidated system-wide data
    }
    // Filter strictly by the current user's ID
    return allTransactions.filter((tx) => tx.userId === user.id);
  }, [allTransactions, user, adminScope]);

  // Authentication: Sign In
  const signIn = useCallback((email, password, preferredRole = 'customer') => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      showAlert('Please enter both email and password.', 'error');
      return false;
    }

    if (cleanEmail === DEMO_USERS.admin.email.toLowerCase() && password === 'admin123') {
      setUser(DEMO_USERS.admin);
      showAlert(`Welcome back, ${DEMO_USERS.admin.name} (Administrator)!`, 'success');
      return true;
    }

    if (cleanEmail === DEMO_USERS.customer.email.toLowerCase() && password === 'password123') {
      setUser(DEMO_USERS.customer);
      showAlert(`Welcome back, ${DEMO_USERS.customer.name}!`, 'success');
      return true;
    }

    // Dynamic role-based fallback login
    const targetRole = preferredRole === 'admin' || cleanEmail.includes('admin') ? 'admin' : 'customer';
    const fallbackUser = {
      id: `user-${Date.now()}`,
      name: cleanEmail.split('@')[0].toUpperCase(),
      email: cleanEmail,
      role: targetRole,
      phone: '+91 98765 43210',
      budgetGoal: targetRole === 'admin' ? 150000 : 45000,
      currency: '₹',
      joinDate: 'October 2026',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    };
    setUser(fallbackUser);
    showAlert(`Welcome, ${fallbackUser.name}! Signed in as ${targetRole.toUpperCase()}.`, 'success');
    return true;
  }, [showAlert]);

  // Authentication: Sign Up with unique user data isolation
  const signUp = useCallback(({ name, email, password, confirmPassword, role }) => {
    if (!name?.trim()) {
      showAlert('Full name is required.', 'error');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.trim() || !emailRegex.test(email.trim())) {
      showAlert('Please enter a valid email address.', 'error');
      return false;
    }
    if (!password || password.length < 6) {
      showAlert('Password must be at least 6 characters long.', 'error');
      return false;
    }
    if (password !== confirmPassword) {
      showAlert('Passwords do not match.', 'error');
      return false;
    }

    const newUserId = `user-${Date.now()}`;
    const newUser = {
      id: newUserId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role || 'customer',
      phone: '+91 98765 00000',
      budgetGoal: role === 'admin' ? 120000 : 40000,
      currency: '₹',
      joinDate: 'October 2026',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    };

    // Initialize user with their own clean starter transactions
    const starterTx = [
      {
        id: `tx-${Date.now()}-1`,
        userId: newUserId,
        title: `${name.trim()}'s Initial Deposit`,
        amount: role === 'admin' ? 50000 : 25000,
        category: 'Salary',
        type: 'income',
        date: '2026-10-01',
        notes: 'Opening deposit for new account',
      },
      {
        id: `tx-${Date.now()}-2`,
        userId: newUserId,
        title: 'Initial Expense Entry',
        amount: 350,
        category: 'Food & Dining',
        type: 'expense',
        date: '2026-10-28',
        notes: 'Account verification transaction',
      },
    ];

    setAllTransactions((prev) => [...starterTx, ...prev]);
    setUser(newUser);
    showAlert(`Hi ${newUser.name}, your account has been created with personal data isolation!`, 'success');
    return true;
  }, [showAlert]);

  // Authentication: Sign Out
  const signOut = useCallback(() => {
    setUser(null);
    showAlert('You have been signed out safely.', 'info');
  }, [showAlert]);

  // Quick Role Switch for exam demonstration
  const switchRole = useCallback((newRole) => {
    if (newRole === 'admin') {
      setUser(DEMO_USERS.admin);
      showAlert('Switched to Admin Role. Viewing Admin Corporate Ledger.', 'info');
    } else {
      setUser(DEMO_USERS.customer);
      showAlert('Switched to Customer Role. Viewing Alex Johnson\'s Personal Ledger.', 'info');
    }
  }, [showAlert]);

  // Update Profile (Customer only)
  const updateProfile = useCallback(({ name, email, phone, budgetGoal }) => {
    if (!name?.trim()) {
      showAlert('Name cannot be empty.', 'error');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.trim() || !emailRegex.test(email.trim())) {
      showAlert('Please enter a valid email address.', 'error');
      return false;
    }
    const numericGoal = Number(budgetGoal);
    if (isNaN(numericGoal) || numericGoal < 0) {
      showAlert('Budget goal must be a valid positive number.', 'error');
      return false;
    }

    setUser((prev) => ({
      ...prev,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || prev?.phone,
      budgetGoal: numericGoal,
    }));

    showAlert(`Hi ${name.trim()}, your profile has been updated successfully.`, 'success');
    return true;
  }, [showAlert]);

  // Add Transaction with Validation and Personalized Alert
  const addTransaction = useCallback(({ title, amount, category, type, date, notes }) => {
    if (!title?.trim()) {
      showAlert('Validation Error: Transaction title is required.', 'error');
      return false;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showAlert('Validation Error: Amount must be a positive number greater than 0.', 'error');
      return false;
    }
    if (!category?.trim()) {
      showAlert('Validation Error: Please select a valid category.', 'error');
      return false;
    }
    if (!type || !['income', 'expense'].includes(type.toLowerCase())) {
      showAlert('Validation Error: Transaction type must be either Income or Expense.', 'error');
      return false;
    }
    if (!date?.trim()) {
      showAlert('Validation Error: Transaction date is required.', 'error');
      return false;
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      userId: user?.id || 'user-cust-1',
      title: title.trim(),
      amount: parsedAmount,
      category: category.trim(),
      type: type.toLowerCase(),
      date: date.trim(),
      notes: notes?.trim() || '',
    };

    setAllTransactions((prev) => [newTx, ...prev]);

    const formattedAmount = `₹${parsedAmount.toLocaleString('en-IN')}`;
    const customerName = user?.name || 'Customer';
    showAlert(
      `Hi ${customerName}, your ${newTx.type} of ${formattedAmount} has been added successfully.`,
      'success'
    );
    return true;
  }, [user, showAlert]);

  // Edit Transaction with Validation and Personalized Alert
  const editTransaction = useCallback((id, { title, amount, category, type, date, notes }) => {
    if (!title?.trim()) {
      showAlert('Validation Error: Title is required.', 'error');
      return false;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showAlert('Validation Error: Amount must be greater than 0.', 'error');
      return false;
    }
    if (!category?.trim()) {
      showAlert('Validation Error: Category is required.', 'error');
      return false;
    }

    setAllTransactions((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              title: title.trim(),
              amount: parsedAmount,
              category: category.trim(),
              type: type.toLowerCase(),
              date: date.trim(),
              notes: notes?.trim() || '',
            }
          : item
      )
    );

    const customerName = user?.name || 'Customer';
    const formattedAmount = `₹${parsedAmount.toLocaleString('en-IN')}`;
    showAlert(
      `Hi ${customerName}, your transaction '${title.trim()}' of ${formattedAmount} has been updated successfully.`,
      'success'
    );
    return true;
  }, [user, showAlert]);

  // Delete Transaction with Personalized Alert
  const deleteTransaction = useCallback((id) => {
    const existing = allTransactions.find((t) => t.id === id);
    if (!existing) return;

    setAllTransactions((prev) => prev.filter((t) => t.id !== id));

    const customerName = user?.name || 'Customer';
    const formattedAmount = `₹${Number(existing.amount).toLocaleString('en-IN')}`;
    showAlert(
      `Hi ${customerName}, your transaction '${existing.title}' of ${formattedAmount} has been deleted.`,
      'info'
    );
  }, [allTransactions, user, showAlert]);

  // Reporting Logic: Filter transactions by Daily, Weekly, Monthly
  const getFilteredTransactions = useCallback((period = selectedPeriod, refDate = currentDate) => {
    const ref = new Date(refDate);

    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);

      if (period === 'daily') {
        return tx.date === refDate;
      }

      if (period === 'weekly') {
        const sevenDaysAgo = new Date(ref);
        sevenDaysAgo.setDate(ref.getDate() - 6);
        return txDate >= sevenDaysAgo && txDate <= ref;
      }

      if (period === 'monthly') {
        const targetYear = ref.getFullYear();
        const targetMonth = ref.getMonth();
        return txDate.getFullYear() === targetYear && txDate.getMonth() === targetMonth;
      }

      return true;
    });
  }, [transactions, selectedPeriod, currentDate]);

  // Financial summary calculations
  const calculateTotals = useCallback((txList) => {
    let income = 0;
    let expenses = 0;

    txList.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        income += amt;
      } else {
        expenses += amt;
      }
    });

    return {
      income,
      expenses,
      balance: income - expenses,
      count: txList.length,
    };
  }, []);

  // Category breakdown calculation
  const getCategoryBreakdown = useCallback((txList) => {
    const expenseTx = txList.filter((tx) => tx.type === 'expense');
    const totalExpense = expenseTx.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const breakdownMap = {};

    expenseTx.forEach((tx) => {
      const cat = tx.category || 'Other';
      if (!breakdownMap[cat]) {
        breakdownMap[cat] = {
          name: cat,
          total: 0,
          count: 0,
        };
      }
      breakdownMap[cat].total += Number(tx.amount || 0);
      breakdownMap[cat].count += 1;
    });

    const result = Object.values(breakdownMap).map((item) => {
      const matchedMeta = CATEGORIES.find((c) => c.name === item.name) || {
        icon: 'pricetag',
        color: '#64748B',
      };
      return {
        ...item,
        icon: matchedMeta.icon,
        color: matchedMeta.color,
        percentage: totalExpense > 0 ? ((item.total / totalExpense) * 100).toFixed(1) : 0,
      };
    });

    return result.sort((a, b) => b.total - a.total);
  }, []);

  // Global All-Time / Overall Totals for active user
  const overallTotals = useMemo(() => calculateTotals(transactions), [calculateTotals, transactions]);

  // Current selected period totals (for Home Screen reports)
  const currentPeriodTransactions = useMemo(
    () => getFilteredTransactions(selectedPeriod, currentDate),
    [getFilteredTransactions, selectedPeriod, currentDate]
  );

  const currentPeriodTotals = useMemo(
    () => calculateTotals(currentPeriodTransactions),
    [calculateTotals, currentPeriodTransactions]
  );

  // Daily Totals
  const dailyTotals = useMemo(
    () => calculateTotals(getFilteredTransactions('daily', currentDate)),
    [calculateTotals, getFilteredTransactions, currentDate]
  );

  // Weekly Totals
  const weeklyTotals = useMemo(
    () => calculateTotals(getFilteredTransactions('weekly', currentDate)),
    [calculateTotals, getFilteredTransactions, currentDate]
  );

  // Monthly Totals
  const monthlyTotals = useMemo(
    () => calculateTotals(getFilteredTransactions('monthly', currentDate)),
    [calculateTotals, getFilteredTransactions, currentDate]
  );

  const value = {
    user,
    setUser,
    transactions,
    allTransactions,
    adminScope,
    setAdminScope,
    selectedPeriod,
    setSelectedPeriod,
    currentDate,
    selectedMonth,
    setSelectedMonth,
    alert,
    showAlert,
    hideAlert,
    signIn,
    signUp,
    signOut,
    switchRole,
    updateProfile,
    addTransaction,
    editTransaction,
    deleteTransaction,
    getFilteredTransactions,
    calculateTotals,
    getCategoryBreakdown,
    overallTotals,
    currentPeriodTransactions,
    currentPeriodTotals,
    dailyTotals,
    weeklyTotals,
    monthlyTotals,
    categories: CATEGORIES,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
