Feature: Tenant Environment Operations
	A tenant enviroment creation

@TenantEnvironmentCreation
Scenario: Tenant Environment Creation
	When a tenant environment is created
	Then should contain tenant, branch and an admin user
	And the tenant environment is deletable