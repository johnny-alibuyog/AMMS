Feature: TenantUserSettingsOperations
	A tenant  enviroment creation

@TenantUserSettingsReadAndUpdate
Scenario: Tenant User Settings Update and Read
	When tenant user settings is updated
	Then tenant user settings reflects the changes
