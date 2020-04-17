Feature: Auth

@login
Scenario: User logs in with bad credentials
  Given username "johnny.nobody" does not exists
  When credentials "johnny.nobody" and password "sample_password" is submitted
	Then 401 status code is returned

@login
Scenario: User accessing resource without permission
  Given username "user.without.perms" with password "sample_password" does exists
  When credentials "user.without.perms" and password "sample_password" is submitted
  And try to access secure page without proper permission
	Then 403 status code is returned

@login
Scenario: User logs in with good credentials
  Given username "existing.user" with password "sample_password" does exists
  When credentials "existing.user" and password "sample_password" is submitted
	Then 200 status code is returned

@login
Scenario: User accessing resource with proper permission
  Given username "user.with.perms" with password "sample_password" does exists
  When credentials "user.with.perms" and password "sample_password" is submitted
  And try to access secure page user has permission to
	Then 200 status code is returned