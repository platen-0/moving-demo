import { NextResponse } from 'next/server';

const MOCK_RESULTS = [
  {
    creditor: 'Chase Sapphire',
    balance: 8450,
    interestRate: 24.99,
    minimumPayment: 253,
  },
  {
    creditor: 'Capital One Quicksilver',
    balance: 4200,
    interestRate: 26.99,
    minimumPayment: 126,
  },
  {
    creditor: 'Discover It',
    balance: 6800,
    interestRate: 22.49,
    minimumPayment: 204,
  },
  {
    creditor: 'Citi Double Cash',
    balance: 3100,
    interestRate: 20.74,
    minimumPayment: 93,
  },
];

export async function POST() {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return random mock result
  const result = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];

  return NextResponse.json({
    success: true,
    data: {
      extractedData: result,
    },
  });
}
