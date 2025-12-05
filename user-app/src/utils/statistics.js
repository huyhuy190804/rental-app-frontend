// wrstudios-frontend/user-app/src/utils/statistics.js
import { getAllUsers } from "./auth";
import { getPlans } from "./plans";

/**
 * Get statistics for a given date range (month or year)
 */

export const getStatistics = async () => {
  const allUsers = await getAllUsers();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Parse user registration dates and premium subscription info
  const userStats = {
    month: {
      newUsers: 0,
      premiumUsers: 0,
      totalPosts: 0,
      revenue: 0
    },
    year: {
      newUsers: 0,
      premiumUsers: 0,
      totalPosts: 0,
      revenue: 0
    },
    all: {
      totalUsers: allUsers.length,
      totalPremiumUsers: 0,
      totalPosts: 0,
      totalRevenue: 0
    }
  };

  (allUsers || []).forEach(user => {
    // Count total premium users
    if (user.accountType === "Premium") {
      userStats.all.totalPremiumUsers++;
    }

    // Count posts
    const postsCount = user.postsCount || 0;
    userStats.all.totalPosts += postsCount;

    // Parse registration date (assume YYYY-MM-DD format or timestamp)
    let regDate = null;
    if (user.registeredDate) {
      regDate = new Date(user.registeredDate);
    }

    // Month stats
    if (regDate && regDate.getFullYear() === currentYear && regDate.getMonth() === currentMonth) {
      userStats.month.newUsers++;
    }

    if (user.accountType === "Premium" && user.premiumDate) {
      const premiumDate = new Date(user.premiumDate);
      if (premiumDate.getFullYear() === currentYear && premiumDate.getMonth() === currentMonth) {
        userStats.month.premiumUsers++;
        // Estimate revenue per premium user (based on plans)
        userStats.month.revenue += user.premiumPrice || 0;
      }
    }

    if (regDate && regDate.getFullYear() === currentYear && regDate.getMonth() === currentMonth) {
      userStats.month.totalPosts += postsCount;
    }

    // Year stats
    if (regDate && regDate.getFullYear() === currentYear) {
      userStats.year.newUsers++;
    }

    if (user.accountType === "Premium" && user.premiumDate) {
      const premiumDate = new Date(user.premiumDate);
      if (premiumDate.getFullYear() === currentYear) {
        userStats.year.premiumUsers++;
        userStats.year.revenue += user.premiumPrice || 0;
      }
    }

    if (regDate && regDate.getFullYear() === currentYear) {
      userStats.year.totalPosts += postsCount;
    }

    // All-time totals
    if (user.accountType === "Premium" && user.premiumPrice) {
      userStats.all.totalRevenue += user.premiumPrice;
    }
  });

  return userStats;
};

/**
 * Get detailed monthly breakdown for charts
 */
export const getMonthlyBreakdown = async () => {
  const allUsers = await getAllUsers();
  const currentYear = new Date().getFullYear();
  const months = [
    "T1", "T2", "T3", "T4", "T5", "T6",
    "T7", "T8", "T9", "T10", "T11", "T12"
  ];

  const monthlyData = months.map((month, idx) => ({
    month,
    newUsers: 0,
    premiumSignups: 0,
    posts: 0,
    revenue: 0
  }));

  (allUsers || []).forEach(user => {
    // New users per month
    if (user.registeredDate) {
      const regDate = new Date(user.registeredDate);
      if (regDate.getFullYear() === currentYear) {
        monthlyData[regDate.getMonth()].newUsers++;
        monthlyData[regDate.getMonth()].posts += user.postsCount || 0;
      }
    }

    // Premium signups per month
    if (user.accountType === "Premium" && user.premiumDate) {
      const premiumDate = new Date(user.premiumDate);
      if (premiumDate.getFullYear() === currentYear) {
        monthlyData[premiumDate.getMonth()].premiumSignups++;
        monthlyData[premiumDate.getMonth()].revenue += user.premiumPrice || 0;
      }
    }
  });

  return monthlyData;
};

/**
 * Get revenue breakdown by plan type
 */
export const getRevenueByPlan = async () => {
  const allUsers = await getAllUsers();
  const plans = await getPlans();

  const revenueByPlan = plans.map(plan => ({
    planName: plan.name,
    planPrice: plan.price,
    subscriptionCount: 0,
    totalRevenue: 0
  }));

  (allUsers || []).forEach(user => {
    if (user.accountType === "Premium" && user.premiumPlan) {
      const planEntry = revenueByPlan.find(p => p.planName === user.premiumPlan);
      if (planEntry) {
        planEntry.subscriptionCount++;
        planEntry.totalRevenue += user.premiumPrice || 0;
      }
    }
  });

  return revenueByPlan.filter(p => p.subscriptionCount > 0);
};

/**
 * Get user growth over time
 */
export const getUserGrowth = async () => {
  const allUsers = await getAllUsers();
  const currentYear = new Date().getFullYear();

  const growthData = {};
  for (let month = 0; month < 12; month++) {
    growthData[month] = 0;
  }

  (allUsers || []).forEach(user => {
    if (user.registeredDate) {
      const regDate = new Date(user.registeredDate);
      if (regDate.getFullYear() === currentYear) {
        growthData[regDate.getMonth()]++;
      }
    }
  });

  const months = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
  return months.map((month, idx) => ({
    month,
    users: growthData[idx]
  }));
};
