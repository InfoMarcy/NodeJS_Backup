package com.bazdigital;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.bazdigital.services.FizzBuzz;

public class Junit5 {
	
	
	private FizzBuzz fb;
	
	// use to initialize the object before each test
	@BeforeEach
	public void before() {
		fb = new FizzBuzz();
	}

	@DisplayName("Running a Test with JUnit 5")
	@Test
	public void test() {
		System.out.println("Test Succeded");
	}
	
	
	@DisplayName("Play FizzBuzz with number =  1")
	@Test
	public void testFizzBuzz() {
		String fizzBuzz = fb.play(1);
		Assertions.assertEquals(fizzBuzz, "1");
	}
	
	
	
	@DisplayName("Play FizzBuzz with number =  3")
	@Test
	public void testFizz() {
		String fizzBuzz = fb.play(3);
		Assertions.assertEquals(fizzBuzz, "Fizz");
	}
	
	
	
	@DisplayName("Play FizzBuzz with number =  5")
	@Test
	public void testBuzz() {
		String fizzBuzz = fb.play(5);
		Assertions.assertEquals(fizzBuzz, "Buzz");
	}

	
	// Test an exception
	@DisplayName("Don't play FizzBuzz with number =  0")
	@Test
	public void testZero() {
		Assertions.assertThrows(IllegalArgumentException.class,  () -> fb.play(0));
	};
	
	
	// reset the values of the object after each test
	@AfterEach
	public void tearDown() {
		fb = null;
	}
	
	// ignore a particular test
	@Disabled
	@DisplayName("Play FizzBuzz with number =  2")
	@Test
	public void testFizzBuzz2() {
		String fizzBuzz = fb.play(1);
		Assertions.assertEquals(fizzBuzz, "2");
	}

}

