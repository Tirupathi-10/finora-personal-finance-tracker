

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

import axios from "axios";


import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  Plus,
  RefreshCw,
  Search,
  Eye,
  Pencil,
  SlidersHorizontal,
  Trash2,
  X,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  ChartNoAxesCombined,
  PiggyBank,
  LayoutDashboard,
  CircleDollarSign,
  LogOut,
  UserRound,
} from "lucide-react";


import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "./App.css";







const API = axios.create({

  baseURL: "http\://localhost:9911/finance",

  headers: { "Content-Type": "application/json" }

});



const COLORS = [

  "#7162B5", "#D99B76", "#739BA9", "#8EAB81",

  "#B69ACB", "#C5AD73", "#608D86", "#D17D91"

];



const emptyForm = {

  title: "",

  amount: "",

  type: "EXPENSE",

  category: "",

  transactionDate: new Date().toISOString().slice(0, 10),

  description: ""

};



const money = value =>

  new Intl.NumberFormat("en-IN", {

    style: "currency",

    currency: "INR",

    maximumFractionDigits: 2

  }).format(Number(value || 0));



const shortMoney = value => {

  const n = Number(value || 0);

  if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(1)}L`;

  if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(1)}k`;

  return `₹${n.toFixed(0)}`;

};



const monthLabel = key =>

  new Date(`${key}-01T00:00:00`).toLocaleDateString("en-IN", {

    month: "short",

    year: "2-digit"

  });



function DashboardContent() {
  const navigate = useNavigate();
  const [currentUser] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem("finoraUser") || "null"
    );
  } catch {
    return null;
  }
});

const handleLogout = () => {
  localStorage.removeItem("finoraUser");
  localStorage.removeItem("finoraToken");
  navigate("/login", { replace: true });
};

  const [transactions, setTransactions] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [mode, setMode] = useState("create");

  const [selectedId, setSelectedId] = useState(null);

  const [details, setDetails] = useState(null);

  const [formOpen, setFormOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [filterType, setFilterType] = useState("ALL");

  const [monthFilter, setMonthFilter] = useState("ALL");

  const [analyticsRange, setAnalyticsRange] = useState("6M");

  const [loading, setLoading] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);

  const [error, setError] = useState("");

  const [notice, setNotice] = useState("");




