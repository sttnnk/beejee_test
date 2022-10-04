'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      login: 'admin',
      password: '$2a$10$GO3JKPbtZkZvBFT4Q/rstuBLD0jtsn/TjOT9X94jLEQGf8g/ivvyq',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});

    await queryInterface.bulkInsert('Tasks', [{
      name: 'Татьяна',
      email: 'stalnik13@tut.by',
      text: 'сделать тестовое',
      isDone: false,
      isChanged: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Сергей',
      email: 'mserg@tut.by',
      text: 'пофиксить баг',
      isDone: false,
      isChanged: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Валера',
      email: 'vlr@tut.by',
      text: 'поговорить с тимлидом',
      isDone: false,
      isChanged: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Настя',
      email: 'anastesha@tut.by',
      text: 'добавить функцию поиска',
      isDone: false,
      isChanged: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Tasks', null, {});
  }
};
