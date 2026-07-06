import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { 
  getExpenses, 
  addExpense, 
  getBudgetLimit, 
  updateBudgetLimit, 
  Transaction 
} from '../database/actions';

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState(10000);
  
  // State variables to capture user inputs in the Add Expense 
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('')
  const [merchant, setMerchant] = useState('')
  const [category, setCategory] = useState<'Need' | 'Want'>('Need');
  const [bank, setBank] = useState('Cash');

  //fetch data from SQLite
  const loadDatabaseData = () => {
    try {
      const dbExpenses = getExpenses();
      const dbBudget = getBudgetLimit();
      setExpenses(dbExpenses);
      setBudget(dbBudget)
    } catch (error) {
      console.error("Failed to fetch from SQLite:", error);
    }
  }

  useEffect(()=>{
    loadDatabaseData();
  },[])

  const handleAddExpense = () =>{
    if(!amount || !merchant){
      Alert.alert("Required Fields", "Please enter both amount and merchant name.");
      return;
    }
    const parsedAmount = parseFloat(amount);
    if(isNaN(parsedAmount) || parsedAmount <= 0){
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }
  }

  //Math Calculations
  const totalSpent = expenses.reduce((sum,tx) => sum + tx.amount, 0);
  const remainingBudget = budget - totalSpent;
  const spentPercentage = Math.min(100, Math.max(0, budget > 0 ? (totalSpent / budget) * 100 : 0));

  //Zero-Budget Predictor Math
  const today = new Date();
  const currentDay = today.getDate();
  const totalDaysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const dailyBurnRate = currentDay > 0 ? totalSpent / currentDay : 0;
  const daysRemainingUntilZero = dailyBurnRate > 0 ? remainingBudget / dailyBurnRate : totalDaysInMonth;
  const predictedZeroDay = Math.min(totalDaysInMonth, Math.max(1, Math.round(currentDay + daysRemainingUntilZero)));
  const daysLeftInMonth = totalDaysInMonth - currentDay;
  const isBudgetInDanger = predictedZeroDay < totalDaysInMonth && remainingBudget < budget * 0.3;
  
  // AI Roast Configuration (Tied to highest "Want" purchase)
  const wants = expenses.filter(e => e.category === 'Want');
  const worstPurchase = wants.length > 0 ? wants.reduce((max, e) => e.amount > max.amount ? e : max, wants[0]) : null;
  const roastText = worstPurchase 
    ? `"${worstPurchase.merchant} for ₹${worstPurchase.amount}? You are living a luxury lifestyle on a beggar's bank balance, siva. RIP savings."`
    : `"No 'Want' transactions found yet. What, are you acting like a monk now? Go spend something stupid so I can roast you."`;
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
  emptyContainer: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#8E8E93',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
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
    height: 80, // larger spacer to prevent overlap with FAB
  },
  // FAB Style
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF4757',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FF4757',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderColor: '#2C2C2E',
    borderTopWidth: 1,
  },
  modalHeader: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputLabel: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  toggleBtnActiveNeed: {
    backgroundColor: '#2F3542',
    borderColor: '#E5E5EA',
  },
  toggleBtnActiveWant: {
    backgroundColor: 'rgba(255, 159, 67, 0.2)',
    borderColor: '#FF9F43',
  },
  toggleBtnInactive: {
    backgroundColor: '#2C2C2E',
    borderColor: 'transparent',
  },
  smallToggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 3,
    borderWidth: 1,
  },
  smallToggleActive: {
    backgroundColor: '#FF4757',
    borderColor: '#FF4757',
  },
  smallToggleInactive: {
    backgroundColor: '#2C2C2E',
    borderColor: 'transparent',
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  toggleTextInactive: {
    color: '#8E8E93',
    fontSize: 14,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelBtn: {
    backgroundColor: '#2C2C2E',
  },
  cancelBtnText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#FF4757',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
