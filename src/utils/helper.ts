export const simulateError = (errorRate: number = 0.08): boolean => {
  
  return Math.random() < errorRate // 8% default error rate
}

