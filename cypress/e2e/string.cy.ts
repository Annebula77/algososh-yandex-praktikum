import { SHORT_DELAY_IN_MS, DELAY_IN_MS } from '../../src/constants/delays';
import { state__default, state__changing, state__modified } from '../constants';

describe('StringComponent tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000/recursion');
  });

  it('Проверка доступности кнопки "Добавить" при пустом поле ввода', () => {
    cy.get('input[data-test-id="inputExtra"]').should('have.value', '');
    cy.get('button[data-test-id="buttonExtra"]').should('be.disabled');
  });

  it('Проверка процесса разворота строки', () => {
    const testString = 'abcde';

    cy.get('input[data-test-id="inputExtra"]').type(testString);
    cy.get('button[data-test-id="buttonExtra"]').click();

    // Проверка начального состояния букв
    testString.split('').forEach((char) => {
      cy.contains(char).parent().find('[data-test-id="circle"]').should('have.css', 'border-color', state__default);
    });

    it('Проверка непосредственно процесса разворота строки', () => {
      const testString = 'abcde';

      cy.get('input[data-test-id="inputExtra"]').type(testString);
      cy.get('button[data-test-id="buttonExtra"]').click();

      for (let i = 0; i < testString.length / 2; i++) {

        // Получаем текущие первый и последний символы
        const firstChar = testString.charAt(i);
        const lastChar = testString.charAt(testString.length - 1 - i);

        // Проверка стилей перед обменом местами
        cy.contains(firstChar).parent().find('[data-test-id="circle"]').should('have.css', 'border-color', state__changing);
        cy.contains(lastChar).parent().find('[data-test-id="circle"]').should('have.css', 'border-color', state__changing);

        cy.wait(SHORT_DELAY_IN_MS);

        // Проверка стилей после обмена местами
        cy.contains(firstChar).parent().find('[data-test-id="circle"]').should('have.css', 'border-color', state__modified);
        cy.contains(lastChar).parent().find('[data-test-id="circle"]').should('have.css', 'border-color', state__modified);
      }
    });

    // Проверка конечного состояния после завершения анимации
    cy.wait(testString.length * DELAY_IN_MS).then(() => {
      const reversedString = testString.split('').reverse().join('');
      reversedString.split('').forEach((char) => {
        cy.contains(char).parent().find('[data-test-id="circle"]').should('have.css', 'border-color', state__modified);
      });
    });
  });
});