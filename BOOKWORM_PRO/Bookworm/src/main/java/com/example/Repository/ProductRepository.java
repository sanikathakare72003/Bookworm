package com.example.Repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.models.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product,Integer>{

	  List<Product> findByProductNameContainingIgnoreCase(String productName,Pageable pageable);
	  
	  List<Product> findByLibraryTrue();
}