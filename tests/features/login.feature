Feature: Login with Database User
  As a user
  I want to login with credentials from database
  So that I can test authentication flow

  Scenario: Login with valid user from database
    Given I open the login page
    When I fill username and password from database user
    Then I should verify login success

  Scenario: Login with invalid user
    Given I open the login page
    When I fill username and password from database user
    Then I should verify login error