import { state__default, state__changing, state__modified } from '../constants';
import { SHORT_DELAY_IN_MS } from '../../src/constants/delays';

describe('List Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/list');
  });

  it('Проверка доступности кнопки при пустом поле ввода', () => {
    cy.get('input').should('have.value', '');
    cy.get('button[data-test-id="addToHead"]').should('be.disabled');
    cy.get('button[data-test-id="addToTail"]').should('be.disabled');
    cy.get('button[data-test-id="addByIndex"]').should('be.disabled');
    cy.get('button[data-test-id="removeByIndex"]').should('be.disabled');
  });

  it("Корректная отрисовка дефолтного списка", () => {
    const initialArray = [0, 34, 8, 1];

    // Проверка содержания и цвета границы для каждого элемента
    cy.get('[data-test-id="circle"]').each((circleEl, index) => {
      cy.wrap(circleEl).should('contain.text', initialArray[index]).and("have.css", "border-color", state__default);
    });

    // Проверка метки "head", которая располагается над первым кружочком
    cy.get('[data-test-id="circle"]').first().prev().should('contain.text', 'head');

    // Проверка метки "tail", которая располагается под последним кружочком
    cy.get('[data-test-id="circle"]').last().nextAll().eq(1).should('contain.text', 'tail');
  });

  it("Корректное добавление элемента в head", () => {
    const char = '75';
    cy.get('input[data-test-id="listSymbolInput"]').type(char);
    cy.get('button[data-test-id="addToHead"]').click();


    cy.get('[data-test-id="circle"]').first()
      .should('contain.text', char)
      .and('have.css', 'border-color', state__changing);


    cy.get('[data-test-id="circle"]').first()
      .should('have.css', 'border-color', state__modified);


    cy.get('[data-test-id="circle"]').first()
      .should('contain.text', char)
      .and('have.css', 'border-color', state__default);

    // Подтверждаем, что над этим элементом есть надпись "head"
    cy.get('[data-test-id="circle"]').first()
      .prev()
      .should('contain.text', 'head');
  });

  it("Корректное добавление элемента в tail", () => {
    const char = '35';
    cy.get('input[data-test-id="listSymbolInput"]').type(char);
    cy.get('button[data-test-id="addToTail"]').click();


    cy.get('[data-test-id="circle"]').eq(-2)  // -2 означает предпоследний элемент
      .should('contain.text', char)
      .and('have.css', 'border-color', state__changing);

    cy.get('[data-test-id="circle"]').last()
      .should('have.css', 'border-color', state__modified);

    cy.get('[data-test-id="circle"]').last()
      .should('contain.text', char)
      .and('have.css', 'border-color', state__default);

    // Подтверждаем, что под этим элементом есть надпись "tail"
    cy.get('[data-test-id="circle"]').last()
      .nextAll().eq(1)
      .should('contain.text', 'tail');
  });

  it("Корректное добавление элемента по индексу", () => {
    const char = '75';
    const indexToInsert = 2;
    cy.get('input[data-test-id="listSymbolInput"]').type(char);
    cy.get('input[data-test-id="listIndexInput"]').type(indexToInsert.toString());
    cy.get('button[data-test-id="addByIndex"]').click();

    cy.get('[data-test-id="circle"]').first()
      .should('contain.text', char)
      .and('have.css', 'border-color', state__changing);

    // Проверяем перемещение элемента к указанному индексу
    for (let i = 1; i < indexToInsert; i++) {
      cy.get('[data-test-id="circle"]').eq(i)
        .should('contain.text', char)
        .and('have.css', 'border-color', state__changing);
    }

    // Проверяем, что элемент встал на свое место и имеет статус `state__modified`
    cy.get('[data-test-id="circle"]').eq(indexToInsert)
      .should('contain.text', char)
      .and('have.css', 'border-color', state__modified);


    cy.get('[data-test-id="circle"]').eq(indexToInsert)
      .should('contain.text', char)
      .and('have.css', 'border-color', state__default);
  });

  it("Корректное удаление элемента из head", () => {
    // Получаем значение из первого кружочка до его удаления
    cy.get('[data-test-id="circle"]').first().invoke('text').then(firstCircleValue => {

      cy.get('button[data-test-id="removeFromHead"]').click();
      cy.wait(SHORT_DELAY_IN_MS);

      // Проверяем, что первый элемент списка теперь пуст
      cy.get('[data-test-id="circle"]').first()
        .should('not.contain.text', firstCircleValue);

      cy.get('[data-test-id="circle"].is-small').should('contain.text', firstCircleValue)
        .and('have.css', 'border-color', state__changing);

      cy.wait(SHORT_DELAY_IN_MS);

      // Подтверждаем, что над этим элементом есть надпись "head"
      cy.get('[data-test-id="circle"]').first()
        .prev()
        .should('contain.text', 'head');
    });
  });

  it("Корректное удаление элемента из tail", () => {
    // Получаем значение из последнего кружочка до его удаления
    cy.get('[data-test-id="circle"]').last().invoke('text').then(lastCircleValue => {

      cy.get('button[data-test-id="removeFromTail"]').click();
      cy.wait(SHORT_DELAY_IN_MS);

      cy.get('[data-test-id="circle"].is-small').should('contain.text', lastCircleValue)
        .and('have.css', 'border-color', state__changing);

      // Проверяем, что последний элемент списка теперь пуст
      cy.get('[data-test-id="circle"]').last()
        .should('not.contain.text', lastCircleValue);

      cy.wait(SHORT_DELAY_IN_MS);

      cy.get('[data-test-id="circle"]').last()
        .nextAll().eq(1)
        .should('contain.text', 'tail');
    });
  });

  it("Удаление по индексу", () => {
    let removedCircleValue: string;
    let nextCircleValue: string;
    const indexToInsert = 2;

    cy.get('[data-test-id="circle"]').eq(indexToInsert).invoke('text').then(text => {
      removedCircleValue = text;

      return cy.get('[data-test-id="circle"]').eq(indexToInsert + 1).invoke('text');
    }).then(text => {
      nextCircleValue = text;

      cy.get('input[data-test-id="listIndexInput"]').type(indexToInsert.toString());

      cy.get('button[data-test-id="removeByIndex"]').click();

      for (let i = 0; i <= indexToInsert; i++) {
        cy.get('[data-test-id="circle"]').eq(i)
          .should('have.css', 'border-color', state__changing);
        cy.wait(SHORT_DELAY_IN_MS);
      }

      cy.get('[data-test-id="circle"].is-small')
        .should('have.css', 'border-color', state__changing)
        .and('contain.text', removedCircleValue);

      cy.get('[data-test-id="circle"]').eq(indexToInsert)
        .should('contain.text', '')
        .and('have.css', 'border-color', state__default);

      cy.wait(SHORT_DELAY_IN_MS);

      cy.get('[data-test-id="circle"]').eq(indexToInsert)
        .should('contain.text', nextCircleValue);

      cy.get('[data-test-id="circleHead"]').should('be.visible');
      cy.get('[data-test-id="circleTail"]').should('be.visible');
    });
  });
});
