export const calculateFibonacci = async (n: number) => {
  const sequence = [1, 1];
  while (sequence.length <= n) {
    const nextNumber = sequence[sequence.length - 1] + sequence[sequence.length - 2];
    sequence.push(nextNumber);
  }
  return sequence;
};