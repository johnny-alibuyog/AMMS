Feature: User Operations
	A user api that can do crud operations

@UserCrud
Scenario: User Crud
	Given a user has been created
	When the user is updated
	Then the user reflects the changes
	And the user is deletable