const loadTransactions = useCallback(async (initial = false) => {
  setLoading(true);
  setError("");

  try {
    const user = JSON.parse(
      localStorage.getItem("finoraUser") || "null"
    );

    if (!user?.id) {
      navigate("/login", { replace: true });
      return;
    }

    const response = await API.get(`/getall/${user.id}`);

    setTransactions(
      Array.isArray(response.data) ? response.data : []
    );
  } catch (err) {
    console.error("Error loading transactions:", err);

    setError(
      err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to load transactions. Check the backend and GET /finance/getall/{userId}."
    );
  } finally {
    setLoading(false);

    if (initial) {
      setInitialLoading(false);
    }
  }
}, [navigate]);
  useEffect(() => {
    loadTransactions(true);
  }, [loadTransactions]);
  const openCreate = () => {

    setForm({ ...emptyForm });

    setSelectedId(null);
    setMode("create");
    setFormOpen(true);

    setDetails(null);

    setError("");

  };



  const openEdit = (item, nextMode = "edit") => {

    setSelectedId(item.id);

    setMode(nextMode);

    setForm(nextMode === "patch"

      ? {

          title: "", amount: "", type: "", category: "",

          transactionDate: "", description: ""

        }

      : {

          title: item.title ?? "",

          amount: item.amount ?? "",

          type: item.type ?? "EXPENSE",

          category: item.category ?? "",

          transactionDate: item.transactionDate ?? "",

          description: item.description ?? ""

        });

    setFormOpen(true);

    setDetails(null);

    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });

  };



  const changeField = event => {

    setForm(prev => ({

      ...prev,

      [event.target.name]: event.target.value

    }));

  };



  const submitForm = async event => {

    event.preventDefault();

    setLoading(true);

    setError("");

    setNotice("");



    try {

      if (mode === "patch") {

        const payload = Object.fromEntries(

          Object.entries(form)

            .filter(([, value]) => value !== "" && value != null)

            .map(([key, value]) => [

              key,

              key === "amount" ? Number(value) : value

            ])

        );



        if (!Object.keys(payload).length) {

          setError("Enter at least one field to update.");

          return;

        }



        await API.patch(`/patch/${selectedId}`, payload);

        setNotice("Selected fields updated successfully.");

      } else {

        const payload = {

          ...form,

          amount: Number(form.amount)

        };



        if (mode === "create") {

          await API.post("/create", payload);

          setNotice("Transaction created successfully.");

        } else {

          await API.put(`/update/${selectedId}`, payload);

          setNotice("Transaction updated successfully.");

        }

      }



      setFormOpen(false);

      setSelectedId(null);

      setForm({ ...emptyForm });

      setMode("create");

      await loadTransactions();

    } catch (err) {

      setError(

        err.response?.data?.message ||

        err.response?.data?.error ||

        "Unable to save transaction."

      );

    } finally {

      setLoading(false);

    }

  };



  const viewTransaction = async id => {

    setError("");

    try {

      const response = await API.get(`/get/${id}`);

      setDetails(response.data);

    } catch (err) {

      setError(err.response?.data?.message || "Unable to get transaction.");

    }

  };



  const removeTransaction = async id => {

    if (!window.confirm(`Delete transaction #${id}?`)) return;



    setError("");

    setNotice("");

    try {

      await API.delete(`/delete/${id}`);

      setNotice("Transaction deleted successfully.");

      if (details?.id === id) setDetails(null);

      if (selectedId === id) setFormOpen(false);

      await loadTransactions();

    } catch (err) {

      setError(err.response?.data?.message || "Delete failed.");

    }

  };



  const totalIncome = useMemo(

    () => transactions

      .filter(t => t.type?.toUpperCase() === "INCOME")

      .reduce((sum, t) => sum + Number(t.amount || 0), 0),

    [transactions]

  );



  const totalExpenses = useMemo(

    () => transactions

      .filter(t => t.type?.toUpperCase() === "EXPENSE")

      .reduce((sum, t) => sum + Number(t.amount || 0), 0),

    [transactions]

  );



  const balance = totalIncome - totalExpenses;

  const savingsRate = totalIncome > 0 ? balance / totalIncome * 100 : 0;



  const analyticsTransactions = useMemo(() => {

    const now = new Date();

    const currentMonth = `${now.getFullYear()}-${String(

      now.getMonth() + 1

    ).padStart(2, "0")}`;



    const previousDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const previousMonth = `${previousDate.getFullYear()}-${String(

      previousDate.getMonth() + 1

    ).padStart(2, "0")}`;



    if (analyticsRange === "ALL") return transactions;



    if (analyticsRange === "THIS_MONTH") {

      return transactions.filter(t => t.transactionDate?.startsWith(currentMonth));

    }



    if (analyticsRange === "LAST_MONTH") {

      return transactions.filter(t => t.transactionDate?.startsWith(previousMonth));

    }



    const count = analyticsRange === "3M" ? 3 : 6;

    const start = new Date(now.getFullYear(), now.getMonth() - count + 1, 1);

    const startKey = `${start.getFullYear()}-${String(

      start.getMonth() + 1

    ).padStart(2, "0")}`;



    return transactions.filter(t =>

      t.transactionDate && t.transactionDate.slice(0, 7) >= startKey

      && t.transactionDate.slice(0, 7) <= currentMonth

    );

  }, [transactions, analyticsRange]);



  const analyticsIncome = analyticsTransactions

    .filter(t => t.type?.toUpperCase() === "INCOME")

    .reduce((sum, t) => sum + Number(t.amount || 0), 0);



  const analyticsExpenses = analyticsTransactions

    .filter(t => t.type?.toUpperCase() === "EXPENSE")

    .reduce((sum, t) => sum + Number(t.amount || 0), 0);



  const analyticsSavings = analyticsIncome - analyticsExpenses;

  const analyticsSavingsRate = analyticsIncome > 0

    ? analyticsSavings / analyticsIncome * 100

    : 0;



  const monthlyData = useMemo(() => {

    const now = new Date();

    const count = analyticsRange === "3M" ? 3 : 6;

    let keys;



    if (analyticsRange === "ALL") {

      keys = [...new Set(

        analyticsTransactions

          .filter(t => t.transactionDate)

          .map(t => t.transactionDate.slice(0, 7))

      )].sort();

    } else if (analyticsRange === "THIS_MONTH" || analyticsRange === "LAST_MONTH") {

      keys = [...new Set(

        analyticsTransactions

          .filter(t => t.transactionDate)

          .map(t => t.transactionDate.slice(0, 7))

      )].sort();

    } else {

      keys = Array.from({ length: count }, (_, i) => {

        const d = new Date(now.getFullYear(), now.getMonth() - count + i + 1, 1);

        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      });

    }



    const grouped = new Map(keys.map(key => [

      key, { key, month: monthLabel(key), income: 0, expenses: 0 }

    ]));



    analyticsTransactions.forEach(t => {

      if (!t.transactionDate) return;

      const row = grouped.get(t.transactionDate.slice(0, 7));

      if (!row) return;

      if (t.type?.toUpperCase() === "INCOME") row.income += Number(t.amount || 0);

      if (t.type?.toUpperCase() === "EXPENSE") row.expenses += Number(t.amount || 0);

    });



    return [...grouped.values()];

  }, [analyticsTransactions, analyticsRange]);



  const categoryData = useMemo(() => {

    const totals = new Map();



    analyticsTransactions

      .filter(t => t.type?.toUpperCase() === "EXPENSE")

      .forEach(t => {

        const category = t.category || "Uncategorized";

        totals.set(category, (totals.get(category) || 0) + Number(t.amount || 0));

      });



    return [...totals.entries()]

      .map(([name, value]) => ({ name, value }))

      .sort((a, b) => b.value - a.value);

  }, [analyticsTransactions]);



  const highestCategory = categoryData[0] || null;



  const averageMonthlyExpense = useMemo(() => {

    if (!monthlyData.length) return 0;

    return analyticsExpenses / monthlyData.length;

  }, [analyticsExpenses, monthlyData]);



  const availableMonths = useMemo(() => [

    ...new Set(

      transactions.filter(t => t.transactionDate)

        .map(t => t.transactionDate.slice(0, 7))

    )

  ].sort((a, b) => b.localeCompare(a)), [transactions]);



  const filteredTransactions = useMemo(() => transactions

    .filter(t => {

      const term = search.toLowerCase();

      const matchesSearch = [

        t.title, t.category, t.description, String(t.id)

      ].some(value => String(value || "").toLowerCase().includes(term));



      const matchesType = filterType === "ALL"

        || t.type?.toUpperCase() === filterType;



      const matchesMonth = monthFilter === "ALL"

        || t.transactionDate?.startsWith(monthFilter);



      return matchesSearch && matchesType && matchesMonth;

    })

    .sort((a, b) => (b.transactionDate || "").localeCompare(a.transactionDate || "")),

    [transactions, search, filterType, monthFilter]

  );



  const stats = [

    { label: "Net Balance", value: money(balance), icon: Wallet, className: "balance-card", note: "Income minus expenses" },

    { label: "Total Income", value: money(totalIncome), icon: TrendingUp, className: "income-card", note: "All recorded income" },

    { label: "Total Expenses", value: money(totalExpenses), icon: TrendingDown, className: "expense-card", note: "All recorded expenses" },

    { label: "Savings Rate", value: `${savingsRate.toFixed(1)}%`, icon: PiggyBank, className: "savings-card", note: "Based on total income" }

  ];



  return (

    <div className="finance-app">

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-logo"><Wallet size={24} /></div>

          <div><h1>Finora</h1><span>PERSONAL FINANCE</span></div>

        </div>



        <p className="side-label">WORKSPACE</p>

        <button className="nav-item active" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>

          <LayoutDashboard size={18} /> Dashboard

        </button>

        <button className="nav-item" onClick={openCreate}>

          <Plus size={18} /> Add Transaction

        </button>



        <div className="sidebar-bottom">

          <div className="sidebar-illustration">

            <div className="illustration-icon"><ChartNoAxesCombined size={23} /></div>

            <strong>Build better habits.</strong>

            <p>Understand your spending and make every rupee count.</p>

          </div>

          <span className="version">FINORA · FINANCE MANAGER</span>

        </div>

      </aside>



      <main className="main-content">

        <header className="topbar">

          <div><span className="breadcrumb">Workspace / Overview</span><h2>Financial Overview</h2></div>

 
<div className="top-actions">
  <span className="live-status">
    <span /> Your dashboard
  </span>

  <button
    className="btn btn-outline"
    onClick={() => loadTransactions()}
    disabled={loading}
  >
    <RefreshCw
      size={16}
      className={loading ? "spin" : ""}
    />
    Refresh
  </button>

  <div className="profile-box">
    <div className="profile-avatar">
      <UserRound size={21} />
    </div>

    <div className="profile-info">
      <strong>
        {currentUser?.name || "Finora User"}
      </strong>
      <span>
        {currentUser?.email || ""}
      </span>
    </div>

    <button
      type="button"
      className="logout-button"
      onClick={handleLogout}
      title="Logout"
      aria-label="Logout"
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  </div>
</div>


        </header>



        <section className="welcome-banner">

          <div className="banner-content">

            <span className="banner-label">YOUR FINANCIAL SPACE</span>

            <h2>Make your money<br />work for you.</h2>

            <p>One clear view of what you earn, spend, and save.</p>

            <button className="btn btn-light" onClick={openCreate}><Plus size={17} /> Add transaction</button>

          </div>

          <div className="banner-art" aria-hidden="true">

            <div className="art-circle circle-one" />

            <div className="art-circle circle-two" />

            <div className="art-wallet"><Wallet size={57} strokeWidth={1.5} /></div>

            <div className="floating-chip chip-top"><TrendingUp size={16} /> Money in</div>

            <div className="floating-chip chip-bottom"><ArrowDownRight size={16} /> Money out</div>

          </div>

        </section>



        {error && <div className="alert alert-error"><span>{error}</span><button onClick={() => setError("")}><X size={17} /></button></div>}

        {notice && <div className="alert alert-success"><span>{notice}</span><button onClick={() => setNotice("")}><X size={17} /></button></div>}



        <section className="stats-grid">

          {stats.map(stat => {

            const Icon = stat.icon;

            return (

              <article className={`stat-card ${stat.className}`} key={stat.label}>

                <div className="stat-top"><span>{stat.label}</span><div className="stat-icon"><Icon size={21} /></div></div>

                <h3>{stat.value}</h3><p>{stat.note}</p>

              </article>

            );

          })}

        </section>



        <section className="analytics-toolbar">

          <div>

            <span className="section-kicker">FINANCIAL INSIGHTS</span>

            <h3>Advanced Analytics</h3>

            <p>Explore your cash flow and spending habits.</p>

          </div>

          <select className="filter-select analytics-filter" value={analyticsRange} onChange={e => setAnalyticsRange(e.target.value)}>

            <option value="THIS_MONTH">This month</option>

            <option value="LAST_MONTH">Last month</option>

            <option value="3M">Last 3 months</option>

            <option value="6M">Last 6 months</option>

            <option value="ALL">All time</option>

          </select>

        </section>



        <section className="analytics-insights">

          <article className="insight-card insight-purple"><span>Income in selected period</span><strong>{money(analyticsIncome)}</strong><small>Recorded income</small></article>

          <article className="insight-card insight-peach"><span>Expenses in selected period</span><strong>{money(analyticsExpenses)}</strong><small>Recorded expenses</small></article>

          <article className="insight-card insight-blue"><span>Net savings</span><strong>{money(analyticsSavings)}</strong><small>{analyticsSavingsRate.toFixed(1)}% savings rate</small></article>

          <article className="insight-card insight-green"><span>Average monthly expenses</span><strong>{money(averageMonthlyExpense)}</strong><small>Based on displayed months</small></article>

        </section>



        <section className="analytics-grid">

          <article className="panel chart-panel">

            <div className="panel-heading">

              <div><span className="section-kicker">CASH FLOW</span><h3>Income vs Expenses</h3><p>Monthly financial movement</p></div>

              <div className="chart-legend"><span><i className="legend-income" /> Income</span><span><i className="legend-expense" /> Expenses</span></div>

            </div>

            {!monthlyData.length ? <div className="chart-empty">No transactions available for this period.</div> : (

              <div className="chart-area">

                <ResponsiveContainer width="100%" height="100%">

                  <AreaChart data={monthlyData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>

                    <defs>

                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">

                        <stop offset="0%" stopColor="#7162B5" stopOpacity={0.3} /><stop offset="100%" stopColor="#7162B5" stopOpacity={0.02} />

                      </linearGradient>

                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">

                        <stop offset="0%" stopColor="#D99B76" stopOpacity={0.3} /><stop offset="100%" stopColor="#D99B76" stopOpacity={0.02} />

                      </linearGradient>

                    </defs>

                    <CartesianGrid stroke="#E5E0EF" strokeDasharray="4 4" vertical={false} />

                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#77728E", fontSize: 11 }} />

                    <YAxis axisLine={false} tickLine={false} tickFormatter={shortMoney} width={55} tick={{ fill: "#77728E", fontSize: 10 }} />

                    <Tooltip formatter={value => money(value)} />

                    <Area type="monotone" dataKey="income" name="Income" stroke="#7162B5" strokeWidth={3} fill="url(#incomeGradient)" />

                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#D99B76" strokeWidth={3} fill="url(#expenseGradient)" />

                  </AreaChart>

                </ResponsiveContainer>

              </div>

            )}

          </article>



          <article className="panel category-panel">

            <div className="panel-heading">

              <div><span className="section-kicker">SPENDING BREAKDOWN</span><h3>Expense Categories</h3><p>Category-wise spending</p></div>

            </div>

            {!categoryData.length ? <div className="chart-empty">No expenses in this period.</div> : (

              <>

                <div className="donut-area">

                  <ResponsiveContainer width="100%" height="100%">

                    <PieChart>

                      <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="82%" paddingAngle={3} stroke="none">

                        {categoryData.map((item, index) => <Cell key={item.name} fill={COLORS[index % COLORS.length]} />)}

                      </Pie>

                      <Tooltip formatter={value => money(value)} />

                    </PieChart>

                  </ResponsiveContainer>

                  <div className="donut-center"><span>Total spent</span><strong>{shortMoney(analyticsExpenses)}</strong></div>

                </div>

                <div className="category-legend">

                  {categoryData.map((item, index) => (

                    <div className="category-row" key={item.name}>

                      <span className="category-name"><i style={{ background: COLORS[index % COLORS.length] }} />{item.name}</span>

                      <strong>{money(item.value)} · {analyticsExpenses ? (item.value / analyticsExpenses * 100).toFixed(1) : "0.0"}%</strong>

                    </div>

                  ))}

                </div>

              </>

            )}

          </article>

        </section>



        <section className="panel spending-summary">

          <div className="panel-heading"><div><span className="section-kicker">SMART INSIGHTS</span><h3>Your spending summary</h3></div></div>

          <div className="summary-insight-grid">

            <div><span>Highest expense category</span><strong>{highestCategory?.name || "No data yet"}</strong><small>{highestCategory ? money(highestCategory.value) : "Add expenses to see insights"}</small></div>

            <div><span>Transactions analyzed</span><strong>{analyticsTransactions.length}</strong><small>Selected period</small></div>

            <div><span>Cash flow</span><strong>{money(analyticsSavings)}</strong><small>{analyticsSavings >= 0 ? "Positive cash flow" : "Expenses exceed income"}</small></div>

          </div>

        </section>



        {formOpen && (

          <section className="panel form-panel">

            <div className="panel-heading">

              <div><span className="section-kicker">{mode === "create" ? "NEW ENTRY" : mode === "edit" ? "EDIT ENTRY" : "PARTIAL UPDATE"}</span>

                <h3>{mode === "create" ? "Add Transaction" : mode === "edit" ? `Update Transaction #${selectedId}` : `Update Selected Fields #${selectedId}`}</h3>

              </div>

              <button className="close-button" onClick={() => setFormOpen(false)}><X size={19} /></button>

            </div>

            {mode === "patch" && <p className="patch-note">Fill only the fields you want to change. Empty fields are ignored.</p>}

            <form onSubmit={submitForm}>

              <div className="form-grid">

                <label>Title {mode !== "patch" && "*"}<input name="title" value={form.title} onChange={changeField} required={mode !== "patch"} placeholder="e.g. Monthly salary" /></label>

                <label>Amount (₹) {mode !== "patch" && "*"}<input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={changeField} required={mode !== "patch"} placeholder="0.00" /></label>

                <label>Type {mode !== "patch" && "*"}<select name="type" value={form.type} onChange={changeField} required={mode !== "patch"}><option value="">Select type</option><option value="INCOME">Income</option><option value="EXPENSE">Expense</option></select></label>

                <label>Category {mode !== "patch" && "*"}<input name="category" value={form.category} onChange={changeField} required={mode !== "patch"} placeholder="Food, Salary, Travel..." /></label>

                <label>Date {mode !== "patch" && "*"}<input name="transactionDate" type="date" value={form.transactionDate} onChange={changeField} required={mode !== "patch"} /></label>

                <label>Description<input name="description" value={form.description} onChange={changeField} placeholder="Optional note" /></label>

              </div>

              <div className="form-actions">

                <button className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : mode === "create" ? "Create transaction" : mode === "edit" ? "Save changes" : "Apply update"}</button>

                <button className="btn btn-outline" type="button" onClick={() => setFormOpen(false)}>Cancel</button>

              </div>

            </form>

          </section>

        )}



        {details && (

          <section className="panel details-panel">

            <div className="panel-heading"><div><span className="section-kicker">TRANSACTION DETAILS</span><h3>{details.title}</h3></div><button className="close-button" onClick={() => setDetails(null)}><X size={19} /></button></div>

            <div className="details-grid">

              {[["ID", details.id], ["Amount", money(details.amount)], ["Type", details.type], ["Category", details.category], ["Date", details.transactionDate], ["Description", details.description || "No description"]].map(([label, value]) => (

                <div className="detail-item" key={label}><span>{label}</span><strong>{value ?? "—"}</strong></div>

              ))}

            </div>

          </section>

        )}



        <section className="panel transactions-panel">

          <div className="panel-heading transactions-heading">

            <div><span className="section-kicker">YOUR ACTIVITY</span><h3>Transactions</h3><p>Review and manage your financial records.</p></div>

            <button className="btn btn-primary" onClick={openCreate}><Plus size={17} /> Add new</button>

          </div>



          <div className="table-tools">

            <div className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, category or ID..." /></div>

            <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}><option value="ALL">All types</option><option value="INCOME">Income</option><option value="EXPENSE">Expenses</option></select>

            <select className="filter-select" value={monthFilter} onChange={e => setMonthFilter(e.target.value)}><option value="ALL">All months</option>{availableMonths.map(month => <option value={month} key={month}>{monthLabel(month)}</option>)}</select>

          </div>



          {initialLoading ? <div className="empty-state">Loading transactions...</div> : filteredTransactions.length === 0 ? (

            <div className="empty-state"><div className="empty-icon"><Receipt size={27} /></div><h4>No transactions found</h4><p>Add a record or change your search filters.</p><button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add transaction</button></div>

          ) : (

            <div className="table-wrap">

              <table>

                <thead><tr><th>Transaction</th><th>Category</th><th>Date</th><th>Type</th><th>Amount</th><th>Actions</th></tr></thead>

                <tbody>

                  {filteredTransactions.map(item => (

                    <tr key={item.id}>

                      <td><div className="transaction-name"><span className={`transaction-symbol ${item.type?.toUpperCase() === "INCOME" ? "symbol-income" : "symbol-expense"}`}>{item.type?.toUpperCase() === "INCOME" ? <ArrowUpRight size={17} /> : <ArrowDownRight size={17} />}</span><div><strong>{item.title}</strong><small>#{item.id} · {item.description || "No description"}</small></div></div></td>

                      <td><span className="category-pill">{item.category || "Uncategorized"}</span></td>

                      <td><span className="date-cell"><CalendarDays size={14} />{item.transactionDate}</span></td>

                      <td><span className={`type-pill ${item.type?.toUpperCase() === "INCOME" ? "pill-income" : "pill-expense"}`}>{item.type}</span></td>

                      <td className={`money-cell ${item.type?.toUpperCase() === "INCOME" ? "money-income" : "money-expense"}`}>{item.type?.toUpperCase() === "INCOME" ? "+" : "−"}{money(item.amount)}</td>

                      <td><div className="row-actions">

                        <button title="View" className="action-icon" onClick={() => viewTransaction(item.id)}><Eye size={16} /></button>

                        <button title="Full update" className="action-icon" onClick={() => openEdit(item, "edit")}><Pencil size={16} /></button>

                        <button title="Partial update" className="action-icon" onClick={() => openEdit(item, "patch")}><SlidersHorizontal size={16} /></button>

                        <button title="Delete" className="action-icon delete-action" onClick={() => removeTransaction(item.id)}><Trash2 size={16} /></button>

                      </div></td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

          <div className="table-footer"><span>Showing {filteredTransactions.length} of {transactions.length} transactions</span><span>All amounts in INR (₹)</span></div>

        </section>



        <footer className="footer"><span>FINORA <b>·</b> Personal Finance Tracker</span><span><CircleDollarSign size={14} /> Spend mindfully. Save consistently.</span></footer>

      </main>

    </div>

  );

}


function App() {
    const location = useLocation();
  const isLoggedIn = (() => {
    try {
      const user = JSON.parse(
        localStorage.getItem("finoraUser") || "null"
      );
      return Boolean(user?.id);
    } catch {
      return false;
    }
  })();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/register"
        element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <Register />
          )
        }
      />

      <Route
        path="/"
        element={
          isLoggedIn ? (
            <DashboardContent />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;


