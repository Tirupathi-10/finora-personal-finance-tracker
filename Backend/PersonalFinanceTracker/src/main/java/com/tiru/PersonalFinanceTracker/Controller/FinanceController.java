package com.tiru.PersonalFinanceTracker.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tiru.PersonalFinanceTracker.Entity.FinanceTracker;
import com.tiru.PersonalFinanceTracker.FinanceService.FinanceService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/finance")
public class FinanceController {

	@Autowired
	FinanceService financeService;

	@PostMapping("/create")
	FinanceTracker createTransaction(@RequestBody FinanceTracker f) {
		return financeService.addTransaction(f);
	}

	@GetMapping("/get/{id}")
	FinanceTracker transactionById(@PathVariable Long id) {
		return financeService.getTransactionById(id);
	}

	@GetMapping("/getall/{userId}")
	public List<FinanceTracker> allTransactions(@PathVariable Long userId) {
		return financeService.getTransactionsByUserId(userId);
	}

	@PutMapping("/update/{id}")
	FinanceTracker updateTransactionbyId(@PathVariable Long id, @RequestBody FinanceTracker f) {
		return financeService.updateTransaction(id, f);
	}

	@PatchMapping("/patch/{id}")
	FinanceTracker patchTransaction(@PathVariable Long id, @RequestBody FinanceTracker f) {
		return financeService.patchTransaction(id, f);
	}

	@DeleteMapping("/delete/{id}")
	String deleteTransaction(@PathVariable Long id) {
		financeService.deleteTransaction(id);
		return "Transaction Deleted Successfully";
	}
}
