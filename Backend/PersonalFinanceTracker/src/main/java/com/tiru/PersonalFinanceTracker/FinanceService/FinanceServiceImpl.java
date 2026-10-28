package com.tiru.PersonalFinanceTracker.FinanceService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tiru.PersonalFinanceTracker.Entity.FinanceTracker;
import com.tiru.PersonalFinanceTracker.Repository.FinanceRepo;

@Service
public class FinanceServiceImpl implements FinanceService {
	@Autowired
	FinanceRepo financeRepo;

	@Override
	public FinanceTracker addTransaction(FinanceTracker f) {

		return financeRepo.save(f);
	}

	@Override
	public List<FinanceTracker> getAllTransactions() {

		return financeRepo.findAll();
	}

	@Override
	public FinanceTracker getTransactionById(Long id) {

		return financeRepo.findById(id).get();
	}

	@Override
	public FinanceTracker updateTransaction(Long id, FinanceTracker f) {

		FinanceTracker finance = getTransactionById(id);
		finance.setTitle(f.getTitle());
		finance.setAmount(f.getAmount());
		finance.setType(f.getType());
		finance.setCategory(f.getCategory());
		finance.setTransactionDate(f.getTransactionDate());
		finance.setDescription(f.getDescription());

		return financeRepo.save(finance);
	}

	@Override
	public FinanceTracker patchTransaction(Long id, FinanceTracker f) {
		FinanceTracker finance = getTransactionById(id);
		if (f.getTitle() != null) {
			finance.setTitle(f.getTitle());
		}
		if (f.getAmount() != null) {
			finance.setAmount(f.getAmount());
		}
		if (f.getType() != null) {
			finance.setType(f.getType());
		}
		if (f.getCategory() != null) {
			finance.setCategory(f.getCategory());
		}
		if (f.getTransactionDate() != null) {
			finance.setTransactionDate(f.getTransactionDate());
		}
		if (f.getDescription() != null) {
			finance.setDescription(f.getDescription());
		}
		return financeRepo.save(finance);
	}

	@Override
	public void deleteTransaction(Long id) {
		financeRepo.deleteById(id);

	}
	
	@Override
	public List<FinanceTracker> getTransactionsByUserId(Long userId) {
	    return financeRepo.findByUserId(userId);
	}

}
