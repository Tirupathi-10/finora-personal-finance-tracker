
package com.tiru.PersonalFinanceTracker.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tiru.PersonalFinanceTracker.Entity.FinanceTracker;

public interface FinanceRepo extends JpaRepository<FinanceTracker, Long> {

    List<FinanceTracker> findByUserId(Long userId);
}
