package com.tiru.PersonalFinanceTracker.FinanceService;

import java.util.List;

import com.tiru.PersonalFinanceTracker.Entity.FinanceTracker;

public interface FinanceService {

	public FinanceTracker addTransaction(FinanceTracker f);

	public List<FinanceTracker> getAllTransactions();

	public FinanceTracker getTransactionById(Long id);
	
	List<FinanceTracker> getTransactionsByUserId(Long userId);

	public FinanceTracker updateTransaction(Long id, FinanceTracker f);

	public FinanceTracker patchTransaction(Long id, FinanceTracker f);

	public void deleteTransaction(Long id);
}
