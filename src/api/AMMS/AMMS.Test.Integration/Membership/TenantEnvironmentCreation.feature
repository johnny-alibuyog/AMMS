Feature: TenantEnvironmentCreation
	A tenant enviroment creation

@TenantEnvironment @Creation
Scenario: Tenant Environment Creation
	When a tenant environment is created
	Then should contain tenant, branch and an admin user
	And the tenant environment is deletable