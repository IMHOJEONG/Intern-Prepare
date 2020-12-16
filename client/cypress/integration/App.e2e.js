describe('App E2E', () => {
   it('click customresources' , ()=> {
       cy.visit('/')
       cy.contains('button','Instanceset').click();
       cy.contains('button',/^Instances$/).click();
       cy.contains('button','haconfigs').click();
       cy.contains('button','backup').click();
   });
});