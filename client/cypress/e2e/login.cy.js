describe('Admin login flow', () => {
  it('logs in with valid credentials and redirects to dashboard', () => {
    cy.visit('/login');

    cy.get('input[name="email"]').type('admin@gmail.com');
    cy.get('input[name="password"]').type('admin123');

    cy.contains('button', 'Login').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Store Admin').should('exist');
  });

  it('stays on login page with invalid credentials', () => {
    cy.visit('/login');

    cy.get('input[name="email"]').type('admin@gmail.com');
    cy.get('input[name="password"]').type('wrong-password');

    cy.contains('button', 'Login').click();

    cy.url().should('include', '/login');
  });
});

