'use strict';
const fs = require('fs').promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   const data = JSON.parse(await fs.readFile('./data/instructors.json', 'utf-8')).map(el => {
    delete el.id
    el.createdAt = new Date()
    el.updatedAt = new Date()

    return el
   })

   await queryInterface.bulkInsert('Instructors', data, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Instructors', null, {});
  }
};
