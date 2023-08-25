import { SHORT_DELAY_IN_MS, DELAY_IN_MS } from '../../src/constants/delays';
describe('Fibonacci Page', () => {
  const fibonacci = (n: number): number => {
    if (n === 1 || n === 2) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
  };

  beforeEach(() => {
    cy.visit('http://localhost:3000/fibonacci');
  });

  it('Проверка доступности кнопки при пустом поле ввода', () => {
    cy.get('input').should('have.value', '');
    cy.get('button[data-test-id="buttonFibonacci"]').should('be.disabled');
  });

  it('Проверка корректной генерации чисел Фибоначчи', () => {
    const inputNumber = 5;

    cy.get('input').type(inputNumber.toString());
    cy.get('button[data-test-id="buttonFibonacci"]').click();

    for (let i = 1; i < inputNumber; i++) {
      cy.wait(SHORT_DELAY_IN_MS);
      cy.get(`[data-test-id="circle"]:eq(${i - 1})`).should('have.text', fibonacci(i).toString());
    }
  });
});
