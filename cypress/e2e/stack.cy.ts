import { state__default, state__changing } from '../constants';
import { SHORT_DELAY_IN_MS } from '../../src/constants/delays';

describe('Stack Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/stack');
  });

  it('Проверка доступности кнопки при пустом поле ввода', () => {
    cy.get('input').should('have.value', '');
    cy.get('button[data-test-id="addToStack"]').should('be.disabled');
  });

  it('Проверка добавления элемента в стек', () => {
    const char = 'A';
    cy.get('input').type(char);
    cy.get('button[data-test-id="addToStack"]').click();

    cy.get('[data-test-id="circle"]').contains(char)
      .parent()  // Выбираем родительский элемент
      .should('have.css', 'border-color', state__changing);

    cy.wait(SHORT_DELAY_IN_MS);

    cy.get('[data-test-id="circle"]').contains(char)
      .parent()  // Выбираем родительский элемент
      .should('have.css', 'border-color', state__default);

  });

  it('Проверка удаления элемента из стека', () => {
    const char = 'A';
    cy.get('input').type(char);
    cy.get('button[data-test-id="addToStack"]').click();
    cy.get('button[data-test-id="removeFromStack"]').click();

    cy.contains(char).should('not.exist');
  });

  it('Проверка очистки стека', () => {
    const chars = ['A', 'B'];
    chars.forEach(char => {
      cy.get('input').type(char);
      cy.get('button[data-test-id="addToStack"]').click();
    });

    cy.get('button[data-test-id="clearStack"]').click();
    cy.get('[data-test-id="stackCircleContainer"]').children().should('have.length', 0);
  });
});
