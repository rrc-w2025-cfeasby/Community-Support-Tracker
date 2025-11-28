### Community Support Tracker – CSS Style Guide

- This style guide documents the conventions used across `Event.css`, `Donation.css`, and `Volunteer.css`.  
- It ensures consistency, accessibility, and maintainability across all pages.

## 1. Reset & Base Styles
# Reset applied globally:
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
- Base font: Arial, sans-serif
- Line height: 16
- Body background: #F9F9F9

## 2. Layout Sections
# Header & Footer

- Background: #CCC
- Padding: 1rem
- Text alignment: center
- Position: relative

# Navigation

- Background: #0077CC
- Links: White text, bold, no underline
- Active link: #005FA3 background, rounded corners, white text
- Layout: Horizontal (flex), switches to vertical on mobile

# Sections

- Event signup: #8BC34A (outer), inner card #F5F5F5
- Donation main: #F5F5F5 card with shadow
- Volunteer main: #FFF59D background, centered content

## 3. Typography
# Headings

- Event/Donation headings: #0077CC, centered
- Volunteer headings: Arial, bold, margin-bottom spacing

# Labels

- Bold, #333 text
- Consistent spacing above/below

# Paragraphs

- Font size: 16px
- Line height: 15

## 4. Forms
# Input & Selects

- Padding: 0.5rem
- Font size: 1rem
- Border: 1px solid #CCC (Event/Donation), 2px solid #CCC (Volunteer)
- Rounded corners: 4px
- Focus state: border-color #0077CC, subtle shadow

# Buttons

- Primary submit: #0077CC background, white text. bold
- Hover: #005FA3
- Volunteer submit: dark gray #333, hover #555, active #111

## 5. Feedback & Error Messages
# Form feedback

- Bold, centered
- Accessible red #D32F2F for error text
- Font size: 1rem

# Error classes

- .error, .error-msg, .error-message
- Color: #D32F2F (WCAG AA compliant)
- Font size: 0.9-1rem
- Bold weight
- Margin-top: 0.25-0.5rem

# Invalid Inputs

- Border: 2px solid #D32F2F or red
- Background: light red #FFF0F0 #FFE6E6

## 6. Components
# Event Signup Card

- Max width: 600px
- Centered with margin
- Rounded corners: 8px
- Shadow: subtle rgba(0, 0, 0, 0.1)

# Donation Form Card

- Same as Event card, consistent spacing and shadow

# Volunteer Form Section

- Max width: 600px
- Background: #F9F9F9
- Rounded corners and shadow

# Star Rating

- RTL layout so starts fill leftwards
- Font size: 2rem
- Default color: #CCC
- Hover: gold highlight
- Checked: gold fill

## 7. Accessibility

- Error colors use contrast-compliant red #D32F2F instead of pure red
- Font sizes >= 14px with bold weight for readability
- Focus states clearly visible with border and shadow
- Consistent spacing ensures touch-friendly targets

## 8. Responsive Design
# Breakpoints

- 768px

# Mobile adjustments

- Header: flex layout with smaller font size
- Navigation: hidden by default, toggled open vertically
- Menu toggle button: visible, positioned top-right
- Navigation items stacked vertically with spacing

## 9. Naming Conventions

- IDs used for major sections: #event-signup, #donation_main, #volunteer_main
- Classes for reusable styles:
  .error, .error-msg, .error-message
  .input-error
  .field-group
- Consistent kebab-case naming for classes and IDs

## 10. Best Practices

- Keep all error messages unified with .error_message styles
- Use accessible colors for text and borders
- Maintain consisten card layout (max-width, padding, shadow)
- Always test contrast ratios with WCAG AA standards
- Use flexbox for layout alignment and responsiveness