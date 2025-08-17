---
layout: post
title:  "Writing Acceptance Criteria in Jira (that won't make developers hate you)"
date:   2025-08-15 11:28:41 +0530
categories: Agile
---

Sprint planning meeting 😕. Product owner presents a user story: `"As a user, I want to log in so I can access my account."`

Developer raises their hand: `"So... what happens if they enter the wrong password? How many attempts before lockout? What about password reset? Social login?"`

Silence. Nobody thought about those details.

Fast forward two weeks - the feature gets rejected because it doesn't handle edge cases anyone mentioned. Sound familiar?

### **1.** Why acceptance criteria matter (and why most suck)

Here's the thing - user stories without acceptance criteria are like recipes without measurements. "Add some flour" isn't helpful when you're trying to bake a cake.

Most teams write acceptance criteria that are either too vague ("login should work") or too technical ("update user.authenticated_at timestamp in database"). Neither helps anyone.

### **2.** The Jira reality check

Jira tickets with bad acceptance criteria usually look like this:

**User Story:** As a user, I want to filter products so I can find what I need.

**Acceptance Criteria:**
- ✅ User can filter products
- ✅ Filters work correctly
- ✅ Results display properly

Cool story. What filters? What counts as "working correctly"? What if there are no results?

### **3.** The Given-When-Then approach (that actually works)

Smart teams use the Given-When-Then format because it forces you to think through scenarios:

- **GIVEN** = What's the starting situation?
- **WHEN** = What does the user do?
- **THEN** = What should happen?

### **4.** Real Jira example that doesn't suck

**User Story:** As a customer, I want to reset my password so I can regain access to my account.

**Acceptance Criteria:**

#### `Scenario 1: Successful password reset`
**GIVEN** a user is on the login page and has forgotten their password

**WHEN** they click "Forgot Password" and enter a valid email address

**THEN** they should receive a password reset email within 5 minutes and see a confirmation message

#### `Scenario 2: Invalid email address`
**GIVEN** a user is on the password reset page

**WHEN** they enter an email that doesn't exist in the system

**THEN** they should still see the same confirmation message (for security) but no email is sent

#### `Scenario 3: Reset link usage`
**GIVEN** a user has received a password reset email

**WHEN** they click the reset link and it's less than 24 hours old

**THEN** they should be taken to a page where they can set a new password

#### `Scenario 4: Expired reset link`
**GIVEN** a user clicks a password reset link

**WHEN** the link is more than 24 hours old

**THEN** they should see an error message and option to request a new reset link

See the difference? Now developers know exactly what to build, and QA knows exactly what to test.

### **5.** How to actually write these in Jira

#### Use the description section wisely
Don't cram everything into the title. Use Jira's description field to break down your acceptance criteria clearly:

```
## User Story
As a [user type], I want [functionality] so that [benefit].

## Acceptance Criteria

### `Scenario 1: [Happy path scenario name]`
**GIVEN** [initial context]

**WHEN** [user action]

**THEN** [expected result]

### `Scenario 2: [Edge case scenario name]`
**GIVEN** [different context]

**WHEN** [different action]

**THEN** [different expected result]
```

#### Use Jira's formatting
- **Bold** the Given/When/Then keywords
- Use bullet points for multiple conditions
- Add checkboxes for each scenario so QA can tick them off
- Use code blocks for specific error messages or UI text

#### Link related tickets
Connect your acceptance criteria to:
- Design mockups (if they exist)
- Technical spike tickets
- Related user stories
- Bug reports from similar features

### **6.** Common mistakes teams make in Jira

#### The "obvious" trap
"User should be able to save their profile" - obvious to who? What if required fields are missing? What if the email is already taken? What about validation errors?

#### The technical rabbit hole
"System should validate email format using regex" - this belongs in technical specs, not acceptance criteria. Focus on user behavior.

#### The "everything is critical" problem
Not every scenario needs to be in the acceptance criteria. Focus on the main happy path and obvious error cases. Edge cases can be separate tickets.

### **7.** What good acceptance criteria look like in practice

#### They're specific but not prescriptive
❌ "Button should be blue and 120px wide"

✅ "User should see a clear call-to-action to submit the form"

#### They cover the obvious failure cases
❌ Just the happy path

✅ Happy path + what happens when things go wrong

#### They're testable
❌ "User experience should be smooth"

✅ "Form submission should complete within 3 seconds"

### **8.** Jira workflow tips that actually help

#### Use templates
Create a Jira ticket template with the Given-When-Then structure so team members don't have to reinvent it every time.

#### Review criteria before development starts
Make it a rule that tickets can't move to "In Progress" until acceptance criteria are reviewed and approved by at least one developer.

#### Update criteria during development
When edge cases come up during coding, update the ticket. Don't just handle them silently - document them.

### **9.** The collaboration factor

The best acceptance criteria aren't written by one person. They come from conversations:

- Product owner explains the business need
- Developer mentions technical constraints
- Designer highlights UX considerations
- QA asks about edge cases

The acceptance criteria become the record of that conversation.

### **10.** When acceptance criteria get out of hand

Sometimes teams go overboard and write acceptance criteria for everything. Use judgment:

#### Good candidates for detailed criteria:
- Complex user flows
- Features with lots of business rules
- Anything involving data validation
- User-facing error handling

#### Skip the detailed criteria for:
- Simple UI updates
- Technical debt tickets
- Investigation spikes
- Internal tools with obvious requirements

### **11.** The real test

Good acceptance criteria pass this test: Could someone else on the team pick up this ticket and know exactly what to build?

If the answer is no, keep refining.

### **12.** Making it stick in your team

Start small. Pick one user story for next sprint and write really good acceptance criteria. Show the team how much smoother development goes when everyone knows what "done" looks like.

Once people see the difference, they'll start asking for better criteria on their own tickets.

*P.S. - The teams with the fewest "this isn't what I expected" moments are the ones who spend 10 extra minutes writing clear acceptance criteria upfront. It's way cheaper than rebuilding features later.*
