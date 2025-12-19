/* eslint-disable no-undef */
///<reference types = "vitest"/>

import { describe } from "vitest";
// import { daysCounter } from "./functions/eventHandlingFn";
import { wordCounter } from "./functions/eventHandlingFn";
import { counter } from "./functions/eventHandlingFn";
import { filterProducts } from "./functions/searchFunction";
import DoubleLinkedList from "./functions/DoubleLinkedList";
import { priceFormatter } from "./functions/eventHandlingFn";
import { countConverter } from "./functions/eventHandlingFn";
import { sanitizeText } from "./functions/eventHandlingFn";

describe("Carosels", () => {
  const list = new DoubleLinkedList();
  list.add(1);
  list.add(2);
  list.add(3);
  test("size,current,next,prev", () => {
    expect(list.getSize()).toBe(3);
    expect(list.getCurrent()).toBe(1);
    list.moveNext();
    expect(list.getCurrent()).toBe(2);
    list.movePrev();
    expect(list.getCurrent()).toBe(1);
  });

  test("checking for circularity", () => {
    list.moveNext();
    expect(list.getCurrent()).toBe(2);
    list.moveNext();
    expect(list.getCurrent()).toBe(3);
    list.moveNext();
    expect(list.getCurrent()).toBe(1);
    list.movePrev();
    expect(list.getCurrent()).toBe(3);
  });
});

//word counter

describe("counting words", () => {
  test("word counter", () => {
    const words = wordCounter("hello world");
    expect(words).toBe(2);
  });

  test("words with commans,hyphens,dots", () => {
    const words = wordCounter(
      "hello welcome to my world.This is a greate and wonderfull day to be here,Hello World."
    );
    expect(words).toBe(17);
  });

  test("difficult text case", () => {
    const words = wordCounter("Hi! This-test, is.a simple-case...");
    expect(words).toBe(7);
  });
});

//counter

describe("counter", () => {
  test("counter perSec", () => {
    vi.useFakeTimers();
    counter(
      10,
      (seconds) => {
        if (seconds === 8) {
          expect(seconds).toBe(8);
        }
      },
      () => {
        expect(true).toBe(true);
      }
    );

    vi.advanceTimersByTime(2000);
    vi.useRealTimers();
  });
});

describe("filter products", () => {
  const dataSet = [
    { category: "Electornic", name: "tv", price: 1000, stock: 10 },
    { category: "audio", name: "speaker", price: 1000, stock: 10 },
    { category: "camera", name: "camera", price: 1000, stock: 10 },
    { category: "footwear", name: "shoes", price: 1000, stock: 10 },
  ];
  test("filtering products", () => {
    const products = filterProducts(dataSet, "Electornic", "category").map(
      (p) => p.name
    );
    expect(products[0]).toBe("tv");
  });

  test("filtering products with of padding any data",()=>{
    const products = filterProducts(dataSet, "", "").map(
      (p) => p.name
    );
    expect(products[0]).toBe(undefined);
  })
});

describe("price formatter",()=>{
   test("price formatter",()=>{
      const price = priceFormatter(124000);
      expect(price).toBe("1,24,000.00");
   })
})

describe("count converter",()=>{
  test("1240",()=>{
     const count = countConverter(1240);
     expect(count).toBe("1.2K");
  })
  test("124000",()=>{
     const count = countConverter(124000);
     expect(count).toBe("124K");
  })
  test("12400000",()=>{
     const count = countConverter(1240000);
     expect(count).toBe("1.2M");
  })
})


describe("sanitization text", () => {
  
  test("plain text allowed", () => {
    const cleanText = sanitizeText("hello world");
    expect(cleanText).toBe("hello world");
  });

  test("HTML tags removed", () => {
    const cleanText = sanitizeText("<h1>hello world</h1>");
    expect(cleanText).toBe("hello world");
  });

  test("script tags removed", () => {
    const cleanText = sanitizeText("<script>alert('hack')</script>");
    expect(cleanText).toBe("");
  });

  test("URLs removed", () => {
    const cleanText1 = sanitizeText("check this http://example.com");
    const cleanText2 = sanitizeText("go to https://google.com");
    const cleanText3 = sanitizeText("visit www.example.com");

    expect(cleanText1).toBe("check this");
    expect(cleanText2).toBe("go to");
    expect(cleanText3).toBe("visit");
  });

  test("removes attributes", () => {
    const cleanText = sanitizeText('<p onclick="hack()">Hello</p>');
    expect(cleanText).toBe("Hello");
  });

  test("complex injection removed", () => {
    const cleanText = sanitizeText(`<img src=x onerror=alert("hack")>hi`);
    expect(cleanText).toBe("hi");
  });

});

// this test cases will not act like dynamic so they should fail by days going to increase

// describe("days counter",()=>{
//    test("today",()=>{
//       const days = daysCounter(new Date());
//       expect(days).toBe(0);
//    });
//    test("upcoming days difference",()=>{
//        const days = daysCounter("2025-09-13");
//        expect(days).toBe(10);
//    });

//    test("past days difference",()=>{
//       const days = daysCounter("2025-08-1");
//       expect(days).toBe(33);
//    });

//    test("date of birth days",()=>{
//      const days = daysCounter("2003-09-1");
//      expect(days).toBe(8038);
//    })
// })
