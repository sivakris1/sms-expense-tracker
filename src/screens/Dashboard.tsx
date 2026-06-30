import React from "react"
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native'

// Mock transactions split into Needs and Wants
const MOCK_TRANSACTIONS = [
  { id: '1', amount: 4500, merchant: 'Hostel Rent', category: 'Need', bank: 'SBI', timestamp: 'June 1' },
  { id: '2', amount: 350, merchant: 'Zomato (Biryani)', category: 'Want', bank: 'HDFC', timestamp: 'Today, 2:30 PM' },
  { id: '3', amount: 800, merchant: 'College Exam Fee', category: 'Need', bank: 'SBI', timestamp: 'Yesterday' },
  { id: '4', amount: 450, merchant: 'Pharmacy Medicines', category: 'Need', bank: 'Cash', timestamp: '2 days ago' },
  { id: '5', amount: 1500, merchant: 'Amazon Shopping', category: 'Want', bank: 'HDFC', timestamp: '3 days ago' },
];

export default function Dashboard(){
    const totalBudget = 10000;
    
     // Calculate total spent
    const totalSpent = MOCK_TRANSACTIONS.reduce((sum, tx) => sum + tx.amount, 0);
    const remainingBudget = totalBudget - totalSpent;
    const spentPercentage = (totalSpent / totalBudget) * 100;

    //Algorithm for zero-budget predictor
    const today = new Date();
    const currentDay = today.getDate();
    const totalDaysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    //calculate daily burn rate
    const dailyBurnRate = totalSpent / currentDay;

    const daysRemainingUntilZero = dailyBurnRate > 0 ? remainingBudget / dailyBurnRate : totalDaysInMonth

    const predictedZeroDay = Math.min(totalDaysInMonth, Math.max(1, Math.round(currentDay+daysRemainingUntilZero)))

     const daysLeftInMonth = totalDaysInMonth - currentDay;
  
  // Warning status
  const isBudgetInDanger = predictedZeroDay < totalDaysInMonth;
  // --- AI Personality Config ---
  const roastData = {
    personality: 'Savage Roommate 👿',
    targetMerchant: 'Zomato (Biryani)',
    roastText: '"₹350 for Biryani? Last week you borrowed ₹20 from me for chai. You are living a luxury lifestyle on a beggar\'s bank balance, my friend."'
  };

   return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hello Siva,</Text>
        <Text style={styles.appTitle}>Roast Wallet</Text>
      </View>
      {/* Main Budget Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Budget Progress</Text>
        <View style={styles.budgetRow}>
          <Text style={styles.spentText}>₹{totalSpent}</Text>
          <Text style={styles.budgetText}> / ₹{totalBudget}</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${spentPercentage}%` }]} />
        </View>
        <Text style={styles.progressPercent}>
          ₹{remainingBudget} remaining for the next {daysLeftInMonth} days
        </Text>
      </View>
      {/* NEW: Zero-Budget Predictor Widget */}
      <View style={[styles.card, isBudgetInDanger ? styles.dangerCard : styles.safeCard]}>
        <Text style={styles.cardTitle}>Zero-Budget Predictor 🚀</Text>
        <View style={styles.predictorRow}>
          <Text style={styles.burnRateLabel}>Avg Daily Burn Rate:</Text>
          <Text style={styles.burnRateValue}>₹{dailyBurnRate.toFixed(0)}/day</Text>
        </View>
        <View style={styles.divider} />
        {isBudgetInDanger ? (
          <Text style={styles.dangerPredictionText}>
            ⚠️ At this rate, your money will hit ₹0 on the **{predictedZeroDay}th** of this month — **{totalDaysInMonth - predictedZeroDay} days** before the month ends!
          </Text>
        ) : (
          <Text style={styles.safePredictionText}>
            ✅ Safe! At this rate, your budget will comfortably survive the month.
          </Text>
        )}
      </View>
      {/* NEW: Dynamic AI Roast Box */}
      <View style={[styles.card, styles.roastCard]}>
        <View style={styles.roastHeader}>
          <Text style={styles.roastTitle}>Active Roast Bot: {roastData.personality}</Text>
        </View>
        <Text style={styles.roastTarget}>
          Target: {roastData.targetMerchant} (Unnecessary Spending)
        </Text>
        <Text style={styles.roastQuote}>
          {roastData.roastText}
        </Text>
      </View>
      {/* Transactions Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>
      {MOCK_TRANSACTIONS.map((tx) => (
        <View key={tx.id} style={styles.txRow}>
          <View style={styles.txLeft}>
            <View style={[styles.txIconBg, tx.category === 'Need' ? styles.needIcon : styles.wantIcon]}>
              <Text style={styles.txIconText}>{tx.category === 'Need' ? '🛡️' : '🛍️'}</Text>
            </View>
            <View style={tx.category === 'Need' ? null : ""}>
              <Text style={styles.txMerchant}>{tx.merchant}</Text>
              <Text style={styles.txMeta}>{tx.bank} • {tx.category}</Text>
            </View>
          </View>
          <Text style={styles.txAmount}>-₹{tx.amount}</Text>
        </View>
      ))}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F12', // Premium deep dark grey
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 25,
  },
  welcomeText: {
    color: '#8E8E93',
    fontSize: 16,
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  cardTitle: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  spentText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  budgetText: {
    color: '#8E8E93',
    fontSize: 16,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#2C2C2E',
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF4757', // Accent red
    borderRadius: 3,
  },
  progressPercent: {
    color: '#8E8E93',
    fontSize: 12,
  },
  // Predictor Styles
  dangerCard: {
    borderColor: '#FF9F43',
    borderWidth: 1,
  },
  safeCard: {
    borderColor: '#2ED573',
    borderWidth: 1,
  },
  predictorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  burnRateLabel: {
    color: '#E5E5EA',
    fontSize: 14,
  },
  burnRateValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#2C2C2E',
    marginVertical: 8,
  },
  dangerPredictionText: {
    color: '#FF9F43',
    fontSize: 13,
    lineHeight: 18,
  },
  safePredictionText: {
    color: '#2ED573',
    fontSize: 13,
    lineHeight: 18,
  },
  // Roast Styles
  roastCard: {
    borderColor: '#FF4757',
    borderWidth: 1.5,
    backgroundColor: 'rgba(255, 71, 87, 0.05)',
  },
  roastHeader: {
    marginBottom: 6,
  },
  roastTitle: {
    color: '#FF4757',
    fontWeight: 'bold',
    fontSize: 15,
  },
  roastTarget: {
    color: '#8E8E93',
    fontSize: 11,
    marginBottom: 10,
  },
  roastQuote: {
    color: '#E5E5EA',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  // Transaction Styles
  sectionHeaderRow: {
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  needIcon: {
    backgroundColor: '#2F3542',
  },
  wantIcon: {
    backgroundColor: 'rgba(255, 159, 67, 0.2)',
  },
  txIconText: {
    fontSize: 16,
  },
  txMerchant: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  txMeta: {
    color: '#8E8E93',
    fontSize: 11,
  },
  txAmount: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});