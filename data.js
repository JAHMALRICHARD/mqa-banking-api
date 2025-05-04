// data.js
const apiDocs = {
  billing: [
    { method: 'GET', url: '/api/billing', description: 'Get all billing records (with populated person details)' },
    { method: 'GET', url: '/api/billing/:id', description: 'Get a single billing record by its ID' },
    { method: 'POST', url: '/api/billing/:personID', description: 'Create a new billing record via Person ID' },
    { method: 'POST', url: '/api/billing', description: 'Create a new billing record' },
    { method: 'PUT', url: '/api/billing/:id', description: 'Update an existing billing record by its ID' },
    { method: 'DELETE', url: '/api/billing/:id', description: 'Delete a billing record by its ID' }
    
  ],
  persons: [
    { method: 'GET', url: '/api/persons', description: 'Get all persons' },
    { method: 'GET', url: '/api/persons/:id', description: 'Get a single person by their ID' },
    { method: 'POST', url: '/api/persons', description: 'Create a new person' },
    { method: 'PUT', url: '/api/persons/:id', description: 'Update an existing person by their ID' },
    { method: 'DELETE', url: '/api/persons/:id', description: 'Delete a person by their ID' }
  ],
  subscriptions: [
    { method: 'GET', url: '/api/subscriptions', description: 'Get all subscription tiers' },
    { method: 'GET', url: '/api/subscriptions/:id', description: 'Get a single subscription by its ID' },
    { method: 'POST', url: '/api/subscriptions', description: 'Create a new subscription plan' },
    { method: 'PUT', url: '/api/subscriptions/:id', description: 'Update an existing subscription by its ID' },
    { method: 'DELETE', url: '/api/subscriptions/:id', description: 'Delete a subscription by its ID' }
  ]
};

module.exports = apiDocs;
