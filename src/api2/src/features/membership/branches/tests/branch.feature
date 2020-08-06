Feature: Branch Management

  @included
  Scenario: Branch Crud
    Given a branch has been created
    When the branch is updated
    Then the branch reflects the changes
    And the branch is deletable

  @included
  Scenario: Branch Activation
    Given a branch has been created with inactive status
    When the branch is activated
    Then the branch has active status
    And is available in lookup

  @included
  Scenario: Branch Deactivation
    Given a branch has been created with active status
    When the branch is deactivated
    Then the branch has inactive status
    And is not available in lookup
