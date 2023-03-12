const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

    async addActivity({  }) {
    const id = `activity-${nanoid(16)}`;
    time: new Date().toISOString();

}

module.exports = ActivitiesService;
