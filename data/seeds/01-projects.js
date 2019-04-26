exports.seed = function(knex, Promise) {
  return knex('projects').insert([
    {
      name: 'Complete API Sprint Challenge',
      description:
        'Zoomy zoom zoom',
    },
  ]);
};
