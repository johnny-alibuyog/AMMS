Feature: Tenant Operations
	A tenant api that can do crud operations

@TenantCrud
Scenario: Tenant Crud
	Given a tenant has been created
	When the tenant is updated
	Then the tenant reflects the changes
	And the tenant is deletable