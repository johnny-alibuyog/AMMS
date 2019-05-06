Feature: Role Operations
	A role api that can do crud operations

@RoleCrud
Scenario: Role Crud
	Given a role has been created
	When the role is updated
	Then the role reflects the changes
	And the role is deletable