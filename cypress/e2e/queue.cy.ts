import { state__default, state__changing, cyHead, cyTail } from '../constants';
import { SHORT_DELAY_IN_MS } from '../../src/constants/delays';

describe('Queue Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/queue');
  });

  it('Проверка доступности кнопки при пустом поле ввода', () => {
    cy.get('input').should('have.value', '');
    cy.get('button[data-test-id="addToQueue"]').should('be.disabled');
  });

  it('Проверка добавления элемента в очередь', () => {
    const char = 'A';
    cy.get('input').type(char);
    cy.get('button[data-test-id="addToQueue"]').click();

    cy.get('[data-test-id="circle"]').contains(char)
      .parent()  // Выбираем родительский элемент
      .should('have.css', 'border-color', state__changing);

    cy.wait(SHORT_DELAY_IN_MS);

    cy.get('[data-test-id="circle"]').contains(char)
      .parent()  // Выбираем родительский элемент
      .should('have.css', 'border-color', state__default);

    cy.get(cyHead).should('exist');
    cy.get(cyTail).should('exist');
  });

  it('Проверка что при удалении удаляется всегда первый символ из очереди', () => {
    const chars = ['A', 'B', 'C'];
    chars.forEach(char => {
      cy.get('input').type(char);
      cy.get('button[data-test-id="addToQueue"]').click();
      cy.wait(SHORT_DELAY_IN_MS);
    });

    chars.forEach((char, index) => {
      // Проверка, что кружок с текущим индексом содержит текущий символ
      cy.get('[data-test-id="circle"]').eq(index).should('contain.text', char);

      // Проверка, что все кружки перед текущим индексом пусты
      for (let i = 0; i < index; i++) {
        cy.get('[data-test-id="circle"]').eq(i).should('not.contain.text', chars[i]);
      }

      // Удаляем первый элемент очереди
      cy.get('button[data-test-id="removeFromQueue"]').click();
      cy.wait(SHORT_DELAY_IN_MS);

      // Проверка, что все последующие элементы сохранили свои символы
      chars.slice(index + 1).forEach((remainingChar, remainingIndex) => {
        cy.wait(SHORT_DELAY_IN_MS);
        cy.get('[data-test-id="circle"]').eq(remainingIndex + index + 1).should('contain.text', remainingChar);
      });
    });
  });


  it('Проверка очистки очереди', () => {
    const chars = ['A', 'B'];
    chars.forEach(char => {
      cy.get('input').type(char);
      cy.get('button[data-test-id="addToQueue"]').click();
      cy.wait(SHORT_DELAY_IN_MS);
    });

    cy.get('button[data-test-id="clearQueue"]').click();
    cy.wait(SHORT_DELAY_IN_MS);

    cy.get('[data-test-id="circle"]').should('have.length', 7); // Убедимся, что все 7 кружков присутствуют
    cy.get('[data-test-id="circle"]').each(($circle) => {
      expect($circle.text().trim()).to.be.empty;  // Убедимся, что каждый кружок пуст
    });
  });
});
