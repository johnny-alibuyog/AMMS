Feature: Branch Management

  @included
  Scenario: Branch Crud
    Given a branch has been created
    When the branch is updated
    Then the branch reflects the changes
    And the branch is deletable