Feature: Image Management

  @base64Image
  Scenario: Base64Image CRUD
    Given a base64Image has been created
    When the base64Image has been updated
    Then the base64Image reflects the changes
    And the base64Image is deletable