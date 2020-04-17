Feature: Role Management

@included
Scenario: Role Crud
	Given a role has been created
	When the role is updated
	Then the role reflects the changes
	And the role is deletable