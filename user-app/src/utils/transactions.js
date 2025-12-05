// wrstudios-frontend/user-app/src/utils/transactions.js

const TRANSACTIONS_KEY = "wrstudios_transactions";
const USERS_KEY = "wrstudios_users"; 
const CURRENT_USER_KEY = "currentUser"; 

export const getTransactions = () => {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const addTransaction = (transaction) => {
  const transactions = getTransactions();
  const newTransaction = {
    id: `TRX${Date.now()}`,
    date: new Date().toISOString(),
    status: "pending", 
    ...transaction,
  };
  transactions.unshift(newTransaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  return { success: true };
};

// Extract membership tier from plan name (Basic, Premium, VIP)
const extractMembershipTier = (planName) => {
  if (!planName) return "Free";
  const name = planName.toLowerCase();
  if (name.includes("basic")) return "Basic";
  if (name.includes("vip")) return "VIP";
  if (name.includes("premium")) return "Premium";
  return "Free";
};

export const updateTransactionStatus = (transactionId, newStatus) => {
  const transactions = getTransactions();
  const index = transactions.findIndex((t) => t.id === transactionId);

  if (index === -1) return { success: false };

  transactions[index].status = newStatus;
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));

  // Nếu duyệt -> Nâng cấp User
  if (newStatus === "approved") {
    const userId = transactions[index].userId;
    const planName = transactions[index].planName;
    const membershipTier = extractMembershipTier(planName);
    
    // Update Database User
    const usersJson = localStorage.getItem(USERS_KEY);
    if (usersJson) {
      let users = JSON.parse(usersJson);
      const uIdx = users.findIndex(u => u.id === userId || u.username === userId);
      if (uIdx !== -1) {
        users[uIdx].rank = planName;
        users[uIdx].membershipTier = membershipTier;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        // Also update auth token if user is currently logged in
        const authData = localStorage.getItem("wrstudios_auth_token");
        if (authData) {
          try {
            const auth = JSON.parse(authData);
            if (auth.user.id === userId) {
              auth.user.membershipTier = membershipTier;
              localStorage.setItem("wrstudios_auth_token", JSON.stringify(auth));
              window.dispatchEvent(new Event("authChange"));
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }
  }
  return { success: true };
};