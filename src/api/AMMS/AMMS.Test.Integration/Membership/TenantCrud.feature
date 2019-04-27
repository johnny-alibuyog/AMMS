Feature: TenantCrud
	A tenant api that can do CRUD operations

@Tenant @CRUD
Scenario: Tenant Api CRUD operation
	Given a tenant has been created
	When the tenant is updated
	Then the tenant reflects the changes
	And the tenant is deletable